<?php
/**
 * Plugin Name: My Leaflet Map Plugin
 * Description: A simple plugin to display GPX tracks on a Leaflet map.
 * Version: 1.0
 * Author: Your Name
 */

function my_leaflet_map_enqueue_scripts() {
    // Leaflet CSS
    wp_enqueue_style('leaflet-css', 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css');
    
    // Leaflet JavaScript
    wp_enqueue_script('leaflet-js', 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js', array(), null, true);

    // leaflet-gpx JavaScript
    wp_enqueue_script('leaflet-gpx-js', 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.6.0/gpx.js', array('leaflet-js'), null, true);

    // Your custom JS for the map
    wp_enqueue_script('my-leaflet-map-js', plugin_dir_url(__FILE__) . 'my-leaflet-map.js', array('leaflet-js', 'leaflet-gpx-js'), null, true);
}

add_action('wp_enqueue_scripts', 'my_leaflet_map_enqueue_scripts');

function my_leaflet_map_shortcode() {
    $html = '<div id="my-leaflet-map" style="height: 400px;"></div>';
    return $html;
}

add_shortcode('my_leaflet_map', 'my_leaflet_map_shortcode');