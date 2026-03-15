// Dynamic 301 redirects managed from WordPress Admin → Theme Options → Redirect Rules.
// Redirects are cached in-memory for 5 minutes so WordPress isn't hit on every request.
import { sendRedirect, getRequestURL } from "h3";

const WP_API = process.env.WORDPRESS_API_URL || "https://cutoutpartner-api.com/wp-json";
const TTL = 5 * 60 * 1000; // 5 minutes

let cache: { rules: Array<{ redirect_from: string; redirect_to: string }>; ts: number } = {
    rules: [],
    ts: 0,
};

async function fetchRedirects() {
    if (Date.now() - cache.ts < TTL) return cache.rules;
    try {
        const data: any = await $fetch(`${WP_API}/cutout/v1/site-settings`);
        const rules: any[] = data?.all_fields?.redirect_rules || [];
        cache = { rules, ts: Date.now() };
        return rules;
    } catch {
        return cache.rules; // return stale data on error
    }
}

export default defineEventHandler(async (event) => {
    const url = getRequestURL(event);
    const path = url.pathname;

    // Skip API routes, assets, and files with extensions
    if (
        path.startsWith("/api/") ||
        path.startsWith("/_nuxt/") ||
        path.startsWith("/__nuxt") ||
        path.startsWith("/favicon") ||
        /\.\w+$/.test(path)
    ) return;

    const rules = await fetchRedirects();

    for (const rule of rules) {
        if (!rule.redirect_from || !rule.redirect_to) continue;

        // Normalize: ensure leading + trailing slash
        let from = rule.redirect_from.trim();
        if (!from.startsWith("/")) from = "/" + from;
        if (!from.endsWith("/")) from += "/";

        let normalizedPath = path;
        if (!normalizedPath.endsWith("/")) normalizedPath += "/";

        if (normalizedPath === from) {
            let to = rule.redirect_to.trim();
            if (!to.startsWith("/") && !/^https?:\/\//.test(to)) to = "/" + to;
            if (!to.endsWith("/") && !/^https?:\/\//.test(to)) to += "/";
            return sendRedirect(event, to, 301);
        }
    }
});
