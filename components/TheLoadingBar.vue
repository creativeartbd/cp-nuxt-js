<!-- components/layout/TheLoadingBar.vue -->
<template>
    <div class="loading-bar" v-if="isLoading">
        <div class="loading-bar-progress"></div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const isLoading = ref(false);
const router = useRouter();
const nuxtApp = useNuxtApp();

// Start loading on navigation start
router.beforeEach((to, from, next) => {
    // Only show loading if navigating to a different page
    if (to.path !== from.path) {
        isLoading.value = true;
    }
    next();
});

// Hide loading when page finishes loading
nuxtApp.hook("page:finish", () => {
    setTimeout(() => {
        isLoading.value = false;
    }, 300);
});

// Also hide on error
nuxtApp.hook("vue:error", () => {
    isLoading.value = false;
});
</script>

<style scoped>
.loading-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    z-index: 9999999999999;
    background: transparent;
}

.loading-bar-progress {
    height: 100%;
    background: linear-gradient(90deg, #07b8d0, #0fa3b8);
    width: 0;
    animation: loading 2s ease-in-out forwards;
    box-shadow: 0 0 10px rgba(7, 184, 208, 0.5);
}

@keyframes loading {
    0% {
        width: 10%;
    }
    50% {
        width: 70%;
    }
    100% {
        width: 100%;
    }
}
</style>
