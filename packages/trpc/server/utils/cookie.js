const ONE_MINUTE = 60 * 1000; // milliseconds
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_MONTH = 30 * ONE_DAY;
const ONE_YEAR = 12 * ONE_MONTH;
const defaultCookieOption = {
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: ONE_YEAR, // One Year
};
export function createCookieFactory(res) {
    return function createCookie(name, value, opts = defaultCookieOption) {
        res.cookie(name, value, opts);
    };
}
export function getCookieFactory(req) {
    function parseCookieHeader(cookieHeader) {
        if (!cookieHeader)
            return {};
        return cookieHeader
            .split(";")
            .map(chunk => chunk.trim())
            .filter(Boolean)
            .reduce((acc, part) => {
            const separator = part.indexOf("=");
            if (separator <= 0)
                return acc;
            const key = decodeURIComponent(part.slice(0, separator).trim());
            const value = decodeURIComponent(part.slice(separator + 1).trim());
            acc[key] = value;
            return acc;
        }, {});
    }
    return function getCookie(name) {
        const headerCookies = parseCookieHeader(req.headers.cookie);
        return req.cookies?.[name] ?? headerCookies[name];
    };
}
export function clearCookieFactory(res) {
    return function clearCookie(name) {
        res.clearCookie(name);
    };
}
const AUTHENTICATION_COOKIE_NAME = 'authentication-token';
export function setAuthenticationCookie(ctx, accessToken) {
    ctx.createCookie(AUTHENTICATION_COOKIE_NAME, accessToken);
}
export function getAuthenticationCookie(ctx) {
    return ctx.getCookie(AUTHENTICATION_COOKIE_NAME);
}
export function clearAuthenticationCookie(ctx) {
    ctx.clearCookie(AUTHENTICATION_COOKIE_NAME);
}
