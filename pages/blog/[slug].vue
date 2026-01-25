<template>
    <div class="single-post-page">
        <ClientOnly>
            <!-- Error State -->
            <div v-if="error" class="error-container">
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
                                    <li v-for="cat in categories" :key="cat.id">
                                        <NuxtLink :to="`/blog?category=${cat.id}`" class="btn btn-link">
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
                                <img :src="getImage(related)" alt="" class="img-fluid rounded" />
                                <div class="single-post-more-blog-taxonomy">
                                    <span>
                                        <NuxtLink :to="`/blog?category=${getCategoryId(related)}`">
                                            {{ getCategory(related) }}
                                        </NuxtLink>
                                    </span>
                                    <h4>
                                        <NuxtLink :to="`/blog/${related.slug}`">
                                            {{ related.title.rendered }}
                                        </NuxtLink>
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Call to Action -->
            <CallToAction
                v-if="blogPageData.sections[0].section_content[0].acf_fc_layout === 'call_to_action'"
                :data="blogPageData.sections[0].section_content[0]"
            />
        </ClientOnly>
    </div>
</template>

<script setup>
import { ref } from "vue";
import CallToAction from "~/components/layout/CallToAction.vue";
const { $api } = useNuxtApp();
const route = useRoute();

// Import and use the shared composable
const { siteSettings, fetchSettings, pageDataCache, fetchPageData } = useSiteSettings();

// --- State (no more 'loading' ref) ---
const error = ref(null);

const post = ref(null);
const categories = ref([]);
const relatedPosts = ref([]);
const search = ref("");
const blogPageData = computed(() => pageDataCache.value["blog"]);

// --- Data Fetching with onMounted inside ClientOnly ---
onMounted(async () => {
    const slug = route.params.slug;

    try {
        // Load critical data FIRST (parallel)
        const [singlePost, allCategories] = await Promise.all([
            $api.getPost(slug),
            $api.getCategories(),
            fetchPageData("blog"),
        ]);

        if (!singlePost) {
            error.value = "This post does not exist.";
            return;
        }

        post.value = singlePost;
        categories.value = allCategories;

        // Load related posts (non-blocking)
        const firstCategory = singlePost.categories?.[0];
        if (firstCategory) {
            $api.getPosts({
                category: firstCategory,
                per_page: 3,
            }).then((res) => {
                relatedPosts.value = res.filter((p) => p.id !== singlePost.id);
            });
        }

        // SEO
        useHead({
            title: `${singlePost.title.rendered} | Blog`,
            meta: [
                {
                    name: "description",
                    content: singlePost.excerpt?.rendered?.replace(/(<([^>]+)>)/gi, "") || "",
                },
                { property: "og:title", content: singlePost.title.rendered },
                {
                    property: "og:description",
                    content: singlePost.excerpt?.rendered?.replace(/(<([^>]+)>)/gi, "") || "",
                },
                { property: "og:image", content: getImage(singlePost) },
            ],
        });
    } catch (err) {
        error.value = err.message || "Failed to load post.";
    }
});

// Fetch settings in the background
fetchSettings();

/* Helpers (all names kept the same) */
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

/* Search inside single post (name kept the same) */
async function searchPosts() {
    if (!search.value.trim()) return;

    navigateTo({
        path: "/blog",
        query: { search: search.value },
    });
}
</script>

<style scoped>
/* Your existing styles are kept */
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
/* ... all your other styles remain unchanged ... */
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
    position: relative;
    text-align: center;
    background: #f3fbff;
    padding: 10px 0;
}
.single-page-banner button {
    border: 2px solid #ffffff;
    font-size: 15px;
    transform: translateY(-2px);
    background: #000000;
    color: #ffffff;
    border-radius: 25px;
    padding: 10px 30px;
    font-size: 18px;
    margin-bottom: 3px;
}
.banner-content h2 {
    font-size: 25px;
    margin-bottom: 0;
}
.banner-content h3 {
    font-size: 17px;
    line-height: 130%;
    font-weight: normal;
    margin-bottom: 0;
}
.banner-content p {
    font-size: 14px;
}
.sticky-sidbare {
    position: sticky;
    top: 72px;
}
.blog-post h2,
h3,
h4,
h5,
h6 {
    margin-top: 10px;
    margin-bottom: 15px;
}
.blog-post strong {
    font-weight: bold;
}
</style>
