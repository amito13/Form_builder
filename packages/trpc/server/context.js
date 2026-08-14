import { createCookieFactory, getCookieFactory, clearCookieFactory } from './utils/cookie';
export async function createContext({ req, res }) {
    const ctx = {
        createCookie: createCookieFactory(res),
        getCookie: getCookieFactory(req),
        clearCookie: clearCookieFactory(res),
        user: undefined
    };
    return ctx;
}
