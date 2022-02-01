document.addEventListener('DOMContentLoaded', function() {

	const swiper = new Swiper('.product_slider', {
		
		loop: false,
		slidesPerView: "auto",
		spaceBetween: 50,
		grabCursor: true,
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
	
	});

	$('.menu-open-js').click(function () { 
		$('.navbar').toggleClass('active')
	});

	// var app = new Vue({
	// 	el: '#app',
	// 	data: {
	// 		menuOpen: false
	// 	}
	// })

})
