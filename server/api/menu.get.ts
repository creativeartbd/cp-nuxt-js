// server/api/menu.get.ts
export default defineCachedEventHandler(
    async (event) => {
        const query = getQuery(event);
        const slug = (query.slug as string) || "primary";

        const config = useRuntimeConfig();

        try {
            // Try custom endpoint first
            try {
                return await $fetch(`${config.public.wordpressApiUrl}/cutout/v1/menu/${slug}`);
            } catch (customError) {
                console.log("Custom menu endpoint not found, trying WP REST API menus...");

                // Try WP REST API Menus v2 (requires plugin)
                try {
                    const menus = await $fetch(`${config.public.wordpressApiUrl}/wp-api-menus/v2/menus`);
                    const menu = Array.isArray(menus) ? menus.find((m) => m.slug === slug) : null;
                    return menu?.items || [];
                } catch (wpMenuError) {
                    // Return empty menu as fallback
                    console.warn("No menu API available, returning empty menu");
                    return [];
                }
            }
        } catch (error) {
            console.error("Error fetching menu:", error);
            return [];
        }
    },
    {
        maxAge: 60 * 15, // 15 minutes
        name: "menu",
    }
);
