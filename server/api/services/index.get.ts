// server/api/services/index.get.ts
export default defineCachedEventHandler(
    async () => {
        const config = useRuntimeConfig();

        try {
            return await $fetch(`/cutout/v1/services`, {
                baseURL: config.public.wordpressApiUrl,
            });
        } catch (error) {
            console.error("Error fetching services list:", error);
            return [];
        }
    },
    {
        maxAge: 60 * 10, // 10 minutes
        name: "services-list",
    }
);
