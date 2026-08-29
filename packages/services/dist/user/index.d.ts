import { type CreateUserWithEmailAndPasswordInputType, SignInUserWithEmailAndPasswordInputType } from './model.js';
import "dotenv/config";
declare class UserService {
    private getUserByEmail;
    private generateUserToken;
    private verifyUserToken;
    getUserInfoById(id: number): Promise<{
        id: number;
        email: string;
        name: string;
    }>;
    private generateHash;
    createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType): Promise<{
        id: number;
        token: string;
    }>;
    signInUserWithEmailAndPassword(payload: SignInUserWithEmailAndPasswordInputType): Promise<{
        id: number;
        token: string;
    }>;
    verifyAndDecodeUserToken(token: string): Promise<{
        id: number;
    }>;
}
export default UserService;
