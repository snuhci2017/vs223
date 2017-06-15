jQuery(function($){
//snb
	$('.side_menu li .tit').mouseenter(function(event){
		var $target=$(event.target);
		if($target.is('.on')){
			$(this).stop();
		}else{
			$(this).addClass('open on02').next('ul').stop().addClass('block').slideDown(300);
		};		
	}).focusin(function(event){
		var $target=$(event.target);
		if($target.is('.on')){
			$(this).stop();
		}else{
			$(this).addClass('open on02').next('ul').stop().addClass('block').slideDown(300);
		};		
	}).focusout(function(){
		$(this).removeClass('open on02');
	});
	$('.side_menu li ul').focusin(function(){
		$(this).prev('a.tit').addClass('open on02');
	});
	$('.side_menu >ul li').mouseleave(function(){
		var _this=$(this).find('ul').hasClass('current');
		if(_this==false){
			$(this).find('.open').removeClass('open on02').next('ul').stop().removeClass('block').slideUp(300);
		}else{
			$(this).find('.open').removeClass('open on02').next('ul').stop().removeClass('block');
		};
	});
	$('.side_menu li li a').focusin(function(){
		$(this).addClass('current');
	}).focusout(function(){
		$(this).removeClass('current');
	});
	$('.side_menu li li:last-child()').focusout(function(){
			$('.side_menu a.on').removeClass('open on02');
			$(this).parents('ul').prev('.open').removeClass('open on02').next('ul').stop().removeClass('block').slideUp(300);
	});
//depth4_menu
	$('.depth4_menu button').click(function(){
		$(this).toggleClass('on')
		var srch_open=$(this).hasClass('on')
		if(srch_open==true){
			$(this).next('.cont').slideDown();
		}else{
			$(this).next('.cont').slideUp();
		};
		return false;
	});




	//
	
	/*$('.research_reports .content_box a.more').click(function(){
		$(this).hide();
		$('.research_reports .content_box .more_list,.research_reports .content_box a.buy').show();
		return false;
	});*/
	
	$('.tab_box .dep1:first-child a.tit').addClass('on').next('.tab_cont').show();
	$('.tab_box a.tit').click(function(){
		$('.tab_box a.tit').removeClass('on').next('.tab_cont').hide();
		$(this).addClass('on').next('.tab_cont').show();
		return false;
	});

	//box_faq
	$('.box_faq a.tit').click(function(event){
		var $target=$(event.target);
		if($target.is('.on')){
			$(this).removeClass('on').parents('.title').next('.cont').slideUp();
		}else{
			$(this).addClass('on').parents('.title').next('.cont').slideDown();
		}
		return false;
	});

});

function ebookWin(url){
	
	var rv = -1;
	var ebook = 'Y';
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
		rv = parseFloat(RegExp.$1);

		if(rv < 9){      // If Internet Explorer, return version number
			alert('E-book 서비스는 Internet Explorer 9버전 이상에서 지원되는 서비스입니다.');
			ebook = 'N';
		}
	}
	
	if(ebook == 'Y'){
		window.open (url,"ebookWin","left=0, top=0, toolbar=no, location=no, directories=no, status=no, fullscreen=no, menubar=no, scrollbars=yes, resizable=yes, width="+eval(screen.availWidth-10)+", height="+eval(screen.availHeight-38)+"");
	}
}