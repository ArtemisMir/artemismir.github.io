ymaps.ready(init);

function init() {
	let map = new ymaps.Map('map-instock', {
		center: [55.919809, 37.419909],
		zoom: 13,
		controls: ['zoomControl', 'rulerControl', 'trafficControl', 'geolocationControl', 'fullscreenControl'],
	});

	let collection = new ymaps.GeoObjectCollection(null, {
		preset: 'islands#darkBlueDotIcon',
		iconColor: '#004b8d'
	});

	$('.placemark-item').each(function(){
		collection.add(new ymaps.Placemark([$(this).data('latitude'), $(this).data('longitude')], {
			balloonContentBody: $(this).html(),
			id: $(this).data('placemark-id')
		}))
	});

	window.myObjects = collection
	map.geoObjects.add(collection);

	$('[data-target="#target-instock-2"]').bind("change", function() {
		setTimeout(function(){ map.container.fitToViewport();}, 200);
	});

	collection.events.add('click', function (e) {
		var target = e.get('target')
		var id = target.properties.get('id')
		activatePlacemark(id);

	});

	$("[data-placemark-id]").click(function(){
		var id = $(this).data('placemark-id')
		activatePlacemark(id);
		collection.each(function (e) {
			var serchId = e.properties.get('id')
			if(serchId == id)
			{
				map.setZoom(13, {duration: 0});
				map.panTo(e.geometry.getCoordinates(), {flying: true})
			}
		});
	});

	function activatePlacemark(id)
	{
		var activate = $('.placemark-item[data-placemark-id="' + id + '"]')
		$('.placemark-item').removeClass('active')
		activate.addClass('active')
		$('[data-placemark-id="' + id + '"]').addClass('active')
		setTimeout(function(){ 
			activate.parent()[0].scrollTop = activate[0].offsetTop;
			map.container.fitToViewport();
		}, 200);
	}
}