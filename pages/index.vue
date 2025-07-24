<!-- pages/index.vue - Fixed Dynamic Component Version -->
<template>
    <div class="home-page">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading homepage content...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
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
                <h1>Welcome to Cutout Partner</h1>
                <p>Professional photo editing services with AI-powered background removal and retouching.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { markRaw } from "vue";

// Import all section components
import HomeSlider from "~/components/sections/HomeSlider.vue";
import WeArePassionate from "~/components/sections/WeArePassionate.vue";
import OurEditingServices from "~/components/sections/OurEditingServices.vue";
import BenefitsOfPartnering from "~/components/sections/BenefitsOfPartnering.vue";
import ClientsTestimonial from "~/components/sections/ClientsTestimonial.vue";
import TryOurEditingServices from "~/components/sections/TryOurEditingServices.vue";
import HowItWorks from "~/components/sections/HowItWorks.vue";
import FAQ from "~/components/sections/Faq.vue";

const { $api } = useNuxtApp();

const loading = ref(true);
const data = ref(null);
const error = ref(null);

// FIXED: Direct component mapping using markRaw (no string names)
const componentMap = markRaw({
    home_slider: HomeSlider,
    we_are_passionate: WeArePassionate,
    our_editing_services: OurEditingServices,
    benefits_of_partnering: BenefitsOfPartnering,
    clients_testimonial: ClientsTestimonial,
    try_our_editing_services: TryOurEditingServices,
    how_it_works: HowItWorks,
    faq: FAQ,
});

// Fetch homepage data on client side
onMounted(async () => {
    console.log("Homepage mounted");

    try {
        console.log("Fetching homepage data...");
        const result = await $api.getPage("home");
        console.log("Homepage data received:", result);
        data.value = result;

        // Set SEO meta tags
        if (result?.seo) {
            useHead({
                title: result.seo.title || "Cutout Partner - Professional Photo Editing Services",
                meta: [
                    {
                        name: "description",
                        content:
                            result.seo.description ||
                            "Professional photo editing services with AI-powered background removal, retouching, and image enhancement.",
                    },
                ],
            });
        }
    } catch (err) {
        console.error("Error fetching homepage:", err);
        error.value = err.message || "Failed to load homepage content";
    } finally {
        loading.value = false;
    }
});

// Default SEO for homepage
useHead({
    title: "Cutout Partner - Professional Photo Editing Services",
    meta: [
        {
            name: "description",
            content:
                "Professional photo editing services with AI-powered background removal, retouching, and image enhancement.",
        },
    ],
});
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
