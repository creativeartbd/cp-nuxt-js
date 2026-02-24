// nuxt.config.ts
export default defineNuxtConfig({
    compatibilityDate: "2025-07-23",
    devServer: {
        port: 8080,
    },

    // Enable SSR
    ssr: true,

    // Global CSS
    css: [
        "bootstrap/dist/css/bootstrap.min.css",
        "bootstrap-icons/font/bootstrap-icons.css",
        "swiper/css",
        "swiper/css/navigation",
        "swiper/css/pagination",
    ],

    imports: {
        // Disable the problematic auto-imports
        dirs: [],
    },

    // Runtime config - FIXED
    runtimeConfig: {
        // Server-side only
        wpBaseUrl: process.env.WORDPRESS_API_URL || "https://cutoutpartner-api.com/wp-json",

        // Public (client & server)
        public: {
            wordpressApiUrl: process.env.WORDPRESS_API_URL || "https://cutoutpartner-api.com/wp-json",
            wpBaseUrl: process.env.WORDPRESS_API_URL || "https://cutoutpartner-api.com/wp-json",
            siteUrl: process.env.SITE_URL || "https://cutoutpartner-api.com",
            googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || "",
        },
    },

    // App head configuration
    app: {
        baseURL: "/v2/",
        head: {
            title: "Cutout Partner - Professional Photo Editing Services",
            htmlAttrs: {
                lang: "en",
            },
            meta: [
                { charset: "utf-8" },
                { name: "viewport", content: "width=device-width, initial-scale=1" },
                {
                    name: "description",
                    content:
                        "Professional photo editing services with AI-powered background removal, retouching, and image enhancement.",
                },
                // Open Graph
                { property: "og:type", content: "website" },
                { property: "og:title", content: "Cutout Partner - Professional Photo Editing Services" },
                { property: "og:image", content: "https://cutoutpartner.com/og-image.jpg" },
                // Twitter
                { name: "twitter:card", content: "summary_large_image" },
            ],
            link: [
                { rel: "icon", type: "image/jpeg", href: "/v2/assets/images/favicon-white.png" },
                { rel: "preconnect", href: "https://cutoutpartner-api.com" },
                { rel: "preconnect", href: "https://fonts.googleapis.com" },
                { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
                {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap",
                },
            ],
            script: [
                {
                    src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
                    integrity: "sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz",
                    crossorigin: "anonymous",
                    defer: true,
                },
            ],
        },
    },

    // Minimal modules that work
    modules: ["@pinia/nuxt", "@vueuse/nuxt"],

    // Development tools
    devtools: {
        enabled: true,
    },

    // TypeScript configuration
    typescript: {
        strict: false,
        typeCheck: false,
    },

    // Nitro configuration
    nitro: {
        compressPublicAssets: true,
        experimental: {
            wasm: true,
        },
    },

    // Build configuration
    build: {
        transpile: [],
    },

    // Vite configuration
    vite: {
        build: {
            rollupOptions: {
                output: {
                    manualChunks: undefined,
                },
            },
        },
        optimizeDeps: {
            include: ["bootstrap", "swiper"],
        },
    },

    loadingIndicator: {
        name: "chasing-dots",
        color: "#07b8d0",
        background: "white",
    },
});
