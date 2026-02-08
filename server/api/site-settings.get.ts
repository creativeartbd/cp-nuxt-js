export default defineCachedEventHandler(
    async () => {
        const config = useRuntimeConfig();

        try {
            // Try custom endpoint first (from your functions.php: /cutout/v1/settings)
            const data = await $fetch(`${config.public.wordpressApiUrl}/cutout/v1/settings`);

            console.log("✅ Site settings loaded from custom endpoint");
            return data;
        } catch (error) {
            console.warn("⚠️ Custom endpoint failed, trying fallback...");

            try {
                // Fallback: Try ACF options endpoint
                const data = await $fetch(`${config.public.wordpressApiUrl}/wp/v2/theme-options`);

                return {
                    site_name: "Cutout Partner",
                    all_fields: data || {},
                };
            } catch (fallbackError) {
                console.error("❌ All site settings endpoints failed");

                // Return safe defaults so site doesn't break
                return {
                    site_name: "Cutout Partner",
                    site_description: "Professional Photo Editing Services",
                    site_url: config.public.siteUrl,
                    all_fields: {
                        site_logo: "",
                        home_logo: "",
                        sticky_logo: "",
                        other_pages_logo: "",
                        footer_section: [],
                        select_services: [],
                    },
                };
            }
        }
    },
    {
        maxAge: 60 * 15, // Cache for 15 minutes
        name: "site-settings",
    }
);
