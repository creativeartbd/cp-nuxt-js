// plugins/api.client.js - Updated with services support
export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();
    class ApiService {
        constructor() {
            this.baseURL = config.public.wordpressApiUrl;
        }

        // inside api.client.js
        async getPost(slug) {
            try {
                const data = await $fetch(`/wp/v2/posts`, {
                    baseURL: this.baseURL,
                    params: {
                        slug,
                        _embed: true,
                    },
                    retry: 2,
                    timeout: 10000,
                });

                // WordPress returns an array even for single slug lookups
                return data && data.length ? data[0] : null;
            } catch (error) {
                console.error("Error fetching single post:", error);
                throw createError({
                    statusCode: error?.response?.status || 500,
                    statusMessage: `Failed to fetch post: ${slug}`,
                });
            }
        }

        async getCategories() {
            return await $fetch(`/wp/v2/categories`, { baseURL: this.baseURL });
        }

        async getPosts(params = {}) {
            try {
                const data = await $fetch("/wp/v2/posts", {
                    baseURL: this.baseURL,
                    params: {
                        _embed: true,
                        per_page: params.per_page || 6,
                        page: params.page || 1,
                        categories: params.category || undefined,
                    },
                    retry: 2,
                    timeout: 10000,
                });
                return data;
            } catch (error) {
                console.error("Error fetching posts:", error);
                return [];
            }
        }

        // NEW: Get all categories
        async getCategories() {
            try {
                const data = await $fetch("/wp/v2/categories", {
                    baseURL: this.baseURL,
                    retry: 2,
                    timeout: 10000,
                });
                return data;
            } catch (error) {
                console.error("Error fetching categories:", error);
                return [];
            }
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

        // NEW: Get service by slug
        async getService(slug) {
            try {
                const data = await $fetch(`/cutout/v1/service/${slug}`, {
                    baseURL: this.baseURL,
                    retry: 3,
                    timeout: 10000,
                });
                return data;
            } catch (error) {
                console.error("Error fetching service:", error);
                throw createError({
                    statusCode: error?.response?.status || 500,
                    statusMessage: `Failed to fetch service: ${slug}`,
                });
            }
        }

        // NEW: Get all services
        async getServices() {
            try {
                const data = await $fetch("/cutout/v1/services", {
                    baseURL: this.baseURL,
                    retry: 2,
                    timeout: 10000,
                });
                return data;
            } catch (error) {
                console.error("Error fetching services:", error);
                return [];
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
