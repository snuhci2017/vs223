document.domain = "hankookilbo.com";

$(document).ready(function () {
	$(".feat").mouseenter(function(){
		$(this).find(".overlay").css("display", "block");
	});
	$(".feat").mouseleave(function(){
		$(this).find(".overlay").css("display", "none");
	});
/*
	$("#feat-wrap .feat").css("background-color", "#6dcff6");
	$(".feat a").mouseenter(function(){
		$(this).animate({
			opacity: 0.7
		}, 300);
		$(this).children().css("box-shadow", "0 0 10px #2682a7");
	});
	$(".feat a").mouseleave(function(){
		$(this).animate({
			opacity: 1
		}, 800);
		$(this).children().css("box-shadow", "none");
	});
*/


	$('#menu-1 > a').hover(function(){ init_menu('hover'); show_submenu(1); });
	$('#menu-1 > a').focus(function(){ init_menu('hover'); show_submenu(1); });
	$('#menu-2 > a').hover(function(){ init_menu('hover'); show_submenu(2); });
	$('#menu-2 > a').focus(function(){ init_menu('hover'); show_submenu(2); });
	$('#menu-3 > a').hover(function(){ init_menu('hover'); show_submenu(3); });
	$('#menu-3 > a').focus(function(){ init_menu('hover'); show_submenu(3); });
	$('#menu-4 > a').hover(function(){ init_menu('hover'); show_submenu(4); });
	$('#menu-4 > a').focus(function(){ init_menu('hover'); show_submenu(4); });
	$('#menu-5 > a').hover(function(){ init_menu('hover'); show_submenu(5); });
	$('#menu-5 > a').focus(function(){ init_menu('hover'); show_submenu(5); });
	$('#menu-6 > a').hover(function(){ init_menu('hover'); show_submenu(6); });
	$('#menu-6 > a').focus(function(){ init_menu('hover'); show_submenu(6); });
	$('#menu-7 > a').hover(function(){ init_menu('hover'); show_submenu(7); });
	$('#menu-7 > a').focus(function(){ init_menu('hover'); show_submenu(7); });
	$('#menu-8 > a').hover(function(){ init_menu('hover'); show_submenu(8); });
	$('#menu-8 > a').focus(function(){ init_menu('hover'); show_submenu(8); });
	$('#menu-8 > a').hover(function(){ init_menu('hover'); show_submenu(8); });
	$('#menu-8 > a').focus(function(){ init_menu('hover'); show_submenu(8); });

	$('#menu-ext-2 > a').focus(function(){ init_menu('hover'); show_submenu('opinion'); });
	$('#menu-ext-2 > a').hover(function(){ init_menu('hover'); show_submenu('opinion'); });

	$('#menu-ext-3 > a').focus(function(){ init_menu('hover'); show_submenu('multimedia'); });
	$('#menu-ext-3 > a').hover(function(){ init_menu('hover'); show_submenu('multimedia'); });

	$('.menu-main-sub-div').mouseleave(function(){
		//if($('#menu-main').is(':hover') !== true){
			init_menu();
		//}
	});

	$('#title-home').mouseenter(function(){ init_menu();});
	$('#title-article').mouseenter(function(){ init_menu();});
	$('#menu-ext-1').mouseenter(function(){ init_menu();});
	
	$('#menu-main > li > a').hover(function(){
		if( $(this).attr('class') == 'selected' ){
			mmid = $(this).parent().attr('id').replace('menu-', '');
			$("#menu-" + mmid + "-div > .menu-main-sub-article").removeClass('none');
			$("#menu-" + mmid + "-div > .blue-line-3px").removeClass('none');
		}
	});

	function init_menu(e){
		$('.menu-main-sub-div').css('display','none');
		if($("#menu-main > li > a").is(".selected")){
/*
			if(e != 'hover'){
				mmid = $("#menu-main > li > a.selected").parent().attr('id').replace('menu-', ''); console.log(mmid);
				$("#menu-" + mmid + "-div > .menu-main-sub-article").addClass('none');
				$("#menu-" + mmid + "-div > .blue-line-3px").addClass('none');
				$("#menu-" + mmid + "-div").css('display', 'block');
			}
*/
		}
		if($("#menu-ext > li > a").is(".selected")){
/*
			if(e != 'hover'){
				mmid = $("#menu-ext > li > a.selected").parent().attr('id').replace('menu-', ''); console.log(mmid);
				$("#menu-" + mmid + "-div > .menu-main-sub-article").addClass('none');
				$("#menu-" + mmid + "-div > .blue-line-3px").addClass('none');
				$("#menu-" + mmid + "-div").css('display', 'block');
			}
*/
		}
	}
	
	function show_submenu(e){
		$('#menu-' + e + '-div').css('display','block'); 
		return false;
	}

	// 많이 본 뉴스 / 많이 추천한 뉴스
	$('#tab-popular-1 > a').click(function(){
		$(this).parent().attr('class','on');
		$('#tab-popular-2').attr('class','');
		$('#popular-1').css('display','block');
		$('#popular-2').css('display','none');
		return false;
	});
	$('#tab-popular-1 > a').focus(function(){
		$(this).parent().attr('class','on');
		$('#tab-popular-2').attr('class','');
		$('#popular-1').css('display','block');
		$('#popular-2').css('display','none');
		return false;
	});
	$('#tab-popular-2 > a').click(function(){
		$(this).parent().attr('class','on');
		$('#tab-popular-1').attr('class','');
		$('#popular-1').css('display','none');
		$('#popular-2').css('display','block');
		return false;
	});
	$('#tab-popular-2 > a').focus(function(){
		$(this).parent().attr('class','on');
		$('#tab-popular-1').attr('class','');
		$('#popular-1').css('display','none');
		$('#popular-2').css('display','block');
		return false;
	});


	// 카테고리별 주요뉴스
	$('#tab-cate-1 > a').click(function(){
		$(this).parent().attr('class','on');
		$('#tab-cate-2').attr('class','');
		$('#tab-cate-3').attr('class','');
		$('#tab-cate-4').attr('class','');
		$('#cate-1').css('display','block');
		$('#cate-2').css('display','none');
		$('#cate-3').css('display','none');
		$('#cate-4').css('display','none');
		return false;
	});
	$('#tab-cate-1 > a').focus(function(){
		$(this).parent().attr('class','on');
		$('#tab-cate-2').attr('class','');
		$('#tab-cate-3').attr('class','');
		$('#tab-cate-4').attr('class','');
		$('#cate-1').css('display','block');
		$('#cate-2').css('display','none');
		$('#cate-3').css('display','none');
		$('#cate-4').css('display','none');
		return false;
	});
	$('#tab-cate-2 > a').click(function(){
		$(this).parent().attr('class','on');
		$('#tab-cate-1').attr('class','');
		$('#tab-cate-3').attr('class','');
		$('#tab-cate-4').attr('class','');
		$('#cate-1').css('display','none');
		$('#cate-2').css('display','block');
		$('#cate-3').css('display','none');
		$('#cate-4').css('display','none');
		return false;
	});
	$('#tab-cate-2 > a').focus(function(){
		$(this).parent().attr('class','on');
		$('#tab-cate-1').attr('class','');
		$('#tab-cate-3').attr('class','');
		$('#tab-cate-4').attr('class','');
		$('#cate-1').css('display','none');
		$('#cate-2').css('display','block');
		$('#cate-3').css('display','none');
		$('#cate-4').css('display','none');
		return false;
	});
	$('#tab-cate-3 > a').click(function(){
		$(this).parent().attr('class','on');
		$('#tab-cate-1').attr('class','');
		$('#tab-cate-2').attr('class','');
		$('#tab-cate-4').attr('class','');
		$('#cate-1').css('display','none');
		$('#cate-2').css('display','none');
		$('#cate-3').css('display','block');
		$('#cate-4').css('display','none');
		return false;
	});
	$('#tab-cate-3 > a').focus(function(){
		$(this).parent().attr('class','on');
		$('#tab-cate-1').attr('class','');
		$('#tab-cate-2').attr('class','');
		$('#tab-cate-4').attr('class','');
		$('#cate-1').css('display','none');
		$('#cate-2').css('display','none');
		$('#cate-3').css('display','block');
		$('#cate-4').css('display','none');
		return false;
	});
	$('#tab-cate-4 > a').click(function(){
		$(this).parent().attr('class','on');
		$('#tab-cate-1').attr('class','');
		$('#tab-cate-2').attr('class','');
		$('#tab-cate-3').attr('class','');
		$('#cate-1').css('display','none');
		$('#cate-2').css('display','none');
		$('#cate-3').css('display','none');
		$('#cate-4').css('display','block');
		return false;
	});
	$('#tab-cate-4 > a').focus(function(){
		$(this).parent().attr('class','on');
		$('#tab-cate-1').attr('class','');
		$('#tab-cate-2').attr('class','');
		$('#tab-cate-3').attr('class','');
		$('#cate-1').css('display','none');
		$('#cate-2').css('display','none');
		$('#cate-3').css('display','none');
		$('#cate-4').css('display','block');
		return false;
	});

	$(".weather").mouseenter(function(){$(".weather-more").css("display", "block");})
	$(".weather").mouseleave(function(){$(".weather-more").css("display", "none");})

});

function article_font_change(e){
	var pFontSize = parseInt($("#article-body > p").css("font-size"));
	var hFontSize = parseInt($("#article-body > h2").css("font-size"));
	pFontSize = pFontSize + (e * 2) + "px";
	hFontSize = hFontSize + (e * 2) + "px";
	$("#article-body > p").css({'font-size':pFontSize});	
	$("#article-body > h2").css({'font-size':hFontSize});	
}