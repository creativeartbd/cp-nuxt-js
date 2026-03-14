// Redirect /slug → /slug/ to match already-indexed URLs with trailing slash
export default defineNuxtRouteMiddleware((to) => {
    if (to.path !== "/" && !to.path.endsWith("/")) {
        const query = Object.keys(to.query).length ? to.query : undefined;
        return navigateTo({ path: to.path + "/", query }, { redirectCode: 301 });
    }
});
