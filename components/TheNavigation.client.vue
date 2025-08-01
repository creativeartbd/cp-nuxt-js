<template>
    <div class="header" id="navbar">
        <div class="container">
            <nav class="navbar navbar-expand-lg bsb-navbar bsb-navbar-hover bsb-navbar-caret">
                <div class="container-fluid">
                    <NuxtLink class="navbar-brand" to="/">
                        <div v-if="!isHomePage">
                            <img src="~/assets/images/logo-black.png" alt="Logo" height="24" class="logo" />
                        </div>
                        <div v-else>
                            <img
                                src="~/assets/images/logo-black.png"
                                alt="Logo"
                                height="24"
                                class="logo"
                                v-if="isSticky"
                            />
                            <img
                                src="~/assets/images/CutoutPartner-Logo-PNG4.png"
                                alt="Logo"
                                height="24"
                                class="logo"
                                v-else
                            />
                        </div>
                    </NuxtLink>
                    <button
                        class="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                            <!-- Show loading state -->
                            <li v-if="menuLoading" class="nav-item">
                                <span class="nav-link">Loading...</span>
                            </li>

                            <!-- WordPress Menu Items -->
                            <template v-else-if="menuItems && menuItems.length > 0">
                                <template v-for="item in menuItems" :key="item.id">
                                    <!-- Menu item without children -->
                                    <li v-if="!item.children || item.children.length === 0" class="nav-item">
                                        <NuxtLink
                                            :to="getMenuItemUrl(item)"
                                            :target="item.target || '_self'"
                                            class="nav-link"
                                            :class="{ active: isActiveLink(item) }"
                                            aria-current="page"
                                        >
                                            {{ item.title }}
                                        </NuxtLink>
                                    </li>

                                    <!-- Menu item with dropdown children -->
                                    <li v-else class="nav-item dropdown">
                                        <a
                                            href="#"
                                            class="nav-link dropdown-toggle"
                                            :class="{ active: isActiveLink(item) }"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                            @click.prevent
                                        >
                                            <span @click="navigateTo(getMenuItemUrl(item))">{{ item.title }}</span>
                                        </a>

                                        <!-- Dropdown menu -->
                                        <ul
                                            class="dropdown-menu"
                                            :class="{
                                                'service-dropdown': item.title.toLowerCase().includes('service'),
                                            }"
                                        >
                                            <div class="dropdown-container">
                                                <div class="dropdown-items">
                                                    <li v-for="child in item.children" :key="child.id">
                                                        <!-- Child with sub-children (3rd level) -->
                                                        <div
                                                            v-if="child.children && child.children.length > 0"
                                                            class="dropdown-item dropdown"
                                                        >
                                                            <a
                                                                href="#"
                                                                class="dropdown-item dropdown-toggle"
                                                                data-bs-toggle="dropdown"
                                                                aria-expanded="false"
                                                                @click.prevent
                                                            >
                                                                <span @click="navigateTo(getMenuItemUrl(child))">{{
                                                                    child.title
                                                                }}</span>
                                                            </a>

                                                            <!-- 3rd level dropdown -->
                                                            <ul class="dropdown-menu dropdown-submenu">
                                                                <li
                                                                    v-for="grandchild in child.children"
                                                                    :key="grandchild.id"
                                                                >
                                                                    <NuxtLink
                                                                        :to="getMenuItemUrl(grandchild)"
                                                                        :target="grandchild.target || '_self'"
                                                                        class="dropdown-item"
                                                                        @click="closeNavbar"
                                                                    >
                                                                        {{ grandchild.title }}
                                                                    </NuxtLink>
                                                                </li>
                                                            </ul>
                                                        </div>

                                                        <!-- Regular child (no sub-children) -->
                                                        <NuxtLink
                                                            v-else
                                                            :to="getMenuItemUrl(child)"
                                                            :target="child.target || '_self'"
                                                            class="dropdown-item"
                                                            @click="closeNavbar"
                                                        >
                                                            {{ child.title }}
                                                        </NuxtLink>
                                                    </li>
                                                </div>
                                            </div>
                                        </ul>
                                    </li>
                                </template>
                            </template>

                            <!-- Fallback menu if WordPress menu fails -->
                            <template v-else>
                                <li class="nav-item">
                                    <NuxtLink to="/" class="nav-link" :class="{ active: route.path === '/' }">
                                        Home
                                    </NuxtLink>
                                </li>
                                <li class="nav-item">
                                    <NuxtLink to="/about" class="nav-link" :class="{ active: route.path === '/about' }">
                                        About
                                    </NuxtLink>
                                </li>
                                <li class="nav-item">
                                    <NuxtLink
                                        to="/services"
                                        class="nav-link"
                                        :class="{ active: route.path === '/services' }"
                                    >
                                        Services
                                    </NuxtLink>
                                </li>
                                <li class="nav-item">
                                    <NuxtLink
                                        to="/contact"
                                        class="nav-link"
                                        :class="{ active: route.path === '/contact' }"
                                    >
                                        Contact
                                    </NuxtLink>
                                </li>
                            </template>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    </div>
</template>

<script setup>
const route = useRoute();
const { $api } = useNuxtApp();

// Reactive data
const isSticky = ref(false);
const optionData = ref(null);
const menuLoading = ref(true);
const menuItems = ref([]);

// Computed properties
const isHomePage = computed(() => {
    return route.path === "/";
});

// Convert WordPress menu URLs to Nuxt-friendly URLs
const getMenuItemUrl = (item) => {
    console.log("Converting URL for:", item.title, "Original URL:", item.url);

    // If it's an external URL (not your WordPress site), return as-is
    if (item.url.includes("http") && !item.url.includes("cutoutpartner-api.com")) {
        return item.url;
    }

    // For WordPress pages, extract the slug and create Nuxt route
    if (item.type === "post_type" && item.object === "page") {
        try {
            const url = new URL(item.url);
            let path = url.pathname;

            // Remove any trailing slashes
            path = path.replace(/\/$/, "") || "/";

            // Convert WordPress paths to Nuxt paths
            if (path === "/" || path === "/home" || path.endsWith("/home")) {
                console.log("Converting to home route:", path, "→", "/");
                return "/";
            }

            // Extract the last part of the path as the slug
            const pathParts = path.split("/").filter((part) => part.length > 0);
            const slug = pathParts[pathParts.length - 1];

            if (slug && slug !== "home") {
                console.log("Converting to page route:", path, "→", `/${slug}`);
                return `/${slug}`;
            }

            return "/";
        } catch (error) {
            console.error("Error parsing URL:", item.url, error);
            return "/";
        }
    }

    // For custom links, try to extract path
    try {
        const url = new URL(item.url);
        let path = url.pathname;

        // Remove trailing slashes
        path = path.replace(/\/$/, "") || "/";

        // Convert home to root
        if (path === "/" || path === "/home") {
            return "/";
        }

        console.log("Custom link converted:", item.url, "→", path);
        return path;
    } catch {
        // If URL parsing fails, assume it's a relative path
        console.log("URL parsing failed, using as relative path:", item.url);
        return item.url.startsWith("/") ? item.url : `/${item.url}`;
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

// Methods
const handleScroll = () => {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 150) {
        navbar.classList.add("fixed-top-scroll");
        isSticky.value = true;
    } else {
        navbar.classList.remove("fixed-top-scroll");
        isSticky.value = false;
    }
};

const closeNavbar = () => {
    // Close mobile navbar when dropdown link is clicked
    const navbarCollapse = document.getElementById("navbarSupportedContent");
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        // Use Bootstrap 5 Collapse API
        if (window.bootstrap) {
            const bsCollapse = new window.bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    }
};

// Lifecycle hooks
onMounted(async () => {
    window.addEventListener("scroll", handleScroll);

    // Fetch WordPress menu
    try {
        console.log("Fetching WordPress menu...");
        // Try to get primary menu first
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
        console.error("Error loading WordPress menu:", error);
        // Keep fallback navigation
    } finally {
        menuLoading.value = false;
    }

    // Fetch options data (if you have an API endpoint for this)
    try {
        // Example: optionData.value = await $api.getOptions()
        // For now, you can set static data or create an API endpoint
        console.log("Navigation mounted - fetch options here if needed");
    } catch (error) {
        console.error("Error fetching options:", error);
    }
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1030;
    transition: all 0.3s ease;
}

.fixed-top-scroll {
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03), 0 3px 6px rgba(0, 0, 0, 0.06);
}

img.logo {
    height: 35px;
}

.navbar-expand-lg .navbar-nav .nav-link {
    padding-right: 1.5rem;
}

.navbar-nav li a {
    text-transform: uppercase;
    font-size: 14px;
    color: #000;
    font-weight: 500;
    line-height: 24px;
}

.other-page li a {
    color: #000;
}

.navbar-nav li a:hover {
    color: #00bcd4;
    background-color: transparent;
}

.fixed-top-scroll .navbar-nav li a:hover {
    color: #00bcd4 !important;
}

.fixed-top-scroll {
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03), 0 3px 6px rgba(0, 0, 0, 0.06);
}

.fixed-top-scroll .navbar-nav li a {
    color: #515151;
}

.navbar-nav .nav-link.active,
.navbar-nav .nav-link.show {
    color: #00bcd4;
}

.fixed-top-scroll .navbar-nav .nav-link.active,
.navbar-nav .nav-link.show {
    color: #00bcd4 !important;
}

.dropdown-menu {
    border-top: 3px solid #00bcd4;
    padding-right: 15px;
}

.dropdown-menu li a {
    color: #515151 !important;
    text-transform: capitalize;
    font-size: 14px;
    font-weight: normal;
}

.dropdown-menu .dropdown-items {
    border-right: 1px solid #ddd;
    margin-left: 15px;
    width: max-content;
}

.dropdown-menu .dropdown-items li {
    padding: 5px 0;
}

.dropdown-menu .dropdown-items li a {
    padding: 0;
}

.dropdown-menu .dropdown-items li a:hover {
    color: #00bcd4 !important;
}

.dropdown-menu .dropdown-items:last-child {
    border-right: none;
}

.dropdown-menu .dropdown-items .title {
    font-size: 15px;
    color: #000 !important;
}

.dropdown-menu .dropdown-items .title a:hover {
    color: #000 !important;
}

.dropdown-toggle::after {
    margin-left: 0.655em;
}

/* 3rd level dropdown styles */
.dropdown-submenu {
    position: absolute;
    top: 0;
    left: 100%;
    min-width: 200px;
}

.dropdown-item.dropdown {
    position: relative;
}

.dropdown-item.dropdown:hover .dropdown-submenu {
    display: block;
}

/* Mobile adjustments for submenus */
@media (max-width: 991.98px) {
    .dropdown-submenu {
        position: static !important;
        left: auto !important;
        margin-left: 20px;
        box-shadow: none;
        border: none;
        background-color: #f0f0f0;
    }
}

/* Minimal responsive adjustments only */
@media (max-width: 991.98px) {
    .dropdown-menu {
        position: static !important;
        float: none;
        width: auto;
        margin-top: 0;
        background-color: #f8f9fa;
        border: none;
        box-shadow: none;
    }

    .dropdown-menu.service-dropdown {
        left: auto !important;
    }

    .dropdown-menu .dropdown-items {
        border-right: none;
        margin-left: 0;
        width: 100%;
    }
}

@media (max-width: 767.98px) {
    .navbar-nav li a {
        font-size: 13px;
    }

    img.logo {
        height: 30px;
    }
}

@media (max-width: 575.98px) {
    img.logo {
        height: 28px;
    }

    .navbar-nav li a {
        font-size: 12px;
    }
}
</style>
