<!-- components/TheNavigation.client.vue -->
<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div class="container">
            <!-- Logo -->
            <NuxtLink to="/" class="navbar-brand">
                <img v-if="siteSettings?.logo" :src="siteSettings.logo" alt="Cutout Partner" height="40" />
                <span v-else class="fw-bold fs-4">Cutout Partner</span>
            </NuxtLink>

            <!-- Mobile menu button -->
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Navigation Links -->
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <!-- Show loading state -->
                    <li v-if="loading" class="nav-item">
                        <span class="nav-link">Loading...</span>
                    </li>

                    <!-- Show menu items -->
                    <template v-else-if="menuItems && menuItems.length > 0">
                        <template v-for="item in menuItems" :key="item.id">
                            <!-- Menu item without children -->
                            <li v-if="!item.children || item.children.length === 0" class="nav-item">
                                <NuxtLink
                                    :to="getMenuItemUrl(item)"
                                    :target="item.target || '_self'"
                                    class="nav-link"
                                    :class="{ active: isActiveLink(item) }"
                                >
                                    {{ item.title }}
                                </NuxtLink>
                            </li>

                            <!-- Menu item with dropdown children -->
                            <li v-else class="nav-item dropdown">
                                <NuxtLink
                                    :to="getMenuItemUrl(item)"
                                    class="nav-link dropdown-toggle"
                                    :class="{ active: isActiveLink(item) }"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {{ item.title }}
                                </NuxtLink>

                                <!-- Dropdown menu -->
                                <ul class="dropdown-menu">
                                    <li v-for="child in item.children" :key="child.id">
                                        <NuxtLink
                                            :to="getMenuItemUrl(child)"
                                            :target="child.target || '_self'"
                                            class="dropdown-item"
                                        >
                                            {{ child.title }}
                                        </NuxtLink>
                                    </li>
                                </ul>
                            </li>
                        </template>
                    </template>

                    <!-- Fallback navigation if menu fails -->
                    <template v-else>
                        <li class="nav-item">
                            <NuxtLink to="/" class="nav-link">Home</NuxtLink>
                        </li>
                        <li class="nav-item">
                            <NuxtLink to="/about" class="nav-link">About</NuxtLink>
                        </li>
                        <li class="nav-item">
                            <NuxtLink to="/contact" class="nav-link">Contact</NuxtLink>
                        </li>
                    </template>

                    <!-- Optional: CTA Button -->
                    <li class="nav-item ms-2">
                        <NuxtLink to="/contact" class="btn btn-primary"> Get Quote </NuxtLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
const { $api } = useNuxtApp();
const route = useRoute();
const loading = ref(true);
const menuItems = ref([]);
const siteSettings = ref({});

// Fetch data on client side only
onMounted(async () => {
    console.log("Navigation mounted on client side");

    try {
        // Fetch primary menu
        console.log("Fetching primary menu...");
        const menuData = await $api.getMenu("primary");
        if (menuData && menuData.items) {
            menuItems.value = menuData.items;
            console.log("Primary menu loaded:", menuData.items);
        } else {
            console.warn("No primary menu found, trying to get all menus...");
            // Fallback: get all menus and use the first one
            const allMenus = await $api.getMenus();
            if (allMenus && allMenus.length > 0) {
                menuItems.value = allMenus[0].items;
                console.log("Using first available menu:", allMenus[0]);
            }
        }
    } catch (error) {
        console.error("Error loading menu:", error);
        // Keep fallback navigation
    }

    try {
        // Fetch site settings
        console.log("Fetching site settings...");
        const settingsData = await $api.getSiteSettings();
        siteSettings.value = settingsData;
        console.log("Settings loaded:", settingsData);
    } catch (error) {
        console.error("Error loading site settings:", error);
        // Keep default values
    }

    loading.value = false;
});

// Convert WordPress menu URLs to Nuxt-friendly URLs
const getMenuItemUrl = (item) => {
    // If it's an external URL, return as-is
    if (item.url.includes("http") && !item.url.includes("cutoutpartner-api.com")) {
        return item.url;
    }

    // For WordPress pages, extract the slug and create Nuxt route
    if (item.type === "post_type" && item.object === "page") {
        // Extract slug from WordPress URL
        const urlParts = item.url.split("/");
        const slug = urlParts[urlParts.length - 2] || urlParts[urlParts.length - 1];

        // Convert home page to root
        if (slug === "home" || slug === "") {
            return "/";
        }

        // Return Nuxt route
        return `/${slug}`;
    }

    // For custom links, try to extract path
    try {
        const url = new URL(item.url);
        let path = url.pathname;

        // Convert home to root
        if (path === "/" || path === "/home") {
            return "/";
        }

        return path;
    } catch {
        // If URL parsing fails, return as-is
        return item.url;
    }
};

// Check if link is active
const isActiveLink = (item) => {
    const itemUrl = getMenuItemUrl(item);
    if (itemUrl === "/") {
        return route.path === "/";
    }
    return route.path === itemUrl;
};
</script>
