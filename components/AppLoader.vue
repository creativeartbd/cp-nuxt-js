<template>
    <Transition name="loader-fade">
        <div v-if="visible" class="app-loader">
            <div class="loader-spinner"></div>
        </div>
    </Transition>
</template>

<script setup>
const DELAY = 3000; // ms — change this to adjust loading duration

const visible = ref(false);
const router = useRouter();
let hideTimer = null;

function show() {
    if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
    }
    visible.value = true;
}

function scheduleHide() {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
        visible.value = false;
    }, DELAY);
}

onMounted(() => {
    show();
    scheduleHide();
});

router.beforeEach(() => {
    show();
});

router.afterEach(() => {
    scheduleHide();
});

onUnmounted(() => {
    if (hideTimer) clearTimeout(hideTimer);
});
</script>

<style scoped>
.app-loader {
    position: fixed;
    inset: 0;
    z-index: 9999999999;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
}
.loader-spinner {
    width: 52px;
    height: 52px;
    border: 4px solid #e0f7fa;
    border-top-color: #07b8d0;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}
@keyframes spin {
    to { transform: rotate(360deg); }
}
.loader-fade-leave-active {
    transition: opacity 0.4s ease;
}
.loader-fade-leave-to {
    opacity: 0;
}
</style>
