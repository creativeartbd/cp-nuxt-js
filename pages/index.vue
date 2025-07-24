<!-- pages/index.vue - Updated Homepage -->
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

                        <!-- Fallback for unknown sections -->
                        <section v-else class="generic-section">
                            <div class="container">
                                <h2>{{ content.acf_fc_layout }} Section</h2>
                                <p>Content for {{ content.acf_fc_layout }} will be styled here.</p>
                            </div>
                        </section>
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
const { $api } = useNuxtApp();

const loading = ref(true);
const data = ref(null);
const error = ref(null);

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

.section-wrapper {
    margin-bottom: 0;
}

.section-header {
    text-align: center;
    margin-bottom: 40px;
}

.section-header h2 {
    font-size: 2.5rem;
    margin-bottom: 15px;
}

/* Hero Section */
.hero-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 100px 0;
    min-height: 80vh;
    display: flex;
    align-items: center;
}

.slider-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
}

.slide-content h1 {
    font-size: 3rem;
    margin-bottom: 20px;
    font-weight: 700;
}

.slide-content p {
    font-size: 1.2rem;
    margin-bottom: 30px;
    opacity: 0.9;
}

.slide-image img {
    width: 100%;
    height: auto;
    border-radius: 15px;
}

/* Sections */
.passionate-section,
.services-section,
.benefits-section,
.testimonials-section,
.try-services-section,
.how-it-works-section,
.faq-section {
    padding: 80px 0;
}

.passionate-section,
.benefits-section,
.try-services-section {
    background: #f8f9fa;
}

.passionate-grid,
.benefits-grid,
.testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
}

.passionate-item,
.benefit-item,
.testimonial-item {
    background: white;
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.passionate-item img,
.benefit-item img {
    width: 100%;
    max-width: 200px;
    height: 150px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 20px;
}

.steps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    margin-top: 40px;
}

.step-item {
    text-align: center;
    padding: 20px;
}

.step-number {
    background: #667eea;
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0 auto 20px;
}

.faq-list {
    max-width: 800px;
    margin: 0 auto;
}

.faq-item {
    background: white;
    padding: 25px;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.faq-item h3 {
    margin-bottom: 15px;
    color: #333;
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

.btn:hover {
    transform: translateY(-2px);
}

.generic-section {
    padding: 60px 0;
    background: #f0f0f0;
    text-align: center;
}

@media (max-width: 768px) {
    .slider-content {
        grid-template-columns: 1fr;
        text-align: center;
    }

    .slide-content h1 {
        font-size: 2rem;
    }

    .passionate-grid,
    .benefits-grid,
    .testimonials-grid {
        grid-template-columns: 1fr;
    }
}
</style>
