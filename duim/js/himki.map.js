ymaps.ready(init);

function init() {
	var myMap2 = new ymaps.Map('map-himki', {
		center: [55.919809, 37.419909],
		zoom: 10,
		controls: ['smallMapDefaultSet']
	});

	var placemark_himki = new ymaps.Placemark([55.919809, 37.419909], {
		hintContent: '141400, Московская область, г. Химки, Вашутинское шоссе, вл. 36',
		balloonContent: '141400, Московская область, г. Химки, Вашутинское шоссе, вл. 36'
	}, {
		iconLayout: 'default#image',/*Необходимо указать данный тип макета*/
		iconImageHref: 'https://www21.duim24.ru/v2.1/images/logo_duim_for_yamaps.png',/*Своё изображение иконки метки*/
		iconImageSize: [160, 31], /*Своё изображение иконки метки*/
		iconImageOffset: [-80, -31], /*Смещение левого верхнего угла иконки относительно её "ножки" (точки привязки)*/
		balloonCloseButton: true,
		hideIconOnBalloonOpen : true
	});

	myMap2.geoObjects.add(placemark_himki);
	myMap2.behaviors.disable("scrollZoom");
}