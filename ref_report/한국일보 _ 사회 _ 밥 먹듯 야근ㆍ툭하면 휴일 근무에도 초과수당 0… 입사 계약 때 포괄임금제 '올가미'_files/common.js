$(document).ready(function(){
	/* 실시간 스크롤체크 */
	$(window).scroll(function(){
		var scrollCheck = $(window).scrollTop();
		if(scrollCheck > 300){
			$(".popup").eq(2).css("display","none");
			$(".popBtn").eq(0).find("span").css({"background-position":"0 0"});
			$(".header .headerCon .inCon .gnb").css({display:"none"});
			$(".header .headerCon .inCon article.gnbCategory").css({right:"55px"});
			$(".header .headerCon .inCon").css({padding:"0 0 0 52px"});
			$(".header .headerCon").css({height:"53px"});
			$(".header .headerCon .logo img").css({height:"53px"});
			$(".header .headerCon .inCon .navi > article.MyMenu > ul").css({display:"none"});
			$(".header .headerCon .inCon .navi > article.naviCategory").css({display:"block"});
			$(".header .headerCon .inCon .navi > article.MyMenu > .memberMenu").css({display:"block"});
			$(".header .headerCon .inCon .navi > article.MyMenu > .icon_Paper").css({display:"block"});
			$(".v_header .v_headerCon .inCon").css({padding:"0 0 0 70px"});
			if($(".v_header").css("display")){
				verTSize("L");
			}
		}else{
			$(".header .headerCon .inCon .gnb").css({display:"block"});
			$(".header .headerCon .inCon article.gnbCategory").css({right:"0"});
			$(".header .headerCon .inCon").css({padding:"0 0 0 104px"});
			$(".header .headerCon").css({height:"107px"});
			$(".header .headerCon .logo img").css({height:"107px"});
			$(".header .headerCon .inCon .navi > article.MyMenu > ul").css({display:"block"});
			$(".header .headerCon .inCon .navi > article.naviCategory").css({display:"none"});
			$(".header .headerCon .inCon .navi > article.MyMenu > .memberMenu").css({display:"none"});
			$(".header .headerCon .inCon .navi > article.MyMenu > .icon_Paper").css({display:"none"});
			$(".v_header .v_headerCon .inCon").css({padding:"0 0 0 100px"});
			if($(".v_header").css("display")){
				verTSize("S");
			}
		}
	});
	function verTSize(a){
		var imgAttr =$(".v_header .v_headerCon .logo img").attr("src");
		if(a == "L"){
			imgAttr = imgAttr.replace("L.png","S.png");
			$(".v_header .v_headerCon .logo img").attr("src",imgAttr);
		}else if(a == "S"){
			imgAttr = imgAttr.replace("S.png","L.png");
			$(".v_header .v_headerCon .logo img").attr("src",imgAttr);
		}
	}
	function pllipICon(){
		$(".cardNews ul li.iconShow").append('<p class="cardIcon"></p>');
		var listLength = $(".cardNews ul li.iconShow").length;
		for(var i=0; i < listLength; i++){
			var listString = $(".cardNews ul li.iconShow").eq(i).attr("class");
			if(listString.search("realTime") == 9 || listString.search("realTime") > 13){
				$(".cardNews ul li.iconShow .cardIcon").eq(i).append('<img src="https://image.hankookilbo.com/n/icon/ico_titSum0_tag.png" alt="실시간 급상승" title="실시간 급상승" />')
			}
			if(listString.search("inter")==9){
				 $(".cardNews ul li.iconShow .cardIcon").eq(i).append('<img src="https://image.hankookilbo.com/n/icon/ico_titSum4_tag.png" alt="인터랙티브" title="인터랙티브" />');
			}
			if(listString.search("movie")==9){
				 $(".cardNews ul li.iconShow .cardIcon").eq(i).append('<img src="https://image.hankookilbo.com/n/icon/ico_titSum5_tag.png" alt="동영상" title="동영상" />');
			}
			if(listString.search("poll")==9){
				 $(".cardNews ul li.iconShow .cardIcon").eq(i).append('<img src="https://image.hankookilbo.com/n/icon/ico_titSum8_tag.png" alt="뉴스 POLL" title="뉴스 POLL" />');
			}
			if(listString.search("card")==9){
				 $(".cardNews ul li.iconShow .cardIcon").eq(i).append('<img src="https://image.hankookilbo.com/n/icon/ico_titSum6_tag.png" alt="카드뉴스" title="카드뉴스" />');
			}
			if(listString.search("quiz")==9){
				 $(".cardNews ul li.iconShow .cardIcon").eq(i).append('<img src="https://image.hankookilbo.com/n/icon/ico_titSum7_tag.png" alt="퀴즈뉴스" title="퀴즈뉴스" />');
			}
		}
	}
	pllipICon();

/* 네비게이션 */
	$(".navi > .menu > ul >li").mouseenter(function(){
		var menuTit = $(this).index();
		var cnt = 0;
		$(".navi > .menu > ul >li").each(function(){
			if(cnt ==menuTit){
				$(".navi > .menu > ul >li").eq(cnt).addClass("on");
				if(menuTit == 0){
					$(".navi > .menu > .subMenu").eq(0).show();
				}else if(menuTit == 1){
					$(".navi > .menu > .subMenu").eq(1).show();
				}else if(menuTit == 5){
					$(".navi > .menu > .subMenu").eq(2).show();
				}
			}else{
				$(".navi > .menu > ul >li").eq(cnt).removeClass("on");
				$(".navi > .menu > .subMenu").eq(cnt).hide();
			}
			cnt++;
		});
	});
	$(".header").mouseleave(function(){
		$(".navi > .menu > .subMenu").hide();
		$(".navi > .menu > ul >li").removeClass("on");
	});
	$(".subMenu:eq(0) .Depth1 li").mouseenter(function(){
		var SubTit = $(this).index();
		var cnt = 0;
		$(".subMenu:eq(0) .Depth1 li").each(function(){
			if(cnt ==SubTit){
				$(".subMenu .Depth1 li").eq(cnt).addClass("on");
				$(".subMenu .Depth2").eq(cnt).show();
				$(".subMenu:eq(0) .Depth1 li .Depth1_arrow").eq(cnt).show();
			}else{
				$(".subMenu .Depth1 li").eq(cnt).removeClass("on");
				$(".subMenu .Depth2").eq(cnt).hide();
				$(".subMenu:eq(0) .Depth1 li .Depth1_arrow").eq(cnt).hide();
			}
			cnt++;
		});
	});
	$(".subMenu:eq(1) .Depth1 li").mouseenter(function(){
		var SubTit = $(this).index();
		var cnt = 0;
		$(".subMenu:eq(1) .Depth1 li").each(function(){
			if(cnt ==SubTit){
				$(".subMenu:eq(1) .Depth1 li").eq(cnt).addClass("on");
			}else{
				$(".subMenu:eq(1) .Depth1 li").eq(cnt).removeClass("on");
			}
			cnt++;
		});
	});
	$(".subMenu:eq(2) .Depth1 li").mouseenter(function(){
		var SubTit = $(this).index();
		var cnt = 0;
		$(".subMenu:eq(2) .Depth1 li").each(function(){
			if(cnt ==SubTit){
				$(".subMenu:eq(2) .Depth1 li").eq(cnt).addClass("on");
			}else{
				$(".subMenu:eq(2) .Depth1 li").eq(cnt).removeClass("on");
			}
			cnt++;
		});
	});


/* Gnb 메뉴 */
	var spanWidth = ["75px","55px","55px","95px","45px"];
	$(".header .headerCon .inCon .gnbCategory > ul > li").mouseenter(function(){
		var GnbTit = $(this).index();
		var cnt = 0;
		$(".header .headerCon .inCon .gnbCategory > ul > li").each(function(){
			if(cnt ==GnbTit){
				$(".header .headerCon .inCon .gnbCategory > ul > li").eq(cnt).addClass("on");
				$(".header .headerCon .inCon .gnbCategory > ul > li").eq(cnt).find("img").attr("src","https://image.hankookilbo.com/n/icon/ico_gnb"+cnt+"_on.png");
				$(".header .headerCon .inCon .gnbCategory > ul > li.on").find("span").animate({"width":spanWidth[cnt]}, {duration:250, queue:false});
			}else{
				$(".header .headerCon .inCon .gnbCategory > ul > li").eq(cnt).removeClass("on");
				$(".header .headerCon .inCon .gnbCategory > ul > li").eq(cnt).find("img").attr("src","https://image.hankookilbo.com/n/icon/ico_gnb"+cnt+"_off.png");
				$(".header .headerCon .inCon .gnbCategory > ul > li").eq(cnt).find("span").animate({"width":"0px"}, {duration:250, queue:false});
			}
			cnt++;
		});
	});
	var timeGnbMenu;
	var GnbCnt = 0;
	var GnbMenu = {
		stop_Gnb : function(){
			clearInterval(timeGnbMenu);
		},
		play_Gnb : function(){
			clearInterval(timeGnbMenu);
			timeGnbMenu = setInterval(function(){
				if(GnbCnt < 5){
					for(var i =0; i<5; ++i){
						if(i==GnbCnt){
							$(".header .headerCon .inCon .gnbCategory > ul > li").eq(i).addClass("on");
							$(".header .headerCon .inCon .gnbCategory > ul > li").eq(i).find("img").attr("src","https://image.hankookilbo.com/n/icon/ico_gnb"+i+"_on.png");
							$(".header .headerCon .inCon .gnbCategory > ul > li.on").find("span").animate({"width":spanWidth[i]}, {duration:250, queue:false});
						}else{
							$(".header .headerCon .inCon .gnbCategory > ul > li").eq(i).removeClass("on");
							$(".header .headerCon .inCon .gnbCategory > ul > li").eq(i).find("img").attr("src","https://image.hankookilbo.com/n/icon/ico_gnb"+i+"_off.png");
							$(".header .headerCon .inCon .gnbCategory > ul > li").eq(i).find("span").animate({"width":"0px"}, {duration:250, queue:false});
						}
					}
					++GnbCnt;
				}else{
					GnbCnt =0;
				}
			},3000);
		},
	};
	$(".header .headerCon .inCon .gnbCategory").mouseenter(function(){
		GnbMenu.stop_Gnb();
	});
	$(".header .headerCon .inCon .gnbCategory").mouseleave(function(){
		GnbMenu.play_Gnb();
	});
	GnbMenu.play_Gnb();


//	$(".v_header .v_headerCon .inCon .gnbCategory > ul > li").mouseenter(function(){
//		var v_GnbTit = $(this).index();
//		var v_cnt = 0;
//		$(".v_header .v_headerCon .inCon .gnbCategory > ul > li").each(function(){
//			if(v_cnt ==v_GnbTit){
//				$(".v_header .v_headerCon .inCon .gnbCategory > ul > li").eq(v_cnt).addClass("on");
//			}else{
//				$(".v_header .v_headerCon .inCon .gnbCategory > ul > li").eq(v_cnt).removeClass("on");
//			}
//			v_cnt++;
//		});
//	});
//
//	var v_timeGnbMenu;
//	var v_GnbCnt = 0;
//	var v_GnbMenu = {
//		stop_Gnb : function(){
//			clearInterval(v_timeGnbMenu);
//		},
//		play_Gnb : function(){
//			clearInterval(v_timeGnbMenu);
//			v_timeGnbMenu = setInterval(function(){
//				if(v_GnbCnt < 5){
//					for(var i =0; i<5; ++i){
//						if(i==v_GnbCnt){
//							$(".v_header .v_headerCon .inCon .gnbCategory > ul > li").eq(i).addClass("on");
//						}else{
//							$(".v_header .v_headerCon .inCon .gnbCategory > ul > li").eq(i).removeClass("on");
//						}
//					}
//					++v_GnbCnt;
//				}else{
//					v_GnbCnt =0;
//				}
//			},3000);
//		},
//	};
//	$(".v_header .v_headerCon .inCon .gnbCategory").mouseenter(function(){
//		v_GnbMenu.stop_Gnb();
//	});
//	$(".v_header .v_headerCon .inCon .gnbCategory").mouseleave(function(){
//		v_GnbMenu.play_Gnb();
//	});
//	v_GnbMenu.play_Gnb();





	/* 조판영역 밑에 메인 상단 배너 */
	var mSlideCnt = $(".mSlide li").length;
	var mSlideSum = 0;
	$('.mSlide_arrow').click(function(){
		switch ($('.mSlide_arrow').index(this)){
		case 0 :
			if(mSlideSum > 0) {
				mSlideBn.prev_Slide();
				mSlideSum = mSlideSum-1;
			}
			break;
		case 1 :
			if(mSlideSum >= 0 && mSlideSum < (mSlideCnt-4)) {
				mSlideBn.next_Slide();
				mSlideSum = mSlideSum+1;
			}
			break;
		}
		if(mSlideSum >= 0 && mSlideSum < (mSlideCnt-4)) {
			$('.mSlide_arrow').eq(1).find('img').attr("src","https://image.hankookilbo.com/n/icon/arrow_bannerR_on.jpg");
		}else{
			$('.mSlide_arrow').eq(1).find('img').attr("src","https://image.hankookilbo.com/n/icon/arrow_bannerR_off.jpg");
		}		
		if(mSlideSum > 0){
			$('.mSlide_arrow').eq(0).find('img').attr("src","https://image.hankookilbo.com/n/icon/arrow_bannerL_on.jpg");
		}else{
			$('.mSlide_arrow').eq(0).find('img').attr("src","https://image.hankookilbo.com/n/icon/arrow_bannerL_off.jpg");
		}
	});
	var mSlideBn = {
		next_Slide : function(){
			$('.mSlide').animate({'left':'-582px'},150,function(){
				$(this).css({'left':'-291px'}).children(':first').appendTo($(this));
			});
		},
		prev_Slide : function(){
			$('.mSlide').animate({'left':'0'},150,function(){
				$(this).css({'left':'-291px'}).children(':last').prependTo($(this));
			});
		},
	};


	/* sns Group */
	$(".container div.snsGroup ul > li").mouseenter(function(){
		var snsCon = $(this).index();
		var cnt = 0;
		$(".container div.snsGroup ul > li").each(function(){
			if(cnt ==snsCon){
				$(".container .moreSite").eq(cnt).show();
				$(".container div.snsGroup ul > li").eq(cnt).addClass("on");
				$(".container div.snsGroup ul > li .imgArrow").eq(cnt).show();
			}else{
				$(".container .moreSite").eq(cnt).hide();
				$(".container div.snsGroup ul > li").eq(cnt).removeClass("on");
				$(".container div.snsGroup ul > li .imgArrow").eq(cnt).hide();
			}
			cnt++;
		});
	});

//	/* 조판영역 마우스 오버 */
//	$(".container .typeSet .inCon .photoNews ul > li").mouseenter(function(){
//		var pNewsCon = $(this).index();
//		var cnt = 0;
//		$(".container .typeSet .inCon .photoNews ul > li").each(function(){
//			if(cnt ==pNewsCon){
//				$(".container .typeSet .inCon .photoNews ul > li").eq(cnt).find(".overBg").show();
//			}else{
//				$(".container .typeSet .inCon .photoNews ul > li").eq(cnt).find(".overBg").hide();
//			}
//			cnt++;
//		});
//	});
//	$(".container .typeSet .inCon .photoNews").mouseleave(function(){
//		$(".container .typeSet .inCon .photoNews ul > li").find(".overBg").hide();
//	});

	/* 오늘의 사진 영역 */
	$(".sliderBanner .bannerCon .detailView").mouseenter(function(){
		$(".container .mainCon .centerCon .sliderBanner .bannerCon .detailView .bnPrev").css({opacity:"0.25"});
		$(".container .mainCon .centerCon .sliderBanner .bannerCon .detailView .bnNext").css({opacity:"0.25"});
	});
	$(".sliderBanner .bannerCon .detailView").mouseleave(function(){
		$(".container .mainCon .centerCon .sliderBanner .bannerCon .detailView .bnPrev").css({opacity:"0"});
		$(".container .mainCon .centerCon .sliderBanner .bannerCon .detailView .bnNext").css({opacity:"0"});
	});

	/* 뉴스 NOW */
	var tabIdx = 0;
	function tabStart(a,b){
		if(b=="arrow"){
			tabIdx = tabIdx +a;
			if(tabIdx < 0){
				tabIdx = 7;
			}else if(tabIdx > 7){
				tabIdx = 0;
			}
		}else{
			if(tabIdx < 3){
				tabIdx = a;
			}else if(tabIdx > 2 && tabIdx < 6){
				tabIdx = (a+3);
			}else if(tabIdx > 5 && tabIdx < 8){
				tabIdx = (a+6);
			}
		}
		var cnt = 0;
		$(".tabList ul li").each(function(){
			if(tabIdx==cnt){
				$(".realTimeNews .ListCon ul").eq(cnt).show();
				$(".tabList ul li").eq(cnt).addClass("on");
				
			}else{
				$(".realTimeNews .ListCon ul").eq(cnt).hide();
				$(".tabList ul li").eq(cnt).removeClass("on");
			}
			cnt++;
		});
		$(".tabList ul").hide();
		if(tabIdx < 3){
			$(".tabList ul").eq(0).show();
		}else if(tabIdx > 2 && tabIdx < 6){
			$(".tabList ul").eq(1).show();
		}else if(tabIdx > 5 && tabIdx < 8){
			$(".tabList ul").eq(2).show();
		}
	}
	$(".tabList ul li").click(function(){
		tabStart($(this).index(),"tab");
	});
	$(".tabList > p").click(function(){
		switch ($(this).index())
		{
			case 0:
				tabStart(-1,"arrow");
				break;
			case 4 :
				tabStart(1,"arrow");
				break;
		}
	});

	/* 검색바 */
//	$(".popBtn").click(function(){
//		var pop = $(".popBtn").index(this);
//		var cnt = 0;
//		$(".popBtn").each(function(){
//			if(pop == cnt){
//				$(".popup").eq(cnt+2).show();
//				$(".popBtn").eq(cnt+2).find("span").css({"background-position":"0 -28px"});
//			}else{
//				$(".popup").eq(cnt+2).hide();
//				$(".popBtn").eq(cnt+2).find("span").css({"background-position":"0 0"});
//			}
//			++cnt;
//		});
//	});
//	$(".popup .close").click(function(){
//		$(".popup").hide();
//		$(".popBtn").find("span").css({"background-position":"0 0"});
//	});
	$(".popBtn").click(function(){
		if($(".popup").eq(2).css("display")=="none"){
			$(".popup").eq(2).show();
			$(".popBtn").eq(0).find("span").css({"background-position":"0 -28px"});
		}else{
			$(".popup").eq(2).hide();
			$(".popBtn").eq(0).find("span").css({"background-position":"0 0"});
		}
	});



	/* 오늘의사진 - Right 메뉴 */
		var timeTodaySlider;
		var todayNum = 0;
		var sortOX=true;
		var todaySlider = {
			next_Slide : function(){
			    ++todayNum;
			    if (todayNum > 4) {
			        todayNum = 0;
			    }
				$('.todayPhoto>.photo').css({"left":"0px;"}).animate({'left':'-300px'},400,function(){
					$(this).css({'left':'0'}).children(':first').appendTo($(this));
				});
				for(var i=0; i<5; i++){
					if(i==todayNum){
						$(".todayPageNum ul li").eq(i).find("img").attr("src","https://image.hankookilbo.com/n/icon/img_page"+(i+1)+"_on.gif");
					}else{
						$(".todayPageNum ul li").eq(i).find("img").attr("src","https://image.hankookilbo.com/n/icon/img_page"+(i+1)+"_off.gif");
					}
				}
				
			},
			prev_Slide : function(){
				--todayNum;
				if(todayNum < 0){
					todayNum=4;
				}
				$('.todayPhoto>.photo').css({ "left": "-300px" }).children(':last').prependTo($('.todayPhoto>.photo'));
				$('.todayPhoto>.photo').animate({ 'left': '0px' }, 400, function () {});
				for (var i = 0; i < 5; i++) {
					if(i == todayNum){
						$(".todayPageNum ul li").eq(i).find("img").attr("src","https://image.hankookilbo.com/n/icon/img_page" + (i+1)+"_on.gif");
					}else{
					    $(".todayPageNum ul li").eq(i).find("img").attr("src", "https://image.hankookilbo.com/n/icon/img_page" + (i + 1) + "_off.gif");
					}
				}

			},
			play_Slide : function(){
				clearInterval(timeTodaySlider);
				timeTodaySlider = setInterval(function(){todaySlider.next_Slide()},3000);
			},

			init: function () {
			    todayNum = Math.floor(Math.random() * 6);
			    if (todayNum > 5)
			        todayNum = 0;

			    for (var i = 0; i < todayNum; i++){
			        $('.todayPhoto>.photo').append($('.todayPhoto>.photo>div:eq(0)'));
			    }

			    for (var i = 0; i < 5; i++) {
			        if (i == todayNum) {
			            $(".todayPageNum ul li").eq(i).find("img").attr("src", "https://image.hankookilbo.com/n/icon/img_page" + (i+1) + "_on.gif");
			        } else {
			            $(".todayPageNum ul li").eq(i).find("img").attr("src", "https://image.hankookilbo.com/n/icon/img_page" + (i+1) + "_off.gif");
			        }
			    }
			    
			    todaySlider.play_Slide();;
			}
		};

		$('.todayPhoto>p').click(function(){
			switch ($(this).index()){
				case 0 :
					todaySlider.prev_Slide();
					todaySlider.play_Slide();
					break;
				case 1 :
					todaySlider.next_Slide();
					todaySlider.play_Slide();
					break;
			}
		});
		todaySlider.init();

		$('.footService p').eq(0).click(function(){
			if($('.footServiceCon').css("display")=="none"){
				$('.footService p').eq(0).find('span').css({"background-position":"0 -30px"})
				$('.footServiceCon').slideDown("fast");
				$('body').scrollTop("5000");
			}else{
				$('.footService p').eq(0).find('span').css({"background-position":"0 0"})
				$('.footServiceCon').slideUp("fast");
			}
		});


	$(".pageNumber ul li").click(function(){
		var pageCnt = $(".pageNumber ul li").index(this);
		if(pageCnt == 0){
			$(".bestNews ul").eq(0).show();
			$(".bestNews ul").eq(1).hide();
			$(".pageNumber ul li").eq(0).find("img").attr("src","https://image.hankookilbo.com/n/icon/img_page1_on.png");
			$(".pageNumber ul li").eq(1).find("img").attr("src","https://image.hankookilbo.com/n/icon/img_page2_off.png");
		}else{
			$(".bestNews ul").eq(0).hide();
			$(".bestNews ul").eq(1).show();
			$(".pageNumber ul li").eq(0).find("img").attr("src","https://image.hankookilbo.com/n/icon/img_page1_off.png");
			$(".pageNumber ul li").eq(1).find("img").attr("src","https://image.hankookilbo.com/n/icon/img_page2_on.png");
		}
	});











});






//
//	var MouseEvent ={
//		Navi : function(x,y){
//			if(x ==2){
//				return;
//			}
//			if(y == "show"){
//				var sub = $(".header .headerCon .inCon .subMenu");
//				var subLen = sub.length;
//				for(var i=0; i<subLen; ++i)
//				{
//					if(i==x){
//						sub.eq(i).slideDown();
//					}else{
//						sub.eq(i).hide();
//					}
//				}
//			}else if(y =="hide"){
//				$(".header .headerCon .inCon .subMenu").hide();
//			}
//		},
//		Gnb : function(x){
//			if(x =="show"){
//				$(".gnb ul").show();
//			}
//			else if(x =="hide"){
//				$(".gnb ul").hide();
//			}
//		}
//	};
//	$(".header .headerCon .inCon .navi > article.menu > ul > li").mouseenter(function(){
//		MouseEvent.Navi($(this).index(),"show");
//	});
//	$(".header .headerCon .inCon .subMenu").mouseleave(function(){
//		MouseEvent.Navi($(this).index(),"hide");
//	});

//	$(".gnb > .search_icon").mouseenter(function(){
//		MouseEvent.Gnb("show");
//	});
//	$(".gnb").mouseleave(function(){
//		MouseEvent.Gnb("hide");
//	});