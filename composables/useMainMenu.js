// composables/useMainMenu.js
import { readonly, computed } from "vue";

export const useMainMenu = () => {
    const menuData = useState("main-menu-data", () => null);
    const isLoading = useState("main-menu-loading", () => false);

    const fetchMenu = async (slug = "primary") => {
        if (menuData.value) return menuData.value;

        isLoading.value = true;
        try {
            const data = await $fetch(`/api/menu?slug=${slug}`);
            console.log("📋 Menu API Response:", data);

            // Store the raw response
            menuData.value = data;

            return data;
        } catch (error) {
            console.error("Error fetching menu:", error);
            menuData.value = [];
            return [];
        } finally {
            isLoading.value = false;
        }
    };

    const setMenu = (items) => {
        menuData.value = items || [];
    };

    // Extract menu items from different possible structures
    const menu = computed(() => {
        if (!menuData.value) return [];

        // If it's already an array, return it
        if (Array.isArray(menuData.value)) {
            return menuData.value;
        }

        // If it's an object with 'items' property (like {location: 'primary', items: [...]})
        if (menuData.value.items && Array.isArray(menuData.value.items)) {
            return menuData.value.items;
        }

        // If it's an object with 'menu' property
        if (menuData.value.menu && Array.isArray(menuData.value.menu)) {
            return menuData.value.menu;
        }

        return [];
    });

    return {
        menu: readonly(menu),
        isLoading: readonly(isLoading),
        fetchMenu,
        setMenu,
    };
};
