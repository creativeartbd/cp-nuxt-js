<!-- app.vue - Root application component -->
<template>
    <div id="app">
        <!-- Loading bar -->
        <TheLoadingBar />

        <!-- Global Navigation - loads once and stays mounted -->
        <TheNavigation />

        <!-- Page content -->
        <main class="main-content">
            <!-- 
              Wrap NuxtPage in ClientOnly to prevent hydration mismatches.
              This ensures that the server and client render the same thing.
            -->
            <ClientOnly>
                <NuxtPage />
            </ClientOnly>
        </main>

        <!-- Optional: Global Footer -->
        <TheFooter2 />
    </div>
</template>

<script setup>
// Global SEO defaults
useHead({
    titleTemplate: "%s - Cutout Partner",
    meta: [{ charset: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }],
});
</script>

<style>
@import "~/assets/css/main.css";
/* Global styles that apply to the entire app */
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
