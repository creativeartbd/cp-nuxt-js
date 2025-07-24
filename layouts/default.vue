<!-- layouts/default.vue -->
<template>
    <div class="app-layout">
        <ClientOnly>
            <TheNavigation />
            <template #fallback>
                <nav class="nav-fallback">
                    <div class="nav-container">
                        <NuxtLink to="/" class="logo">
                            <span class="logo-text">Cutout Partner</span>
                        </NuxtLink>
                        <div class="nav-links">
                            <NuxtLink to="/" class="nav-link">Home</NuxtLink>
                            <NuxtLink to="/contact" class="nav-link">Contact</NuxtLink>
                        </div>
                    </div>
                </nav>
            </template>
        </ClientOnly>
        <main class="main-content">
            <slot />
        </main>
        <footer class="footer">
            <div class="container">
                <p>&copy; 2025 Cutout Partner. All rights reserved.</p>
            </div>
        </footer>
    </div>
</template>

<script setup>
// This layout will be applied to all pages automatically
</script>
