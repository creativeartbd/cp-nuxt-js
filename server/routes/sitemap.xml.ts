import { defineEventHandler, setHeader } from "h3";

const SITE_URL = "https://cutoutpartner.com";
const WP_API = process.env.WORDPRESS_API_URL || "https://cutoutpartner-api.com/wp-json";

const staticPages = [
    { loc: "/",               priority: "1.0", changefreq: "weekly"  },
    { loc: "/pricing/",       priority: "0.9", changefreq: "weekly"  },
    { loc: "/about-us/",      priority: "0.8", changefreq: "monthly" },
    { loc: "/contact/",       priority: "0.8", changefreq: "monthly" },
    { loc: "/blog/",          priority: "0.9", changefreq: "daily"   },
    { loc: "/get-quotation/", priority: "0.8", changefreq: "monthly" },
    { loc: "/free-trial/",    priority: "0.8", changefreq: "monthly" },
    { loc: "/order/",         priority: "0.7", changefreq: "monthly" },
];

function urlEntry(loc: string, opts: { lastmod?: string; changefreq: string; priority: string }) {
    const lastmod = opts.lastmod ? `\n    <lastmod>${opts.lastmod}</lastmod>` : "";
    return `  <url>\n    <loc>${SITE_URL}${loc}</loc>${lastmod}\n    <changefreq>${opts.changefreq}</changefreq>\n    <priority>${opts.priority}</priority>\n  </url>`;
}

export default defineEventHandler(async (event) => {
    setHeader(event, "Content-Type", "application/xml; charset=UTF-8");
    setHeader(event, "Cache-Control", "public, max-age=3600");

    const entries: string[] = [];

    // Static pages
    for (const page of staticPages) {
        entries.push(urlEntry(page.loc, { changefreq: page.changefreq, priority: page.priority }));
    }

    // Service pages
    try {
        const services: any[] = await $fetch(
            `${WP_API}/wp/v2/services?per_page=100&_fields=slug,modified&status=publish`
        );
        for (const s of services) {
            entries.push(urlEntry(`/${s.slug}/`, {
                lastmod:    s.modified?.split("T")[0],
                changefreq: "monthly",
                priority:   "0.8",
            }));
        }
    } catch {}

    // Blog posts
    try {
        const posts: any[] = await $fetch(
            `${WP_API}/wp/v2/posts?per_page=100&_fields=slug,modified&status=publish`
        );
        for (const p of posts) {
            entries.push(urlEntry(`/${p.slug}/`, {
                lastmod:    p.modified?.split("T")[0],
                changefreq: "monthly",
                priority:   "0.6",
            }));
        }
    } catch {}

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>`;
});
