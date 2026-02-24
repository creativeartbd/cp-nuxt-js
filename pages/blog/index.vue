<template>
    <div class="blog-page">
            <!-- Error State -->
            <div v-if="error" class="container py-5 text-center">
                <h3>Something went wrong</h3>
                <p>{{ error }}</p>
            </div>

            <!-- Content (only shows if not error) -->
            <div v-else>
                <!-- Header -->
                <div class="container">
                    <div class="blog-header">
                        <h2>{{ siteSettings?.all_fields?.blog_title || "Our Blog" }}</h2>
                        <p>
                            {{ siteSettings?.all_fields?.blog_sub_title || "Latest articles and insights" }}
                        </p>

                        <!-- Search -->
                        <form @submit.prevent="searchPosts">
                            <div class="search-input">
                                <i class="bi bi-search"></i>
                                <input
                                    v-model="search"
                                    type="text"
                                    class="form-control rounded mt-3"
                                    placeholder="Search by title"
                                />
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Featured Post -->
                <div v-if="featuredPost" class="container-fluid sticky-blog-post">
                    <div class="container">
                        <div class="row align-items-center py-5">
                            <div class="col-md-6">
                                <h5>{{ featuredPost.category }}</h5>
                                <h2>{{ featuredPost.title }}</h2>
                                <p v-html="featuredPost.excerpt.rendered"></p>
                                <NuxtLink :to="`/blog/${featuredPost.slug}`" class="btn btn-dark mt-3">
                                    Read More
                                </NuxtLink>
                            </div>
                            <div class="col-md-6">
                                <img :src="featuredPost.image" class="img-fluid rounded" alt="" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="container mt-5">
                    <!-- Categories -->
                    <ul class="blog-categories list-inline text-center">
                        <li v-for="cat in categories" :key="cat.id" class="list-inline-item">
                            <button
                                class="btn btn-outline-secondary rounded-pill"
                                :class="{ active: activeCategory === cat.id }"
                                @click="filterByCategory(cat.id)"
                            >
                                {{ cat.name }}
                            </button>
                        </li>
                    </ul>
                </div>

                <!-- Blog Grid -->
                <div class="container mt-5" v-if="posts.length">
                    <!-- Posts -->
                    <div class="row mt-4">
                        <div v-for="post in posts" :key="post.id" class="col-md-4 mb-4">
                            <div class="thumb-post">
                                <NuxtLink :to="`/blog/${post.slug}`">
                                    <img :src="post.image" class="w-100 rounded mb-3" loading="lazy" />
                                </NuxtLink>

                                <span class="category">{{ post.category }}</span>

                                <h4 class="mt-2">
                                    <NuxtLink :to="`/blog/${post.slug}`">
                                        {{ post.title }}
                                    </NuxtLink>
                                </h4>
                            </div>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <nav class="blog-pagination">
                        <ul class="pagination justify-content-center">
                            <li class="page-item" :class="{ disabled: page === 1 }" @click="changePage(page - 1)">
                                <a class="page-link">Previous</a>
                            </li>

                            <li
                                v-for="n in totalPages"
                                :key="n"
                                class="page-item"
                                :class="{ active: n === page }"
                                @click="changePage(n)"
                            >
                                <a class="page-link">{{ n }}</a>
                            </li>

                            <li
                                class="page-item"
                                :class="{ disabled: page === totalPages }"
                                @click="changePage(page + 1)"
                            >
                                <a class="page-link">Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>

                <!-- No posts -->
                <div v-else class="container py-5 text-center">
                    <p class="alert alert-warning w-100">No blog posts found.</p>
                </div>
            </div>

            <div v-if="blogPageData && blogPageData.sections && blogPageData.sections.length > 0" class="wp-content">
                <!-- Loop through all sections -->
                <template v-for="(section, index) in blogPageData.sections" :key="index">
                    <div
                        v-if="section.section_content && Array.isArray(section.section_content)"
                        class="section-wrapper"
                    >
                        <div v-for="(content, contentIndex) in section.section_content" :key="contentIndex">
                            <component
                                :is="componentMap[content.acf_fc_layout]"
                                :data="content"
                                v-if="componentMap[content.acf_fc_layout]"
                                :service="siteSettings?.all_fields?.select_services || []"
                            />
                        </div>
                    </div>
                </template>
            </div>
    </div>
</template>

<script setup>
import { defineAsyncComponent } from "vue";

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

import { ref } from "vue";

const route = useRoute();
const { $api } = useNuxtApp();

// Import and use the shared composable
const { siteSettings } = useSiteSettings();

// --- State ---
const error = ref(null);

const posts = ref([]);
const featuredPost = ref(null);
const categories = ref([]);

const page = ref(1);
const totalPages = ref(1);
const search = ref(route.query.search || "");
const activeCategory = ref(route.query.category ? Number(route.query.category) : null);

const blogPageData = ref(null);

// --- Main Data Fetching with useAsyncData ---
const { data: asyncData, error: asyncError } = await useAsyncData("page-blog", async () => {
    try {
        const initialSearch = route.query.search;
        const initialCategory = route.query.category ? Number(route.query.category) : undefined;

        // Fetch blog posts AND blog page data in parallel
        const [postsResponse, sticky, cats, blogPage] = await Promise.all([
            $api.getBlogPostsLight({
                per_page: 9,
                search: initialSearch || undefined,
                category: initialCategory || undefined,
            }),
            $api.getStickyPost(),
            $api.getCategories(),
            $api.getPage("blog"), // 👈 NEW: Fetch blog page for ACF sections
        ]);

        useHead({
            title: "Blog - Cutout Partner",
            meta: [
                {
                    name: "description",
                    content: "Read our latest articles on photo editing, tips, and industry insights.",
                },
            ],
        });

        return {
            posts: Array.isArray(postsResponse) ? postsResponse : postsResponse.posts || [],
            totalPages: postsResponse.totalPages || 1,
            sticky,
            categories: cats,
            blogPage, // 👈 NEW: Return blog page data
        };
    } catch (err) {
        console.error("Failed to load blog data:", err);
        throw createError({
            statusCode: 500,
            statusMessage: "Failed to load blog.",
        });
    }
});

// --- Populate refs from asyncData ---
watch(
    asyncData,
    (newData) => {
        if (newData) {
            posts.value = newData.posts;
            totalPages.value = newData.totalPages;
            categories.value = newData.categories;
            search.value = route.query.search || "";
            blogPageData.value = newData.blogPage; // 👈 NEW

            featuredPost.value = newData.sticky
                ? {
                      id: newData.sticky.id,
                      slug: newData.sticky.slug,
                      title: newData.sticky.title.rendered,
                      image: newData.sticky._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
                      category: newData.sticky._embedded?.["wp:term"]?.[0]?.[0]?.name || "",
                      excerpt: newData.sticky.excerpt,
                  }
                : null;

            if (featuredPost.value) {
                posts.value = posts.value.filter((p) => p.id !== featuredPost.value.id);
            }
        }
    },
    { immediate: true }
);

// --- Handle errors ---
watch(
    asyncError,
    (newError) => {
        if (newError) {
            error.value = newError.message || "Failed to load blog";
        }
    },
    { immediate: true }
);

// --- Watch for category query param changes (e.g. from single post page) ---
watch(
    () => route.query.category,
    async (newCat) => {
        if (newCat) {
            await filterByCategory(Number(newCat));
        } else {
            activeCategory.value = null;
            page.value = 1;
            const response = await $api.getBlogPostsLight({ per_page: 9 });
            posts.value = Array.isArray(response) ? response : response.posts || [];
            totalPages.value = response.totalPages || 1;
        }
    }
);

// --- Client-side functions ---
async function changePage(newPage) {
    if (newPage < 1 || newPage > totalPages.value) return;

    try {
        const response = await $api.getBlogPostsLight({
            page: newPage,
            per_page: 9,
            category: activeCategory.value,
            search: search.value || undefined,
        });

        posts.value = Array.isArray(response) ? response : response.posts || [];
        totalPages.value = response.totalPages || 1;
        page.value = newPage;
    } catch (err) {
        console.error("Failed to change page:", err);
        error.value = "Failed to load posts";
    }
}

async function filterByCategory(catId) {
    try {
        activeCategory.value = catId;
        page.value = 1;

        const response = await $api.getBlogPostsLight({
            category: catId,
            per_page: 9,
        });

        posts.value = Array.isArray(response) ? response : response.posts || [];
        totalPages.value = response.totalPages || 1;
    } catch (err) {
        console.error("Failed to filter by category:", err);
        error.value = "Failed to filter posts";
    }
}

async function searchPosts() {
    if (!search.value.trim()) return;

    try {
        page.value = 1;
        activeCategory.value = null;

        const response = await $api.getBlogPostsLight({
            search: search.value,
            per_page: 9,
        });

        posts.value = Array.isArray(response) ? response : response.posts || [];
        totalPages.value = response.totalPages || 1;
    } catch (err) {
        console.error("Failed to search posts:", err);
        error.value = "Failed to search posts";
    }
}
</script>

<style scoped>
/* Your existing styles are kept */
.sticky-blog-post {
    background: #f4fdff;
}
.blog-header {
    text-align: center;
    padding: 50px 0;
    max-width: 500px;
    margin: auto;
}
.search-input {
    position: relative;
}
.search-input i {
    position: absolute;
    left: 12px;
    top: 13px;
    color: #888;
}
.search-input input {
    padding: 12px 12px 12px 40px;
}
.thumb-post a {
    text-decoration: none;
    color: inherit;
}
.thumb-post h4 {
    font-size: 18px;
}
.category {
    font-size: 14px;
    color: #777;
}
.blog-pagination {
    margin: 50px 0;
}
.blog-pagination .active > .page-link,
.page-link.active {
    background: #07b8d0;
    border-color: #07b8d0;
    color: #fff;
}
.blog-pagination .page-link {
    color: #000;
}
.page-item {
    cursor: pointer;
}
.blog-categories li {
    margin: 5px;
}
.blog-categories li button:hover {
    background: #07b8d0;
    border-color: #07b8d0;
}
.blog-categories .list-inline-item button.active {
    background-color: #07b8d0 !important;
    border-color: #07b8d0 !important;
    color: #fff !important;
}
</style>
