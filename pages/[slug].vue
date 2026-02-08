<template>
    <div class="home-page">
        <!-- Error State -->
        <div v-if="error" class="error-container">
            <div class="container">
                <h1>Page Not Found</h1>
                <p>The page "{{ $route.params.slug }}" doesn't exist.</p>
                <p>
                    <small>{{ error }}</small>
                </p>
            </div>
        </div>

        <!-- Content from WordPress -->
        <div v-else-if="data && data.sections && data.sections.length > 0" class="wp-content">
            <!-- FIXED: Removed .value from siteSettings -->
            <TheHeaderBannerVue :data="data" :page-banner="siteSettings?.all_fields?.upload_page_banner" />

            <!-- Loop through all sections -->
            <template v-for="(section, index) in data.sections" :key="index">
                <div v-if="section.section_content && Array.isArray(section.section_content)" class="section-wrapper">
                    <!-- Display each section using dynamic components -->
                    <div v-for="(content, contentIndex) in section.section_content" :key="contentIndex">
                        <component
                            :is="componentMap[content.acf_fc_layout]"
                            :data="content"
                            v-if="componentMap[content.acf_fc_layout]"
                            :service="siteSettings?.all_fields?.select_services || []"
                        />

                        <!-- Fallback for unknown sections -->
                        <div v-else class="unknown-section">
                            <div class="container">
                                <h2>Unknown Section: {{ content.acf_fc_layout }}</h2>
                                <p>Component not found for this layout type.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <!-- Default Content if no sections -->
        <div v-else class="default-content">
            <div class="container">
                <h1>{{ data?.page?.title || "Page" }}</h1>
                <p>This page exists but has no content yet.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { markRaw, computed } from "vue";
// page header
import TheHeaderBannerVue from "../components/TheHeaderBanner.vue";

// Import all section components
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

const route = useRoute();
const { $api } = useNuxtApp();

// Import and use the shared composable - NO .value needed in template!
const { siteSettings } = useSiteSettings();

// Component mapping (using markRaw is good practice)
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
});

const slug = computed(() => route.params.slug);

const { data: asyncData, error: asyncError } = await useAsyncData(
    `page-${slug.value}`,
    async () => {
        if (!slug.value) return null;

        try {
            const pageData = await $api.getPage(slug.value);

            if (pageData?.seo) {
                useHead({
                    title: pageData.seo.title || pageData.page?.title || "Cutout Partner",
                    meta: [
                        {
                            name: "description",
                            content: pageData.seo.description || "Professional photo editing services",
                        },
                        {
                            property: "og:title",
                            content: pageData.seo.og_title || pageData.seo.title,
                        },
                        {
                            property: "og:description",
                            content: pageData.seo.og_description || pageData.seo.description,
                        },
                        { property: "og:image", content: pageData.seo.og_image },
                    ],
                });
            }

            return pageData;
        } catch (err) {
            throw createError({
                statusCode: 404,
                statusMessage: "Page not found",
            });
        }
    },
    {
        watch: [slug],
    }
);

// Create reactive refs for the template
const data = computed(() => asyncData.value);
const error = computed(() => asyncError.value);

// Debug logging
onMounted(() => {
    console.log("🔍 [slug].vue Debug:");
    console.log("  Site Settings:", siteSettings.value);
    console.log("  Page Data:", data.value);
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

.error-container,
.default-content {
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

.unknown-section details {
    margin-top: 20px;
    text-align: left;
}

.unknown-section pre {
    background: white;
    padding: 15px;
    border-radius: 4px;
    overflow: auto;
    max-height: 300px;
    font-size: 12px;
}
</style>
