// Patch router.resolve so NuxtLink renders hrefs with trailing slashes.
// Without this, hovering a link shows the URL without a trailing slash,
// then the global middleware redirects — causing a flicker and extra round-trip.
export default defineNuxtPlugin(() => {
    const router = useRouter();
    const _resolve = router.resolve.bind(router);

    router.resolve = (to, from) => {
        if (typeof to === "string") {
            if (to && to !== "/" && !to.endsWith("/") && !to.includes("?") && !to.includes("#") && !/^https?:\/\//.test(to)) {
                to = to + "/";
            }
        } else if (to && typeof to === "object" && to.path) {
            if (to.path !== "/" && !to.path.endsWith("/")) {
                to = { ...to, path: to.path + "/" };
            }
        }
        return _resolve(to, from);
    };
});
