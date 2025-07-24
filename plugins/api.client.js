// plugins/api.client.js - Updated with better error handling
export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();

    console.log("API Plugin loading...", config.public.wordpressApiUrl);

    class ApiService {
        constructor() {
            this.baseURL = config.public.wordpressApiUrl;
        }

        async getPage(slug) {
            try {
                const data = await $fetch(`/cutout/v1/page/${slug}`, {
                    baseURL: this.baseURL,
                    retry: 3,
                    timeout: 10000,
                });
                return data;
            } catch (error) {
                console.error("Error fetching page:", error);
                throw createError({
                    statusCode: error?.response?.status || 500,
                    statusMessage: `Failed to fetch page: ${slug}`,
                });
            }
        }

        async getMenus() {
            try {
                const data = await $fetch("/cutout/v1/menus", {
                    baseURL: this.baseURL,
                    retry: 2,
                    timeout: 10000,
                });
                return data;
            } catch (error) {
                console.error("Error fetching menus:", error);
                return [];
            }
        }

        async getMenu(location) {
            try {
                const data = await $fetch(`/cutout/v1/menu/${location}`, {
                    baseURL: this.baseURL,
                    retry: 2,
                    timeout: 10000,
                });
                return data;
            } catch (error) {
                console.error(`Error fetching menu for location ${location}:`, error);
                return null;
            }
        }

        async getPages() {
            try {
                // Try custom endpoint first
                const data = await $fetch("/cutout/v1/pages", {
                    baseURL: this.baseURL,
                    retry: 2,
                    timeout: 10000,
                });
                return data;
            } catch (error) {
                console.warn("Custom pages endpoint failed, trying WordPress default:", error);

                try {
                    // Fallback to WordPress default API
                    const pages = await $fetch("/wp/v2/pages", {
                        baseURL: this.baseURL,
                        retry: 2,
                        timeout: 10000,
                    });

                    // Format the data to match our expected structure
                    return pages.map((page) => ({
                        id: page.id,
                        title: page.title.rendered,
                        slug: page.slug,
                        url: page.slug === "home" ? "/" : "/" + page.slug,
                        menu_order: page.menu_order || 0,
                    }));
                } catch (fallbackError) {
                    console.error("Both pages endpoints failed:", fallbackError);
                    return [];
                }
            }
        }

        async getSiteSettings() {
            try {
                const data = await $fetch("/cutout/v1/settings", {
                    baseURL: this.baseURL,
                    retry: 3,
                    timeout: 10000,
                });
                return data;
            } catch (error) {
                console.error("Error fetching site settings:", error);
                return {
                    site_name: "Cutout Partner",
                    site_description: "Professional Photo Editing Services",
                    site_url: config.public.siteUrl,
                };
            }
        }
    }

    return {
        provide: {
            api: new ApiService(),
        },
    };
});
