<template>
    <div class="header" id="navbar">
        <div class="container">
            <nav class="navbar navbar-expand-lg bsb-navbar bsb-navbar-hover bsb-navbar-caret">
                <div class="container-fluid">
                    <NuxtLink class="navbar-brand" v-if="otherPagesLogo || stickyLogo || homeLogo" to="/">
                        <div v-if="!isHomePage && otherPagesLogo">
                            <img
                                :src="otherPagesLogo"
                                alt="Cutout Partner"
                                height="24"
                                class="logo"
                                v-if="otherPagesLogo"
                            />
                        </div>
                        <div v-else>
                            <img
                                :src="stickyLogo"
                                alt="Logo"
                                height="24"
                                class="logo sticky"
                                v-if="isSticky && stickyLogo"
                            />
                            <img :src="homeLogo" alt="Cutout Partner" height="24" class="logo" v-else />
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
                            <li v-if="pending" class="nav-item">
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
                                            :href="getMenuItemUrl(item)"
                                            class="nav-link dropdown-toggle"
                                            :class="{ active: isActiveLink(item) }"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                            @click="handleParentClick($event, item)"
                                        >
                                            {{ item.title }}
                                        </a>

                                        <!-- SIMPLE 2-COLUMN MEGA MENU (NO LEFT CATEGORY) -->
                                        <div
                                            v-if="item.title.toLowerCase().trim() === 'services'"
                                            class="dropdown-menu mega-dropdown-menu simple-2col-menu"
                                            @mouseleave="handleDropdownMouseLeave"
                                            @mouseenter="handleDropdownMouseEnter"
                                        >
                                            <div class="simple-mega-container">
                                                <!-- SHOW ALL CHILD ITEMS IN 2 COLUMNS -->
                                                <ul class="simple-mega-grid">
                                                    <li v-for="child in item.children" :key="child.id">
                                                        <NuxtLink
                                                            :to="getMenuItemUrl(child)"
                                                            :target="child.target || '_self'"
                                                            @click="closeNavbar"
                                                        >
                                                            {{ child.title }}
                                                        </NuxtLink>
                                                    </li>
                                                </ul>

                                                <NuxtLink to="/services" class="explore-all">
                                                    EXPLORE ALL <i class="bi bi-arrow-right"></i>
                                                </NuxtLink>
                                            </div>
                                        </div>

                                        <!-- Regular dropdown menu for non-services -->
                                        <div
                                            v-else
                                            class="dropdown-menu mega-dropdown-menu simple-2col-menu one-col"
                                            @mouseleave="handleDropdownMouseLeave"
                                            @mouseenter="handleDropdownMouseEnter"
                                        >
                                            <div class="simple-mega-container">
                                                <ul class="simple-mega-grid">
                                                    <li v-for="child in item.children" :key="child.id">
                                                        <NuxtLink
                                                            :to="getMenuItemUrl(child)"
                                                            :target="child.target || '_self'"
                                                            @click="closeNavbar"
                                                        >
                                                            {{ child.title }}
                                                        </NuxtLink>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
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

// Import and use the shared composable
const { siteSettings, fetchSettings } = useSiteSettings();

// Reactive data
const isSticky = ref(false);
const optionData = ref(null);

// --- Fetch menu data with useAsyncData ---
const { data: asyncMenuData, pending } = await useAsyncData("main-menu", async () => {
    try {
        // Try to get primary menu first
        const menuData = await $api.getMenu("primary");
        if (menuData && menuData.items) {
            return menuData.items;
        } else {
            console.warn("No primary menu found, trying to get all menus...");
            // Fallback: get all menus and use the first one
            const allMenus = await $api.getMenus();
            if (allMenus && allMenus.length > 0) {
                return allMenus[0].items;
            }
            return null; // Return null if no menus are found
        }
    } catch (err) {
        console.error("Error loading WordPress menu:", err);
        // Return null to trigger the fallback menu
        return null;
    }
});

// Create a computed property for the menu items
const menuItems = computed(() => asyncMenuData.value);

// Computed properties for logos, now safely accessing the composable
const isHomePage = computed(() => route.path === "/");
const stickyLogo = computed(() => siteSettings.value?.all_fields?.sticky_logo || null);
const homeLogo = computed(() => siteSettings.value?.all_fields?.home_page_logo || null);
const otherPagesLogo = computed(() => siteSettings.value?.all_fields?.other_pages_logo || null);

// Convert WordPress menu URLs to Nuxt-friendly URLs
const getMenuItemUrl = (item) => {
    // Handle empty, null, undefined, or placeholder URLs
    if (!item.url || item.url.trim() === "" || item.url === "#") {
        return null; // Return null for invalid URLs
    }

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
                return "/";
            }

            // Extract the last part of the path as the slug
            const pathParts = path.split("/").filter((part) => part.length > 0);
            const slug = pathParts[pathParts.length - 1];

            if (slug && slug !== "home") {
                return `/${slug}`;
            }

            return "/";
        } catch (error) {
            console.error("Error parsing URL:", item.url, error);
            return null; // Return null for parsing errors
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

        return path;
    } catch {
        // If URL parsing fails and it's not empty, assume it's a relative path
        if (item.url && item.url.trim() !== "") {
            return item.url.startsWith("/") ? item.url : `/${item.url}`;
        }
        return null;
    }
};

// Check if link is active
const isActiveLink = (item) => {
    const itemUrl = getMenuItemUrl(item);

    // If URL is null/invalid, never mark as active
    if (itemUrl === null) {
        return false;
    }

    const currentPath = route.path;

    // Handle root/home page - only exact match
    if (itemUrl === "/" || itemUrl === "/home") {
        return currentPath === "/";
    }

    // For other pages, use exact match
    const normalizedItemUrl = itemUrl.replace(/\/$/, "") || "/";
    const normalizedCurrentPath = currentPath.replace(/\/$/, "") || "/";

    return normalizedCurrentPath === normalizedItemUrl;
};

// Handle parent click for dropdown items with children
const handleParentClick = (event, item) => {
    // If it's a regular click (not right-click), navigate to the parent page
    if (event.button === 0) {
        // Small delay to allow dropdown to show if needed
        setTimeout(() => {
            navigateTo(getMenuItemUrl(item));
        }, 100);
    }
};

// Handle mouse events for dropdown visibility
const handleDropdownMouseLeave = (event) => {
    // Close the dropdown when mouse leaves the dropdown container
    const dropdown = event.currentTarget;
    const bootstrapDropdown = window.bootstrap?.Dropdown?.getInstance(dropdown.previousElementSibling);
    if (bootstrapDropdown) {
        bootstrapDropdown.hide();
    }
};

const handleDropdownMouseEnter = (event) => {
    // Ensure dropdown stays open when mouse enters
    event.stopPropagation();
};

// Methods
const handleScroll = () => {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 60) {
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

// Helper function to initialize dropdowns
const initializeDropdowns = () => {
    const dropdownElements = document.querySelectorAll(".dropdown-toggle");
    dropdownElements.forEach((element) => {
        // Ensure we don't re-initialize an already existing dropdown
        if (window.bootstrap && !window.bootstrap.Dropdown.getInstance(element)) {
            new window.bootstrap.Dropdown(element, {
                autoClose: "outside",
                boundary: "viewport",
            });
        }
    });
};

// Lifecycle hooks
onMounted(() => {
    window.addEventListener("scroll", handleScroll);

    // Initial dropdown initialization
    nextTick(() => {
        initializeDropdowns();
    });
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
});

// Watch for menu data to be ready and re-initialize dropdowns
watch(menuItems, () => {
    // Re-initialize dropdowns after menu loads
    nextTick(() => {
        initializeDropdowns();
    });
});

// Fetch main site settings in the background
fetchSettings();
</script>

<style scoped>
/* ---------- kept & used styles ---------- */

.explore-all {
    margin-top: 20px;
    text-align: center;
    display: inline-block;
    width: 100%;
}

.header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 99999;
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
    padding: 20px;
}

.navbar-nav li a {
    text-transform: capitalize;
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

.fixed-top-scroll .navbar-nav li a {
    color: #515151;
}

.navbar-nav .nav-link.active,
.navbar-nav .nav-link.show {
    color: #00bcd4;
}

/* Mega Dropdown (base) */
.mega-dropdown-menu {
    border-top: 3px solid #00bcd4;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 0;
}

/* dropdown base & hover behavior */
.dropdown {
    position: relative;
}

.dropdown-menu {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    margin-top: 0;
    border-top: 3px solid #00bcd4;
}

.dropdown:hover .dropdown-menu {
    display: block !important;
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    border: none;
}

.dropdown-menu:hover {
    display: block !important;
    opacity: 1;
    visibility: visible;
}

/* Non-service dropdown inner layout (kept because used) */
.dropdown-container {
    padding: 0 15px;
}

.dropdown-items {
    border-right: 1px solid #ddd;
    margin-left: 15px;
    width: max-content;
}

.dropdown-items li {
    padding: 5px 0;
}

.dropdown-items li a {
    padding: 0;
    transition: all 0.3s ease;
}

.dropdown-items li a:hover {
    color: #00bcd4 !important;
    padding-left: 15px;
    border-left: 3px solid #00bcd4;
}

.dropdown-submenu {
    position: absolute;
    top: 0;
    left: 100%;
    min-width: 200px;
}

.dropdown-item.dropdown {
    position: relative;
}

/* SIMPLE 2-COLUMN MEGA MENU (current used layout) */
.simple-mega-container {
    width: 100%;
}

.simple-mega-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(285px, 1fr));
    list-style: none;
    padding: 0;
    margin: 0;
}

.simple-mega-grid li {
    border-bottom: 1px solid #eeeeee;
    border-right: 1px solid #eee;
}

.simple-mega-grid li:last-child {
    border-bottom: 0;
    border-right: 0;
}

.simple-mega-grid li a {
    font-size: 14px;
    color: #666;
    transition: 0.2s;
    padding: 10px 10px 10px 20px;
    display: block;
}

.simple-mega-grid li a:hover {
    color: #000 !important;
    background-color: #e0fbff;
}

/* small helpers */
.explore-all {
    margin-top: 12px;
    margin-bottom: 12px;
    text-align: center;
    display: inline-block;
    width: 100%;
    color: #00bcd4;
    text-decoration: none;
}

.one-col .simple-mega-grid {
    grid-template-columns: 1fr !important;
}

/* ---------------- mobile responsive (kept minimal) ---------------- */
@media (max-width: 991.98px) {
    /* Disable hover effects on mobile - use click instead */
    .dropdown:hover .dropdown-menu {
        display: none !important;
    }

    .dropdown-menu {
        opacity: 1;
        visibility: visible;
        transform: none;
        transition: none;
    }

    .mega-dropdown-menu {
        position: static !important;
        float: none;
        width: auto;
        margin-top: 0;
        background-color: #f8f9fa;
        border: none;
        box-shadow: none;
        border-radius: 0;
        min-width: auto;
        max-width: none;
    }

    .dropdown-submenu {
        position: static !important;
        left: auto !important;
        margin-left: 20px;
        box-shadow: none;
        border: none;
        background-color: #f0f0f0;
    }

    .dropdown-items {
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
