import {randomBytes,createHmac} from 'crypto'
import jwt from "jsonwebtoken";
import {db,eq} from "@repo/database"
import {users} from "@repo/database"
import { type CreateUserWithEmailAndPasswordInputType, GenerateUserTokenPayloadType, SignInUserWithEmailAndPasswordInputType, createUserWithEmailAndPasswordInput, generateUserTokenPayload, signInUserWithEmailAndPasswordInput } from './model.js'
import "dotenv/config";

class UserService {
    private async getUserByEmail(email: string) {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
        
        if (!result || result.length === 0) return null
        return result[0]
    }

    private async generateUserToken(payload: GenerateUserTokenPayloadType) {
        const {id} = await generateUserTokenPayload.parseAsync(payload)
        const secret = process.env.JWT_SECRET
        if (!secret) throw new Error("JWT_SECRET is not configured")
        const token = jwt.sign({id}, secret)
        return {token}
    }

    private async verifyUserToken(token: string) :Promise<GenerateUserTokenPayloadType> {
        try{
            const secret = process.env.JWT_SECRET
            if (!secret) throw new Error("JWT_SECRET is not configured")
            const verificationResult = jwt.verify(token, secret)
            return await generateUserTokenPayload.parseAsync(verificationResult)

        }
        catch(err){
            throw new Error("Invalid token")
        }

    }
    public async getUserInfoById(id: number) {
        const user = await db.select({
            id: users.id,
            email: users.email,
            name: users.name
        }).from(users).where(eq(users.id, id)).execute()

        if (!user || user.length === 0) throw new Error (`User with id ${id} not found`)
        return user[0]!
    }
    private async generateHash(salt: string, password: string) {
        return createHmac('sha256', salt).update(password).digest('hex')
    }
    public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) {
        const {name, email, password} = await createUserWithEmailAndPasswordInput.parseAsync(payload)

        const existingUser = await this.getUserByEmail(email)
        if (existingUser) throw new Error(`User with email ${email} already exists`)
        
        const salt = randomBytes(16).toString('hex')
        const hash = await this.generateHash(salt, password)

        const userInsertResult = await db.insert(users).values({
            name,
            email,
            salt,
            password: hash
            
        }).returning({id: users.id, email: users.email, name: users.name})

        if (!userInsertResult || userInsertResult.length === 0) throw new Error('Failed to create user')
        const userId = userInsertResult[0]!.id
        const {token} = await this.generateUserToken({id: userId})
        return {
            id: userId,
            token
        }
    }
    public async signInUserWithEmailAndPassword(payload: SignInUserWithEmailAndPasswordInputType) {
        const {email, password} = await signInUserWithEmailAndPasswordInput.parseAsync(payload)
        const existingUser = await this.getUserByEmail(email)
        if (!existingUser) throw new Error(`User with email ${email} does not exist`)
        if (!existingUser.salt || !existingUser.password) throw new Error(`User with email ${email} does not have a password set`)
        const hash = await this.generateHash(existingUser.salt, password)
        if (hash !== existingUser.password) throw new Error(`Invalid password for user with email ${email}`)
        const {token} = await this.generateUserToken({id: existingUser.id})
        return {
            id: existingUser.id,
            token
        }
    }
    public async verifyAndDecodeUserToken(token: string) {
        const { id } = await this.verifyUserToken(token)
        return { id }
    }

}
export default UserService
