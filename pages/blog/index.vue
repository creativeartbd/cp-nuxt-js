<template>
    <div class="blog-page">
        <!-- Loading -->
        <div v-if="loading" class="d-flex justify-content-center py-5">
            <div class="spinner-border" role="status"></div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="container py-5 text-center">
            <h3>Something went wrong</h3>
            <p>{{ error }}</p>
        </div>

        <!-- Content -->
        <div v-else>
            <!-- Header -->
            <div class="container">
                <div class="blog-header">
                    <h2>{{ siteSettings?.all_fields?.blog_title || "Blog" }}</h2>
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

            <!-- Blog Grid -->
            <div class="container mt-5" v-if="posts.length">
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

                        <li class="page-item" :class="{ disabled: page === totalPages }" @click="changePage(page + 1)">
                            <a class="page-link">Next</a>
                        </li>
                    </ul>
                </nav>
            </div>

            <!-- No posts -->
            <div v-else class="container py-5 text-center">
                <p class="alert alert-warning">No blog posts found.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
const route = useRoute();
import { ref, onMounted } from "vue";

const { $api } = useNuxtApp();

const loading = ref(true);
const error = ref(null);

const posts = ref([]);
const featuredPost = ref(null);
const categories = ref([]);
const siteSettings = ref(null);

const page = ref(1);
const totalPages = ref(1);
const search = ref("");
const activeCategory = ref(null);

onMounted(async () => {
    try {
        const initialSearch = route.query.search;

        const response = await $api.getBlogPostsLight({
            per_page: 9,
            search: initialSearch || undefined,
        });

        posts.value = Array.isArray(response) ? response : response.posts || [];

        totalPages.value = response.totalPages || 1;
        page.value = 1;
        search.value = initialSearch || "";

        loading.value = false;

        // load other data in background (unchanged)
        const [sticky, cats, settings] = await Promise.all([
            $api.getStickyPost(),
            $api.getCategories(),
            $api.getSiteSettings(),
        ]);

        featuredPost.value = sticky
            ? {
                  id: sticky.id,
                  slug: sticky.slug,
                  title: sticky.title.rendered,
                  image: sticky._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
                  category: sticky._embedded?.["wp:term"]?.[0]?.[0]?.name || "",
              }
            : null;

        categories.value = cats;
        siteSettings.value = settings;

        if (featuredPost.value) {
            posts.value = posts.value.filter((p) => p.id !== featuredPost.value.id);
        }
    } catch (err) {
        error.value = err.message || "Failed to load blog";
        loading.value = false;
    }
});

async function changePage(newPage) {
    if (newPage < 1 || newPage > totalPages.value) return;

    loading.value = true;

    const response = await $api.getBlogPostsLight({
        page: newPage,
        per_page: 9,
        category: activeCategory.value,
        search: search.value || undefined,
    });

    posts.value = Array.isArray(response) ? response : response.posts || [];
    totalPages.value = response.totalPages || 1;
    page.value = newPage;
    loading.value = false;
}

async function filterByCategory(catId) {
    activeCategory.value = catId;
    page.value = 1;
    loading.value = true;

    const response = await $api.getBlogPostsLight({
        category: catId,
        per_page: 9,
    });

    posts.value = Array.isArray(response) ? response : response.posts || [];
    totalPages.value = response.totalPages || 1;
    loading.value = false;
}

async function searchPosts() {
    if (!search.value.trim()) return;

    page.value = 1;
    loading.value = true;

    const response = await $api.getBlogPostsLight({
        search: search.value,
        per_page: 9,
    });

    posts.value = Array.isArray(response) ? response : response.posts || [];
    totalPages.value = response.totalPages || 1;
    activeCategory.value = null;
    loading.value = false;
}
</script>

<style scoped>
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
.page-item {
    cursor: pointer;
}
</style>
