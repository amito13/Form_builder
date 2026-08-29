export function generatePath(base) {
    return function (path) {
        const cleanBase = base.replace(/^\/+|\/+$/g, "");
        const cleanPath = path.replace(/^\/+|\/+$/g, "");
        return `/${[cleanBase, cleanPath].filter(Boolean).join("/")}`;
    };
}
