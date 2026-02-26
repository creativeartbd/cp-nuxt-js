<template>
    <div class="category-page">
        <div v-if="error" class="container py-5 text-center">
            <h3>Category Not Found</h3>
            <p>{{ error }}</p>
        </div>

        <div v-else>
            <!-- Header -->
            <div class="container-fluid bg-single-post-header">
                <div class="container">
                    <div class="category-header">
                        <h2>{{ category?.name }}</h2>
                        <p>{{ category?.count }} {{ category?.count === 1 ? 'post' : 'posts' }}</p>
                    </div>
                </div>
            </div>

            <div class="container mt-5">
                <div class="row">
                    <!-- Posts Grid -->
                    <div class="col-md-8">
                        <div v-if="posts.length">
                            <div class="row">
                                <div v-for="post in posts" :key="post.id" class="col-md-6 mb-4">
                                    <div class="thumb-post">
                                        <NuxtLink :to="`/${post.slug}`">
                                            <NuxtImg
                                                :src="post.image"
                                                class="w-100 rounded mb-3"
                                                loading="lazy"
                                                decoding="async"
                                                format="webp"
                                                quality="80"
                                                width="400"
                                                height="280"
                                                sizes="sm:100vw md:50vw lg:400px"
                                            />
                                        </NuxtLink>
                                        <span class="category-label">{{ post.category }}</span>
                                        <h4 class="mt-2">
                                            <NuxtLink :to="`/${post.slug}`">{{ post.title }}</NuxtLink>
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
                                    <li class="page-item" :class="{ disabled: page === totalPages }" @click="changePage(page + 1)">
                                        <a class="page-link">Next</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        <div v-else class="py-5 text-center">
                            <p class="alert alert-warning">No posts found in this category.</p>
                        </div>
                    </div>

                    <!-- Sidebar -->
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
                                <li v-for="cat in allCategories" :key="cat.id">
                                    <NuxtLink
                                        :to="`/category/${cat.slug}`"
                                        class="btn btn-link"
                                        :class="{ active: cat.slug === slug }"
                                    >
                                        {{ cat.name }}
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        <!-- Blog page ACF sections (CTA etc.) -->
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
    </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, markRaw } from "vue";

const route = useRoute();
const { $api } = useNuxtApp();
const { siteSettings } = useSiteSettings();
const currentUrl = useRequestURL();

const slug = computed(() => route.params.slug);

const componentMap = markRaw({
    call_to_action: defineAsyncComponent(() => import("~/components/layout/CallToAction.vue")),
    try_our_editing_services: defineAsyncComponent(() => import("~/components/sections/TryOurEditingServices.vue")),
    clients_testimonial: defineAsyncComponent(() => import("~/components/sections/ClientsTestimonial.vue")),
    our_editing_services: defineAsyncComponent(() => import("~/components/sections/OurEditingServices.vue")),
    faq: defineAsyncComponent(() => import("~/components/sections/Faq.vue")),
    text_content: defineAsyncComponent(() => import("~/components/sections/TextContent.vue")),
});

const error = ref(null);
const posts = ref([]);
const category = ref(null);
const allCategories = ref([]);
const blogPageData = ref(null);
const page = ref(1);
const totalPages = ref(1);
const search = ref("");

const { data: asyncData, error: asyncError } = await useAsyncData(
    `category-${slug.value}`,
    async () => {
        const [cat, cats, blogPage] = await Promise.all([
            $api.getCategoryBySlug(slug.value),
            $api.getCategories().catch(() => []),
            $api.getPage("blog").catch(() => null),
        ]);

        if (!cat) {
            throw createError({ statusCode: 404, statusMessage: "Category not found" });
        }

        const response = await $api.getBlogPostsLight({ category: cat.id, per_page: 9 });

        return {
            category: cat,
            allCategories: cats,
            blogPage,
            posts: Array.isArray(response) ? response : response.posts || [],
            totalPages: response.totalPages || 1,
        };
    },
    { watch: [slug] }
);

watch(
    asyncData,
    (newData) => {
        if (newData) {
            category.value = newData.category;
            allCategories.value = newData.allCategories;
            blogPageData.value = newData.blogPage;
            posts.value = newData.posts;
            totalPages.value = newData.totalPages;
        }
    },
    { immediate: true }
);

watch(
    asyncError,
    (newError) => {
        if (newError) error.value = newError.message || "Failed to load category";
    },
    { immediate: true }
);

// Reactive SEO — set in setup context so it works correctly server-side
useHead(computed(() => {
    const cat = category.value;
    if (!cat) return {};
    return {
        // titleTemplate applies: "Category - Blog - Cutout Partner"
        title: `${cat.name} - Blog`,
        meta: [
            { name: "description", content: `Browse all posts in the ${cat.name} category.` },
            { property: "og:title", content: `${cat.name} - Blog | Cutout Partner` },
            { property: "og:description", content: `Browse all posts in the ${cat.name} category.` },
            { property: "og:image", content: "https://cutoutpartner.com/og-image.jpg" },
            { property: "og:url", content: currentUrl.href },
            { property: "og:type", content: "website" },
            { name: "twitter:title", content: `${cat.name} - Blog | Cutout Partner` },
            { name: "twitter:description", content: `Browse all posts in the ${cat.name} category.` },
            { name: "robots", content: "index,follow" },
        ],
        link: [{ rel: "canonical", href: currentUrl.href }],
    };
}));

async function changePage(newPage) {
    if (newPage < 1 || newPage > totalPages.value) return;
    const response = await $api.getBlogPostsLight({
        category: category.value.id,
        page: newPage,
        per_page: 9,
    });
    posts.value = Array.isArray(response) ? response : response.posts || [];
    totalPages.value = response.totalPages || 1;
    page.value = newPage;
}

function searchPosts() {
    if (!search.value.trim()) return;
    navigateTo({ path: "/blog", query: { search: search.value } });
}
</script>

<style scoped>
.bg-single-post-header {
    background-color: #f4fdff;
    padding-top: 40px;
    padding-bottom: 40px;
    margin-bottom: 20px;
}
.category-header h2 {
    font-size: 28px;
    margin-bottom: 5px;
    text-transform: capitalize;
}
.category-header p {
    color: #485b5e;
    margin: 0;
}
.thumb-post a {
    text-decoration: none;
    color: inherit;
}
.thumb-post h4 {
    font-size: 18px;
}
.category-label {
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
.sticky-sidbare {
    position: sticky;
    top: 72px;
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
ul.single-page-categories li a:hover,
ul.single-page-categories li a.active {
    color: #07b8d0;
    text-decoration: underline;
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
</style>
