<template>
    <div
        class="header-banner"
        :style="{ backgroundImage: pageBanner ? `url('${pageBanner}')` : 'url(../assets/images/header_bg.jpg)' }"
    >
        <div class="header-content">
            <h3>{{ data.page.title }}</h3>
            <nav class="breadcrumb" v-if="$route.params.slug">
                <NuxtLink to="/">Home</NuxtLink>
                <span>&nbsp;&raquo;&nbsp;</span>
                <span>{{ data.page.title }}</span>
            </nav>
        </div>
    </div>
</template>

<script setup>
// Define the props the component expects
defineProps({
    data: {
        type: Object,
        required: true,
    },
    pageBanner: {
        type: String,
        default: null, // The banner URL is now passed in
    },
});

// NO LONGER NEEDED: const siteSettings = useState("siteSettings");
// NO LONGER NEEDED: const pageBanner = computed(() => { ... });
</script>

<style scoped>
.header-banner {
    position: relative;
    background-repeat: no-repeat;
    background-size: cover;
    height: 300px;
    background-position: center center;
}

.header-banner .header-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    text-align: center;
}

.header-banner .header-content h3 {
    font-size: 30px;
    margin-bottom: 15px;
}

.header-banner .header-content h3,
p {
    color: #000;
}

.header-banner img {
    object-fit: cover;
    height: 300px;
    width: 100%;
    object-position: center center;
}

.header-banner-overlay {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: #000;
    opacity: 0.5;
}

.header-content a {
    color: #000;
}
</style>
