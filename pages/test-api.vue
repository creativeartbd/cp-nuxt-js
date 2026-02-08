<!-- pages/test-api.vue -->
<template>
    <div class="container py-5">
        <h1>API Test Page</h1>
        
        <div class="row">
            <!-- Test Site Settings -->
            <div class="col-md-6">
                <div class="card mb-4">
                    <div class="card-header">
                        <h3>Site Settings</h3>
                        <button class="btn btn-sm btn-primary" @click="testSiteSettings">Test</button>
                    </div>
                    <div class="card-body">
                        <div v-if="siteSettingsLoading">Loading...</div>
                        <div v-else-if="siteSettingsError" class="alert alert-danger">
                            {{ siteSettingsError }}
                        </div>
                        <pre v-else class="small">{{ JSON.stringify(siteSettingsData, null, 2) }}</pre>
                    </div>
                </div>
            </div>

            <!-- Test Menu -->
            <div class="col-md-6">
                <div class="card mb-4">
                    <div class="card-header">
                        <h3>Menu</h3>
                        <button class="btn btn-sm btn-primary" @click="testMenu">Test</button>
                    </div>
                    <div class="card-body">
                        <div v-if="menuLoading">Loading...</div>
                        <div v-else-if="menuError" class="alert alert-danger">
                            {{ menuError }}
                        </div>
                        <pre v-else class="small">{{ JSON.stringify(menuData, null, 2) }}</pre>
                    </div>
                </div>
            </div>

            <!-- Test Page -->
            <div class="col-md-6">
                <div class="card mb-4">
                    <div class="card-header">
                        <h3>Page (home)</h3>
                        <button class="btn btn-sm btn-primary" @click="testPage">Test</button>
                    </div>
                    <div class="card-body">
                        <div v-if="pageLoading">Loading...</div>
                        <div v-else-if="pageError" class="alert alert-danger">
                            {{ pageError }}
                        </div>
                        <pre v-else class="small">{{ JSON.stringify(pageData, null, 2) }}</pre>
                    </div>
                </div>
            </div>

            <!-- Test WordPress Direct -->
            <div class="col-md-6">
                <div class="card mb-4">
                    <div class="card-header">
                        <h3>WordPress Direct</h3>
                        <button class="btn btn-sm btn-primary" @click="testWordPressDirect">Test</button>
                    </div>
                    <div class="card-body">
                        <div v-if="wpLoading">Loading...</div>
                        <div v-else-if="wpError" class="alert alert-danger">
                            {{ wpError }}
                        </div>
                        <pre v-else class="small">{{ JSON.stringify(wpData, null, 2) }}</pre>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-4">
            <h3>WordPress Endpoints to Check:</h3>
            <ul>
                <li><a href="https://cutoutpartner-api.com/wp-json/wp/v2/pages?slug=home&_embed=true" target="_blank">Pages API</a></li>
                <li><a href="https://cutoutpartner-api.com/wp-json/wp/v2/posts?per_page=1&_embed=true" target="_blank">Posts API</a></li>
                <li><a href="https://cutoutpartner-api.com/wp-json/wp-api-menus/v2/menus" target="_blank">Menus API (requires plugin)</a></li>
                <li><a href="https://cutoutpartner-api.com/wp-json/acf/v3/options/options" target="_blank">ACF Options (requires ACF)</a></li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const { $api } = useNuxtApp();

// Site Settings
const siteSettingsLoading = ref(false);
const siteSettingsError = ref(null);
const siteSettingsData = ref(null);

const testSiteSettings = async () => {
    siteSettingsLoading.value = true;
    siteSettingsError.value = null;
    try {
        const data = await $fetch('/api/site-settings');
        siteSettingsData.value = data;
        console.log('Site Settings:', data);
    } catch (error) {
        siteSettingsError.value = error.message;
        console.error('Site Settings Error:', error);
    } finally {
        siteSettingsLoading.value = false;
    }
};

// Menu
const menuLoading = ref(false);
const menuError = ref(null);
const menuData = ref(null);

const testMenu = async () => {
    menuLoading.value = true;
    menuError.value = null;
    try {
        const data = await $fetch('/api/menu?slug=primary');
        menuData.value = data;
        console.log('Menu:', data);
    } catch (error) {
        menuError.value = error.message;
        console.error('Menu Error:', error);
    } finally {
        menuLoading.value = false;
    }
};

// Page
const pageLoading = ref(false);
const pageError = ref(null);
const pageData = ref(null);

const testPage = async () => {
    pageLoading.value = true;
    pageError.value = null;
    try {
        const data = await $fetch('/api/page/home');
        pageData.value = data;
        console.log('Page:', data);
    } catch (error) {
        pageError.value = error.message;
        console.error('Page Error:', error);
    } finally {
        pageLoading.value = false;
    }
};

// WordPress Direct
const wpLoading = ref(false);
const wpError = ref(null);
const wpData = ref(null);

const testWordPressDirect = async () => {
    wpLoading.value = true;
    wpError.value = null;
    try {
        const data = await $fetch('https://cutoutpartner-api.com/wp-json/wp/v2/pages?slug=home&_embed=true');
        wpData.value = data;
        console.log('WordPress Direct:', data);
    } catch (error) {
        wpError.value = error.message;
        console.error('WordPress Direct Error:', error);
    } finally {
        wpLoading.value = false;
    }
};

// Auto-test on mount
onMounted(() => {
    testSiteSettings();
    testMenu();
    testPage();
});
</script>

<style scoped>
pre {
    max-height: 300px;
    overflow: auto;
    background: #f5f5f5;
    padding: 10px;
    border-radius: 4px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-header h3 {
    margin: 0;
    font-size: 1.2rem;
}
</style>