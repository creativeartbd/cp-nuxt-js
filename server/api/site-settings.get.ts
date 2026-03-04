export default defineCachedEventHandler(
    async () => {
        const config = useRuntimeConfig();

        try {
            const data = await $fetch(`${config.public.wordpressApiUrl}/cutout/v1/settings`);
            return data;
        } catch {
            try {
                const data = await $fetch(`${config.public.wordpressApiUrl}/wp/v2/theme-options`);
                return {
                    site_name: "Cutout Partner",
                    all_fields: data || {},
                };
            } catch {
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
        maxAge: 60 * 60, // Cache for 1 hour
        name: "site-settings",
        swr: true,
    }
);
