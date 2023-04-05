document.addEventListener("DOMContentLoaded", function() {

function smallDev() {
	var small_dev = $(window).width() >= 992 ? false : true;
	return small_dev;
}
lazyload();

$('.order-item-products').each(function() {
	let mw = [];
	$(this).find('tr > td').each(function(index, el) {
		let i = $(el).index()
		let span_w = $(el).find('span:first').width()
		if (span_w != undefined){
			if(mw[i] == undefined || mw[i] < span_w) mw[i] = span_w
		}
	});
	$(this).find('tr > td').each(function(index, el) {
		$(el).width(mw[$(el).index()])
	});
});

$('.copy-click, .order-item-products td').click(function(event) {
	selectCopyContent(event)
});


function animate(c) {
	$(c).removeClass('animate')
	setTimeout(function(){ $(c).addClass('animate') }, 50);
}

function selectCopyContent(event) {
	event.cancelBubble = true

	if (window.getSelection() != '') {
		var select = window.getSelection();
		var content = select.toString();
		navigator.clipboard.writeText(content)
			.then(() => animate(event.target))
	} else {
		var content = event.target.textContent
		navigator.clipboard.writeText(content)
			.then(() => animate(event.target))
			.catch(err => console.log('Something went wrong', err))
	}
}

$('[data-bs-toggle="collapse-fast"]').click(function(event) {
	$($(this).data('bs-target')).toggleClass('show');
});

$('[data-add-show]').click(function(event) {
	$(this).parents($(this).data('add-show')).toggleClass('show');
});


function sec2time(timeInSeconds) {
    var pad = function(num, size) { return ('000' + num).slice(size * -1); },
    time = parseFloat(timeInSeconds).toFixed(3),
    hours = Math.floor(time / 60 / 60),
    minutes = Math.floor(time / 60) % 60,
    seconds = Math.floor(time - minutes * 60),
    milliseconds = time.slice(-3);

    return pad(minutes, 2) + ':' + pad(seconds, 2);
}

var callTimer = 0
function startCallTimer() {
	clearInterval(callTimer)
	callTimer = setInterval(function() {

		$('[data-timer-up]').each(function() {
			let seconds = $(this).attr('data-timer-up') * 1
			//console.log(seconds)
			if (seconds < 3600) {
				$(this).attr('data-timer-up', seconds + 1)
			} else {
				clearInterval(callTimer)
				$(this).attr('data-timer-up', 0)
			}
			$(this).html(sec2time($(this).attr('data-timer-up')))
		});
	}, 1000);
}
$('.dev-call-start').click(function() {
	scroll_top()
	startCallTimer()
});
$('.dev-call-more').click(function() {
	more_call()
});

function more_call() {
	let e = $('.calls>div')[0].outerHTML;
	$('.calls').append(e.replaceAll('-123' , '-123'+$('.calls>div').length));
}
function scroll_top () {
	$('html, body').scrollTop(0);
}

$('.hide-switch').click(function() {
	$(this).parents(".hide-switcher").toggleClass('active');
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

	var envelope = $('.cd-nav-menu.catalog'),
	envelope_h = envelope.height(),
	eOffset = envelope.offset();

	x2i = eOffset.left + envelope.outerWidth(),
	y2i = eOffset.top,
	x3i = x2i,
	y3i = eOffset.top + envelope.outerHeight()*0.9;/*домножение на 0.6 - сократил конверт до снизу по высоте для более резкой реакции при траектории мышки в сторону 4-5 часов*/

	//console.log(" x=" + x + " y=" + y + " x1=" + x1 + " y1=" + y1 + " x2i=" + x2i + " y2i=" + y2i + " x3i=" + x3i + " y3i=" + y3i)
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
function check_quantity(e, i)
{
	p = $(e).parents('.product-data');
	q = p.find('.quantity');
	var new_q = Math.ceil(q.val()/p.data('ed')) * p.data('ed') + i * p.data('ed');
	if (new_q >= 0) q.val(new_q);
	else q.val('0');

	product_recount_amount(e)

	clearTimeout(timer[p.data('id')]);
	timer[p.data('id')] = setTimeout(function(p, q) {
		update_product_quantity(p.data('id'), q.val())
		if(q.val() == '0'){
			p.removeClass('in-cart');
			q.val(p.data('ed'));
		}
	}, 500, p, q);
}

function product_recount_amount(e)
{
	p = $(e).parents('.product-data');
	q = p.find('.quantity');

	var price = parseFloat(p.data('price'));
	var quantity = parseFloat($(q).val());
	var amount_wrp = p.find('.product-amount')

	if(price > 0 && quantity > 0 )
	{
		var amount = price * quantity;
		p.data("amount", amount)

		var amount_format = Intl.NumberFormat('ru-RU').format(amount)
		amount_wrp.html(amount_format)

		product_recount_total_amount(e);
	}
}

function product_recount_total_amount(e)
{
	total_amount_wrp = $(e).parents('.products').find('[data-total-amount]')
	if(total_amount_wrp.length > 0)
	{
		var total_amount = 0
		$(e).parents('.products').find('[data-amount]').each(function(){
			total_amount += parseFloat($(this).data('amount'))
		})
		total_amount_wrp.data('total-amount', total_amount)
		total_amount_wrp.html(Intl.NumberFormat('ru-RU').format(total_amount))
	}
}

$("body").on('click', '.count-down', function(){
	check_quantity(this, -1);
});

$("body").on('click', '.count-up',function(){
	check_quantity(this, 1);
});

$("body").on('change input', '.quantity', function(){
	if (this.value.match(/[^0-9]/g)) {
		this.value = this.value.replace(/[^0-9]/g, '');
	}
	if (this.value == '' || this.value < 0) {
		this.value = '';
	}
});

$("body").on('change input', '.quantity', function(){
	check_quantity(this, 0);
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
	placement: 'top',
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


$('.input-edit .input-edit-activate').click(function(){
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

$('.data-edit .data-edit-activate').click(function(){
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

$('.modal-list-search input').on('input change', function(){
	var this_modal = $(this).parents('.modal-content')
	this_modal.find('.column-list label').hide();
	this_modal.find(".column-list label:Contains('"+$(this).val()+"')").show();
	if($(this).val() == '') this_modal.find(".column-list label").show();
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

$('#counterparty-search').submit(function(){
	$('.counterparty-step-2').collapse('show')
	return false;
});
$('.counterparty-start-search').click(function(){
	$('.counterparty-step-2').collapse('show')

	$('html, body').stop().animate({scrollTop: $('.counterparty-step-2').offset().top}, 'fast', 'swing');
	return false;
});

$(".counterparty-new").submit(function(){

	var form = $(this)

	$.post(form.attr('action'), form.serialize())
	.done(function(data) {
		console.log(form.attr('action'))
		console.log(form.serialize())
		console.log(data)
	})
	.fail(function() {
		console.log(form.attr('action'))
		console.log(form.serialize())
	});

	$("#modal-counterparty-new").modal('hide')
	form.trigger("reset")
	return false;
});

$('[data-type=number]').bind("change keyup input click", function() {
	if (this.value.match(/[^0-9+]/g)) {
		this.value = this.value.replace(/[^0-9+]/g, '');
	}
});

/*$('.collapse-no-animation').collapse({
	animate: false
});*/

$('input[data-toggle="collapse-change"]').bind("change", function() {
	$($(this).data('target')).collapse('show')
});

$('select[data-toggle="collapse-change"]').bind("change", function() {
	$($(this).find('option:selected').data('target')).collapse('show')
});

$('.dropdown-input [data-toggle="dropdown"]').on('show.bs.dropdown', function () {
	if( $(this).parent().find('.dropdown-item').length < 1 ) return false;
});

$('.drop-not-hide .dropdown-item').on('click', function (e) {
	 e.stopPropagation();
});

$('.dropdown-input .dropdown-item').on('click', function () {
	var input = $(this).parents('.dropdown-input').find('[data-toggle="dropdown"]')
	input.val($(this).text())
	input.dropdown('hide')
	return false;
});

stm = 0
$('.invoice-number').on('keyup input', function(){
	var th = this
	clearTimeout(stm);
	stm = setTimeout(function() {
		console.log("Запрос в бэкэнд")
		$(th).dropdown('show')
	}, 300);

});

$(".datepick").flatpickr({
	dateFormat: "d.m.Y",
	locale: "ru",
});

$('.datepick').prop('readonly', false)
if($('.datepick.flatpickr-mobile').length < 1) $('.datepick').mask("99.99.9999")

$("form.calculations-form").submit(function(){
	var submit = $(this).find('.btn[type="submit"]')
	submit.prop("disabled", true);
	setTimeout(function(){ submit.prop("disabled", false); }, 3000);
	return false;
});
$("form#user-region-list").submit(function(){
	console.log($(this).serialize());
	$(this).modal('hide')
});

$("form#modal-check-order").submit(function(){
	console.log($(this).serialize());
	$('#check-order-result').collapse('show')
	return false
});

$('[data-target="#modal-check-order"]').click(function(){
	$('#check-order-number').focus();
});


$('#main-slider').carousel({
	pause: false,
  	interval: 8000
})


$("form#modal-montazh-new-review").submit(function() {
	var th = $(this);
/*	$.ajax({ /// Раскоментить на сервере
		type: "POST",
		url: "/send.php",
		data: th.serialize()
	}).done(function() {*/
		$(th).find('.send-success').addClass('active').hide().fadeIn();
		setTimeout(function() {
			$(th).find('.send-success').removeClass('active').fadeOut();
			th.trigger("reset");
			th.modal('hide')
		}, 3000);
	//});

	$('.sc-cart-clear').click();
	return false;
});

$('.phone-mask').mask("+7 (999) 999-99-99");

$('.phone-input').on('focus', function(){
	if($(this).val().length < 1) $(this).val('+7')
});

$("form.login-1").submit(function() {
	var login = $(this).find('[name="login"]')
	if(validator.isMobilePhone(login.val()))
	{
		login.removeClass('is-invalid')
		login.removeClass('animate')
		$('.login-phone').html(login.val())
		$("#target-login-2").collapse('show')
		$("form.login-2").find('.login-code input:first-child').focus()
		startLoginNewCodeTimer()
	}
	else
	{
		login.addClass('is-invalid')
		animate(login)
	}
	return false;
});

var wrongCounter = 0 // <--Имитация трех неправильных вводов
$("form.login-2").submit(function() {
	var loginCode = $(this).find('.login-code')
	loginCode.addClass('is-invalid')
	animate(loginCode)

	// START Имитация трех неправильных вводов
	wrongCounter++
	if(wrongCounter >= 3)
	{
		startLoginSubmitBlock()
		wrongCounter = 0
	}
	//END Имитация трех неправильных вводов

	return false;
});

var loginNewCodeTimer = 0
function startLoginNewCodeTimer() {
	clearInterval(loginNewCodeTimer)
	$('.login-new-code').addClass('active')
	let seconds = $('.login-new-code-timer span')
	loginNewCodeTimer = setInterval(function() {
		if (seconds.text() > 0) {
			seconds.text(seconds.text()-1)
		} else {
			clearInterval(loginNewCodeTimer)
			$('.login-new-code').removeClass('active')
			seconds.text(60)
		}
	}, 1000);
}
$('.login-new-code-link').click(function(){
	startLoginNewCodeTimer()
	return false
})

var loginSubmitBlock = 0
function startLoginSubmitBlock() {
	clearInterval(loginSubmitBlock)
	$('.login-submit').addClass('is-invalid')
	let seconds = $('.login-submit .lock span')
	loginSubmitBlock = setInterval(function() {
		if (seconds.text() > 0) {
			seconds.text(seconds.text()-1)
		} else {
			clearInterval(loginSubmitBlock)
			$('.login-submit').removeClass('is-invalid')
			seconds.text(60)
		}
	}, 1000);
}

$('.login-code input').on('focus', function(){
	$(this).parent().removeClass('is-invalid')
	$(this).parent().removeClass('animate')
	$(this).select()
})

$('.login-code input').on('keydown', function(e){
	if(e.key == 'Backspace' || e.key == 'Delete')
	{
		if(this.value.length > 0)
		{
			this.value = ''
			return false
		}
		else
			prevCodeField(this)
	}
	else if(e.key == 'ArrowLeft') { prevCodeField(this); return false }
	else if(e.key == 'ArrowRight') { nextCodeField(this); return false }
	else if(numberSymbol(e)) { this.value = '' }

});
$('.login-code input').on('keyup', function(e){
	if (this.value.length == this.dataset.maxlength && numberSymbol(e)) {
		nextCodeField(this)
	}
});
$('.login-code input').on('input', function(e){

	let code = $(this).val().replace(/[^\d]/g, '')
	if(code.length < 2) return;

	let codeFields = $(this).parent().find('input')
	let shift = codeFields.index(this)

	for (let i = 0; i < code.length; i++) {

		if(i + shift == codeFields.length) break
		codeFields[i + shift].value = code[i]
		nextCodeField(codeFields[i + shift])
	}

});

function numberSymbol(e)
{
	if(e.key.match(/[\d]/g) !== null) return true
	return false
}

function nextCodeField(e) {
	let $next = $(e).next('input')
	if ($next.length)
		$(e).next('input').focus().select()
}

function prevCodeField(e) {
	let $prev = $(e).prev('input')
	if ($prev.length)
		$(e).prev('input').focus().select()
}

$('[max]').on('input keyup', function(){
	if(parseFloat($(this).val()) > parseFloat($(this).attr('max'))) $(this).val($(this).attr('max'))
})
$('[min]').on('input keyup', function(){
	if(parseFloat($(this).val()) < parseFloat($(this).attr('min'))) $(this).val($(this).attr('min'))
})

$(".bonus-points-range").on('change mousemove click touchmove', function(){
	inputRangeFill(this)
})
$(".bonus-points").on('change input', function(){
	inputRangeFill(this)
})

function inputRangeFill(e) {
	$(e).parents('.diapazon').find('.bonus-points').val($(e).val())
	let range = $(e).parents('.diapazon').find('.bonus-points-range')
	range.val($(e).val())

	let width = $(e).val()/$(e).attr('max')
	if(width > 1) width = 1
	$(range).next('.range-fill').width('calc((' + width + ' * 100%) + 0.5rem - (' + width + ' * 1rem))')
}
inputRangeFill($('.form-range'))


$('#modal-counterparty-new [name="counterparty-ogrn"]').on('change input', function(){
	$('.counterparty-step-1').collapse('show')
})

$('[data-required]').each(function () {
	$(this).prop('required', true)
})
$('.dynamic-required .collapse').on('shown.bs.collapse hidden.bs.collapse', function () {
	let e = $(this).parents('.dynamic-required').find('[data-required]')
	e.prop('required', false)
	e.filter(":visible").prop('required', true)
	e.filter(":hidden").val('')
})

$('.counterparty-step-2').on('show.bs.collapse', function () { // демонстрация включения лоадра
	let e = $(this);
	e.addClass('active');
	setTimeout(function(){ e.removeClass('active') }, 1500);
})

setTimeout(function(){ // демонстрация лоадра
	$('.loading').removeClass('active')
}, 3000);

$('[data-collapse=".address-type-2"]').click(function () {
	$('.address-type-2').collapse('show')
	$('[name="delivery-address"]').val(0)
})

/*if($('#deliverymap').length > 0){
	$.getScript("/js/delivery.map.js");
}

if($('#map-address').length > 0){
	$.getScript("/js/cartaddress.map.js");
}*/

///END
});