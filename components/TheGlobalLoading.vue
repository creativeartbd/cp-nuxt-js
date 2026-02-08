<!-- components/TheGlobalLoading.vue -->
<template>
    <div v-if="isLoading" class="global-loading">
        <div class="spinner"></div>
        <p>Loading...</p>
    </div>
</template>

<script setup>
// This component doesn't need any script logic. It just reacts to a prop.
defineProps({
    isLoading: {
        type: Boolean,
        default: false,
    },
});
</script>

<style scoped>
.global-loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.85);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9998; /* Ensure it's above content but below the navbar */
    pointer-events: none; /* Prevent clicks while loading */
}

.global-loading .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
