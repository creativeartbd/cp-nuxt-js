<template>
    <div class="blog-page">
        <!-- ✅ Loading State -->
        <div class="d-flex justify-content-center align-items-center mt-5 mb-5" v-if="loading">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- ✅ Error State -->
        <div v-else-if="error" class="error-container">
            <div class="container">
                <h1>Something went wrong</h1>
                <p>
                    <small>{{ error }}</small>
                </p>
            </div>
        </div>

        <!-- ✅ Main Content -->
        <div v-else class="blog-content">
            <!-- Header -->
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <div class="blog-header">
                            <h2>Discover useful blogs from {{ siteSettings?.site_name || "Ephotovn" }}</h2>
                            <p>
                                {{
                                    siteSettings?.site_description ||
                                    "Explore professional insights, photography tips, and creative ideas from our editors."
                                }}
                            </p>

                            <!-- Search -->
                            <form @submit.prevent="searchPosts">
                                <div class="search-input">
                                    <i class="bi bi-search"></i>
                                    <input
                                        v-model="search"
                                        type="text"
                                        placeholder="Enter your keyword and press Enter"
                                        class="form-control rounded mt-3"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Featured Post -->
            <div v-if="featuredPost" class="container-fluid sticky-blog-post">
                <div class="container">
                    <div class="row align-items-center sticky-blog-post-header">
                        <div class="col-md-6">
                            <h5>
                                {{ getCategory(featuredPost) }}
                            </h5>
                            <h2 v-html="featuredPost.title.rendered"></h2>
                            <p v-html="featuredPost.excerpt.rendered"></p>
                            <NuxtLink :to="`/blog/${featuredPost.slug}`" class="btn btn-link"> Read More... </NuxtLink>
                        </div>
                        <div class="col-md-1"></div>
                        <div class="col-md-5">
                            <img :src="getImage(featuredPost)" alt="" class="img-fluid rounded" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Blog Grid -->
            <div class="container" v-if="posts && posts.length">
                <!-- Categories -->
                <div class="row">
                    <div class="col-md-12">
                        <ul class="blog-categories list-inline">
                            <li v-for="cat in categories" :key="cat.id" class="list-inline-item">
                                <button
                                    class="btn btn-outline-secondary rounded-pill"
                                    @click="filterByCategory(cat.id)"
                                >
                                    {{ cat.name }}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="row">
                    <div v-for="post in posts.slice(1)" :key="post.id" class="col-sm-4">
                        <div class="thumb-post">
                            <!-- ✅ Clickable image -->
                            <NuxtLink :to="`/blog/${post.slug}`">
                                <img :src="getImage(post)" :alt="post.title.rendered" class="rounded w-100 mb-3" />
                            </NuxtLink>

                            <div class="category">
                                <span>{{ getCategory(post) }}</span>
                            </div>

                            <!-- ✅ Clickable title -->
                            <h4>
                                <NuxtLink :to="`/blog/${post.slug}`" v-html="post.title.rendered" />
                            </h4>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div class="row">
                    <div class="col-md-12">
                        <nav class="blog-pagination">
                            <ul class="pagination justify-content-center">
                                <li class="page-item" :class="{ disabled: page === 1 }" @click="changePage(page - 1)">
                                    <a class="page-link" href="#">Previous</a>
                                </li>
                                <li
                                    v-for="n in totalPages"
                                    :key="n"
                                    class="page-item"
                                    :class="{ active: n === page }"
                                    @click="changePage(n)"
                                >
                                    <a class="page-link" href="#">{{ n }}</a>
                                </li>
                                <li
                                    class="page-item"
                                    :class="{ disabled: page === totalPages }"
                                    @click="changePage(page + 1)"
                                >
                                    <a class="page-link" href="#">Next</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            <!-- No Posts -->
            <div v-else class="text-center py-5">
                <p>No blog posts found.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const { $api } = useNuxtApp();

const loading = ref(true);
const error = ref(null);
const posts = ref([]);
const categories = ref([]);
const siteSettings = ref(null);
const page = ref(1);
const totalPages = ref(1);
const search = ref("");
const activeCategory = ref(null);

/* --------------------------------------------
   Lifecycle: Fetch all initial data
--------------------------------------------- */
onMounted(async () => {
    try {
        const [postData, catData, settingsData] = await Promise.all([
            $api.getPosts({ per_page: 9 }),
            $api.getCategories(),
            $api.getSiteSettings(),
        ]);

        posts.value = postData;
        categories.value = catData;
        siteSettings.value = settingsData;
    } catch (err) {
        console.error("Error loading blog data:", err);
        error.value = err.message || "Failed to load blog content.";
    } finally {
        loading.value = false;
    }
});

/* --------------------------------------------
   Computed helpers
--------------------------------------------- */
const featuredPost = computed(() => (posts.value && posts.value.length ? posts.value[0] : null));

function getImage(post) {
    return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "https://placehold.co/600x400";
}
function getCategory(post) {
    return post._embedded?.["wp:term"]?.[0]?.[0]?.name || "Uncategorized";
}

/* --------------------------------------------
   Interactions
--------------------------------------------- */
async function changePage(newPage) {
    if (newPage < 1) return;
    loading.value = true;
    try {
        posts.value = await $api.getPosts({
            per_page: 9,
            page: newPage,
            category: activeCategory.value,
            search: search.value || undefined,
        });
        page.value = newPage;
    } catch (err) {
        error.value = err.message || "Failed to change page.";
    } finally {
        loading.value = false;
    }
}

async function filterByCategory(catId) {
    loading.value = true;
    try {
        posts.value = await $api.getPosts({
            per_page: 9,
            page: 1,
            category: catId,
        });
        activeCategory.value = catId;
        page.value = 1;
    } catch (err) {
        error.value = err.message || "Failed to filter posts.";
    } finally {
        loading.value = false;
    }
}

async function searchPosts() {
    loading.value = true;
    try {
        posts.value = await $api.getPosts({
            per_page: 9,
            page: 1,
            search: search.value,
        });
        page.value = 1;
    } catch (err) {
        error.value = err.message || "Failed to search posts.";
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.error-container {
    text-align: center;
    padding: 60px 0;
}

/* ✅ Existing blog styling */
.blog-header {
    text-align: center;
    padding: 50px 0;
    width: 500px;
    max-width: 100%;
    margin: 0 auto;
}
.blog-header p {
    color: #797d88;
}
.form-control::placeholder {
    color: #888;
    opacity: 0.5;
}
.sticky-blog-post {
    background-color: #effdff;
}
.sticky-blog-post .sticky-blog-post-header {
    padding: 75px 0;
}
.sticky-blog-post h2 {
    color: #3e3e3e;
    margin-bottom: 26px;
}
.sticky-blog-post p {
    color: #485b5e;
}
.sticky-blog-post a {
    border: none;
    padding: 15px 30px;
    background: #0d464f;
    color: #fff;
    text-decoration: none;
}
.search-input {
    position: relative;
}
.search-input i {
    position: absolute;
    left: 10px;
    font-size: 21px;
    top: 17px;
    color: #888;
}
.search-input input {
    padding: 15px 15px 15px 45px;
}
.active > .page-link,
.page-link.active {
    background: #07b8d0;
    border-color: #07b8d0;
    color: #fff;
}
.blog-categories {
    margin-top: 50px;
    text-align: center;
}
.blog-categories button {
    color: #797d88;
    border: 1px solid #ddd;
    border-radius: 15px;
    padding: 5px 25px;
    margin: 5px;
}
.blog-categories button:hover {
    color: #0d8d9e;
    border-color: #0d8d9e;
}
.thumb-post {
    margin-bottom: 35px;
}
.thumb-post h4 {
    color: #3e3e3e;
    font-size: 19px;
}
.thumb-post .category span {
    color: #797d88;
    display: inline-block;
    font-size: 14px;
    margin-bottom: 8px;
}
.blog-pagination {
    margin-bottom: 45px;
    display: block;
}
.blog-pagination a {
    color: #000;
}
li.list-inline-item:hover button {
    background: transparent;
}
.thumb-post a {
    text-decoration: none;
    color: inherit;
}

.thumb-post a:hover {
    color: #07b8d0;
}
</style>
