<template>
    <div class="home-page">
        <!-- Error State -->
        <div v-if="error" class="error-container">
            <div class="container">
                <h1>Welcome to Cutout Partner</h1>
                <p>Professional photo editing services with AI-powered background removal and retouching.</p>
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
                <h1>Welcome to Cutout Partner</h1>
                <p>Professional photo editing services with AI-powered background removal and retouching.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { markRaw, computed, defineAsyncComponent } from "vue";

// Above-fold: static import for instant render
import HomeSlider from "~/components/sections/HomeSlider.vue";

const { $api } = useNuxtApp();

// Import and use the shared composables
const { siteSettings } = useSiteSettings();

// Below-fold: lazy-loaded for code splitting
const componentMap = markRaw({
    home_slider: HomeSlider,
    we_are_passionate: defineAsyncComponent(() => import("~/components/sections/WeArePassionate.vue")),
    our_editing_services: defineAsyncComponent(() => import("~/components/sections/OurEditingServices.vue")),
    benefits_of_partnering: defineAsyncComponent(() => import("~/components/sections/BenefitsOfPartnering.vue")),
    clients_testimonial: defineAsyncComponent(() => import("~/components/sections/ClientsTestimonial.vue")),
    try_our_editing_services: defineAsyncComponent(() => import("~/components/sections/TryOurEditingServices.vue")),
    how_it_works: defineAsyncComponent(() => import("~/components/sections/HowItWorks.vue")),
    faq: defineAsyncComponent(() => import("~/components/sections/Faq.vue")),
    call_to_action: defineAsyncComponent(() => import("~/components/layout/CallToAction.vue")),
});

// --- Main Data Fetching with useAsyncData ---
// This fetches the 'home' page data on the server for super-fast loads.
const { data: asyncData, error: asyncError } = await useAsyncData("page-home", async () => {
    try {
        // Direct API call - useAsyncData caches this automatically
        const pageData = await $api.getPage("home");

        // Set SEO meta tags
        if (pageData?.seo) {
            useHead({
                title: pageData.seo.title || "Cutout Partner - Professional Photo Editing Services",
                meta: [
                    {
                        name: "description",
                        content:
                            pageData.seo.description ||
                            "Professional photo editing services with AI-powered background removal, retouching, and image enhancement.",
                    },
                ],
            });
        }
        return pageData;
    } catch (err) {
        console.error("HOMEPAGE FETCH ERROR:", err);

        throw createError({
            statusCode: err?.response?.status || 500,
            statusMessage: err?.response?._data || err?.message || "Failed to load homepage content.",
        });
    }
});

// --- Create reactive refs for the template ---
const data = computed(() => asyncData.value);
const error = computed(() => asyncError.value);

// --- Fetch main site settings in the background ---
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
