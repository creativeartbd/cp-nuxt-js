// server/api/blog/index.get.ts
export default defineCachedEventHandler(
    async (event) => {
        const config = useRuntimeConfig();
        const query = getQuery(event);
        const page = (query.page as string) || "1";
        const perPage = (query.per_page as string) || "10";

        try {
            return await $fetch(`/cutout/v1/posts?page=${page}&per_page=${perPage}`, {
                baseURL: config.public.wordpressApiUrl,
            });
        } catch (error) {
            console.error("Error fetching blog posts:", error);
            return { posts: [], total: 0 };
        }
    },
    {
        maxAge: 60 * 10, // 10 minutes
        name: "blog-list",
    }
);
