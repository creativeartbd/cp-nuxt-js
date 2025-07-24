<!-- pages/debug-nav.vue -->
<template>
    <div class="debug-nav-page">
        <div class="container">
            <h1>Navigation Debug Page</h1>

            <div class="debug-section">
                <h2>Pages Data:</h2>
                <p><strong>Loading:</strong> {{ pending }}</p>
                <p><strong>Error:</strong> {{ error }}</p>
                <p><strong>Pages Count:</strong> {{ pages?.length || 0 }}</p>

                <div v-if="pages && pages.length > 0">
                    <h3>Available Pages:</h3>
                    <ul>
                        <li v-for="page in pages" :key="page.id">
                            <strong>{{ page.title }}</strong> - <code>{{ page.slug }}</code> -
                            <NuxtLink :to="page.url">{{ page.url }}</NuxtLink>
                        </li>
                    </ul>
                </div>

                <div v-else>
                    <p>No pages found</p>
                </div>

                <details>
                    <summary>Raw Pages Data</summary>
                    <pre>{{ JSON.stringify(pages, null, 2) }}</pre>
                </details>
            </div>

            <div class="debug-section">
                <h2>Site Settings Data:</h2>
                <p><strong>Loading:</strong> {{ settingsPending }}</p>
                <p><strong>Error:</strong> {{ settingsError }}</p>

                <details>
                    <summary>Raw Settings Data</summary>
                    <pre>{{ JSON.stringify(siteSettings, null, 2) }}</pre>
                </details>
            </div>

            <div class="debug-section">
                <h2>Test Navigation Links:</h2>
                <div v-if="pages && pages.length > 0" class="test-links">
                    <NuxtLink v-for="page in pages" :key="page.id" :to="page.url" class="test-link">
                        Go to {{ page.title }}
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { $api } = useNuxtApp();

// Fetch navigation pages
const {
    data: pages,
    pending,
    error,
} = await useLazyAsyncData("debug-navigation-pages", () => $api.getPages(), {
    default: () => [],
});

// Fetch site settings
const {
    data: siteSettings,
    pending: settingsPending,
    error: settingsError,
} = await useLazyAsyncData("debug-site-settings", () => $api.getSiteSettings(), {
    default: () => ({}),
});

useHead({
    title: "Navigation Debug",
});
</script>

<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.debug-section {
    background: #f8f9fa;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
}

.debug-section h2 {
    margin-bottom: 15px;
    color: #333;
}

.debug-section ul {
    background: white;
    padding: 15px;
    border-radius: 6px;
}

.debug-section li {
    margin-bottom: 10px;
    padding: 5px;
    border-bottom: 1px solid #eee;
}

.test-links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.test-link {
    background: #667eea;
    color: white;
    padding: 10px 15px;
    border-radius: 6px;
    text-decoration: none;
}

.test-link:hover {
    background: #5a6fd8;
}

details {
    margin-top: 15px;
}

summary {
    cursor: pointer;
    font-weight: bold;
    padding: 10px;
    background: white;
    border-radius: 4px;
}

pre {
    background: white;
    padding: 15px;
    border-radius: 4px;
    overflow: auto;
    max-height: 300px;
    font-size: 12px;
}
</style>
