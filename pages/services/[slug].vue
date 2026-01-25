<template>
    <div class="home-page">
        <!-- Error State -->
        <div v-if="error" class="error-container">
            <div class="container">
                <h1>Service Not Found</h1>
                <p>The service "{{ $route.params.slug }}" doesn't exist.</p>
                <p>
                    <small>{{ error }}</small>
                </p>
            </div>
        </div>

        <!-- Content from WordPress -->
        <div v-else-if="data && data.sections && data.sections.length > 0" class="wp-content">
            <!-- Loop through all sections -->
            <template v-for="(section, index) in data.sections" :key="index">
                <div v-if="section.section_content && Array.isArray(section.section_content)" class="section-wrapper">
                    <!-- Display each section using dynamic components -->
                    <div v-for="(content, contentIndex) in section.section_content" :key="contentIndex">
                        <component
                            :is="componentMap[content.acf_fc_layout]"
                            :data="content"
                            :service="siteSettings?.all_fields?.select_services || []"
                            v-if="componentMap[content.acf_fc_layout]"
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
                <h1>{{ data?.title?.rendered || "Service" }}</h1>
                <p>This service exists but has no content yet.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { markRaw, computed } from "vue";

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
import SingleServiceBanner from "~/components/sections/SingleServiceBanner.vue";
import VisualExample from "~/components/sections/VisualExample.vue";
import PortraitSkin from "~/components/sections/PortraitSkin.vue";

const route = useRoute();
const { $api } = useNuxtApp();

// Import and use the shared composables
const { siteSettings, fetchSettings, postDataCache, fetchPostData } = useSiteSettings();

// Component mapping
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
    single_service_banner: SingleServiceBanner,
    visual_example: VisualExample,
    portrait_skin: PortraitSkin,
});

// Get the slug from the route
const slug = computed(() => route.params.slug);
const postType = "service"; // Define the post type for this page

// --- Main Data Fetching with useAsyncData ---
// This fetches data on the server and client, and reacts to slug changes.
const { data: asyncData, error: asyncError } = await useAsyncData(`${postType}-${slug.value}`, async () => {
    if (!slug.value) return null;

    try {
        // Fetch the service data using our new generic composable function
        const serviceData = await fetchPostData(postType, slug.value);

        // Set SEO meta tags
        if (serviceData?.seo) {
            useHead({
                title: serviceData.seo.title || serviceData.title?.rendered || "Cutout Partner",
                meta: [
                    {
                        name: "description",
                        content: serviceData.seo.description || "Professional photo editing services",
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
        if (err.response?.status === 404) {
            throw createError({ statusCode: 404, statusMessage: "This service does not exist." });
        }
        throw createError({ statusCode: 500, statusMessage: "Failed to load service." });
    }
});

// --- Create reactive refs for the template ---
const data = computed(() => asyncData.value);
const error = computed(() => asyncError.value);

// --- Fetch main site settings in the background ---
fetchSettings();
</script>

<style scoped>
/* Your existing styles are kept */
.home-page {
    min-height: 100vh;
}
.container {
    max-width: 1200px;
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
