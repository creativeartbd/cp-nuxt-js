// server/api/blog/[slug].get.ts
export default defineCachedEventHandler(
    async (event) => {
        const { slug } = event.context.params!;
        const config = useRuntimeConfig();

        try {
            return await $fetch(`/cutout/v1/post/${slug}`, {
                baseURL: config.public.wordpressApiUrl,
            });
        } catch (error) {
            console.error(`Error fetching blog post ${slug}:`, error);
            throw createError({
                statusCode: 404,
                message: `Blog post not found: ${slug}`,
            });
        }
    },
    {
        maxAge: 60 * 10, // 10 minutes
        name: "blog-post",
    }
);
