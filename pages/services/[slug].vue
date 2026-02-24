<template>
    <div class="home-page">
        <!-- Error State -->
        <div v-if="error" class="error-container">
            <div class="container">
                <h1>Service Not Found</h1>
                <p>The service "{{ slug }}" does not exist.</p>
            </div>
        </div>

        <!-- Loading / Empty State -->
        <div v-else-if="!data || !data.sections">
            <div class="container">
                <p>Loading service...</p>
            </div>
        </div>

        <!-- Content -->
        <div v-else class="wp-content">
            <!-- Sections -->
            <template v-for="(section, index) in data.sections" :key="index">
                <div v-if="Array.isArray(section.section_content)" class="section-wrapper">
                    <template v-for="(content, contentIndex) in section.section_content" :key="contentIndex">
                        <component
                            v-if="content && componentMap[content.acf_fc_layout]"
                            :is="componentMap[content.acf_fc_layout]"
                            :data="content"
                            :service="siteSettings?.all_fields?.select_services || []"
                        />

                        <!-- Unknown / Safe fallback -->
                        <div v-else class="unknown-section">
                            <div class="container">
                                <h3>Unknown section</h3>
                            </div>
                        </div>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { computed, markRaw, defineAsyncComponent } from "vue";
import TheHeaderBannerVue from "~/components/TheHeaderBanner.vue";

const route = useRoute();
const { $api } = useNuxtApp();
const { siteSettings } = useSiteSettings();

const slug = computed(() => route.params.slug);

const componentMap = markRaw({
    home_slider: defineAsyncComponent(() => import("~/components/sections/HomeSlider.vue")),
    we_are_passionate: defineAsyncComponent(() => import("~/components/sections/WeArePassionate.vue")),
    our_editing_services: defineAsyncComponent(() => import("~/components/sections/OurEditingServices.vue")),
    benefits_of_partnering: defineAsyncComponent(() => import("~/components/sections/BenefitsOfPartnering.vue")),
    clients_testimonial: defineAsyncComponent(() => import("~/components/sections/ClientsTestimonial.vue")),
    try_our_editing_services: defineAsyncComponent(() => import("~/components/sections/TryOurEditingServices.vue")),
    how_it_works: defineAsyncComponent(() => import("~/components/sections/HowItWorks.vue")),
    faq: defineAsyncComponent(() => import("~/components/sections/Faq.vue")),
    call_to_action: defineAsyncComponent(() => import("~/components/layout/CallToAction.vue")),
    who_we_are: defineAsyncComponent(() => import("~/components/sections/WhoWeAre.vue")),
    quality_assurance: defineAsyncComponent(() => import("~/components/sections/QualityAssurance.vue")),
    we_ve_accomplished: defineAsyncComponent(() => import("~/components/sections/WeHaveAccomplished.vue")),
    our_sample: defineAsyncComponent(() => import("~/components/sections/OurSample.vue")),
    our_pricing: defineAsyncComponent(() => import("~/components/sections/OurPricing.vue")),
    contact_page: defineAsyncComponent(() => import("~/components/sections/ContactPage.vue")),
    text_content: defineAsyncComponent(() => import("~/components/sections/TextContent.vue")),
    single_service_banner: defineAsyncComponent(() => import("~/components/sections/SingleServiceBanner.vue")),
    visual_example: defineAsyncComponent(() => import("~/components/sections/VisualExample.vue")),
    portrait_skin: defineAsyncComponent(() => import("~/components/sections/PortraitSkin.vue")),
});

// Data fetch with SEO handling
const { data: asyncData, error } = await useAsyncData(
    `service-${slug.value}`,
    async () => {
        if (!slug.value) return null;

        try {
            // Use $api.getService which calls /cutout/v1/service/{slug}
            const serviceData = await $api.getService(slug.value);

            // Set SEO meta tags
            if (serviceData?.seo) {
                useHead({
                    title: serviceData.seo.title || serviceData.title?.rendered || "Service - Cutout Partner",
                    meta: [
                        {
                            name: "description",
                            content: serviceData.seo.description || "Professional photo editing service",
                        },
                        {
                            property: "og:title",
                            content: serviceData.seo.og_title || serviceData.seo.title || serviceData.title?.rendered,
                        },
                        {
                            property: "og:description",
                            content: serviceData.seo.og_description || serviceData.seo.description,
                        },
                        { property: "og:image", content: serviceData.seo.og_image },
                        { name: "robots", content: serviceData.seo?.noindex ? "noindex" : "index,follow" },
                    ],
                    link: [{ rel: "canonical", href: serviceData.seo?.canonical_url }],
                });
            }

            return serviceData;
        } catch (err) {
            console.error("Service fetch error:", err);
            if (err?.response?.status === 404) {
                throw createError({ statusCode: 404, statusMessage: "This service does not exist." });
            }
            throw createError({ statusCode: 500, statusMessage: "Failed to load service." });
        }
    },
    { watch: [slug] }
);

const data = computed(() => asyncData.value);

</script>

<style scoped>
.home-page {
    min-height: 100vh;
}

.container {
    margin: 0 auto;
    padding: 0 20px;
}

.error-container {
    text-align: center;
    padding: 60px 0;
}

.unknown-section {
    padding: 40px 0;
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    margin: 20px 0;
    text-align: center;
}
</style>
