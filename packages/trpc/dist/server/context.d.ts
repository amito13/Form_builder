import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { createCookieFactory, getCookieFactory, clearCookieFactory } from './utils/cookie.js';
export interface TRPCCtxUser {
    id: number;
}
export interface TRPCContext {
    user?: TRPCCtxUser;
    getCookie: ReturnType<typeof getCookieFactory>;
    createCookie: ReturnType<typeof createCookieFactory>;
    clearCookie: ReturnType<typeof clearCookieFactory>;
}
export declare function createContext({ req, res }: CreateExpressContextOptions): Promise<TRPCContext>;
export type Context = Awaited<ReturnType<typeof createContext>>;
