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
import { computed, markRaw } from "vue";

// Header
import TheHeaderBannerVue from "~/components/TheHeaderBanner.vue";

// Sections
import HomeSlider from "~/components/sections/HomeSlider.vue";
import WeArePassionate from "~/components/sections/WeArePassionate.vue";
import OurEditingServices from "~/components/sections/OurEditingServices.vue";
import BenefitsOfPartnering from "~/components/sections/BenefitsOfPartnering.vue";
import ClientsTestimonial from "~/components/sections/ClientsTestimonial.vue";
import TryOurEditingServices from "~/components/sections/TryOurEditingServices.vue";
import HowItWorks from "~/components/sections/HowItWorks.vue";
import FAQ from "~/components/sections/Faq.vue";
import CallToAction from "~/components/layout/CallToAction.vue";
import WhoWeAre from "~/components/sections/WhoWeAre.vue";
import QualityAssurance from "~/components/sections/QualityAssurance.vue";
import WeHaveAccomplished from "~/components/sections/WeHaveAccomplished.vue";
import OurSample from "~/components/sections/OurSample.vue";
import OurPricing from "~/components/sections/OurPricing.vue";
import ContactPage from "~/components/sections/ContactPage.vue";
import TextContent from "~/components/sections/TextContent.vue";
import SingleServiceBanner from "~/components/sections/SingleServiceBanner.vue";
import VisualExample from "~/components/sections/VisualExample.vue";
import PortraitSkin from "~/components/sections/PortraitSkin.vue";

const route = useRoute();
const { $api } = useNuxtApp();

// Import composable - it only provides siteSettings state
const { siteSettings } = useSiteSettings();

// Slug
const slug = computed(() => route.params.slug);

// Component map
const componentMap = markRaw({
    home_slider: HomeSlider,
    we_are_passionate: WeArePassionate,
    our_editing_services: OurEditingServices,
    benefits_of_partnering: BenefitsOfPartnering,
    clients_testimonial: ClientsTestimonial,
    try_our_editing_services: TryOurEditingServices,
    how_it_works: HowItWorks,
    faq: FAQ,
    call_to_action: CallToAction,
    who_we_are: WhoWeAre,
    quality_assurance: QualityAssurance,
    we_ve_accomplished: WeHaveAccomplished,
    our_sample: OurSample,
    our_pricing: OurPricing,
    contact_page: ContactPage,
    text_content: TextContent,
    single_service_banner: SingleServiceBanner,
    visual_example: VisualExample,
    portrait_skin: PortraitSkin,
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

// Debug logging
onMounted(() => {
    console.log("🔍 Service Page Debug:");
    console.log("  Slug:", slug.value);
    console.log("  Site Settings:", siteSettings.value);
    console.log("  Service Data:", data.value);
});
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
