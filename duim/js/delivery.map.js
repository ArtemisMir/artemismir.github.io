
ymaps.ready(init_deliverymap)

var moscowCenter = [37.617708,55.755781];

function init_deliverymap() {

	let map = new ymaps.Map('deliverymap', {
		center: moscowCenter,
		zoom: 8,
		controls: ['zoomControl', 'rulerControl', 'trafficControl', 'geolocationControl', 'fullscreenControl'],
	});

    map.behaviors.disable("scrollZoom");
    
    let obl1 = new ymaps.Circle([
        // Координаты центра круга.
        moscowCenter,
        // Радиус круга в метрах.
        40000
    ], {
        // Описываем свойства круга.
        // Содержимое балуна.
        balloonContent: "490 руб. до 40км от центра Москвы",
        // Содержимое хинта.
        hintContent: "490 руб. до 40км от центра Москвы"
    }, {
        // Задаем опции круга.
        // Включаем возможность перетаскивания круга.
        draggable: false,
        // Цвет заливки.
        // Последний байт (77) определяет прозрачность.
        // Прозрачность заливки также можно задать используя опцию "fillOpacity".
        fillColor: "#00993344",
        // Цвет обводки.
        strokeColor: "#009933",
        // Прозрачность обводки.
        strokeOpacity: 0.8,
        // Ширина обводки в пикселях.
        strokeWidth: 1,
        zIndex:10
    });
    
    let obl2 = new ymaps.Circle([
        // Координаты центра круга.
        moscowCenter,
        // Радиус круга в метрах.
        70000
    ], {
        // Описываем свойства круга.
        // Содержимое балуна.
        balloonContent: "990 руб. до 70км от центра Москвы",
        // Содержимое хинта.
        hintContent: "990 руб. до 70км от центра Москвы"
    }, {
        // Задаем опции круга.
        // Включаем возможность перетаскивания круга.
        draggable: false,
        // Цвет заливки.
        // Последний байт (77) определяет прозрачность.
        // Прозрачность заливки также можно задать используя опцию "fillOpacity".
        fillColor: "#ffcc6644",
        // Цвет обводки.
        strokeColor: "#ffcc66",
        // Прозрачность обводки.
        strokeOpacity: 0.8,
        // Ширина обводки в пикселях.
        strokeWidth: 1,
        zIndex:9
    });
    
    let obl3 = new ymaps.Circle([
        // Координаты центра круга.
        moscowCenter,
        // Радиус круга в метрах.
        110000
    ], {
        // Описываем свойства круга.
        // Содержимое балуна.
        balloonContent: "1490 руб. до 110км от центра Москвы",
        // Содержимое хинта.
        hintContent: "1490 руб. до 110км от центра Москвы"
    }, {
        // Задаем опции круга.
        // Включаем возможность перетаскивания круга.
        draggable: false,
        // Цвет заливки.
        // Последний байт (77) определяет прозрачность.
        // Прозрачность заливки также можно задать используя опцию "fillOpacity".
        fillColor: "#DB709344",
        // Цвет обводки.
        strokeColor: "#990066",
        // Прозрачность обводки.
        strokeOpacity: 0.8,
        // Ширина обводки в пикселях.
        strokeWidth: 1,
        zIndex:8
    });

    map.geoObjects
		.add(obl1)
		.add(obl2)
		.add(obl3)
    ;

    function convertGeoJsonToYmapsJson(v) {
        let out = {
            type: 'FeatureCollection',
            features: []
        };
        v.geometry.geometries.forEach(function(item, i, arr) {
            out.features.push({
            type: 'Feature',
            geometry: item,
            properties: v.properties,
            options: v.options
                }); 
        });
        return out;
    }
   
    jQuery.getJSON('/js/json/oldmoscow.json', function (json) {
        ymaps.geoQuery(convertGeoJsonToYmapsJson(json)).addToMap(map);
    });

    jQuery.getJSON('/js/json/khimki.json', function (json) {
        ymaps.geoQuery(convertGeoJsonToYmapsJson(json)).addToMap(map);
    });

}
