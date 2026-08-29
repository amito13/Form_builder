import { CookieOptions, Response, Request } from 'express';
import { TRPCContext } from "../context.js";
export declare function createCookieFactory(res: Response): (name: string, value: string, opts?: CookieOptions) => void;
export declare function getCookieFactory(req: Request): (name: string) => any;
export declare function clearCookieFactory(res: Response): (name: string) => void;
export declare function setAuthenticationCookie(ctx: TRPCContext, accessToken: string): void;
export declare function getAuthenticationCookie(ctx: TRPCContext): any;
export declare function clearAuthenticationCookie(ctx: TRPCContext): void;
