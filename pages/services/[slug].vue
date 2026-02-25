<template>
    <div></div>
</template>

<script setup>
// Redirect /services/slug → /slug (service pages no longer use /services/ prefix)
const route = useRoute();
await navigateTo(`/${route.params.slug}`, { redirectCode: 301, replace: true });
</script>
