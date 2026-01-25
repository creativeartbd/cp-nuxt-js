// composables/useSiteSettings.js

export const useSiteSettings = () => {
    const { $api } = useNuxtApp();

    // Main site settings state
    const siteSettings = useState("site-settings", () => null);

    // Generic page data cache
    const pageDataCache = useState("page-data-cache", () => ({}));

    // NEW: Generic post data cache for custom post types
    const postDataCache = useState("post-data-cache", () => ({}));

    // Function to fetch the main site settings
    const fetchSettings = async () => {
        if (siteSettings.value) return siteSettings.value;
        try {
            const data = await $api.getSiteSettings();
            siteSettings.value = data;
            return data;
        } catch (error) {
            console.error("Failed to fetch site settings:", error);
            const defaultSettings = {
                all_fields: { blog_title: "Our Blog", blog_sub_title: "Read our latest articles" },
            };
            siteSettings.value = defaultSettings;
            return defaultSettings;
        }
    };

    // Generic function to fetch and cache any page's data
    const fetchPageData = async (slug) => {
        if (pageDataCache.value[slug]) return pageDataCache.value[slug];
        try {
            const data = await $api.getPage(slug);
            pageDataCache.value[slug] = data;
            return data;
        } catch (error) {
            console.error(`Failed to fetch page data for slug: ${slug}`, error);
            const defaultPageData = { title: { rendered: "Page Not Found" }, content: { rendered: "" }, acf: {} };
            pageDataCache.value[slug] = defaultPageData;
            return defaultPageData;
        }
    };

    // NEW: Generic function to fetch and cache any custom post type data
    const fetchPostData = async (postType, slug) => {
        const cacheKey = `${postType}-${slug}`;
        if (postDataCache.value[cacheKey]) return postDataCache.value[cacheKey];

        try {
            // We dynamically call the correct API method based on postType
            const apiMethod = `get${postType.charAt(0).toUpperCase() + postType.slice(1)}`; // e.g., 'service' -> 'getService'
            const data = await $api[apiMethod](slug);

            postDataCache.value[cacheKey] = data;
            return data;
        } catch (error) {
            console.error(`Failed to fetch ${postType} data for slug: ${slug}`, error);
            const defaultPostData = { title: { rendered: "Post Not Found" }, content: { rendered: "" }, acf: {} };
            postDataCache.value[cacheKey] = defaultPostData;
            return defaultPostData;
        }
    };

    return {
        siteSettings: readonly(siteSettings),
        pageDataCache: readonly(pageDataCache),
        postDataCache: readonly(postDataCache),
        fetchSettings,
        fetchPageData,
        fetchPostData, // Expose the new function
    };
};
