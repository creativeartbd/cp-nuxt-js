export default defineNuxtPlugin(() => {
    if (process.client) {
        const Tawk_API = window.Tawk_API || {};
        const Tawk_LoadStart = new Date();

        (function () {
            const s1 = document.createElement("script");
            const s0 = document.getElementsByTagName("script")[0];

            s1.async = true;
            s1.src = "https://embed.tawk.to/6926b24d27f46f195d9b2358/1javih0km";
            s1.charset = "UTF-8";
            s1.setAttribute("crossorigin", "*");

            s0.parentNode.insertBefore(s1, s0);
        })();
    }
});
