import type {CreateExpressContextOptions} from '@trpc/server/adapters/express';
import {createCookieFactory, getCookieFactory, clearCookieFactory} from './utils/cookie';

export interface TRPCCtxUser{
    id: string;
}

export interface TRPCContext {
    user?: TRPCCtxUser;
    getCookie: ReturnType<typeof getCookieFactory>;
    createCookie: ReturnType<typeof createCookieFactory>;
    clearCookie: ReturnType<typeof clearCookieFactory>;

}

export async function createContext({req, res}: CreateExpressContextOptions): Promise<TRPCContext> {
    const ctx: TRPCContext = {
        createCookie: createCookieFactory(res),
        getCookie: getCookieFactory(req),
        clearCookie: clearCookieFactory(res),
        user:undefined
    };

    return ctx;
}

export type Context = Awaited<ReturnType<typeof createContext>>;