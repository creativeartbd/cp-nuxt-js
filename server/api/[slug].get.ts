export default defineCachedEventHandler(
    async (event) => {
        const { slug } = event.context.params!;
        const config = useRuntimeConfig();
        const res = await $fetch(`${config.wpBaseUrl}/pages/${slug}`);
        return res;
    },
    {
        maxAge: 60 * 10,
        name: "page",
    }
);
