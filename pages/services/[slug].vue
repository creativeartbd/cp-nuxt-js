<!-- pages/services/[slug].vue - Exact match to pages/[slug].vue functionality -->
<template>
    <div class="home-page">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
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
            <!-- <TheHeaderBannerVue :data="data" /> -->

            <!-- Loop through all sections -->
            <template v-for="(section, index) in data.sections" :key="index">
                <div v-if="section.section_content && Array.isArray(section.section_content)" class="section-wrapper">
                    <!-- Display each section using dynamic components -->
                    <div v-for="(content, contentIndex) in section.section_content" :key="contentIndex">
                        <!-- FIXED: Dynamic component rendering -->

                        <component
                            :is="componentMap[content.acf_fc_layout]"
                            :data="content"
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
                <h1>{{ data?.page?.title || "Page" }}</h1>
                <p>This page exists but has no content yet.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { markRaw } from "vue";
// page header
import TheHeaderBannerVue from "../../components/TheHeaderBanner.vue";

// Import all section components (SAME AS INDEX.VUE)
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

const { $api } = useNuxtApp();
const route = useRoute();

const loading = ref(true);
const data = ref(null);
const error = ref(null);

// SAME component mapping as index.vue
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

// Fetch page data on client side (SAME PATTERN AS PAGES/[SLUG].VUE but using service API)
onMounted(async () => {
    console.log("Dynamic page mounted for slug:", slug.value);

    try {
        console.log("Fetching page data...");
        const result = await $api.getService(slug.value); // ONLY DIFFERENCE: using getService instead of getPage
        console.log("Page data received:", result);
        data.value = result;

        // Set SEO meta tags
        if (result?.seo) {
            useHead({
                title: result.seo.title || result.page?.title || "Cutout Partner",
                meta: [
                    {
                        name: "description",
                        content: result.seo.description || "Professional photo editing services",
                    },
                    { property: "og:title", content: result.seo.og_title || result.seo.title || result.page?.title },
                    { property: "og:description", content: result.seo.og_description || result.seo.description },
                    { property: "og:image", content: result.seo.og_image },
                    { name: "robots", content: result.seo?.noindex ? "noindex" : "index,follow" },
                ],
                link: [{ rel: "canonical", href: result.seo?.canonical_url }],
            });
        }
    } catch (err) {
        console.error("Error fetching page:", err);
        error.value = err.message || "Page not found";
    } finally {
        loading.value = false;
    }
});

// Watch for route changes (SAME AS PAGES/[SLUG].VUE)
watch(
    () => route.params.slug,
    async (newSlug) => {
        if (newSlug) {
            loading.value = true;
            error.value = null;
            data.value = null;

            try {
                const result = await $api.getService(newSlug); // ONLY DIFFERENCE: using getService
                data.value = result;
            } catch (err) {
                error.value = err.message || "Page not found";
            } finally {
                loading.value = false;
            }
        }
    }
);
</script>

<style scoped>
.home-page {
    min-height: 100vh;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
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
