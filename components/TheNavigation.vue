<template>
    <div class="header" id="navbar">
        <div class="container">
            <nav class="navbar navbar-expand-lg bsb-navbar bsb-navbar-hover bsb-navbar-caret cutout-navbar">
                <div class="container-fluid">
                    <!-- Logo Section -->
                    <NuxtLink class="navbar-brand" to="/">
                        <div v-if="!isHomePage && otherPagesLogo">
                            <img :src="otherPagesLogo" alt="Cutout Partner" height="35" class="logo" />
                        </div>
                        <div v-else>
                            <img
                                v-if="isSticky && stickyLogo"
                                :src="stickyLogo"
                                alt="Logo"
                                height="35"
                                class="logo sticky"
                            />
                            <img v-else-if="homeLogo" :src="homeLogo" alt="Cutout Partner" height="35" class="logo" />
                            <span v-else class="navbar-brand-text fw-bold">Cutout Partner</span>
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
                            <!-- Loading State -->
                            <li v-if="isLoading" class="nav-item">
                                <span class="nav-link text-muted">Loading menu...</span>
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
                                    <li
                                        v-else
                                        class="nav-item dropdown"
                                        @mouseenter="showDropdown($event)"
                                        @mouseleave="hideDropdown"
                                    >
                                        <!-- Parent link - clickable ONLY if it has a real URL -->
                                        <NuxtLink
                                            v-if="hasRealUrl(item)"
                                            :to="getMenuItemUrl(item)"
                                            class="nav-link has-dropdown"
                                            :class="{ active: isActiveLink(item) }"
                                        >
                                            {{ item.title }}
                                            <i class="bi bi-chevron-down ms-1"></i>
                                        </NuxtLink>

                                        <!-- Parent is just a label (custom link with # or empty) -->
                                        <span v-else class="nav-link has-dropdown dropdown-label">
                                            {{ item.title }}
                                            <i class="bi bi-chevron-down ms-1"></i>
                                        </span>

                                        <!-- UNIVERSAL Dropdown - Smart column layout -->
                                        <div
                                            class="dropdown-menu mega-dropdown-menu"
                                            :class="getDropdownClass(item.children.length)"
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

                                                <!-- Optional "Explore All" link if parent has URL -->
                                                <NuxtLink
                                                    v-if="item.children.length > 8"
                                                    :to="getMenuItemUrl(item)"
                                                    class="explore-all"
                                                >
                                                    EXPLORE ALL <i class="bi bi-arrow-right"></i>
                                                </NuxtLink>
                                            </div>
                                        </div>
                                    </li>
                                </template>
                            </template>

                            <!-- Fallback Static Menu -->
                            <template v-else>
                                <li class="nav-item">
                                    <NuxtLink to="/" class="nav-link" :class="{ active: route.path === '/' }">
                                        Home
                                    </NuxtLink>
                                </li>
                                <li class="nav-item">
                                    <NuxtLink
                                        to="/about-us"
                                        class="nav-link"
                                        :class="{ active: route.path === '/about-us' }"
                                    >
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
                                        to="/contact-us"
                                        class="nav-link"
                                        :class="{ active: route.path === '/contact-us' }"
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
import { ref, computed, onMounted, onUnmounted } from "vue";

const route = useRoute();
const { siteSettings } = useSiteSettings();
const { menu, isLoading } = useMainMenu();

// Sticky header state
const isSticky = ref(false);
const currentDropdown = ref(null);

// Check if on homepage
const isHomePage = computed(() => {
    return route.path === "/" || route.path === "";
});

// Logo URLs from site settings (with fallbacks)
const homeLogo = computed(() => {
    const logo = siteSettings.value?.all_fields?.home_page_logo || siteSettings.value?.all_fields?.home_page_logo;
    return logo && logo.trim() !== "" ? logo : null;
});

const stickyLogo = computed(() => {
    const logo = siteSettings.value?.all_fields?.sticky_logo || siteSettings.value?.all_fields?.sticky_logo;
    return logo && logo.trim() !== "" ? logo : null;
});

const otherPagesLogo = computed(() => {
    const logo = siteSettings.value?.all_fields?.other_pages_logo || siteSettings.value?.all_fields?.other_pages_logo;
    return logo && logo.trim() !== "" ? logo : null;
});

// Menu items (extract array from menu object)
const menuItems = computed(() => {
    if (!menu.value) return [];
    if (Array.isArray(menu.value)) return menu.value;
    if (menu.value.items && Array.isArray(menu.value.items)) return menu.value.items;
    return [];
});

// Get menu item URL - FIXED for baseURL: "/v2/"
const getMenuItemUrl = (item) => {
    if (!item.url) return "/";

    let url = item.url;

    // If URL is absolute, extract pathname
    if (url.startsWith("http")) {
        try {
            const urlObj = new URL(url);
            url = urlObj.pathname;
        } catch (e) {
            return "/";
        }
    }

    // Remove /v2/ prefix if WordPress added it
    // Nuxt automatically adds it via baseURL config
    if (url.startsWith("/v2/")) {
        url = url.replace(/^\/v2/, "");
    }

    // Ensure it starts with /
    if (!url.startsWith("/")) {
        url = "/" + url;
    }

    return url;
};

// Check if menu item has a real URL (not just # or empty)
const hasRealUrl = (item) => {
    return item.url && item.url !== "#" && item.url.trim() !== "";
};

// Smart column layout based on number of children
const getDropdownClass = (childrenCount) => {
    if (childrenCount <= 6) {
        return "one-col"; // 1-3 items → 1 column
    } else if (childrenCount <= 30) {
        return "two-col"; // 4-8 items → 2 columns
    } else {
        return "three-col"; // 9+ items → 3 columns
    }
};

// Check if link is active
const isActiveLink = (item) => {
    const itemUrl = getMenuItemUrl(item);
    return route.path === itemUrl || route.path.startsWith(itemUrl + "/");
};

// Dropdown management
const showDropdown = (event) => {
    // Find the dropdown menu within this parent li
    const parentLi = event.currentTarget;
    const dropdown = parentLi.querySelector(".dropdown-menu");
    if (dropdown) {
        currentDropdown.value = dropdown;
        dropdown.classList.add("show");
    }
};

const hideDropdown = () => {
    if (currentDropdown.value) {
        currentDropdown.value.classList.remove("show");
        currentDropdown.value = null;
    }
};

// Close navbar (for mobile)
const closeNavbar = () => {
    const navbar = document.getElementById("navbarSupportedContent");
    if (navbar && navbar.classList.contains("show")) {
        const bsCollapse = new window.bootstrap.Collapse(navbar);
        bsCollapse.hide();
    }
};

// Handle scroll for sticky header (throttled via requestAnimationFrame)
let scrollTicking = false;
const handleScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
        const navbar = document.getElementById("navbar");
        if (window.scrollY > 50) {
            isSticky.value = true;
            navbar?.classList.add("fixed-top-scroll");
        } else {
            isSticky.value = false;
            navbar?.classList.remove("fixed-top-scroll");
        }
        scrollTicking = false;
    });
};

// Lifecycle
onMounted(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
/* Base Styles */
.navbar-brand-text {
    font-size: 20px;
    color: #000;
}

.explore-all {
    margin-top: 20px;
    text-align: center;
    display: inline-block;
    width: 100%;
    margin-bottom: 12px;
    color: #00bcd4;
    text-decoration: none;
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

/* Mega Dropdown */
.mega-dropdown-menu {
    border-top: 3px solid #00bcd4;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 0;
}

/* Dropdown Behavior */
.dropdown {
    position: relative;
}

.dropdown-menu {
    position: absolute;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    margin-top: -2px;
    border-top: 3px solid #00bcd4;
    display: none;
    pointer-events: none;
    left: 0;
    top: 100%;
}

.dropdown-menu.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: auto;
}

/* Parent link should ALWAYS be clickable */
.dropdown .nav-link {
    pointer-events: auto !important;
    cursor: pointer !important;
}

/* Custom dropdown arrow styling */
.nav-link.has-dropdown i {
    font-size: 10px;
    transition: transform 0.3s ease;
}

.dropdown:hover .nav-link.has-dropdown i {
    transform: rotate(180deg);
}

/* Non-clickable dropdown label (custom links with #) */
.dropdown-label {
    cursor: default !important;
    pointer-events: none !important;
    /* Make it look exactly like other nav links */
    display: inline-block;
    padding: 20px;
    font-size: 14px;
    color: #000;
    font-weight: 500;
    line-height: 24px;
    text-transform: capitalize;
    text-decoration: none;
}

/* Dropdown label in sticky header */
.fixed-top-scroll .dropdown-label {
    color: #515151;
}

/* Dropdown label hover effect */
.dropdown-label:hover {
    color: #00bcd4;
    background-color: transparent;
}

.fixed-top-scroll .dropdown-label:hover {
    color: #00bcd4 !important;
}

/* Hover behavior for desktop */
@media (min-width: 992px) {
    .dropdown:hover .dropdown-menu {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
        pointer-events: auto;
        margin-top: 0px;
    }
}

/* Simple Mega Menu Container */
.simple-mega-container {
    width: 100%;
}

.simple-mega-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(285px, 1fr)); /* Default: 2 columns */
    list-style: none;
    padding: 0;
    margin: 0;
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

/* Column layouts - automatic based on item count */
.one-col .simple-mega-grid {
    grid-template-columns: 1fr !important;
}

/* Responsive */
@media (max-width: 991px) {
    .dropdown-menu {
        opacity: 1;
        visibility: visible;
        transform: none;
        position: static;
        border: none;
        box-shadow: none;
        pointer-events: auto;
    }

    .simple-mega-grid {
        grid-template-columns: 1fr;
    }
}
.cutout-navbar {
    padding: 0;
}
</style>
