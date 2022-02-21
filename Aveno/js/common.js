
document.addEventListener('DOMContentLoaded', function() {
	$('.filter__select').selectpicker();
	window.topProductSlider = new Swiper('.top_product__slider', {
		
		loop: false,
		slidesPerView: 1,
		spaceBetween: 50,
		parallax : true,
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		breakpoints: {
			768: { slidesPerView: 2 },
			992: { slidesPerView: 3 }
		},
	})
	if($('.product__slider').length > 0)
	window.catalogProductSlider = new Swiper('.product__slider__swiper', {
		slidesPerView: getCssVar('.product__slider__swiper', '--swiper-rows') || 3, // Сколько горизонтальных рядов
		slidesPerGroup: 3, // По сколько горизонтатльных рядов пролистывать
		grid: {
			rows: getCssVar('.product__slider__swiper', '--swiper-columns') || 2 // Вертикальных рядов
		},
	  breakpoints: {
			// when window width is >= 1200px
			992: {
				slidesPerGroup: 3,
				grid: {
					rows: getCssVar('.product__slider__swiper', '--swiper-columns') || 4,
				},
			}
		},
		// pagination: {
		// 	el: '.product__slider__pagination__js',
		// 	clickable: false,
		// },
		spaceBetween: getCssVar('.product__slider__swiper', '--swiper-spaceetween') || 30,
		direction: 'vertical',
		allowTouchMove: false,
		navigation: {
			nextEl: '.product__slider__nav_down',
			prevEl: '.product__slider__nav_up',
		},
		on: {
			beforeInit: function (swiper) {
				recountGridProductSlider(swiper)
				swiper.loadedPages = 1
				swiper.loaded = false
			},
			afterInit: function(swiper) {
				recountSlidesCatalodSlider (swiper)
				updatePaginationCatalogSlider (swiper)
				getCatalogSlider (swiper)
				swiper.myTotalOld = swiper.myTotal
			},
			slideChange: function (swiper) {
				recountSlidesCatalodSlider (swiper)
				updatePaginationCatalogSlider (swiper)
			},
			slideChangeTransitionEnd: function (swiper) {
				getCatalogSlider (swiper)
			},
			slidesLengthChange: function (swiper) {
				recountGridProductSlider(swiper)
				recountSlidesCatalodSlider (swiper)

				if(swiper.myTotalOld == swiper.myTotal) {
					if(!swiper.loaded) getCatalogSlider (swiper)
				}
				else swiper.myTotalOld = swiper.myTotal
			},
			breakpoint: function (swiper) {
				recountGridProductSlider (swiper)
			}

		},
	});

	$('.menu-open-js').click(function () { 
		$('.navbar').toggleClass('active')
	});

	// $('.filter__select_js').selectize({})
	
	// var app = new Vue({
	// 	el: '#app',
	// 	data: {
	// 		menuOpen: false
	// 	}
	// })

})

function updatePaginationCatalogSlider (swiper) {
		
	$('.product__slider__pagination__js').each(function (index, element) {
		const bullets = $(element).find('.swiper-pagination-bullet')
		bullets.removeClass('swiper-pagination-bullet-active')
		$(bullets[swiper.myCurrent-1]).addClass('swiper-pagination-bullet-active')
	});

}
function recountSlidesCatalodSlider (swiper) {
	const productsOnPage = swiper.params.slidesPerGroup * swiper.params.grid.rows
	swiper.myTotal = Math.ceil(swiper.slides.length / productsOnPage)
	swiper.myCurrent = Math.ceil(swiper.realIndex / swiper.params.slidesPerGroup) + 1
}

var queryCounter = 0;
function getCatalogSlider (swiper) {
	
	if(!swiper.loaded) {

		console.log('---')
		console.log("Всего страниц " + swiper.myTotal)
		console.log("realIndex " + swiper.myCurrent)

		const step = 1

		if(swiper.myCurrent >= swiper.myTotal - step) {

			let page = swiper.loadedPages + 1
			if(page > 30)  return

			console.log('Запрос страницы ' + page)

			$.get( 'query/catalog'+queryCounter+'.html', { page: page } )
				.done(function(data) {
					if(!data) {
						console.log('Страницы закончились')
						swiper.loaded = true
					}
					else {
						swiper.loadedPages++
						swiper.appendSlide(data)
					}
					queryCounter++
				})
		}
	}
}

function getCssVar(element, variable) {
	return parseInt(getComputedStyle($(element)[0]).getPropertyValue(variable))
}
function recountGridProductSlider (swiper) {
	$('.product__slider__swiper').css('--swiper-rows', '')
	const itemsInRow = getCssVar('.product__slider__swiper', '--swiper-columns') || 4
	const initCount = getCssVar('.product__slider__swiper', '--swiper-rows') || 3
	const newCount = Math.ceil($('.product__slider__swiper .swiper-slide').length / itemsInRow)

	if( newCount <= initCount) {
		$('.product__slider__swiper').css('--swiper-rows', newCount)
		if(swiper) {
			swiper.params.slidesPerView = newCount
		}
	}
	swiper.params.grid.rows = itemsInRow
	swiper.update()
}