<template>
    <div></div>
</template>

<script setup>
// Redirect /blog/slug → /slug (blog posts no longer use /blog/ prefix)
const route = useRoute();
await navigateTo(`/${route.params.slug}`, { redirectCode: 301, replace: true });
</script>
