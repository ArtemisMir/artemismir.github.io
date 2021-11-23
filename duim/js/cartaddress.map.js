
ymaps.ready(init_map_address)

function init_map_address() {
	let map = new ymaps.Map('map-address', {
		center: [55.919809, 37.419909],
		zoom: 13,
		controls: ['zoomControl', 'rulerControl', 'trafficControl', 'geolocationControl', 'fullscreenControl'],
		behaviors: ['drag']
	});

	let behaviors = $(window).width() >= 992 ? ['drag', 'dblClickZoom', 'rightMouseButtonMagnifier'] : ['dblClickZoom', 'multiTouch'];
	let map2 = new ymaps.Map('map-samovivoz', {
		center: [55.919809, 37.419909],
		zoom: 13,
		controls: ['zoomControl', 'rulerControl', 'trafficControl', 'geolocationControl', 'fullscreenControl'],
		behaviors: behaviors
	});
	
}