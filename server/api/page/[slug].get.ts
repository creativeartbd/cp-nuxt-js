// server/api/page/[slug].get.ts
export default defineCachedEventHandler(
    async (event) => {
        const { slug } = event.context.params!;
        const config = useRuntimeConfig();

        try {
            // Try custom endpoint first
            try {
                return await $fetch(`/cutout/v1/page/${slug}`, {
                    baseURL: config.public.wordpressApiUrl,
                });
            } catch (customError) {
                console.log(`Custom page endpoint not found for ${slug}, trying WP REST API...`);

                // Use standard WordPress REST API
                const response = await $fetch(`/wp/v2/pages?slug=${slug}&_embed=true`, {
                    baseURL: config.public.wordpressApiUrl,
                });

                if (!response || !Array.isArray(response) || response.length === 0) {
                    throw createError({
                        statusCode: 404,
                        message: `Page not found: ${slug}`,
                    });
                }

                const page = response[0];

                // Transform to match expected structure
                return {
                    page: {
                        id: page.id,
                        title: page.title?.rendered || "",
                    },
                    sections: page.acf?.sections || [],
                    seo: {
                        title: page.yoast_head_json?.title || page.title?.rendered,
                        description: page.yoast_head_json?.description || "",
                        og_title: page.yoast_head_json?.og_title,
                        og_description: page.yoast_head_json?.og_description,
                        og_image: page.yoast_head_json?.og_image?.[0]?.url,
                    },
                };
            }
        } catch (error) {
            console.error(`Error fetching page ${slug}:`, error);
            throw createError({
                statusCode: 404,
                message: `Page not found: ${slug}`,
            });
        }
    },
    {
        maxAge: 60 * 10, // 10 minutes
        name: "page",
    }
);
