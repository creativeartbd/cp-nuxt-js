<!-- app.vue - Root application component -->
<template>
    <div id="app">
        <!-- Global Navigation - loads once and stays mounted -->
        <TheNavigation />

        <!-- Page content -->
        <main class="main-content">
            <NuxtPage />
        </main>

        <!-- Optional: Global Footer -->
        <TheFooter />
    </div>
</template>

<script setup>
// Global SEO defaults
useHead({
    titleTemplate: "%s - Cutout Partner",
    meta: [{ charset: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }],
});

// You can add global logic here that runs once
console.log("App.vue mounted - this runs once when the app starts");
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
