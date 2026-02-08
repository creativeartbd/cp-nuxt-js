// composables/useSiteSettings.js
export const useSiteSettings = () => {
    const siteSettings = useState("site-settings", () => null);
    const isLoading = useState("site-settings-loading", () => false);

    const fetchSiteSettings = async () => {
        if (siteSettings.value) return siteSettings.value;

        isLoading.value = true;
        try {
            const data = await $fetch("/api/site-settings");
            siteSettings.value = data;
            return data;
        } catch (error) {
            console.error("Error fetching site settings:", error);
            siteSettings.value = null;
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        siteSettings,
        isLoading,
        fetchSiteSettings,
    };
};
