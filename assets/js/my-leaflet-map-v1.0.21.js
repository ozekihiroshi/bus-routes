document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('my-leaflet-map').setView([-24.6282, 25.9231], 13); // ボツワナ・ハボロネの座標

    var greenIcon = L.icon({
        iconUrl: 'leaf-green.png',
        shadowUrl: 'leaf-shadow.png',
        iconSize: [38, 95], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });


    //var map = L.map('my-leaflet-map').setView([35.6895, 139.6917], 13); // 東京の座標をデフォルトに設定

    // ベースマップレイヤーを追加
    //        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //          maxZoom: 19,
    //         attribution: '© OpenStreetMap contributors'
    //    }).addTo(map);


    //	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    //    maxZoom: 18,
    //    id: 'mapbox/streets-v11', // または他のスタイル
    //    tileSize: 512,
    //    zoomOffset: -1,
    //    accessToken: 'あなたのMapboxアクセストークン'
    //}).addTo(map);

    googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map);;

    //
    //	L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
    //   maxZoom: 20,
    //  subdomains: 'abcd',
    //  ext: 'png'
    //}).addTo(map);

    //	L.tileLayer('https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey={apiKey}', {
    //   maxZoom: 22,
    //   apiKey: 'あなたのThunderforest APIキー'
    //}).addTo(map);

    var gpxLayers = [];
    // 地図全体にクリックイベントを追加
    map.on('click', function () {
        gpxLayers.forEach(function (layer) {
            if (!map.hasLayer(layer)) {
                map.addLayer(layer);
            }
        });
    });

    // GPXレイヤーを追加する関数
    function addGpxLayer(url, color, name = '') {
        var gpxLayer = new L.GPX(url, {
            async: true,
            marker_options: {
                startIconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.5.0/pin-icon-start.png',
                endIconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.5.0/pin-icon-end.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.5.0/pin-shadow.png'
            },
            polyline_options: {
                color: color,
                weight: 5,
                opacity: 0.7
            },
            name: name  // ルートの名前を保存
        }).on('loaded', function (e) {
            map.fitBounds(e.target.getBounds());
        }).addTo(map);

        gpxLayers.push(gpxLayer); // レイヤーを配列に追加

        // レイヤーにクリックイベントを追加
        gpxLayer.on('click', function (e) {
            // 他のGPXレイヤーを非表示にする
            map.eachLayer(function (layer) {
                if (layer instanceof L.GPX && layer !== gpxLayer) {
                    map.removeLayer(layer);
                }
            });
            // クリックされたGPXレイヤーを再表示
            gpxLayer.addTo(map);
            L.DomEvent.stopPropagation(e); // 地図のクリックイベントへの伝播を止める
        });
    }

    // 10個までのGPXファイルを異なる色で表示
    addGpxLayer('../../../../../wp-content/uploads/cm-maps-routes-manager/imports/1705855274085-21_01_24_GameCityToBusRank.gpx', 'blue', '');
    addGpxLayer('../../../../../wp-content/uploads/cm-maps-routes-manager/imports/1705867556320-21_01_24_BusRankToGameCity.gpx', 'red', '');
    addGpxLayer('../../../../../wp-content/uploads/cm-maps-routes-manager/imports/1706372240227-27_01_24.gpx', 'blue', '');
    addGpxLayer('../../../../../wp-content/uploads/cm-maps-routes-manager/imports/1706372456313-27_01_24_2.gpx', 'red', '');
    //addGpxLayer('../../assets/data/first.gpx', 'blue');
    //addGpxLayer('../../assets/data/second.gpx', 'red');
    //addGpxLayer('../../assets/data/third.gpx', 'green');
    //addGpxLayer('../../assets/data/fourth.gpx', 'orange');
    //addGpxLayer('../../assets/data/fifth.gpx', 'purple');
    //addGpxLayer('../../assets/data/sixth.gpx', 'yellow');
    //addGpxLayer('../../assets/data/seventh.gpx', 'cyan');
    //addGpxLayer('../../assets/data/eighth.gpx', 'magenta');
    //addGpxLayer('../../assets/data/ninth.gpx', 'gray');
    //addGpxLayer('../../assets/data/tenth.gpx', 'brown');

    // 画像のURL
    //var imageUrl = 'https://www.game-city.fun/wp-content/uploads/cm-maps-routes-manager/imaes/2024-01-20_20-43-31_932734_IMG_2509-scaled.jpg';
    //var imageUrl = 'https://www.game-city.fun/wp-content/uploads/2024/01/IMG_2541-1-scaled.jpg';
    var imageUrl = 'https://www.game-city.fun/wp-content/uploads/cm-maps-routes-manager/images/2024-01-22_16-55-51_437926_IMG_2542-scaled.jpg';
    // 地図が読み込まれた後に緯度経度を取得してマーカーを追加する
    processCoordinates(imageUrl);

    // 緯度と経度を抽出する関数
    async function getCoordinatesFromImage(url) {
        try {
            const base64 = await getBase64FromImageUrl(url);
            const coordinates = await getEXIFData(base64);
            console.log("coordinates:", coordinates);
            return coordinates;
        } catch (error) {
            console.error('error:', error);
            throw error;
        }
    }

    // 画像のURLからBase64を取得する関数（修正済み）
    async function getBase64FromImageUrl(url) {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    // Base64からEXIF情報を取得して緯度経度を返す関数
    function getEXIFData(base64) {
        return new Promise((resolve, reject) => {
            // Base64文字列からBlobオブジェクトを生成
            const byteString = atob(base64.split(',')[1]);
            const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });

            // EXIFデータを取得
            EXIF.getData(blob, function () {
                const exifData = EXIF.getAllTags(this);
                const latitude = exifData.GPSLatitude;
                const longitude = exifData.GPSLongitude;
                const latitudeRef = exifData.GPSLatitudeRef; // 緯度参照
                const longitudeRef = exifData.GPSLongitudeRef; // 経度参照
                // 緯度経度の方向に基づいてプラスまたはマイナスの乗算を行う
                const latitudeValue = latitudeRef === 'S' ? -latitude : latitude;
                const longitudeValue = longitudeRef === 'W' ? -longitude : longitude;
                if (latitude && longitude) {
                    const coordinates = {
                        lat: convertDMSToDD(latitude),
                        lng: convertDMSToDD(longitude)
                    };
                    resolve(coordinates);
                } else {
                    reject("Latitude and/or longitude not found in EXIF data.");
                }
            });
        });
    }

    // 度分秒 (DMS) を10進数 (DD) に変換する関数
    function convertDMSToDD(dmsArray) {
        return dmsArray[0] + dmsArray[1] / 60 + dmsArray[2] / 3600;
    }

    // 緯度と経度をセットする関数
    function setCoordinates(lat, lng) {
        var popupContent = '<h3>Place of Photo</h3>';
        popupContent += '<p>Latitude: ' + lat + '</p>';
        popupContent += '<p>Longitude: ' + lng + '</p>';
        // マップ上にマーカーを追加してポップアップを表示
        var marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(popupContent).openPopup();
    }

    // 緯度と経度を外部の変数にセットする関数
    async function processCoordinates(imageUrl) {
        try {
            const temp = await getCoordinatesFromImage(imageUrl);
            const latitude = temp.lat;
            const longitude = temp.lng;
            setCoordinates(latitude, longitude);
        } catch (error) {
            console.error('error:', error);
        }
    }

});
