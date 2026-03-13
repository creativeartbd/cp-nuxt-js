// Redirect /slug/ → /slug to avoid duplicate content (canonical is no trailing slash)
export default defineNuxtRouteMiddleware((to) => {
    if (to.path !== "/" && to.path.endsWith("/")) {
        const newPath = to.path.slice(0, -1);
        const query = Object.keys(to.query).length ? to.query : undefined;
        return navigateTo({ path: newPath, query }, { redirectCode: 301 });
    }
});
