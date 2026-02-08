<template>
    <div id="app">
        <!-- Loading bar will show automatically on navigation -->
        <TheLoadingBar />

        <TheNavigation />

        <main class="main-content">
            <NuxtPage />
        </main>

        <TheFooter2 />
    </div>
</template>

<script setup>
const { fetchSiteSettings } = useSiteSettings();
const { fetchMenu } = useMainMenu();

onMounted(async () => {
    await Promise.all([
        fetchSiteSettings(),
        fetchMenu("primary"), // ← This loads the menu!
    ]);
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
    padding-top: 64px; /* Adjust based on your header height */
}

/* Remove this if you don't have a fixed header */
body {
    margin: 0;
    padding: 0;
}
</style>
