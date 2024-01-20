document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('my-leaflet-map').setView([35.6895, 139.6917], 13); // 東京の座標をデフォルトに設定

    // ベースマップレイヤーを追加
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // GPXレイヤーを追加する関数
function addGpxLayer(url, color, name) {
    var gpxLayer = new L.GPX(url, {
        async: true,
        polyline_options: {
            color: color,
            weight: 5,
            opacity: 0.7
        },
        name: name  // ルートの名前を保存
    }).on('loaded', function(e) {
        map.fitBounds(e.target.getBounds());
    }).addTo(map);

    // レイヤーにクリックイベントを追加
    gpxLayer.on('click', function() {
        // 他のGPXレイヤーを非表示にする
        map.eachLayer(function(layer) {
            if (layer instanceof L.GPX && layer !== gpxLayer) {
                map.removeLayer(layer);
            }
        });
        // クリックされたGPXレイヤーを再表示
        gpxLayer.addTo(map);
    });
    // 地図全体にクリックイベントを追加
    map.on('click', function() {
    // 全てのGPXレイヤーを表示
        map.eachLayer(function(layer) {
            if (layer instanceof L.GPX) {
                layer.addTo(map);
            }
        });
    });
}
   // 10個までのGPXファイルを異なる色で表示
   addGpxLayer('assets/data/first.gpx', 'blue');
   addGpxLayer('assets/data/second.gpx', 'red');
   addGpxLayer('assets/data/third.gpx', 'green');
   addGpxLayer('assets/data/fourth.gpx', 'orange');
   addGpxLayer('assets/data/fifth.gpx', 'purple');
   addGpxLayer('assets/data/sixth.gpx', 'yellow');
   addGpxLayer('assets/data/seventh.gpx', 'cyan');
   addGpxLayer('assets/data/eighth.gpx', 'magenta');
   addGpxLayer('assets/data/ninth.gpx', 'gray');
   addGpxLayer('assets/data/tenth.gpx', 'brown');
});