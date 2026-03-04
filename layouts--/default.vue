<template>
    <div id="app">
        <!-- Loading bar will show automatically on navigation -->
        <TheLoadingBar />

        <TheNavigation />

        <main class="main-content">
            <NuxtLayout>
                <NuxtPage />
            </NuxtLayout>
        </main>

        <!-- <TheFooter2 /> -->
        <!-- Temporarily disabled until footer data is ready -->
    </div>
</template>

<script setup>
// Import composables
const { fetchSiteSettings } = useSiteSettings();
const { fetchMenu } = useMainMenu();

// Load global data on app mount
onMounted(async () => {
    try {
        await Promise.all([fetchSiteSettings(), fetchMenu("primary")]);
    } catch (error) {
        // silently fail — nav/footer will render without data
    }
});

useHead({
    titleTemplate: "%s - Cutout Partner",
    meta: [{ charset: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }],
});
</script>

<style>
@import "~/assets/css/main.css";
@import "~/assets/css/response.css";

#app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.main-content {
    flex: 1;
    padding-top: 64px;
}

body {
    margin: 0;
    padding: 0;
}
</style>
