<!-- components/TheFooter2.vue -->
<template>
    <!-- Loading state -->
    <div v-if="!footerSections || !footerSections.length" class="footer-skeleton">Loading footer...</div>

    <!-- Footer -->
    <div v-else class="container-fluid footer-bg">
        <div class="container">
            <div class="footer-grid" :style="desktopGridStyle">
                <div class="footer-column" v-for="(section, index) in footerSections" :key="index">
                    <template v-if="section.footer_column" v-for="(item, itemIndex) in section.footer_column">
                        <h6 class="footer-title" v-if="section.footer_title">{{ section.footer_title }}</h6>
                        <!-- Logo -->
                        <div v-if="item.acf_fc_layout === 'footer_logo'" class="footer-logo" :key="`logo-${itemIndex}`">
                            <img :src="item.footer_logo" alt="Logo" />
                        </div>

                        <!-- Content -->
                        <div
                            v-if="item.acf_fc_layout === 'footer_content'"
                            class="footer-inner-content"
                            :key="`content-${itemIndex}`"
                            v-html="item.footer_content"
                        ></div>

                        <!-- Social -->
                        <div
                            v-if="item.acf_fc_layout === 'footer_social'"
                            class="footer-social"
                            :key="`social-${itemIndex}`"
                            :class="{ is_inline_style: item.is_inline_style === 'no' }"
                        >
                            <a
                                v-for="(social, i) in item.footer_social"
                                :key="i"
                                :href="social.location"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i :class="social.bootstrap_icon_class_name"></i> {{ social.label }}
                            </a>
                        </div>

                        <!-- Links -->
                        <div v-if="item.acf_fc_layout === 'footer_link'" class="footer-link" :key="`link-${itemIndex}`">
                            <ul class="list-unstyled">
                                <li v-for="(link, i) in item.footer_page_link" :key="i">
                                    <NuxtLink :to="getPostUrl(link)">
                                        {{ link.post_title }}
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer Bottom Section -->
    <div class="container-fluid footer-bottom-bg">
        <div class="container">
            <div class="footer-bottom-grid">
                <div class="footer-bottom-item" v-for="(fb, fbIndex) in footerBottom" :key="fbIndex">
                    <div v-if="fb.footer_bottom_content" v-html="fb.footer_bottom_content"></div>

                    <template v-if="fb.payment_icons" v-for="(icon, iconsIndex) in fb.payment_icons" :key="iconsIndex">
                        <img v-if="icon.upload_svg_icon" :src="icon.upload_svg_icon" :alt="icon.title" />
                    </template>

                    <ul v-if="fb.select_page && fb.select_page.length" class="footer-bottom-link">
                        <li v-for="(page, pageIndex) in fb.select_page" :key="pageIndex">
                            <NuxtLink :to="getPostUrl(page)">{{ page.post_title }}</NuxtLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";

const { siteSettings } = useSiteSettings();

// Get footer data from siteSettings
const footerSections = computed(() => {
    return siteSettings.value?.all_fields?.footer_top_section || [];
});

const footerBottom = computed(() => {
    return siteSettings.value?.all_fields?.footer_bottom || [];
});

// ✅ FIXED: Desktop grid style
const desktopGridStyle = computed(() => {
    const columns = siteSettings.value?.all_fields?.footer_grid_column_desktop || 4;
    return {
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
    };
});

// ✅ FIXED: Footer bottom grid style
const footerBottomGridStyle = computed(() => {
    const columns = siteSettings.value?.all_fields?.footer_bottom_grid_column || 4;
    return {
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        display: "grid",
        gap: "1.25rem",
        padding: "20px 0",
        alignItems: "center",
    };
});

// ✅ ADDED: Helper function to convert post object to URL
const getPostUrl = (post) => {
    if (!post) return "/";

    // If post has a URL property, use it
    if (post.url) return post.url;

    // If post has post_name (slug), construct URL
    if (post.post_name) {
        return `/${post.post_name}`;
    }

    // If post has ID, construct URL (fallback)
    if (post.ID) {
        return `/page/${post.ID}`;
    }

    return "/";
};
</script>

<style scoped>
/* All your existing styles remain unchanged */
.footer-bg {
    background-color: #fff;
}

.footer-bg p {
    margin-bottom: 0;
    padding-bottom: 0;
}

.footer-grid {
    display: grid;
    gap: 1.25rem;
    padding: 80px 0;
}

.footer-grid .footer-column {
    min-width: 0;
    overflow: hidden;
}

.footer-grid img {
    max-width: 250px;
    height: auto;
}

.footer-skeleton {
    padding: 80px 0;
    text-align: center;
    color: #aaa;
    background: #f8f9fa;
}

/* Component Styles */
.footer-inner-content {
    color: #555;
    line-height: 1.8;
}

.footer-social {
    display: flex;
    gap: 15px;
    margin-top: 20px;
}

.footer-social.is_inline_style {
    flex-direction: column;
    row-gap: 5px;
}

.footer-social.is_inline_style i {
    font-size: 16px;
}

.footer-social.is_inline_style a {
    font-size: 16px;
    line-height: 170%;
    display: flex;
    column-gap: 10px;
    word-break: break-all;
}

.footer-social a {
    color: #555;
    font-size: 20px;
    transition: 0.3s;
}
.footer-social a:hover {
    color: #007bff;
}

.footer-title {
    margin-bottom: 20px;
}

.footer-link ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
.footer-link ul li {
    margin-bottom: 10px;
}
.footer-link ul li a {
    text-decoration: none;
    color: #555;
    transition: 0.3s;
}
.footer-link ul li a:hover {
    color: #06bcd4;
    padding-left: 5px;
}
.footer-link i {
    margin-right: 5px;
}

/* Footer Bottom Grid */

.footer-bottom-grid {
    display: flex;
    gap: 1.25rem;
    padding: 20px 0;
    align-items: center;
}

.footer-bottom-item img {
    width: 150px;
    margin-left: 10px;
}

.footer-bottom-link {
    display: flex;
    column-gap: 15px;
    align-items: center;
    margin-bottom: 0;
    padding: 0;
}

.footer-bottom-link li {
    list-style: none;
}

.footer-bottom-link a {
    text-decoration: none;
    color: #898989;
    transition: 0.3s;
}

.footer-bottom-link a:hover {
    color: #06bcd4;
}

.footer-logo {
    margin-bottom: 20px;
}
</style>
