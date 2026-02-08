// server/api/services/[slug].get.ts
export default defineCachedEventHandler(
    async (event) => {
        const { slug } = event.context.params!;
        const config = useRuntimeConfig();

        try {
            // Try custom endpoint first
            try {
                return await $fetch(`/cutout/v1/service/${slug}`, {
                    baseURL: config.public.wordpressApiUrl,
                });
            } catch (customError) {
                console.log(`Custom service endpoint not found for ${slug}, trying WP REST API...`);

                // Use standard WordPress REST API for custom post type
                // Try common CPT endpoints: service, services
                let response;
                try {
                    response = await $fetch(`/wp/v2/service?slug=${slug}&_embed=true`, {
                        baseURL: config.public.wordpressApiUrl,
                    });
                } catch (e) {
                    // Try plural
                    response = await $fetch(`/wp/v2/services?slug=${slug}&_embed=true`, {
                        baseURL: config.public.wordpressApiUrl,
                    });
                }

                if (!response || !Array.isArray(response) || response.length === 0) {
                    throw createError({
                        statusCode: 404,
                        message: `Service not found: ${slug}`,
                    });
                }

                const service = response[0];

                // Transform to match expected structure
                return {
                    page: {
                        id: service.id,
                        title: service.title?.rendered || "",
                    },
                    sections: service.acf?.sections || [],
                    seo: {
                        title: service.yoast_head_json?.title || service.title?.rendered,
                        description: service.yoast_head_json?.description || "",
                        og_title: service.yoast_head_json?.og_title,
                        og_description: service.yoast_head_json?.og_description,
                        og_image: service.yoast_head_json?.og_image?.[0]?.url,
                    },
                };
            }
        } catch (error) {
            console.error(`Error fetching service ${slug}:`, error);
            throw createError({
                statusCode: 404,
                message: `Service not found: ${slug}`,
            });
        }
    },
    {
        maxAge: 60 * 10, // 10 minutes
        name: "service",
    }
);
