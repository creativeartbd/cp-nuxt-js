export default defineNuxtPlugin(() => {
    const { siteSettings } = useSiteSettings();

    watch(
        () => siteSettings.value,
        (settings) => {
            if (!settings?.all_fields) return;

            const tracking = settings.all_fields;

            // Google Analytics (GA4)
            if (tracking.google_analytics_id) {
                const gaScript = document.createElement("script");
                gaScript.async = true;
                gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${tracking.google_analytics_id}`;
                document.head.appendChild(gaScript);

                const inlineScript = document.createElement("script");
                inlineScript.text = `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${tracking.google_analytics_id}');
                `;
                document.head.appendChild(inlineScript);
            }

            // Google Ads
            if (tracking.google_ads_id) {
                const adsScript = document.createElement("script");
                adsScript.text = `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('config', '${tracking.google_ads_id}');
                `;
                document.head.appendChild(adsScript);
            }

            // Google Tag Manager
            if (tracking.google_tag_manager_id) {
                const gtmScript = document.createElement("script");
                gtmScript.text = `
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','${tracking.google_tag_manager_id}');
                `;
                document.head.appendChild(gtmScript);
            }

            // Google Search Console
            if (tracking.google_search_console_verification_code) {
                useHead({
                    meta: [
                        {
                            name: "google-site-verification",
                            content: tracking.google_search_console_verification_code,
                        },
                    ],
                });
            }
        },
        { immediate: true }
    );
});
