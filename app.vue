<template>
    <div id="app">
        <!-- Google Tag Manager (noscript) -->
        <noscript v-if="gtmId">
            <iframe
                :src="`https://www.googletagmanager.com/ns.html?id=${gtmId}`"
                height="0"
                width="0"
                style="display: none; visibility: hidden"
            ></iframe>
        </noscript>

        <!-- Loading bar will show automatically on navigation -->
        <TheLoadingBar />

        <TheNavigation />

        <main class="main-content">
            <NuxtLayout>
                <NuxtPage />
            </NuxtLayout>
        </main>

        <TheFooter2 />
    </div>
</template>

<script setup>
const { siteSettings } = useSiteSettings();
const { setMenu } = useMainMenu();

// GTM ID for noscript fallback
const gtmId = computed(() => {
    return siteSettings.value?.all_fields?.google_tag_manager_id || "";
});

// Load global data ONCE on server-side for fast initial load
await useAsyncData(
    "global-data",
    async () => {
        try {
            // Load menu and settings in parallel
            const [menuData, settingsData] = await Promise.all([
                $fetch("/api/menu?slug=primary"),
                $fetch("/api/site-settings"),
            ]);

            // Set the data in composables
            setMenu(menuData);
            siteSettings.value = settingsData;

            return { menu: menuData, settings: settingsData };
        } catch (error) {
            // Don't throw - let the app render with defaults
            return { menu: null, settings: null };
        }
    },
    {
        // This ensures data is fetched on server and cached for client
        server: true,
        lazy: false,
    }
);

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

body {
    margin: 0;
    padding: 0;
}
</style>
