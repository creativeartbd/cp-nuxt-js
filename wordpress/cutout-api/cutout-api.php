<?php
/**
 * Plugin Name: Cutout Partner API
 * Description: Custom REST API endpoints for the Nuxt frontend
 * Version: 1.0.0
 * Author: Cutout Partner
 */

if (!defined('ABSPATH')) exit;

add_action('rest_api_init', 'cutout_register_rest_routes');

function cutout_register_rest_routes() {
    register_rest_route('cutout/v1', '/settings', [
        'methods'             => 'GET',
        'callback'            => 'cutout_get_settings',
        'permission_callback' => '__return_true',
    ]);
    register_rest_route('cutout/v1', '/site-settings', [
        'methods'             => 'GET',
        'callback'            => 'cutout_get_settings',
        'permission_callback' => '__return_true',
    ]);
    register_rest_route('cutout/v1', '/menu/(?P<slug>[a-zA-Z0-9-_]+)', [
        'methods'             => 'GET',
        'callback'            => 'cutout_get_menu',
        'permission_callback' => '__return_true',
        'args' => ['slug' => ['required' => true]],
    ]);
    register_rest_route('cutout/v1', '/page/(?P<slug>[a-zA-Z0-9-_]+)', [
        'methods'             => 'GET',
        'callback'            => 'cutout_get_page',
        'permission_callback' => '__return_true',
    ]);
    register_rest_route('cutout/v1', '/service/(?P<slug>[a-zA-Z0-9-_]+)', [
        'methods'             => 'GET',
        'callback'            => 'cutout_get_service',
        'permission_callback' => '__return_true',
    ]);
}

function cutout_get_settings() {
    $fields = function_exists('get_fields') ? (get_fields('option') ?: []) : [];
    return rest_ensure_response([
        'site_name'        => get_bloginfo('name'),
        'site_description' => get_bloginfo('description'),
        'site_url'         => get_site_url(),
        'all_fields'       => $fields,
    ]);
}

function cutout_build_menu_tree($items, $parent_id = 0) {
    $branch = [];
    foreach ($items as $item) {
        if ((int)$item->menu_item_parent !== $parent_id) continue;
        $branch[] = [
            'id'       => $item->ID,
            'title'    => $item->title,
            'url'      => $item->url,
            'target'   => $item->target ?: '_self',
            'children' => cutout_build_menu_tree($items, $item->ID),
        ];
    }
    return $branch;
}

function cutout_get_menu($request) {
    $slug = $request->get_param('slug');
    $locations = get_nav_menu_locations();
    $menu_obj  = null;
    if (!empty($locations[$slug])) {
        $menu_obj = wp_get_nav_menu_object($locations[$slug]);
    }
    if (!$menu_obj) {
        $menu_obj = wp_get_nav_menu_object($slug);
    }
    if (!$menu_obj) {
        foreach (wp_get_nav_menus() as $m) {
            if (strtolower($m->name) === strtolower($slug)) {
                $menu_obj = $m;
                break;
            }
        }
    }
    if (!$menu_obj) return rest_ensure_response([]);
    $items = wp_get_nav_menu_items($menu_obj->term_id);
    if (!$items) return rest_ensure_response([]);
    return rest_ensure_response(cutout_build_menu_tree($items));
}

function cutout_post_response($post) {
    $sections = [];
    if (function_exists('get_fields')) {
        $acf = get_fields($post->ID) ?: [];
        $sections = isset($acf['section_type']) ? $acf['section_type'] : [];
    }
    $seo = [
        'title'          => get_post_meta($post->ID, '_yoast_wpseo_title', true) ?: $post->post_title,
        'description'    => get_post_meta($post->ID, '_yoast_wpseo_metadesc', true) ?: '',
        'og_title'       => get_post_meta($post->ID, '_yoast_wpseo_opengraph-title', true) ?: '',
        'og_description' => get_post_meta($post->ID, '_yoast_wpseo_opengraph-description', true) ?: '',
        'og_image'       => get_post_meta($post->ID, '_yoast_wpseo_opengraph-image', true) ?: '',
    ];
    return rest_ensure_response([
        'page'     => ['id' => $post->ID, 'title' => $post->post_title],
        'sections' => $sections,
        'seo'      => $seo,
    ]);
}

function cutout_get_page($request) {
    $slug = $request->get_param('slug');
    $page = get_page_by_path($slug, OBJECT, 'page');
    if (!$page) {
        return new WP_Error('not_found', 'Page not found: ' . $slug, ['status' => 404]);
    }
    return cutout_post_response($page);
}

function cutout_get_service($request) {
    $slug  = $request->get_param('slug');
    $query = new WP_Query([
        'post_type'      => ['services', 'service'],
        'name'           => $slug,
        'posts_per_page' => 1,
        'post_status'    => 'publish',
    ]);
    if (empty($query->posts)) {
        return new WP_Error('not_found', 'Service not found: ' . $slug, ['status' => 404]);
    }
    return cutout_post_response($query->posts[0]);
}

/* ======================================================
   BLOG ENDPOINTS (added)
   ====================================================== */

add_action('rest_api_init', 'cutout_register_blog_routes');

function cutout_register_blog_routes() {
    register_rest_route('cutout/v1', '/blog-posts', [
        'methods'             => 'GET',
        'callback'            => 'cutout_get_blog_posts',
        'permission_callback' => '__return_true',
    ]);
    register_rest_route('cutout/v1', '/posts', [
        'methods'             => 'GET',
        'callback'            => 'cutout_get_blog_posts',
        'permission_callback' => '__return_true',
    ]);
    register_rest_route('cutout/v1', '/post/(?P<slug>[a-zA-Z0-9-_]+)', [
        'methods'             => 'GET',
        'callback'            => 'cutout_get_single_post',
        'permission_callback' => '__return_true',
    ]);
}

function cutout_get_blog_posts($request) {
    $page     = max(1, (int)($request->get_param('page') ?: 1));
    $per_page = max(1, (int)($request->get_param('per_page') ?: 9));
    $category = $request->get_param('category');
    $search   = $request->get_param('search');

    $args = [
        'post_type'      => 'post',
        'post_status'    => 'publish',
        'posts_per_page' => $per_page,
        'paged'          => $page,
        'orderby'        => 'date',
        'order'          => 'DESC',
    ];
    if ($category) $args['cat'] = (int)$category;
    if ($search)   $args['s']   = sanitize_text_field($search);

    $query = new WP_Query($args);
    $posts = [];

    foreach ($query->posts as $post) {
        $image    = get_the_post_thumbnail_url($post->ID, 'large') ?: '';
        $cats     = get_the_category($post->ID);
        $cat_name = $cats ? $cats[0]->name : '';

        $posts[] = [
            'id'       => $post->ID,
            'slug'     => $post->post_name,
            'title'    => $post->post_title,
            'image'    => $image,
            'category' => $cat_name,
        ];
    }

    return rest_ensure_response([
        'posts'      => $posts,
        'totalPages' => (int)($query->max_num_pages ?: 1),
        'total'      => (int)$query->found_posts,
    ]);
}

function cutout_get_single_post($request) {
    $slug  = $request->get_param('slug');
    $posts = get_posts([
        'name'        => $slug,
        'post_type'   => 'post',
        'post_status' => 'publish',
        'numberposts' => 1,
    ]);
    if (empty($posts)) {
        return new WP_Error('not_found', 'Post not found: ' . $slug, ['status' => 404]);
    }
    $post  = $posts[0];
    $image = get_the_post_thumbnail_url($post->ID, 'full') ?: '';
    $cats  = get_the_category($post->ID);

    return rest_ensure_response([
        'id'       => $post->ID,
        'slug'     => $post->post_name,
        'title'    => ['rendered' => $post->post_title],
        'content'  => ['rendered' => apply_filters('the_content', $post->post_content)],
        'excerpt'  => ['rendered' => apply_filters('the_excerpt', $post->post_excerpt)],
        'image'    => $image,
        'category' => $cats ? $cats[0]->name : '',
        'date'     => $post->post_date,
    ]);
}
