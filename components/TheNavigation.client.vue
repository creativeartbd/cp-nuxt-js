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
                                            :href="getMenuItemUrl(item)"
                                            class="nav-link dropdown-toggle"
                                            :class="{ active: isActiveLink(item) }"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                            @click="handleParentClick($event, item)"
                                        >
                                            {{ item.title }}
                                        </a>

                                        <!-- Multi-column dropdown menu for services -->
                                        <div
                                            v-if="item.title.toLowerCase().includes('service')"
                                            class="dropdown-menu mega-dropdown-menu"
                                            @mouseleave="handleDropdownMouseLeave"
                                            @mouseenter="handleDropdownMouseEnter"
                                        >
                                            <div class="mega-dropdown-container">
                                                <div class="mega-dropdown-row">
                                                    <!-- Column for each sub-heading -->
                                                    <div
                                                        v-for="child in item.children.filter(
                                                            (c) => c.children && c.children.length > 0
                                                        )"
                                                        :key="child.id"
                                                        class="mega-dropdown-column"
                                                    >
                                                        <!-- Sub-heading (clickable) -->
                                                        <div class="mega-dropdown-header">
                                                            <NuxtLink
                                                                :to="getMenuItemUrl(child)"
                                                                :target="child.target || '_self'"
                                                                class="mega-dropdown-title"
                                                                @click="closeNavbar"
                                                            >
                                                                {{ child.title }}
                                                            </NuxtLink>
                                                        </div>

                                                        <!-- Sub-items under the heading -->
                                                        <ul class="mega-dropdown-list">
                                                            <li
                                                                v-for="grandchild in child.children"
                                                                :key="grandchild.id"
                                                            >
                                                                <NuxtLink
                                                                    :to="getMenuItemUrl(grandchild)"
                                                                    :target="grandchild.target || '_self'"
                                                                    class="mega-dropdown-link"
                                                                    @click="closeNavbar"
                                                                >
                                                                    {{ grandchild.title }}
                                                                </NuxtLink>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <!-- Handle direct children (without sub-children) if any -->
                                                    <div
                                                        v-if="
                                                            item.children.filter(
                                                                (c) => !c.children || c.children.length === 0
                                                            ).length > 0
                                                        "
                                                        class="mega-dropdown-column"
                                                    >
                                                        <div class="mega-dropdown-header">
                                                            <span class="mega-dropdown-title">Other Services</span>
                                                        </div>
                                                        <ul class="mega-dropdown-list">
                                                            <li
                                                                v-for="child in item.children.filter(
                                                                    (c) => !c.children || c.children.length === 0
                                                                )"
                                                                :key="child.id"
                                                            >
                                                                <NuxtLink
                                                                    :to="getMenuItemUrl(child)"
                                                                    :target="child.target || '_self'"
                                                                    class="mega-dropdown-link"
                                                                    @click="closeNavbar"
                                                                >
                                                                    {{ child.title }}
                                                                </NuxtLink>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Regular dropdown menu for non-services -->
                                        <ul
                                            v-else
                                            class="dropdown-menu"
                                            @mouseleave="handleDropdownMouseLeave"
                                            @mouseenter="handleDropdownMouseEnter"
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
                                                                :href="getMenuItemUrl(child)"
                                                                class="dropdown-item dropdown-toggle"
                                                                data-bs-toggle="dropdown"
                                                                aria-expanded="false"
                                                                @click="handleParentClick($event, child)"
                                                            >
                                                                {{ child.title }}
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

    // Handle empty, null, undefined, or placeholder URLs
    if (!item.url || item.url.trim() === "" || item.url === "#") {
        console.log("Empty/invalid URL detected for:", item.title, "- returning null");
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

        console.log("Custom link converted:", item.url, "→", path);
        return path;
    } catch {
        // If URL parsing fails and it's not empty, assume it's a relative path
        if (item.url && item.url.trim() !== "") {
            console.log("URL parsing failed, using as relative path:", item.url);
            return item.url.startsWith("/") ? item.url : `/${item.url}`;
        }

        console.log("Invalid URL for:", item.title);
        return null;
    }
};

const debugActiveLinks = () => {
    console.log("=== Active Link Debug ===");
    console.log("Current route:", route.path);

    menuItems.value.forEach((item) => {
        const itemUrl = getMenuItemUrl(item);
        const isActive = isActiveLink(item);

        console.log(`${item.title}: ${itemUrl} - Active: ${isActive}`);

        if (item.children) {
            item.children.forEach((child) => {
                const childUrl = getMenuItemUrl(child);
                const childActive = isActiveLink(child);
                console.log(`  └─ ${child.title}: ${childUrl} - Active: ${childActive}`);
            });
        }
    });
    console.log("=== End Debug ===");
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

    // Initialize Bootstrap dropdowns with proper configuration
    nextTick(() => {
        const dropdownElements = document.querySelectorAll(".dropdown-toggle");
        dropdownElements.forEach((element) => {
            if (window.bootstrap) {
                new window.bootstrap.Dropdown(element, {
                    autoClose: "outside", // Close when clicking outside
                    boundary: "viewport",
                });
            }
        });
    });

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

        // Re-initialize dropdowns after menu loads
        nextTick(() => {
            const dropdownElements = document.querySelectorAll(".dropdown-toggle");
            dropdownElements.forEach((element) => {
                if (window.bootstrap && !window.bootstrap.Dropdown.getInstance(element)) {
                    new window.bootstrap.Dropdown(element, {
                        autoClose: "outside",
                        boundary: "viewport",
                    });
                }
            });
        });
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
    /* box-shadow: 5px 3px 8px #ddd;
    background: #fff; */
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

/* Mega Dropdown Styles */
.mega-dropdown-menu {
    border-top: 3px solid #00bcd4;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 0;
    min-width: 600px;
    max-width: 900px;
}

/* Show dropdown on hover with smooth transition */
.dropdown {
    position: relative;
}

.dropdown-menu {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    margin-top: 0;
}

.dropdown:hover .dropdown-menu {
    display: block !important;
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

/* Keep dropdown visible when hovering over the dropdown itself */
.dropdown-menu:hover {
    display: block !important;
    opacity: 1;
    visibility: visible;
}

/* Add a small invisible bridge to prevent gaps */
.dropdown::before {
    content: "";
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    height: 5px;
    background: transparent;
    z-index: 999;
}

.dropdown:hover::before {
    display: block;
}

.mega-dropdown-container {
    padding: 10px;
}

.mega-dropdown-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.mega-dropdown-column {
    flex: 1;
    min-width: 175px;
    margin-bottom: 0;
}

.mega-dropdown-header {
    margin-bottom: 5px;
    padding-bottom: 8px;
    border-bottom: 2px solid #00bcd4;
}

.mega-dropdown-title {
    font-size: 16px;
    font-weight: 600;
    color: #000 !important;
    text-transform: uppercase;
    text-decoration: none;
    letter-spacing: 0.5px;
    transition: color 0.3s ease;
}

.mega-dropdown-title:hover {
    color: #00bcd4 !important;
    text-decoration: none;
}

.mega-dropdown-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.mega-dropdown-list li {
    margin-bottom: 0;
}

.mega-dropdown-link {
    color: #666 !important;
    font-size: 14px;
    text-decoration: none;
    text-transform: capitalize;
    transition: all 0.3s ease;
    display: block;
    padding: 5px 0;
    border-left: 3px solid transparent;
    padding-left: 0px;
}

.mega-dropdown-link:hover {
    color: #00bcd4 !important;
    text-decoration: none;
    border-left-color: #00bcd4;
    padding-left: 15px;
}

/* Regular dropdown styles (for non-services) */
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
    color: #0286a6 !important;
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

/* Mobile Responsive */
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

    /* Remove invisible bridge on mobile */
    .dropdown::before {
        display: none !important;
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

    .mega-dropdown-container {
        padding: 15px;
    }

    .mega-dropdown-row {
        flex-direction: column;
        gap: 10px;
    }

    .mega-dropdown-column {
        min-width: auto;
        margin-bottom: 15px;
    }

    .mega-dropdown-header {
        margin-bottom: 10px;
        padding-bottom: 5px;
    }

    .mega-dropdown-title {
        font-size: 15px;
    }

    .mega-dropdown-link {
        font-size: 13px;
        padding: 3px 0;
    }

    .mega-dropdown-link:hover {
        padding-left: 15px;
    }
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

    .mega-dropdown-title {
        font-size: 14px;
    }

    .mega-dropdown-link {
        font-size: 12px;
    }
}

@media (max-width: 575.98px) {
    img.logo {
        height: 28px;
    }

    .navbar-nav li a {
        font-size: 12px;
    }

    .mega-dropdown-container {
        padding: 10px;
    }

    .mega-dropdown-title {
        font-size: 13px;
    }

    .mega-dropdown-link {
        font-size: 11px;
    }
}
</style>
