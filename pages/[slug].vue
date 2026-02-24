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
import { markRaw, computed, defineAsyncComponent } from "vue";
import TheHeaderBannerVue from "../components/TheHeaderBanner.vue";

const route = useRoute();
const { $api } = useNuxtApp();
const { siteSettings } = useSiteSettings();

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
