<template>
    <div>
        <!-- Error State -->
        <div v-if="error" class="error-container">
            <div class="container">
                <h1>Page Not Found</h1>
                <p>The page "{{ $route.params.slug }}" doesn't exist.</p>
                <p><small>{{ error }}</small></p>
            </div>
        </div>

        <!-- Blog Post Content -->
        <div v-else-if="data?._type === 'post' && post" class="single-post-page">
            <div class="container-fluid bg-single-post-header">
                <div class="container">
                    <div class="row px-5">
                        <div class="col-md-6">
                            <NuxtImg :src="getImage(post)" alt="" class="img-fluid rounded" fetchpriority="high" decoding="sync" format="webp" quality="85" width="600" height="400" sizes="sm:100vw md:50vw lg:600px" />
                        </div>
                        <div class="col-md-6 d-flex flex-column justify-content-center align-items-start">
                            <h2 v-html="post.title.rendered"></h2>
                            <div class="single-post-taxonomy">
                                <p>{{ getAuthor(post) }}</p>
                                <p>{{ formatDate(post.date) }}</p>
                                <p>{{ post.views || 0 }} views</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container">
                <div class="row">
                    <div class="col-md-8">
                        <div v-html="post.content.rendered" class="blog-post"></div>
                    </div>

                    <div class="col-md-4">
                        <div class="sticky-sidbare">
                            <h5>Search</h5>
                            <div class="single-page-search">
                                <input
                                    type="text"
                                    v-model="search"
                                    @keyup.enter="searchPosts"
                                    class="form-control rounded"
                                    placeholder="Search"
                                />
                                <i class="bi bi-search" @click="searchPosts"></i>
                            </div>

                            <div class="single-page-banner" v-if="siteSettings?.all_fields?.blog_banner">
                                <div class="banner-content">
                                    <h2>{{ siteSettings?.all_fields?.banner_title }}</h2>
                                    <h3>{{ siteSettings?.all_fields?.banner_sub_title }}</h3>
                                    <p>{{ siteSettings?.all_fields?.banner_content }}</p>
                                </div>
                                <div class="side-banner" v-html="siteSettings.all_fields.blog_banner"></div>
                                <div class="banner-button">
                                    <NuxtLink :to="`/` + siteSettings?.all_fields?.banner_location.post_name">
                                        <button>{{ siteSettings?.all_fields?.banner_label }}</button>
                                    </NuxtLink>
                                </div>
                            </div>

                            <h5>Categories</h5>
                            <ul class="single-page-categories">
                                <li v-for="cat in postCategories" :key="cat.id">
                                    <NuxtLink :to="`/category/${cat.slug}`" class="btn btn-link">
                                        {{ cat.name }}
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="col-md-12">
                        <h5 class="mt-4">Share this post</h5>
                        <div class="single-post-social">
                            <i class="bi bi-facebook"></i>
                            <i class="bi bi-linkedin"></i>
                            <i class="bi bi-pinterest"></i>
                            <i class="bi bi-twitter"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Related Posts -->
            <div class="container mb-5" v-if="relatedPosts.length">
                <div class="row">
                    <h4 class="text-center mt-5 mb-4">Related Posts</h4>
                    <div v-for="related in relatedPosts" :key="related.id" class="col-md-4">
                        <div class="related-post">
                            <NuxtImg :src="getImage(related)" alt="" class="img-fluid rounded" loading="lazy" decoding="async" format="webp" quality="80" width="400" height="280" sizes="sm:100vw md:33vw lg:400px" />
                            <div class="single-post-more-blog-taxonomy">
                                <span>
                                    <NuxtLink :to="`/category/${getCategorySlug(related)}`">
                                        {{ getCategory(related) }}
                                    </NuxtLink>
                                </span>
                                <h4>
                                    <NuxtLink :to="`/${related.slug}`">
                                        {{ related.title.rendered }}
                                    </NuxtLink>
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Blog page ACF sections (if any) -->
            <div v-if="blogPageData?.sections?.length" class="wp-content">
                <template v-for="(section, index) in blogPageData.sections" :key="index">
                    <div v-if="section.section_content && Array.isArray(section.section_content)" class="section-wrapper">
                        <div v-for="(content, contentIndex) in section.section_content" :key="contentIndex">
                            <component
                                v-if="componentMap[content.acf_fc_layout]"
                                :is="componentMap[content.acf_fc_layout]"
                                :data="content"
                                :service="siteSettings?.all_fields?.select_services || []"
                            />
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- Page / Service Content -->
        <div v-else-if="data && data.sections && data.sections.length > 0" class="wp-content">
            <!-- Header banner only for standard pages, not service pages -->
            <TheHeaderBannerVue v-if="data._type === 'page'" :data="data" :page-banner="siteSettings?.all_fields?.upload_page_banner" />

            <template v-for="(section, index) in data.sections" :key="index">
                <div v-if="section.section_content && Array.isArray(section.section_content)" class="section-wrapper">
                    <div v-for="(content, contentIndex) in section.section_content" :key="contentIndex">
                        <component
                            :is="componentMap[content.acf_fc_layout]"
                            :data="content"
                            v-if="componentMap[content.acf_fc_layout]"
                            :service="siteSettings?.all_fields?.select_services || []"
                        />
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
import { markRaw, computed, ref, defineAsyncComponent } from "vue";
import TheHeaderBannerVue from "../components/TheHeaderBanner.vue";

const route = useRoute();
const { $api } = useNuxtApp();
const { siteSettings } = useSiteSettings();

const search = ref("");

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
    // Service-specific layouts
    single_service_banner: defineAsyncComponent(() => import("~/components/sections/SingleServiceBanner.vue")),
    visual_example: defineAsyncComponent(() => import("~/components/sections/VisualExample.vue")),
    portrait_skin: defineAsyncComponent(() => import("~/components/sections/PortraitSkin.vue")),
});

const slug = computed(() => route.params.slug);

const { data: asyncData, error: asyncError } = await useAsyncData(
    `page-${slug.value}`,
    async () => {
        if (!slug.value) return null;

        // 1. Try WordPress page
        try {
            const pageData = await $api.getPage(slug.value);
            if (pageData?.seo) {
                useHead({
                    title: pageData.seo.title || pageData.page?.title || "Cutout Partner",
                    meta: [
                        { name: "description", content: pageData.seo.description || "Professional photo editing services" },
                        { property: "og:title", content: pageData.seo.og_title || pageData.seo.title },
                        { property: "og:description", content: pageData.seo.og_description || pageData.seo.description },
                        { property: "og:image", content: pageData.seo.og_image },
                    ],
                });
            }
            return { ...pageData, _type: "page" };
        } catch (pageErr) {
            if (pageErr?.statusCode !== 404) throw pageErr;
        }

        // 2. Try service post type
        try {
            const serviceData = await $api.getService(slug.value);
            if (serviceData?.seo) {
                useHead({
                    title: serviceData.seo.title || serviceData.title?.rendered || "Service - Cutout Partner",
                    meta: [
                        { name: "description", content: serviceData.seo.description || "Professional photo editing service" },
                        { property: "og:title", content: serviceData.seo.og_title || serviceData.seo.title || serviceData.title?.rendered },
                        { property: "og:description", content: serviceData.seo.og_description || serviceData.seo.description },
                        { property: "og:image", content: serviceData.seo.og_image },
                        { name: "robots", content: serviceData.seo?.noindex ? "noindex" : "index,follow" },
                    ],
                    link: [{ rel: "canonical", href: serviceData.seo?.canonical_url }],
                });
            }
            return { ...serviceData, _type: "service" };
        } catch (serviceErr) {
            if (serviceErr?.statusCode !== 404) throw serviceErr;
        }

        // 3. Try blog post
        try {
            const [singlePost, allCategories, blogPage] = await Promise.all([
                $api.getPost(slug.value),
                $api.getCategories().catch(() => []),
                $api.getPage("blog").catch(() => null),
            ]);

            if (!singlePost) {
                throw createError({ statusCode: 404, statusMessage: "Not found" });
            }

            let related = [];
            const firstCategory = singlePost.categories?.[0];
            if (firstCategory) {
                const res = await $api.getPosts({ category: firstCategory, per_page: 3 });
                const postsArray = Array.isArray(res) ? res : res.posts || [];
                related = postsArray.filter((p) => p.id !== singlePost.id);
            }

            useHead({
                title: `${singlePost.title.rendered} | Blog`,
                meta: [
                    { name: "description", content: singlePost.excerpt?.rendered?.replace(/(<([^>]+)>)/gi, "") || "" },
                    { property: "og:title", content: singlePost.title.rendered },
                    { property: "og:description", content: singlePost.excerpt?.rendered?.replace(/(<([^>]+)>)/gi, "") || "" },
                    { property: "og:image", content: getImage(singlePost) },
                ],
            });

            return { post: singlePost, categories: allCategories, relatedPosts: related, blogPage, _type: "post" };
        } catch {
            throw createError({ statusCode: 404, statusMessage: "Page not found" });
        }
    },
    { watch: [slug] }
);

const data = computed(() => asyncData.value);
const error = computed(() => asyncError.value);

// Blog post computed refs
const post = computed(() => data.value?._type === "post" ? data.value.post : null);
const postCategories = computed(() => data.value?._type === "post" ? data.value.categories : []);
const relatedPosts = computed(() => data.value?._type === "post" ? data.value.relatedPosts : []);
const blogPageData = computed(() => data.value?._type === "post" ? data.value.blogPage : null);

// Blog post helpers
function getImage(p) {
    return p._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "https://placehold.co/600x400";
}
function getAuthor(p) {
    return p._embedded?.author?.[0]?.name || "Unknown Author";
}
function getCategory(p) {
    return p._embedded?.["wp:term"]?.[0]?.[0]?.name || "Uncategorized";
}
function getCategoryId(p) {
    return p._embedded?.["wp:term"]?.[0]?.[0]?.id || null;
}
function getCategorySlug(p) {
    return p._embedded?.["wp:term"]?.[0]?.[0]?.slug || null;
}
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
function searchPosts() {
    if (!search.value.trim()) return;
    navigateTo({ path: "/blog", query: { search: search.value } });
}
</script>

<style scoped>
.bg-single-post-header {
    background-color: #f4fdff;
    padding-top: 50px;
    padding-bottom: 50px;
    margin-bottom: 50px;
}
.single-post-taxonomy {
    display: flex;
    gap: 20px;
    color: #485b5e;
}
.single-post-social {
    display: flex;
    gap: 20px;
    border-radius: 5px;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px dashed #ddd;
    padding-bottom: 20px;
    padding-top: 15px;
}
.single-post-social i {
    font-size: 30px;
    color: #06bcd4;
}
.single-post-social i:hover {
    color: hwb(0 25% 75%);
    cursor: pointer;
}
.single-page-search {
    margin-bottom: 30px;
    position: relative;
}
.single-page-search i {
    position: absolute;
    top: 12px;
    right: 15px;
    font-size: 20px;
    color: #8a8a8a;
    cursor: pointer;
}
.single-page-search input {
    padding-right: 50px;
    height: 50px;
}
ul.single-page-categories {
    padding: 0;
    margin-bottom: 50px;
    margin-top: 20px;
}
ul.single-page-categories li {
    border-left: 1px solid #ddd;
    list-style: none;
    padding-left: 20px;
    margin-bottom: 0;
}
ul.single-page-categories li a {
    color: #000;
    text-decoration: none;
}
ul.single-page-categories li a:hover {
    color: #07b8d0;
    text-decoration: underline;
}
.single-post-more-blog-taxonomy span a {
    color: #535353;
    display: block;
    margin-top: 10px;
}
.single-post-more-blog-taxonomy h4 a {
    font-size: 19px;
    color: #535353;
}
.single-page-banner {
    margin-bottom: 30px;
    position: relative;
    text-align: center;
    background: #f3fbff;
    padding: 10px 0;
}
.single-page-banner button {
    border: 2px solid #fff;
    font-size: 15px;
    transform: translateY(-2px);
    background: #000;
    color: #fff;
    border-radius: 25px;
    padding: 10px 30px;
    font-size: 18px;
    margin-bottom: 3px;
}
.banner-content h2 { font-size: 25px; margin-bottom: 0; }
.banner-content h3 { font-size: 17px; line-height: 130%; font-weight: normal; margin-bottom: 0; }
.banner-content p { font-size: 14px; }
.sticky-sidbare { position: sticky; top: 72px; }
.blog-post h2, h3, h4, h5, h6 { margin-top: 10px; margin-bottom: 15px; }
.blog-post strong { font-weight: bold; }
.error-container, .default-content { text-align: center; padding: 60px 0; }
.unknown-section {
    padding: 40px 0;
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    margin: 20px 0;
    text-align: center;
}
</style>
