<template>
    <div>
        <TheNavigation />
        <div class="error-page">
            <h2>Opps!</h2>
            <h4>The page you are looking for is not found.</h4>
        </div>
        <TheFooter />
    </div>
</template>

<script setup>
import TheNavigation from "~/components/TheNavigation.vue";
// rest of your script
</script>
<style scoped>
.error-page {
    margin: 150px auto;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    flex-direction: column;
    text-align: center;
}
</style>
