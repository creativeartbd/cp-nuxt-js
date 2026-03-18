# Cutout Partner — Claude Instructions

## CRITICAL: Read before making ANY changes

---

## Infrastructure

| Item | Value |
|---|---|
| Frontend URL | `https://cutoutpartner.com/` |
| WordPress API | `https://cutoutpartner-api.com/wp-json` |
| VPS IP | `76.13.155.121` (user: root) |
| PM2 process | `cutout-nuxt` (runs on port 3000, Nginx proxies) |
| Deploy | `bash deploy.sh` — builds locally, SCPs `.output` to VPS, restarts PM2 |
| Local dev | `npm run dev` on port 8080 |
| WP backup | `/home/cutoutpartner2/backups/` (files + DB dump dated 20260312) |

**After every change: run `bash deploy.sh` automatically. Do NOT ask the user to push/deploy.**

---

## Stack

- **Nuxt**: 3.17.7 — PINNED. Do NOT upgrade. 3.21+ breaks `#app-manifest` virtual module.
- **Vue**: 3.x with SSR enabled (`ssr: true`)
- **CMS**: WordPress headless (ACF Pro for fields, Yoast for SEO)
- **Styling**: Bootstrap 5.3 + custom CSS
- **Images**: `@nuxt/image` with `provider: 'none'` (images served directly from WP)
- **State**: Pinia (`@pinia/nuxt`)
- **CSS**: PostCSS + PurgeCSS (production only)

---

## WordPress Plugin — `cutout-api` (CRITICAL)

**Location on server**: `/home/cutoutpartner/htdocs/cutoutpartner-api.com/wp-content/plugins/cutout-api/cutout-api.php`
**Location in repo**: `wordpress/cutout-api/cutout-api.php`

This plugin provides ALL custom REST API endpoints the Nuxt frontend depends on.
**It must always be active.** If the site breaks (blank pages, missing menu/content), check this plugin first.

### Why it exists
The original code was in `functions.php` of the hello-elementor theme. A theme update (v3.1.1 → v3.4.7) **overwrote functions.php** and deleted all custom code. The plugin ensures this never happens again.

### Endpoints registered (`cutout/v1`)

| Endpoint | Used by | Returns |
|---|---|---|
| `GET /settings` | `server/api/site-settings.get.ts` | All ACF options (`all_fields`) |
| `GET /site-settings` | `server/middleware/redirects.ts` | Same as above (alias) |
| `GET /menu/{slug}` | `server/api/menu.get.ts` | Menu items with `{id, title, url, target, children}` |
| `GET /page/{slug}` | `server/api/page/[slug].get.ts` | `{page, sections, seo}` |
| `GET /service/{slug}` | `server/api/services/[slug].get.ts` | `{page, sections, seo}` |
| `GET /blog-posts` | `plugins/api.js` → `getBlogPostsLight()` | `{posts, totalPages, total}` |
| `GET /posts` | `server/api/blog/index.get.ts` | Same as above (alias) |
| `GET /post/{slug}` | `server/api/blog/[slug].get.ts` | Single post object |

### ACF page sections field
Pages and services store sections under the ACF field key **`section_type`** (NOT `sections`).
`sections` in the API response = `$acf['section_type']` from WordPress.

### select_services field
The `all_fields.select_services` array returns `{value, label}` objects.
Some entries have post IDs as label — the plugin resolves these to post titles automatically via `cutout_fix_select_services()`.

### After editing the plugin on the server
Always sync back to the repo:
```bash
scp root@76.13.155.121:/home/cutoutpartner/htdocs/cutoutpartner-api.com/wp-content/plugins/cutout-api/cutout-api.php wordpress/cutout-api/cutout-api.php
```

---

## WordPress Admin Structure

### Options Pages
- **Theme Options** (slug: `theme-option`) — top-level menu item
  - **Theme General Settings** (slug: `general-settings`) — sub-page ← MAIN SETTINGS
    - Contains: footer, blog settings, services list, redirect rules, logos, GA/GTM IDs, etc.
  - Theme Options field group (ID: 11190)
  - Global Settings field group (ID: 12575)

Both options pages are registered via `acf/init` hook in the `cutout-api` plugin.
**If Theme General Settings disappears from WP admin, check the plugin is active.**

### ACF Field Groups (key ones)
| Group | ID | Location |
|---|---|---|
| Theme General Settings | 13223 | options page: `general-settings` |
| Theme Options | 11190 | options page: `theme-option` |
| Global Settings | 12575 | options page: `theme-option` |
| Page Builder | 12592 | post_type: page, services |

### Custom Post Types
- `services` (plural) — service pages
- `post` — blog posts

---

## Nuxt Architecture

### Data Flow
1. `app.vue` → `useAsyncData("global-data")` fetches `/api/menu` + `/api/site-settings` on **server**
2. Results stored in `useSiteSettings()` (Pinia) and `useMainMenu()` composables
3. Each page fetches its own data via `useAsyncData`

### siteSettings usage
- In **script**: `siteSettings.value?.all_fields?.field_name`
- In **template**: `siteSettings?.all_fields?.field_name` (Vue auto-unwraps refs — no `.value`)
- NEVER write `siteSettings?.value?....` in templates

### Page sections pattern
```js
// Every page/service response has this structure:
{ page: { id, title }, sections: [{ section_content: [...acf_blocks] }], seo: {...} }

// Render sections like this:
v-for="(section, i) in pageData.sections"
  v-for="(content, j) in section.section_content"
    <component :is="componentMap[content.acf_fc_layout]" :data="content" />
```

### componentMap pattern
```js
const componentMap = markRaw({
  home_slider: defineAsyncComponent(() => import('~/components/sections/HomeSlider.vue')),
  // ... always use defineAsyncComponent for code splitting
})
```

### Nitro caches
- `site-settings`: 1 hour (`maxAge: 3600`, `swr: true`)
- `menu`: 15 minutes
- `page` / `service`: 10 minutes
- ISR: 300 seconds (`routeRules: { "/**": { isr: 300 } }`)

**To clear all caches**: `pm2 restart cutout-nuxt` on the VPS

---

## Key Files

| File | Purpose |
|---|---|
| `nuxt.config.ts` | Main config — ISR rules, 301 redirects, PurgeCSS, image config |
| `app.vue` | Root — loads global data (menu + settings), AppLoader |
| `assets/css/main.css` | Global styles |
| `assets/css/response.css` | Responsive styles |
| `plugins/api.js` | `$api` plugin — all WP API calls |
| `plugins/trailing-slash.js` | Patches router.resolve to add trailing slashes |
| `composables/useSiteSettings.ts` | Shared siteSettings Pinia store |
| `composables/useMainMenu.ts` | Shared menu Pinia store |
| `server/middleware/redirects.ts` | Dynamic 301 redirects from WP admin (5-min cache) |
| `server/api/site-settings.get.ts` | Calls `cutout/v1/settings` |
| `server/api/menu.get.ts` | Calls `cutout/v1/menu/{slug}` |
| `server/api/page/[slug].get.ts` | Calls `cutout/v1/page/{slug}` |
| `server/api/services/[slug].get.ts` | Calls `cutout/v1/service/{slug}` |
| `components/AppLoader.vue` | 3-second page loader — change `DELAY` to adjust |
| `components/TheNavigation.vue` | Sticky navbar |
| `components/TheFooter2.vue` | Active footer (TheFooter.vue is unused) |
| `components/form/GetStartedForm.vue` | Contact/order form |
| `wordpress/cutout-api/cutout-api.php` | WP plugin (keep in sync with server) |

---

## 301 Redirects

Two layers:
1. **Static** — `nuxt.config.ts` → `routeRules` (rebuilt into the app, fastest)
2. **Dynamic** — WP Admin → Theme General Settings → Redirect Rules tab → fetched by `server/middleware/redirects.ts` with 5-minute cache

---

## Known Gotchas — DO NOT repeat these mistakes

- **`@nuxt/image` provider**: Must be `provider: 'none'`. IPX requires `sharp` which is arch-specific (macOS ARM64 → Linux x86 = 404 on all images).
- **`aspect-ratio: attr(width)/attr(height)`** on global `img` breaks v-html WordPress images.
- **Theme update wipes functions.php** — NEVER put custom code in `functions.php`. Use the `cutout-api` plugin.
- **Nitro cache survives broken WP API** — if WP API breaks, Nitro serves stale data until PM2 restarts. After fixing WP, always `pm2 restart cutout-nuxt`.
- **`active` CSS class on category buttons**: needs `!important` in `.blog-categories .list-inline-item button.active` due to Bootstrap specificity.
- **DMCA badge**: `DMCABadgeHelper.min.js` strips DOM-patched attributes. Patch HTML string before `v-html` in `TheFooter2.vue` via `patchDmca()`.
- **Footer links**: stored as absolute URLs in WP (`https://cutoutpartner.com/...`). Use `toRelative()` helper to convert for NuxtLink.
- **`imports.dirs: []`** in nuxt.config disables custom auto-imports — always import explicitly in composables/plugins.
