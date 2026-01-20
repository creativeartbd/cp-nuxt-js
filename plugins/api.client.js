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

        async getStickyPost() {
            try {
                const data = await $fetch("/wp/v2/posts", {
                    baseURL: this.baseURL,
                    params: {
                        _embed: true,
                        sticky: true,
                        per_page: 1,
                    },
                    retry: 2,
                    timeout: 10000,
                });
                return data && data.length ? data[0] : null;
            } catch (error) {
                console.error("Error fetching sticky post:", error);
                return null;
            }
        }

        async getPostUrl(post) {
            // Get the post type and slug, handling both API and ACF formats
            const postType = post.post_type || post.type;
            const slug = post.post_name || post.slug;

            // If it's a standard 'post', we want the URL to be /blog/slug
            if (postType === "post") {
                return `/blog/${slug}`;
            }

            // For any other custom post type (e.g., 'services'), use its name
            // This will create a URL like /services/slug
            if (postType === "page") {
                return `/${slug}`;
            } else {
                return `/${postType}/${slug}`;
            }

            // Fallback if post type is missing for some reason
            return `/blog/${slug}`;
        }

        async getBlogPostsLight(params = {}) {
            try {
                return await $fetch("/cutout/v1/blog-posts", {
                    baseURL: this.baseURL,
                    params: {
                        page: params.page || 1,
                        per_page: params.per_page || 9,
                        category: params.category || undefined,
                        search: params.search || undefined,
                    },
                });
            } catch (error) {
                console.error("Error fetching lightweight blog posts:", error);
                return {
                    posts: [],
                    totalPages: 1,
                };
            }
        }

        async getPostsForBlog(params = {}) {
            let totalPagesCount = 1; // Default to 1
            try {
                const data = await $fetch("/wp/v2/posts", {
                    baseURL: this.baseURL,
                    params: {
                        _embed: 1,
                        _fields: "id,slug,title,featured_media,categories,_links,_embedded",
                        per_page: params.per_page || 9,
                        page: params.page || 1,
                        categories: params.category || undefined,
                        search: params.titleSearch || undefined,
                        title_only: params.titleOnly || undefined,
                        exclude: params.exclude || undefined,
                        orderby: "date",
                        order: "desc",
                    },
                    onResponse({ response }) {
                        const totalPagesHeader = response.headers.get("x-wp-totalpages");
                        if (totalPagesHeader) {
                            totalPagesCount = parseInt(totalPagesHeader, 10);
                        }
                    },
                });

                // Return an object containing both the posts and the total pages
                return {
                    posts: data,
                    totalPages: totalPagesCount,
                };
            } catch (error) {
                console.error("Error fetching blog posts:", error);
                // Return an empty structure on error to prevent breaking the component
                return {
                    posts: [],
                    totalPages: 1,
                };
            }
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
                        search: params.search,
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
