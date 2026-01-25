<!-- components/layout/TheLoadingBar.vue -->
<template>
    <div class="loading-bar" v-if="isLoading">
        <div class="loading-bar-progress"></div>
    </div>
</template>

<script setup>
const isLoading = ref(false);

// This is a more direct way to listen for navigation changes
const router = useRouter();
const nuxtApp = useNuxtApp();

// Create a navigation guard
router.beforeEach((to, from, next) => {
    isLoading.value = true;
    next();
});

nuxtApp.hook("page:finish", () => {
    // We still use the finish hook to hide it
    setTimeout(() => {
        isLoading.value = false;
    }, 200); // Slightly longer delay for visibility
});
</script>

<style scoped>
/* Your original styles are perfect */
.loading-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    z-index: 9999999999999;
}

.loading-bar-progress {
    height: 100%;
    background-color: #07b8d0;
    width: 0;
    animation: loading 1.5s ease-in-out infinite;
}

@keyframes loading {
    0% {
        width: 0;
    }
    50% {
        width: 70%;
    }
    100% {
        width: 100%;
    }
}
</style>
