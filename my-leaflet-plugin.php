<?php

/**
 * Plugin Name: My Leaflet Map Plugin
 * Description: A simple plugin to display GPX tracks on a Leaflet map.
 * Version: 1.0
 * Author: Hiroshi Ozeki
 */

function my_leaflet_map_enqueue_scripts()
{
    wp_enqueue_style('leaflet-css', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
    wp_enqueue_script('leaflet-js', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', array(), null, true);
    wp_enqueue_script('exif-js', 'https://cdn.jsdelivr.net/npm/exif-js', array(), null, true); 
    wp_enqueue_script('leaflet-gpx-js', 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.7.0/gpx.min.js', array('leaflet-js'), null, true);
    wp_enqueue_script('my-leaflet-map-js', plugin_dir_url(__FILE__) . 'assets/js/my-leaflet-map-v1.0.18.js', array('leaflet-js', 'leaflet-gpx-js'), null, true);
}

add_action('wp_enqueue_scripts', 'my_leaflet_map_enqueue_scripts');

function my_leaflet_map_shortcode()
{
    $html = '<div id="my-leaflet-map" style="height: 450px;"></div>';
    return $html;
}

add_shortcode('my_leaflet_map', 'my_leaflet_map_shortcode');
