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
                            style="white-space: pre-line"
                            :key="`content-${itemIndex}`"
                            v-html="item.footer_content"
                        ></div>

                        <!-- Social -->
                        <div
                            v-if="item.acf_fc_layout === 'footer_social'"
                            class="footer-social"
                            :key="`social-${itemIndex}`"
                        >
                            <a
                                v-for="(social, i) in item.footer_social"
                                :key="i"
                                :href="social.location"
                                target="_blank"
                            >
                                <i :class="social.bootstrap_icon_class_name"></i>
                            </a>
                        </div>

                        <!-- Links -->
                        <div v-if="item.acf_fc_layout === 'footer_link'" class="footer-link" :key="`link-${itemIndex}`">
                            <ul class="list-unstyled">
                                <!-- Call the method from the template, just like your working component -->
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
            <div class="footer-bottom-grid" :style="footerBottomGridStyle">
                <div class="footer-bottom-item" v-for="(fb, fbIndex) in footerBottom" :key="fbIndex">
                    <div v-if="fb.footer_bottom_content" v-html="fb.footer_bottom_content"></div>

                    <template v-if="fb.payment_icons" v-for="(icon, iconsIndex) in fb.payment_icons" :key="iconsIndex">
                        <img v-if="icon.upload_svg_icon" :src="icon.upload_svg_icon" :alt="icon.title" />
                    </template>

                    <ul v-if="fb.select_page && fb.select_page.length" class="footer-bottom-link">
                        <!-- Call the method from the template here as well -->
                        <li v-for="(page, pageIndex) in fb.select_page" :key="pageIndex">
                            <NuxtLink :to="getPostUrl(page)">{{ page.post_title }}</NuxtLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    // Use the same data fetching pattern as your working component's parent would.
    // We'll use a computed property to get the state.
    computed: {
        siteSettings() {
            return useState("siteSettings").value;
        },
        footerSections() {
            return this.siteSettings?.all_fields?.footer_top_section || [];
        },
        footerBottom() {
            return this.siteSettings?.all_fields?.footer_bottom || [];
        },
        desktopGridStyle() {
            const count = this.footerSections.length;
            if (!count) return {};
            return {
                gridTemplateColumns: this.footerSections.map((_, i) => (i === 0 ? "1.5fr" : "1fr")).join(" "),
            };
        },
        footerBottomGridStyle() {
            const count = this.footerBottom.length;
            if (!count) return {};
            return {
                gridTemplateColumns: Array(count).fill("1fr").join(" "),
            };
        },
    },
    methods: {
        // This is the exact same method from your working component.
        // The Options API's `this.$api` is reliable and works correctly.
        getPostUrl(post) {
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
        },
    },
    // The mounted hook is the correct place to trigger data fetching if it hasn't happened yet.
    mounted() {
        // Only fetch if the parent hasn't already loaded the data
        if (!this.siteSettings) {
            const { $api } = useNuxtApp();
            $api.getSiteSettings()
                .then((data) => {
                    if (data) {
                        // Update the global state
                        useState("siteSettings").value = data;
                    }
                })
                .catch((error) => {
                    console.error("Site settings load error:", error);
                });
        }
    },
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
    background: #171b26;
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

.footer-social a {
    color: #171b26;
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
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: space-between;
}
.footer-bottom-item {
    min-width: 0;
    display: flex;
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
}
.footer-bottom-link li {
    list-style: none;
}
.footer-logo {
    margin-bottom: 20px;
}

/* Responsive Media Queries */
@media (max-width: 575.98px) {
    .footer-grid {
        grid-template-columns: 1fr !important;
        padding: 60px 0;
    }
    .footer-bottom-grid .footer-bottom-item {
        flex-basis: 100%;
    }
}

@media (min-width: 576px) and (max-width: 767.98px) {
    .footer-grid {
        grid-template-columns: repeat(2, 1fr) !important;
    }
    .footer-bottom-grid .footer-bottom-item {
        flex-basis: calc(50% - 0.5rem);
    }
}

@media (min-width: 768px) and (max-width: 991.98px) {
    .footer-grid {
        grid-template-columns: repeat(3, 1fr) !important;
    }
    .footer-bottom-grid .footer-bottom-item {
        flex-basis: calc(33.333% - 0.666rem);
    }
}

@media (min-width: 992px) {
    .footer-grid {
        /* JS Dynamic Grid */
    }
    .footer-bottom-grid {
        display: flex;
    }
}
</style>
