<!-- pages/[slug].vue - Client-Side Version -->
<template>
    <div class="dynamic-page">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading page content...</p>
        </div>

        <!-- Error State / 404 -->
        <div v-else-if="error" class="error-container">
            <div class="container">
                <h1>Page Not Found</h1>
                <p>The page "{{ $route.params.slug }}" doesn't exist.</p>
                <p>
                    <small>{{ error }}</small>
                </p>
                <NuxtLink to="/" class="back-home-btn">Go Back Home</NuxtLink>
            </div>
        </div>

        <!-- Page Content -->
        <div v-else-if="data && (data.sections || data.page)" class="page-content">
            <!-- Show page title if it exists and no sections -->
            <div v-if="data.page && data.page.title && !data.sections?.length" class="simple-page-header">
                <div class="container">
                    <h1>{{ data.page.title }}</h1>
                </div>
            </div>

            <!-- Loop through sections if they exist -->
            <template
                v-if="data.sections && data.sections.length > 0"
                v-for="(section, index) in data.sections"
                :key="index"
            >
                <div v-if="section.section_content && Array.isArray(section.section_content)" class="section-wrapper">
                    <!-- Display each section based on its type -->
                    <div v-for="(content, contentIndex) in section.section_content" :key="contentIndex">
                        <!-- Home Slider Section -->
                        <section v-if="content.acf_fc_layout === 'home_slider'" class="hero-section">
                            <div class="container">
                                <div v-if="content.sliders && content.sliders.length > 0" class="slider-content">
                                    <div
                                        v-for="(slider, sliderIndex) in content.sliders"
                                        :key="sliderIndex"
                                        class="slide"
                                        v-show="sliderIndex === 0"
                                    >
                                        <div class="slide-content">
                                            <h1>{{ slider.slider_title }}</h1>
                                            <p>{{ slider.slider_sub_title }}</p>
                                            <NuxtLink
                                                v-if="slider.button_label"
                                                :to="slider.button_url"
                                                class="btn btn-primary"
                                            >
                                                {{ slider.button_label }}
                                            </NuxtLink>
                                        </div>
                                        <div class="slide-image">
                                            <img
                                                v-if="slider.slider_image"
                                                :src="slider.slider_image"
                                                :alt="slider.slider_title"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- We Are Passionate Section -->
                        <section v-else-if="content.acf_fc_layout === 'we_are_passionate'" class="passionate-section">
                            <div class="container">
                                <div class="section-header">
                                    <h2>{{ content.title }}</h2>
                                    <p>{{ content.sub_title }}</p>
                                </div>
                                <div v-if="content.sections" class="passionate-grid">
                                    <div
                                        v-for="(item, itemIndex) in content.sections"
                                        :key="itemIndex"
                                        class="passionate-item"
                                    >
                                        <img
                                            v-if="item.section_image"
                                            :src="item.section_image"
                                            :alt="item.section_title || 'Service image'"
                                        />
                                        <h3 v-if="item.section_title">{{ item.section_title }}</h3>
                                        <div
                                            v-if="item.section_content"
                                            v-html="item.section_content.replace(/\n/g, '<br>')"
                                        ></div>
                                        <NuxtLink
                                            v-if="item.section_button"
                                            :to="item.section_button_url || '#'"
                                            class="btn btn-secondary"
                                        >
                                            {{ item.section_button }}
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Our Editing Services Section -->
                        <section v-else-if="content.acf_fc_layout === 'our_editing_services'" class="services-section">
                            <div class="container">
                                <div class="section-header">
                                    <h2>{{ content.title }}</h2>
                                    <p>{{ content.sub_title }}</p>
                                </div>
                                <div v-if="content.tabs" class="services-tabs">
                                    <div v-for="(tab, tabIndex) in content.tabs" :key="tabIndex" class="tab-content">
                                        <h3>{{ tab.tab_name }}</h3>
                                        <div v-if="tab.tab_images" class="tab-images">
                                            <div
                                                v-for="(image, imgIndex) in tab.tab_images"
                                                :key="imgIndex"
                                                class="image-item"
                                            >
                                                <h4>{{ image.title }}</h4>
                                                <img
                                                    v-if="image.after_image"
                                                    :src="image.after_image"
                                                    :alt="image.title"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Benefits Section -->
                        <section
                            v-else-if="content.acf_fc_layout === 'benefits_of_partnering'"
                            class="benefits-section"
                        >
                            <div class="container">
                                <div class="section-header">
                                    <h2>{{ content.title }}</h2>
                                    <p>{{ content.sub_title }}</p>
                                </div>
                                <div v-if="content.services" class="benefits-grid">
                                    <div
                                        v-for="(service, serviceIndex) in content.services"
                                        :key="serviceIndex"
                                        class="benefit-item"
                                    >
                                        <img v-if="service.image" :src="service.image" :alt="service.title" />
                                        <h3>{{ service.title }}</h3>
                                        <p>{{ service.content }}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Client Testimonials -->
                        <section
                            v-else-if="content.acf_fc_layout === 'clients_testimonial'"
                            class="testimonials-section"
                        >
                            <div class="container">
                                <div class="section-header">
                                    <h2>{{ content.title }}</h2>
                                    <p>{{ content.sub_title }}</p>
                                </div>
                                <div v-if="content.reviews" class="testimonials-grid">
                                    <div
                                        v-for="(review, reviewIndex) in content.reviews"
                                        :key="reviewIndex"
                                        class="testimonial-item"
                                    >
                                        <p>"{{ review.review_content }}"</p>
                                        <div class="reviewer">
                                            <strong>{{ review.review_by }}</strong>
                                            <span>{{ review.reviewer_country }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Try Our Services Section -->
                        <section
                            v-else-if="content.acf_fc_layout === 'try_our_editing_services'"
                            class="try-services-section"
                        >
                            <div class="container">
                                <div class="section-header">
                                    <h2>{{ content.title }}</h2>
                                    <p>{{ content.sub_title }}</p>
                                    <div v-if="content.content" v-html="content.content.replace(/\n/g, '<br>')"></div>
                                </div>
                            </div>
                        </section>

                        <!-- How It Works Section -->
                        <section v-else-if="content.acf_fc_layout === 'how_it_works'" class="how-it-works-section">
                            <div class="container">
                                <div class="section-header">
                                    <h2>{{ content.title }}</h2>
                                    <p>{{ content.sub_title }}</p>
                                </div>
                                <div class="how-it-works-content">
                                    <div v-if="content.feature_image" class="feature-image">
                                        <img :src="content.feature_image" alt="How it works" />
                                    </div>
                                    <div v-if="content.steps" class="steps-grid">
                                        <div
                                            v-for="(step, stepIndex) in content.steps"
                                            :key="stepIndex"
                                            class="step-item"
                                        >
                                            <div class="step-number">{{ stepIndex + 1 }}</div>
                                            <h3>{{ step.title }}</h3>
                                            <p>{{ step.content }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- FAQ Section -->
                        <section v-else-if="content.acf_fc_layout === 'faq'" class="faq-section">
                            <div class="container">
                                <div class="section-header">
                                    <h2>{{ content.title }}</h2>
                                    <p>{{ content.sub_title }}</p>
                                </div>
                                <div v-if="content.questions" class="faq-list">
                                    <div v-for="(faq, faqIndex) in content.questions" :key="faqIndex" class="faq-item">
                                        <h3>{{ faq.question }}</h3>
                                        <div v-html="faq.answer.replace(/\n/g, '<br>')"></div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Text Content Section -->
                        <section v-else-if="content.acf_fc_layout === 'text_content'" class="text-content-section">
                            <div class="container">
                                <h2 v-if="content.title">{{ content.title }}</h2>
                                <div v-if="content.content" v-html="content.content"></div>
                            </div>
                        </section>

                        <!-- Fallback for unknown sections -->
                        <section v-else class="generic-section">
                            <div class="container">
                                <h2>{{ content.acf_fc_layout || "Content" }}</h2>
                                <div v-if="content.title">
                                    <h3>{{ content.title }}</h3>
                                </div>
                                <div v-if="content.content" v-html="content.content"></div>
                                <p v-else>This section type ({{ content.acf_fc_layout }}) needs to be styled.</p>
                            </div>
                        </section>
                    </div>
                </div>
            </template>

            <!-- Show regular page content if no sections -->
            <div v-else-if="data.page && data.page.content" class="simple-page-content">
                <div class="container">
                    <div v-html="data.page.content"></div>
                </div>
            </div>
        </div>

        <!-- Fallback -->
        <div v-else class="no-content">
            <div class="container">
                <h1>{{ data?.page?.title || "Page" }}</h1>
                <p>This page exists but has no content yet.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
const { $api } = useNuxtApp();
const route = useRoute();

const loading = ref(true);
const data = ref(null);
const error = ref(null);

// Get the slug from the route
const slug = computed(() => route.params.slug);

// Fetch page data on client side only
onMounted(async () => {
    console.log("Dynamic page mounted for slug:", slug.value);

    try {
        console.log("Fetching page data...");
        const result = await $api.getPage(slug.value);
        console.log("Page data received:", result);
        data.value = result;

        // Set SEO meta tags
        if (result?.seo) {
            useHead({
                title: result.seo.title || result.page?.title || "Cutout Partner",
                meta: [
                    { name: "description", content: result.seo.description || "Professional photo editing services" },
                ],
            });
        }
    } catch (err) {
        console.error("Error fetching page:", err);
        error.value = err.message || "Page not found";
    } finally {
        loading.value = false;
    }
});

// Watch for route changes
watch(
    () => route.params.slug,
    async (newSlug) => {
        if (newSlug) {
            loading.value = true;
            error.value = null;
            data.value = null;

            try {
                const result = await $api.getPage(newSlug);
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
    min-height: 50vh;
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
.no-content {
    text-align: center;
    padding: 60px 0;
}

.back-home-btn {
    display: inline-block;
    background: #667eea;
    color: white;
    padding: 12px 24px;
    border-radius: 6px;
    text-decoration: none;
    margin-top: 20px;
}

.simple-page-header {
    padding: 60px 0 40px;
    background: #f8f9fa;
    text-align: center;
}

.text-content-section,
.simple-page-content {
    padding: 60px 0;
}

.generic-section {
    padding: 40px 0;
    background: #f8f9fa;
}

.section-header {
    text-align: center;
    margin-bottom: 40px;
}

.btn {
    display: inline-block;
    padding: 12px 24px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-primary {
    background: #ff6b6b;
    color: white;
}

.btn-secondary {
    background: #667eea;
    color: white;
}
</style>
