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

function cutout_get_all_services() {
    $posts = get_posts([
        'post_type'      => ['services', 'service'],
        'post_status'    => 'publish',
        'posts_per_page' => -1,
        'orderby'        => 'menu_order title',
        'order'          => 'ASC',
    ]);
    return array_map(function($post) {
        return ['value' => (string)$post->ID, 'label' => $post->post_title];
    }, $posts);
}

function cutout_get_settings() {
    $fields = function_exists('get_fields') ? (get_fields('option') ?: []) : [];
    // Always populate select_services from published service posts — not the ACF field
    // (ACF field data was lost when theme was updated; CPT posts are the source of truth)
    $fields['select_services'] = cutout_get_all_services();
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

/* ======================================================
   CONTACT FORM ENDPOINT
   ====================================================== */

add_action('rest_api_init', 'cutout_register_contact_routes');

function cutout_register_contact_routes() {
    register_rest_route('cutout/v1', '/contact-form', [
        'methods'             => 'POST',
        'callback'            => 'cutout_handle_contact_form',
        'permission_callback' => '__return_true',
    ]);
}

function cutout_handle_contact_form($request) {
    $name       = sanitize_text_field($request->get_param('name') ?: '');
    $email      = sanitize_email($request->get_param('email') ?: '');
    $phone      = sanitize_text_field($request->get_param('phone') ?: '');
    $website    = esc_url_raw($request->get_param('website') ?: '');
    $service    = sanitize_text_field($request->get_param('service') ?: '');
    $message    = sanitize_textarea_field($request->get_param('message') ?: '');
    $cloud_link = esc_url_raw($request->get_param('cloudLink') ?: '');

    if (empty($name) || empty($email) || empty($message)) {
        return new WP_Error('validation_error', 'Name, email, and message are required.', ['status' => 400]);
    }

    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Please provide a valid email address.', ['status' => 400]);
    }

    // Recipient: use ACF contact_email field or fall back to WP admin email
    $fields = function_exists('get_fields') ? (get_fields('option') ?: []) : [];
    $to     = !empty($fields['contact_email']) ? $fields['contact_email'] : get_option('admin_email');

    $subject = "New Contact Form Submission from {$name}";

    $body  = "<h2>New Contact Form Submission</h2><table cellpadding='8'>";
    $body .= "<tr><td><strong>Name:</strong></td><td>{$name}</td></tr>";
    $body .= "<tr><td><strong>Email:</strong></td><td>{$email}</td></tr>";
    if ($phone)      $body .= "<tr><td><strong>Phone:</strong></td><td>{$phone}</td></tr>";
    if ($website)    $body .= "<tr><td><strong>Website:</strong></td><td>{$website}</td></tr>";
    if ($service)    $body .= "<tr><td><strong>Service:</strong></td><td>{$service}</td></tr>";
    $body .= "<tr><td><strong>Message:</strong></td><td>" . nl2br(esc_html($message)) . "</td></tr>";
    if ($cloud_link) $body .= "<tr><td><strong>Cloud Link:</strong></td><td><a href='" . esc_url($cloud_link) . "'>" . esc_html($cloud_link) . "</a></td></tr>";
    $body .= "</table>";

    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        "Reply-To: {$name} <{$email}>",
    ];

    // Handle file attachments
    $attachments  = [];
    $temp_files   = [];
    if (!empty($_FILES)) {
        $upload_dir = wp_upload_dir();
        $temp_dir   = trailingslashit($upload_dir['basedir']) . 'contact-form-temp/';
        if (!file_exists($temp_dir)) wp_mkdir_p($temp_dir);

        foreach ($_FILES as $file) {
            $names     = is_array($file['name'])     ? $file['name']     : [$file['name']];
            $tmp_names = is_array($file['tmp_name']) ? $file['tmp_name'] : [$file['tmp_name']];
            $errors    = is_array($file['error'])    ? $file['error']    : [$file['error']];

            foreach ($names as $i => $original_name) {
                if ($errors[$i] !== UPLOAD_ERR_OK) continue;
                $safe_name  = sanitize_file_name($original_name);
                $temp_path  = $temp_dir . time() . '_' . $i . '_' . $safe_name;
                if (move_uploaded_file($tmp_names[$i], $temp_path)) {
                    $attachments[] = $temp_path;
                    $temp_files[]  = $temp_path;
                }
            }
        }
    }

    $sent = wp_mail($to, $subject, $body, $headers, $attachments);

    // Clean up temp files
    foreach ($temp_files as $f) {
        if (file_exists($f)) @unlink($f);
    }

    if (!$sent) {
        return new WP_Error('mail_error', 'Failed to send email. Please try again or contact us directly.', ['status' => 500]);
    }

    return rest_ensure_response(['success' => true, 'message' => 'Message sent successfully.']);
}

/* ======================================================
   ACF OPTIONS PAGE REGISTRATION (was in functions.php)
   ====================================================== */

add_action('acf/init', 'cutout_register_options_pages');

function cutout_register_options_pages() {
    if (!function_exists('acf_add_options_page')) return;

    acf_add_options_sub_page([
        'page_title'  => 'Theme General Settings',
        'menu_title'  => 'Theme General Settings',
        'menu_slug'   => 'general-settings',
        'parent_slug' => 'theme-option',
        'capability'  => 'manage_options',
        'icon_url'    => 'dashicons-admin-settings',
        'position'    => 2,
        'redirect'    => false,
        'post_id'     => 'options',
        'autoload'    => true,
    ]);
}
