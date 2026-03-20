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
        "swiper/css/effect-fade",
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
            siteUrl: process.env.SITE_URL || "https://cutoutpartner.com",
            googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || "",
        },
    },

    // App head configuration
    app: {
        baseURL: "/",
        head: {
            title: "Cutout Partner - Professional Photo Editing Services",
            htmlAttrs: {
                lang: "en",
            },
            meta: [
                { name: "dmca-site-verification", content: "T0hXV1Q4SWovZEwwV1FNSUE4MHBNa21tci81ZXppRnZsWWY1VklPMkJObz01" },
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
                { property: "og:description", content: "Professional photo editing services with AI-powered background removal, retouching, and image enhancement." },
                { property: "og:image", content: "https://cutoutpartner.com/og-image.jpg" },
                // Twitter
                { name: "twitter:card", content: "summary_large_image" },
                { name: "twitter:title", content: "Cutout Partner - Professional Photo Editing Services" },
                { name: "twitter:description", content: "Professional photo editing services with AI-powered background removal, retouching, and image enhancement." },
            ],
            link: [
                { rel: "icon", type: "image/png", href: "/assets/images/favicon-white.png" },
                // Preconnect for critical origins
                { rel: "preconnect", href: "https://cutoutpartner-api.com" },
                { rel: "preconnect", href: "https://fonts.googleapis.com" },
                { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
                // DNS prefetch for non-critical origins
                { rel: "dns-prefetch", href: "https://cutoutpartner-api.com" },
                { rel: "dns-prefetch", href: "https://cdn.jsdelivr.net" },
                { rel: "dns-prefetch", href: "https://www.youtube.com" },
                { rel: "dns-prefetch", href: "https://i.ytimg.com" },
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
    modules: ["@pinia/nuxt", "@nuxt/image"],

    image: {
        // Use 'none' provider: images served directly from WordPress.
        // IPX (server-side WebP conversion) requires sharp, which is
        // architecture-specific and cannot be cross-compiled from macOS to Linux.
        provider: "none",
        domains: ["cutoutpartner-api.com"],
        screens: {
            xs: 320,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
        },
    },

    // Development tools
    devtools: {
        enabled: true,
    },

    // TypeScript configuration
    typescript: {
        strict: false,
        typeCheck: false,
    },

    // Cache rendered HTML pages for 5 minutes (ISR via Nitro)
    // First visitor gets fresh SSR; subsequent visitors get cached HTML instantly
    routeRules: {
        "/": { isr: 300 },
        // 301 SEO redirects (old URLs → new canonical URLs)
        "/clipping-path-service/": { redirect: { to: "/best-clipping-path-service-provider/", statusCode: 301 } },
        "/ecommerce-photo-editing/": { redirect: { to: "/ecommerce-image-editing-services/", statusCode: 301 } },
        "/neck-joint-service/": { redirect: { to: "/invisible-ghost-mannequin-services/", statusCode: 301 } },
        "/product-retouching-service/": { redirect: { to: "/product-photo-editing-services/", statusCode: 301 } },
        "/background-removal-service/": { redirect: { to: "/background-removal-services/", statusCode: 301 } },
        "/shadow-making-service/": { redirect: { to: "/shadow-creation-service/", statusCode: 301 } },
        "/color-correction-service/": { redirect: { to: "/color-correction-services/", statusCode: 301 } },
        "/headshot-retouching-service/": { redirect: { to: "/headshot-retouching-services/", statusCode: 301 } },
        "/beauty-retouch-service/": { redirect: { to: "/beauty-retouching-services/", statusCode: 301 } },
        "/newborn-baby-retouch/": { redirect: { to: "/newborn-photo-editing-services/", statusCode: 301 } },
        "/wedding-photo-retouch/": { redirect: { to: "/wedding-photo-editing-services/", statusCode: 301 } },
        "/multi-path-service/": { redirect: { to: "/multiple-clipping-path-service/", statusCode: 301 } },
        "/jewelry-retouching-service/": { redirect: { to: "/jewelry-photo-editing-service/", statusCode: 301 } },
        "/photo-restoration-service/": { redirect: { to: "/photo-restoration-services/", statusCode: 301 } },
        "/real-estate-photo-editing/": { redirect: { to: "/real-estate-photo-editing-services/", statusCode: 301 } },
        "/upload/": { redirect: { to: "/order/", statusCode: 301 } },
        "/contact-us/": { redirect: { to: "/contact/", statusCode: 301 } },
        "/**": { isr: 300 },
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

    // PostCSS - PurgeCSS removes unused Bootstrap CSS in production (~80 KB savings)
    postcss: {
        plugins: {
            "@fullhuman/postcss-purgecss":
                process.env.NODE_ENV === "production"
                    ? {
                          content: [
                              "./components/**/*.vue",
                              "./pages/**/*.vue",
                              "./layouts/**/*.vue",
                              "./app.vue",
                              "./plugins/**/*.{js,ts}",
                              "./composables/**/*.{js,ts}",
                          ],
                          defaultExtractor: (content) =>
                              content.match(/[\w-/:]+(?<!:)/g) || [],
                          safelist: {
                              // Exact class names added dynamically by Bootstrap JS / Vue
                              standard: [
                                  "show",
                                  "hide",
                                  "fade",
                                  "active",
                                  "disabled",
                                  "open",
                                  "collapsing",
                                  "collapsed",
                                  "in",
                                  "was-validated",
                                  "is-valid",
                                  "is-invalid",
                                  "nuxt-link-active",
                                  "nuxt-link-exact-active",
                                  "router-link-active",
                                  "router-link-exact-active",
                              ],
                              // Pattern-based safelist for dynamic Bootstrap components
                              deep: [
                                  /^nav/,
                                  /^navbar/,
                                  /^dropdown/,
                                  /^collapse/,
                                  /^tab-/,
                                  /^accordion/,
                                  /^btn/,
                                  /^modal/,
                                  /^alert/,
                                  /^badge/,
                                  /^swiper/,
                                  /^pagination/,
                                  /^page-/,
                                  /^spinner/,
                                  /^offcanvas/,
                                  /^tooltip/,
                                  /^popover/,
                                  /^form-/,
                                  /^input-/,
                                  /^bi-/,
                                  // WordPress content classes (used inside v-html)
                                  /^wp-/,
                                  /^align/,
                                  /^has-/,
                                  /^is-/,
                                  /^size-/,
                              ],
                          },
                      }
                    : false,
        },
    },

    // Vite configuration
    vite: {
        build: {
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('/node_modules/swiper/')) return 'swiper';
                        if (id.includes('/node_modules/@img-comparison-slider/')) return 'img-comparison-slider';
                    },
                },
            },
        },
        optimizeDeps: {},
    },

    loadingIndicator: {
        name: "chasing-dots",
        color: "#07b8d0",
        background: "white",
    },
});
