<template>
    <div class="blog-page">
        <!-- 
          Using <ClientOnly> to bypass server-side rendering issues.
          The top loading bar will handle the loading feedback.
        -->
        <ClientOnly>
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
                        <h2>{{ siteSettings?.all_fields?.blog_title }}</h2>
                        <p>
                            {{ siteSettings?.all_fields?.blog_sub_title }}
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

                <!-- Call to Action -->
                <CallToAction
                    v-if="blogPageData.sections[0].section_content[0].acf_fc_layout === 'call_to_action'"
                    :data="blogPageData.sections[0].section_content[0]"
                />
            </div>
        </ClientOnly>
    </div>
</template>

<script setup>
const route = useRoute();
import CallToAction from "~/components/layout/CallToAction.vue";
import { ref, computed } from "vue";

const { $api } = useNuxtApp();

// Import and use the shared composable
const { siteSettings, fetchSettings, pageDataCache, fetchPageData } = useSiteSettings();

// --- State (no more 'loading' ref) ---
const error = ref(null);

const posts = ref([]);
const featuredPost = ref(null);
const categories = ref([]);

const page = ref(1);
const totalPages = ref(1);
const search = ref(route.query.search || "");
const activeCategory = ref(null);

const blogPageData = computed(() => pageDataCache.value["blog"]);
const slug = computed(() => route.params.slug);
console.log("route.params:", route.params);

// --- Data Fetching with onMounted inside ClientOnly ---
onMounted(async () => {
    console.log("onMounted: Starting data fetch...");
    try {
        const initialSearch = route.query.search;

        // Fetch initial posts and other data in parallel
        const [postsResponse, sticky, cats] = await Promise.all([
            $api.getBlogPostsLight({
                per_page: 9,
                search: initialSearch || undefined,
            }),
            $api.getStickyPost(),
            $api.getCategories(),
            fetchPageData("blog"),
        ]);

        console.log("API Response:", { postsResponse, sticky, cats });

        // --- Manually update the refs ---
        posts.value = Array.isArray(postsResponse) ? postsResponse : postsResponse.posts || [];
        totalPages.value = postsResponse.totalPages || 1;
        page.value = 1;
        search.value = initialSearch || "";

        featuredPost.value = sticky
            ? {
                  id: sticky.id,
                  slug: sticky.slug,
                  title: sticky.title.rendered,
                  image: sticky._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
                  category: sticky._embedded?.["wp:term"]?.[0]?.[0]?.name || "",
                  excerpt: sticky.excerpt,
              }
            : null;

        categories.value = cats;

        if (featuredPost.value) {
            posts.value = posts.value.filter((p) => p.id !== featuredPost.value.id);
        }

        console.log("onMounted: Data fetch successful.");
    } catch (err) {
        console.error("onMounted: An error occurred during data fetch.", err);
        error.value = err.message || "Failed to load blog";
    }
});

// --- Fetch settings in the background ---
fetchSettings();

// --- Client-side functions (no more loading.value updates) ---
async function changePage(newPage) {
    if (newPage < 1 || newPage > totalPages.value) return;

    const response = await $api.getBlogPostsLight({
        page: newPage,
        per_page: 9,
        category: activeCategory.value,
        search: search.value || undefined,
    });

    posts.value = Array.isArray(response) ? response : response.posts || [];
    totalPages.value = response.totalPages || 1;
    page.value = newPage;
}

async function filterByCategory(catId) {
    activeCategory.value = catId;
    page.value = 1;

    const response = await $api.getBlogPostsLight({
        category: catId,
        per_page: 9,
    });

    posts.value = Array.isArray(response) ? response : response.posts || [];
    totalPages.value = response.totalPages || 1;
}

async function searchPosts() {
    if (!search.value.trim()) return;

    page.value = 1;
    activeCategory.value = null;

    const response = await $api.getBlogPostsLight({
        search: search.value,
        per_page: 9,
    });

    posts.value = Array.isArray(response) ? response : response.posts || [];
    totalPages.value = response.totalPages || 1;
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
.blog-categories .list-inline-item .active {
    background: #07b8d0;
    border-color: #07b8d0;
}
</style>
