<template>
    <div>
        <!-- <call-in-action :cta-data="ctaData" v-if="whichPage !== '/quotation'"></call-in-action> -->
        <div class="footer" v-if="footerSettings">
            <!-- <page-loader v-if="!isLoading"></page-loader> -->
            <div class="container" v-if="footerSettings">
                <div class="footer-top">
                    <div class="row">
                        <div class="col-lg-3 col-md-6 col-sm-12 mb-4 mb-lg-0">
                            <img
                                :src="footerSettings.footer_group.footer_logo"
                                alt=""
                                class="logo"
                                v-if="footerSettings.footer_group.footer_logo"
                            />
                            <div
                                v-if="footerSettings.footer_group.footer_about_us"
                                v-html="footerSettings.footer_group.footer_about_us"
                                class="footer-about"
                            ></div>
                        </div>
                        <div
                            class="col-lg-3 col-md-6 col-sm-12 mb-4 mb-lg-0"
                            v-for="(link, index) in footerSettings.footer_group.footer_links"
                            :key="index"
                        >
                            <h3>{{ link.link_title }}</h3>
                            <div class="footer-link" v-if="link.is_link == 0">
                                <ul>
                                    <li
                                        v-for="(footer_menu, footer_menu_index) in link.link_content"
                                        :key="footer_menu_index"
                                    >
                                        <router-link v-if="footer_menu.link_location" :to="footer_menu.link_location">{{
                                            footer_menu.link_text
                                        }}</router-link>
                                    </li>
                                </ul>
                            </div>
                            <div class="footer-link" v-else>
                                <div v-if="link.link_content_full" v-html="link.link_content_full"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <div class="row">
                        <div class="col-12">
                            <div class="footer-bottom-content">
                                <div
                                    class="footer-bottom-left"
                                    v-if="footerSettings.footer_group.footer_bottom_left_text"
                                    v-html="footerSettings.footer_group.footer_bottom_left_text"
                                ></div>

                                <div class="footer-social" v-if="footerSettings.footer_group.footer_social">
                                    <router-link
                                        :to="social.location"
                                        v-for="(social, index) in footerSettings.footer_group.footer_social"
                                        :key="index"
                                        class="social-link"
                                    >
                                        <i :class="social.social_icon"></i>
                                    </router-link>
                                </div>

                                <p
                                    class="copyright"
                                    v-if="footerSettings.footer_group.footer_bottom_right_text"
                                    v-html="footerSettings.footer_group.footer_bottom_right_text"
                                ></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const route = useRoute();
const { $api } = useNuxtApp();
const footerSettings = ref(null);

onMounted(async () => {
    // Fetch footer settings
    try {
        const footerData = await $api.getSiteSettings();
        footerSettings.value = footerData.all_fields;
    } catch (error) {
        console.error("Error fetching site settings:", error);
    }
});
</script>

<style scoped>
.footer {
    padding-top: 100px;
    padding-bottom: 50px;
    background-color: #171b26;
}

.footer-top img.logo {
    width: 200px;
    margin-bottom: 20px;
    max-width: 100%;
    height: auto;
}

.footer a,
.footer p {
    color: #797d88;
}

.footer a:hover {
    color: #07b8d0;
}

.footer h3 {
    color: #fff;
    margin-bottom: 30px;
    font-weight: normal;
}

.footer-about {
    line-height: 1.6;
    margin-top: 15px;
}

.footer-link ul {
    padding-left: 0;
    list-style: none;
}

.footer-link ul li {
    margin-bottom: 12px;
    line-height: 20px;
}

.footer-link ul li a {
    font-size: 16px;
    text-decoration: none;
    transition: color 0.3s ease;
}

.footer-link i {
    color: #00bcd4;
    margin-right: 10px;
    font-size: 18px;
}

.footer-bottom {
    margin: 30px 0 0 0;
    border-top: 1px solid #404040;
    padding-top: 50px;
}

.footer-bottom-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
}

.footer-bottom-left {
    flex: 1;
    min-width: 200px;
}

.footer-bottom p {
    font-size: 14px;
    margin: 0;
}

.footer-social {
    display: flex;
    gap: 15px;
    align-items: center;
}

.footer-social .social-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: all 0.3s ease;
    text-decoration: none;
}

.footer-social .social-link:hover {
    background-color: rgba(7, 184, 208, 0.1);
    transform: translateY(-2px);
}

.footer-social i {
    color: #07b8d0;
    font-size: 22px;
    margin: 0;
}

.copyright {
    text-align: right;
    white-space: nowrap;
}

/* Tablet Styles */
@media (max-width: 991.98px) {
    .footer {
        padding-top: 80px;
        padding-bottom: 40px;
    }

    .footer-top img.logo {
        width: 180px;
    }

    .footer h3 {
        margin-bottom: 25px;
        font-size: 1.1rem;
    }

    .footer-bottom {
        padding-top: 40px;
    }
}

/* Mobile Styles */
@media (max-width: 767.98px) {
    .footer {
        padding-top: 60px;
        padding-bottom: 30px;
    }

    .footer-top img.logo {
        width: 160px;
        margin-bottom: 15px;
    }

    .footer h3 {
        margin-top: 30px;
        margin-bottom: 20px;
        font-size: 1rem;
    }

    .footer h3:first-child {
        margin-top: 0;
    }

    .footer-link ul li {
        margin-bottom: 10px;
    }

    .footer-link ul li a {
        font-size: 15px;
    }

    .footer-bottom {
        margin-top: 20px;
        padding-top: 30px;
    }

    .footer-bottom-content {
        justify-content: center;
        flex-direction: column;
        text-align: center;
        gap: 15px;
    }

    .footer-bottom-left {
        order: 2;
        min-width: auto;
    }

    .footer-social {
        order: 1;
        justify-content: center;
        margin-bottom: 10px;
    }

    .copyright {
        order: 3;
        text-align: center;
        white-space: normal;
    }

    .footer-social .social-link {
        width: 35px;
        height: 35px;
    }

    .footer-social i {
        font-size: 20px;
    }
}

/* Small Mobile Styles */
@media (max-width: 575.98px) {
    .footer {
        padding-top: 50px;
        padding-bottom: 25px;
    }

    .footer-top img.logo {
        width: 140px;
    }

    .footer h3 {
        font-size: 0.95rem;
        margin-bottom: 15px;
    }

    .footer-link ul li a {
        font-size: 14px;
    }

    .footer-bottom p {
        font-size: 13px;
    }

    .footer-social {
        gap: 10px;
    }

    .footer-social .social-link {
        width: 32px;
        height: 32px;
    }

    .footer-social i {
        font-size: 18px;
    }
}

/* Extra Small Mobile Styles */
@media (max-width: 375px) {
    .footer {
        padding-top: 40px;
        padding-bottom: 20px;
    }

    .footer-top img.logo {
        width: 120px;
    }

    .footer h3 {
        font-size: 0.9rem;
    }

    .footer-link ul li a {
        font-size: 13px;
    }

    .footer-bottom p {
        font-size: 12px;
    }
}

/* Print Styles */
@media print {
    .footer {
        background-color: transparent !important;
        color: #000 !important;
        padding: 20px 0;
    }

    .footer a,
    .footer p,
    .footer h3 {
        color: #000 !important;
    }

    .footer-social {
        display: none;
    }
}
</style>
