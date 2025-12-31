<template>
    <div class="single-post-page">
        <!-- Loading State -->
        <div class="d-flex justify-content-center align-items-center mt-5 mb-5" v-if="loading">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
            <div class="container">
                <h1>Post Not Found</h1>
                <p>
                    <small>{{ error }}</small>
                </p>
            </div>
        </div>

        <!-- Post Content -->
        <div v-else-if="post" class="post-wrapper">
            <div class="container-fluid bg-single-post-header">
                <div class="container">
                    <div class="row px-5">
                        <div class="col-md-6">
                            <img :src="getImage(post)" alt="" class="img-fluid rounded" />
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
                    <div class="col-md-1">
                        <div class="single-post-social">
                            <i class="bi bi-facebook"></i>
                            <i class="bi bi-linkedin"></i>
                            <i class="bi bi-pinterest"></i>
                            <i class="bi bi-twitter"></i>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <div v-html="post.content.rendered"></div>
                    </div>
                    <div class="col-md-4">
                        <div class="sticky-sidbare">
                            <h5>Search</h5>
                            <div class="single-page-search">
                                <input type="text" v-model="search" class="form-control rounded" placeholder="Search" />
                                <i class="bi bi-search" @click="searchPosts"></i>
                            </div>
                            <div class="single-page-banner">
                                <img src="https://placehold.co/600x400" alt="" class="img-fluid rounded" />
                            </div>
                            <h5>Categories</h5>
                            <ul class="single-page-categories">
                                <li v-for="cat in categories" :key="cat.id">
                                    <NuxtLink :to="`/blog?category=${cat.id}`" class="btn btn-link">{{
                                        cat.name
                                    }}</NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Related Posts -->
            <div class="container mb-5" v-if="relatedPosts.length">
                <div class="row">
                    <div class="col-md-1"></div>
                    <div class="col-md-10">
                        <div class="row">
                            <h4 class="text-center mt-5 mb-4">Related Posts</h4>
                            <div v-for="related in relatedPosts" :key="related.id" class="col-md-4">
                                <div class="related-post">
                                    <img :src="getImage(related)" alt="" class="img-fluid rounded" />
                                    <div class="single-post-more-blog-taxonomy">
                                        <span>
                                            <NuxtLink :to="`/blog?category=${getCategoryId(related)}`">
                                                {{ getCategory(related) }}
                                            </NuxtLink>
                                        </span>
                                        <h4>
                                            <NuxtLink :to="`/blog/${related.slug}`" v-html="related.title.rendered" />
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-1"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const { $api } = useNuxtApp();
const route = useRoute();

const loading = ref(true);
const error = ref(null);
const post = ref(null);
const categories = ref([]);
const relatedPosts = ref([]);
const search = ref("");

onMounted(async () => {
    const slug = route.params.slug;
    try {
        const [singlePost, allCategories] = await Promise.all([$api.getPost(slug), $api.getCategories()]);

        if (!singlePost) {
            error.value = "This post does not exist.";
            return;
        }

        post.value = singlePost;
        categories.value = allCategories;

        // Fetch related posts
        const firstCategory = singlePost.categories?.[0];
        if (firstCategory) {
            const related = await $api.getPosts({
                category: firstCategory,
                per_page: 3,
            });
            relatedPosts.value = related.filter((p) => p.id !== singlePost.id);
        }

        // SEO setup
        useHead({
            title: `${singlePost.title.rendered} | ${singlePost._embedded?.author?.[0]?.name || "Blog"}`,
            meta: [
                { name: "description", content: singlePost.excerpt?.rendered?.replace(/(<([^>]+)>)/gi, "") || "" },
                { property: "og:title", content: singlePost.title.rendered },
                {
                    property: "og:description",
                    content: singlePost.excerpt?.rendered?.replace(/(<([^>]+)>)/gi, "") || "",
                },
                { property: "og:image", content: getImage(singlePost) },
            ],
        });
    } catch (err) {
        console.error("Error loading post:", err);
        error.value = err.message || "Failed to load this blog post.";
    } finally {
        loading.value = false;
    }
});

/* ------------------ Helpers ------------------ */
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
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
async function searchPosts() {
    if (!search.value) return;
    const results = await $api.getPosts({ search: search.value, per_page: 3 });
    relatedPosts.value = results;
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

/* Your original styles */
.bg-single-post-header {
    background-color: #f4fdff;
    padding-top: 50px;
    padding-bottom: 50px;
    margin-bottom: 100px;
}
.single-post-taxonomy {
    display: flex;
    gap: 20px;
    color: #485b5e;
}
.single-post-social {
    display: flex;
    flex-direction: column;
    gap: 30px;
    border-radius: 5px;
    background: #fff;
    padding: 15px;
    align-items: center;
    box-shadow: 5px 7px 12px #e3e3e3;
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
    top: 7px;
    right: 12px;
    font-size: 20px;
    color: #8a8a8a;
    cursor: pointer;
}
.single-page-search input {
    padding-right: 50px;
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
    margin-bottom: 0px;
}
ul.single-page-categories li a {
    color: #000000;
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
}
.sticky-sidbare {
    position: sticky;
    top: 72px;
}
</style>
