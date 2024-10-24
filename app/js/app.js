document.addEventListener("DOMContentLoaded", function() {

$('.magnific-image').magnificPopup({
	type: 'image',
	image: {
		titleSrc: 'title',
	},
	gallery: {
		enabled: true,
		preload: [0,2],
	},
	removalDelay: 0,
	mainClass: 'mfp-with-zoom',
	fixedContentPos: true,
	zoom: {
		enabled: true,
		duration: 200,
		easing: 'ease-in-out',
	}
});


jQuery.expr[":"].Contains = jQuery.expr.createPseudo(function(arg) {
	return function( elem ) {
		return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
	};
});

$('.cd-nav-link').click(function(){
	if(smallDev()) return
	if(!$(this).parent().hasClass('has-children')) return
	$('.cd-nav-link').not(this).removeClass('active')
	$(this).toggleClass('active')
	if($(this).hasClass('active')) overlay_on()
	else overlay_off()
	return false
});

$('.has-children > a').click(function(){
	if(!smallDev()) return
	$(this).next('ul').addClass('active')
	return false
});

$('.go-back').click(function(){
	$(this).parent().removeClass('active')
	return false
});

$(".menu-button").click(function(){
	if(!smallDev()) return
	if($(this).hasClass('is-active'))
	{
		$(this).removeClass('is-active')
		$('.cd-nav ul').removeClass('active')
		overlay_off()
		$('body').removeClass('no-scroll')
		return
	}
	$(this).addClass('is-active')
	$('#cd-nav-main').addClass('active')
	overlay_on()
	$('body').addClass('no-scroll')
});

/*$('[data-menu]').click(function(){
	$($(this).data('menu')).parents().addClass('active')
	$($(this).data('menu')).addClass('active')
});*/

$('.overlay').click(function(){
	$('.cd-nav-link').removeClass('active')
	$('.search').removeClass('active')
	$('body').removeClass('no-scroll')
	$('.cart-bar').fadeOut('fast')
	$(".menu-button").removeClass('is-active')
	$('.cd-nav ul').removeClass('active')
	overlay_off()
});

function overlay_on() {$('.overlay').fadeIn(smallDev() ? 0 : 150)}
function overlay_off() {$('.overlay').fadeOut(smallDev() ? 0 : 150)}

$('.cd-nav-menu > .has-children > a').on('mousemove', function(event){
	if(smallDev()) return
	x = event.pageX,
	y = event.pageY;

	if(!inPoly()) {
		$('.cd-nav-menu > .has-children > a').not(this).removeClass('active');
		$(this).addClass('active');
	}

	x1 = x,
	y1 = y;
});

/*for cd-nav:*/
x = 0,
y = 0,
x1 = 0,
y1 = 0,
x2i = 0,
y2i = 0,
x3i = 0,
y3i = 0;
/*vec = new Array(0,0,0,0,0,0);*/
function inPoly(){
		var xp = new Array(x1,x2i,x3i),
		yp = new Array(y1,y2i,y3i),
		xcor = x+1;
		npol = xp.length;
		j = npol - 1;
		var c = false;
		for (i = 0; i < npol;i++){
			if ((((yp[i]<=y) && (y<yp[j])) || ((yp[j]<=y) && (y<yp[i]))) &&
				(xcor > (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) {
				c = true
		}
		j = i;
	}
	return c;
}

var envelope = $('.cd-nav-menu.catalog'),
envelope_h = envelope.height(),
eOffset = envelope.offset();

x2i = eOffset.left + envelope.outerWidth(),
y2i = eOffset.top,
x3i = x2i,
y3i = eOffset.top + envelope.outerHeight()*0.9;/*домножение на 0.6 - сократил конверт до снизу по высоте для более резкой реакции при траектории мышки в сторону 4-5 часов*/


$(window).scroll(function(){
	if($(this).scrollTop() > $(this).height()-100){
		$('.top').addClass('active');
	}
	else{
		$('.top').removeClass('active');
	}
});

$('.top').click(function(){
	smallDev() ? $('html, body').scrollTop(0) : $('html, body').stop().animate({scrollTop: 0}, 'fast', 'swing');
});

$("body").on('click', '.buy',function(){
	p = $(this).parents('.product-data');
	p.addClass('in-cart');

	console.log("PHP запрос отправлен: в корзину id:" + p.data('id') + " q:" + p.data('ed'));
});

$("body").on('click', '.product-delete',function(){
	p = $(this).parents('.product-data');
	p.removeClass('in-cart');
	p.find('.quantity').val(p.data('ed'));

	console.log("PHP запрос отправлен: удалить id:" + p.data('id'));
	return false;
});

var timer = {};
function check_quantity(th, i)
{
	p = $(th).parents('.product-data');
	q = p.find('.quantity');
	var new_q = Math.ceil(q.val()/p.data('ed')) * p.data('ed') + i * p.data('ed');
	if (new_q >= 0) q.val(new_q);
	else q.val('0');

	clearTimeout(timer[p.data('id')]);
	timer[p.data('id')] = setTimeout(function(p, q) {
		update_product_quantity(p.data('id'), q.val())
		if(q.val() == '0'){
			p.removeClass('in-cart');
			q.val(p.data('ed'));
		}
	}, 500, p, q);
}

$("body").on('click', '.count-down', function(){
	check_quantity(this, -1);
});

$("body").on('click', '.count-up',function(){
	check_quantity(this, 1);
});

$("body").on('change', '.quantity', function(){
	check_quantity(this, 0);
});

$("body").on('change keyup input', '.quantity', function(){
	if (this.value.match(/[^0-9]/g)) {
		this.value = this.value.replace(/[^0-9]/g, '');
	}
	if (this.value == '' || this.value < 0) {
		this.value = '';
	}
});

function update_product_quantity(id, q){
	console.log("PHP запрос отправлен: новое количество id:" + id + " q:" + q);
	//$.post( "/update_product_quantity.php", {product_id:id, q:q});
	animate('.in-cart-animate')
}

function animate(c) {
	$(c).removeClass('animate')
	setTimeout(function(){ $(c).addClass('animate') }, 50);
}

function smallDev() {
	var small_dev = $(window).width() >= 992 ? false : true;
	return small_dev;
}

$("body").on('click', '.filter-header', function(){
	$(this).toggleClass('active');
	if($(this).hasClass('active')) $(this).next('.filter-list').slideDown(0);
	else $(this).next('.filter-list').slideUp(0);
});

$("form.filter").submit(function(){
	filter_apply();
	return false;
});

$(".filter-reset").click(function(){
	$('form.filter input').prop('checked', false);
	filter_apply();
});

$(".filter-open").click(function(){ filter_open()} );
$(".filter-close").click(function(){ filter_apply()} );

function filter_apply()
{
	console.log("PHP запрос отправлен: " + decodeURI($('form.filter').serialize()));
	$('.filter').removeClass('active')
	$('body').removeClass('no-scroll')
	$('.filter-float').fadeOut(100);
	var filter_quantity = $('.filter-checkbox input:checked').length
	$('.filter-quantity').html(filter_quantity > 0 ? filter_quantity : '')
}
function filter_open()
{
	$('.filter').addClass('active')
	$('body').addClass('no-scroll')
}

var tm = 0;
$('.filter-checkbox input').on('change', function(){
	if($('.filter-checkbox input:checked').length > 0) {
		$('.filter-float').fadeIn(100);
		$('.filter-float').offset({top:$(this).parents('.filter-checkbox').offset().top});

		clearTimeout(tm);
		tm = setTimeout(function() {
			$('.filter-float').fadeOut(100);
		}, 4000);
	}
	else $('.filter-float').fadeOut(100);
});

$(".cart-open").click(function(){
	$('#modal-cart').modal('toggle')
});

$(".search-open").click(function(){
	$('.search').addClass('active')
	$('body').addClass('no-scroll')
	overlay_on();
	$('.search input').focus();
});
$(".search-clean").click(function(){
	$('.search input').val('')
	$(".search-result").hide()
	$('.search input').focus()
});

$("#search").submit(function(){
	search()
	return false;
});

stm = 0
$('#search input').on('keyup input', function(){
	clearTimeout(stm);
	stm = setTimeout(function() {
		search();
	}, 300);

});

function search()
{
	if($('.search input').val().length < 2) return;

	//alert("PHP запрос отправлен: "+decodeURI($('#search').serialize()))
	console.log("PHP запрос отправлен: "+($('#search').serialize()))

	if($('.search input').val().length > 1) // если результат поиска не пустой
		$(".search-result").show()
	else
		$(".search-result").hide()
}

jQuery(document).on('click',function (e) {
	if (jQuery(e.target).closest('.search-result').length) return;
	$(".search-result").hide()
});

$(".product-compare").click(function(){
	p = $(this).parents('.product-data');
	if($(this).hasClass('active'))
	{
		$(this).removeClass('active');
		console.log("PHP запрос отправлен: из списка сравнения id:" + p.data('id'));
	}
	else
	{
		$(this).addClass('active');
		console.log("PHP запрос отправлен: в список сравнения id:" + p.data('id'));
	}
});

$(".product-favorite").click(function(){
	p = $(this).parents('.product-data');
	if($(this).hasClass('active'))
	{
		$(this).removeClass('active');
		console.log("PHP запрос отправлен: из избранного id:" + p.data('id'));
	}
	else
	{
		$(this).addClass('active');
		console.log("PHP запрос отправлен: в избранное id:" + p.data('id'));
	}
});

$('.informer').popover({
	trigger: 'manual',
	container: 'body',
	content: function(){
		return $(this).hasClass('active') ? $(this).data('content-hidden') : $(this).data('content-active')
	},
	html: true,
})

$('.informer').mouseenter(function(){
	$(this).popover('show');
});
$('.informer').click(function(){
	$(this).popover('show');
});
$('.informer').mouseout(function(e){
	if($(this).is(e.relatedTarget) || $(this).has(e.relatedTarget).length !== 0) return
	if($(".popover").is(e.relatedTarget) || $(".popover").has(e.relatedTarget).length !== 0) return
	$(this).popover('hide');
});
$('body').on('mouseleave', '.popover', function(){
	$('.popover').each(function(){
		$('[aria-describedby='+$(this).attr("id")+']').popover('hide');
	});
});

$('.product-slider-item').on('mouseenter', function(){
	product_slider_on(this);
});
$('.product-slider-select').swipe({
	swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
		if(direction == 'left')
		{
			var active = $(this).find('.active').next('.product-slider-item')
			if(active.length === 0) active = $(this).find('.product-slider-item:first');
			product_slider_on(active);
		}
		else if(direction == 'right')
		{
			var active = $(this).find('.active').prev('.product-slider-item')
			if(active.length === 0) active = $(this).find('.product-slider-item:last');
			product_slider_on(active);
		}
	},
	threshold: 30 // сработает через 30 пикселей
});
function product_slider_on(e)
{
	$(e).parent().find('.active').removeClass('active');
	$(e).addClass('active');
	$(e).parents('.product-slider').find('.product-slider-img img').attr('src', $(e).data('src'));
}

$(".spoiler-open").click(function(){
	var p = $(this).parent('.spoiler')
	if(p.hasClass('active')) p.removeClass('active')
	else p.addClass('active')
	return false
});

$('.product-navigation-link').click(function(){
	$('.product-navigation-link').removeClass('active')
	$(this).addClass('active')
	$('html, body').stop().animate({scrollTop: $($(this).attr('href')).offset().top}, 'fast', 'swing');
	return false;
});

$('.img-to-video').click(function(){
	$('<iframe>', {
		src: $(this).find('img').data('video'),
		frameborder: 0,
		allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
		allowfullscreen : ''
	}).appendTo(this);
});

$('.related-search-input input').on('input change', function(){
	$('.product-related .product-table-item').parent().hide();
	$(".product-related .product-table-item:Contains('"+$(this).val()+"')").parent().show();
	if($(this).val() == '') $(".product-related .product-table-item").parent().show();
});

$(".product-oneclick").submit(function(){

	p = $(this).parents('.product-data');
	q = p.find('.quantity').val();

	var name = $(this).find('[name="name"]').val()
	if(name.length > 2) $('#modal-msg-title').html(name + '!')

	$('#modal-msg-phone').html($(this).find('[name="phone"]').val())

	console.log("PHP запрос отправлен: id:" + p.data('id') + " q:" + q + " User: " + $(this).serialize());

	$('#modal-msg').modal('show')
	$(this).trigger("reset")
	return false;
});


$('.input-edit-activate').click(function(){
	var th = $(this).parents('.input-edit')
	th.addClass('active')
	th.find('.input-edit-field').attr('data-old-value', th.find('.input-edit-field').val());
	th.find('.input-edit-field').focus()
});

$('.input-edit-yes').on('click', function(){
	var th = $(this).parents('.input-edit')
	th.removeClass('active')
	var name = th.find('.input-edit-field').attr('name')
	var data = th.find('.input-edit-field').val()
	console.log(name + " " + data)
});

$('.input-edit-no').on('click', function(){
	var th = $(this).parents('.input-edit')
	th.removeClass('active')
	th.find('.input-edit-field').val(th.find('.input-edit-field').attr('data-old-value'));
});

$('.data-edit-activate').click(function(){
	var th = $(this).parents('.data-edit')
	th.addClass('active')
	th.find('.data-edit-field').val(th.find('.data-edit-info').text())
	th.find('.data-edit-field').focus()
});

$('.data-edit-yes').on('click', function(){
	var th = $(this).parents('.data-edit')
	th.removeClass('active')
	th.find('.data-edit-info').html(th.find('.data-edit-field').val());

});

$('.data-edit-no').on('click', function(){
	var th = $(this).parents('.data-edit')
	th.removeClass('active')
	th.find('.data-edit-field').val(th.find('.data-edit-info').text());
});

$('.gallery-popup-delete').click(function(){
	$(this).parents('.col').remove();
	return false;
});

$('.region-search input').on('input change', function(){
	$('.region-list .good-checkbox').hide();
	$(".region-list .good-checkbox:Contains('"+$(this).val()+"')").show();
	if($(this).val() == '') $(".region-list .good-checkbox").show();
});

$('.montazh-users .data-edit-yes').on('click', function(){
	var th = $(this).parents('.data-edit')
	var name = th.find('.data-edit-field').attr('name');
	var data = th.find('.data-edit-field').val()
	var user_id = $(this).parents('tr').data('id')

	console.log(user_id + " " + name + " " + data)
});

$('.montazh-users-delete').on('click', function(){
	var user_id = $(this).parents('.montazh-user-item').data('id')
	if(confirm("Удалить пользователя под номером " + user_id + " ?"))
	{
		console.log(user_id + " delete")
		$(this).parents('.montazh-user-item').remove()
	}
})

$("#modal-montazh-user-new").submit(function(){
	console.log($(this).serialize())

	$("#modal-montazh-user-new").modal('hide')
	$(this).trigger("reset")
	return false;
});

$(".counterparty-edit").submit(function(){
	formData = new FormData(this)
	var id = formData.get("id")
	console.log($(this).serialize())

	$("#modal-counterparty-edit-" + id).modal('hide')
	return false;
});

$("#modal-counterparty-new").submit(function(){
	console.log($(this).serialize())

	$("#modal-counterparty-new").modal('hide')
	$(this).trigger("reset")
	return false;
});

$('[data-type=number]').bind("change keyup input click", function() {
	if (this.value.match(/[^0-9]/g)) {
		this.value = this.value.replace(/[^0-9]/g, '');
	}
});
///END
});

$('input[data-toggle="collapse-change"]').bind("change", function() {
	$($(this).data('target')).collapse('show')
});


/*$('.catalog-items [class*="col-"]').each(function(){
	$(this).attr('class', $(this).attr('class').replace(/col-/g, 'col_1-'));
});*/