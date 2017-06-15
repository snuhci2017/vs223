	var	IS_MOBILE			= /mobile|android|bada|blackberry|blazer|ip(hone|od|ad)|windows (ce|phone)/i.test(navigator.userAgent||navigator.vendor||window.opera);
	var	LOGIN_INFO			= {"isLogin":false,"uid":"","name":"","email":"","img":"","type":"", "subscription":0, "scrap":0};
	var	TRANSFORM_TYPE		= "left";
	var	TRANSITION_NAME		= "";
	var	TRANSITION_EVENT	= "";
	var	TRANSITION_DURATION	= 500;
	var	WINDOW_HEIGHT		= window.innerHeight ? window.innerHeight : jQuery(window).height();
	var	SCROLL_TOP			= 0;
	var	SCROLL_TOP_PREV		= 0;
	var	SCROLL_DIRECTION	= "stop";

	var	IS_IOS				= navigator.userAgent.toLowerCase().search(/ip(hone|ad|od)/i) > -1;
	var	IS_ANDROID			= navigator.userAgent.toLowerCase().indexOf("android")	> -1;
	var	IS_PHONEGAP			= false;
	var	IS_PHONEGAP_IOS		= false;
	var	IS_PHONEGAP_ANDROID	= false;
	var	APP_VERSION_NUMBER	= 200;
	var	APP_MARKET_TYPE		= "appstore";
	
	function	init()
	{
		haniEventManager.addResize(onResizeImage2);
		
		checkLogin();
		checkPhoneGap();
		initTransformValue();
		initAside();
		getSnsCount();
		
		haniEventManager.addScroll(onScrollHeader);
		jQuery(window).resize(function(event){haniEventManager.resize(event);});
		jQuery(document).scroll(function(event){haniEventManager.scroll(event);});
		
		haniPageManager.load();
		
		loadAdvertise();
	};
	
	function	checkLogin()
	{
		var	cookies		= document.cookie.split(";");
		var	isLogin		= false;
		var	isLogin2	= LOGIN_INFO.isLogin;
		var	uid2		= LOGIN_INFO.uid;
		var	name2		= LOGIN_INFO.name;
		var	email2		= LOGIN_INFO.email;
		var	img2		= LOGIN_INFO.img;
		var	type2		= LOGIN_INFO.type; 		

		
		for(var i=0;i<cookies.length;i++)
		{
			var	cookie	= cookies[i].trim().split("=");
			
			if ( cookie[0] == "SNS" )
			{
				var	values	= decodeURIComponent(cookie[1]).split("|");
				
				LOGIN_INFO.isLogin	= true;
				LOGIN_INFO.uid		= values[0];
				LOGIN_INFO.name		= values[1];
				LOGIN_INFO.email	= values[2];
				LOGIN_INFO.img		= values[3];
				LOGIN_INFO.type		= values[4];
				
				isLogin	= true;
				
				break;
			}
		}
		if ( !isLogin )
		{
			LOGIN_INFO.isLogin		= false;
			LOGIN_INFO.uid			= "";
			LOGIN_INFO.name			= "";
			LOGIN_INFO.email		= "";
			LOGIN_INFO.img			= "";
			LOGIN_INFO.type			= "";
			LOGIN_INFO.subscription	= 0;
			LOGIN_INFO.scrap		= 0;
		}
		
		if ( isLogin != isLogin2 )
		{
			if ( isLogin )
			{
				getMySubscriptionCount();
			}
			checkLoginIcon();
			checkLoginDisplayed();
		}
		else if ( uid2 != LOGIN_INFO.uid || name2 != LOGIN_INFO.name || email2 != LOGIN_INFO.email || img2 != LOGIN_INFO.img || type2 != LOGIN_INFO.type )
		{
			checkLoginDisplayed();
		}
	};
	
	function	checkLoginIcon()
	{
		var	objHeader	= jQuery("header.top_menu");
		if ( objHeader.length )
		{
			if ( LOGIN_INFO.isLogin )
			{
				if ( LOGIN_INFO.subscription || LOGIN_INFO.scrap )
				{
					objHeader.addClass("alert").removeClass("login").removeClass("logout");
				}
				else
				{
					objHeader.addClass("login").removeClass("logout").removeClass("alert");
				}
			}
			else
			{
				objHeader.addClass("logout").removeClass("login").removeClass("alert");
			}
		}
		
		var	objInfo	= jQuery("section.hani_personal_info");
	}
	
	function	checkLoginDisplayed()
	{
		haniFunctionManager.fire("checkLoginDisplayed", checkLoginDisplayedProcess, 500);
	};
	
	function	checkLoginDisplayedProcess()
	{
		var	objPersonal	= jQuery(".slide_personal");
		if ( objPersonal.length )
		{
			var	objLogin	= objPersonal.children("section.login_box");
			var	objUser		= objPersonal.children("section.user_info");

			if ( LOGIN_INFO.isLogin )
			{
				if ( LOGIN_INFO.img )
				{
					objUser.children(".profile").css({"background-image":"url("+LOGIN_INFO.img+")"}).show();
				}
				else
				{
					objUser.children(".profile").css({"background-image":""}).hide();
				}
				objUser.children(".name").html(LOGIN_INFO.name);
				objUser.show();
				objLogin.hide();
			}
			else
			{
				objUser.children(".profile").css({"background-image":""});
				objUser.children(".name").html("");
				objUser.hide();
				objLogin.show();
			}
		}
		
		var	objLogin	= jQuery("aside.right > main.aside > .slide_box .slide_item section.login_box");
		var	objUser		= jQuery("aside.right > main.aside > .slide_box .slide_item section.user_info");

		if ( LOGIN_INFO.isLogin )
		{
			if ( LOGIN_INFO.img )
			{
				objUser.children(".profile").css({"background-image":"url("+LOGIN_INFO.img+")"}).show();
			}
			else
			{
				objUser.children(".profile").css({"background-image":""}).hide();
			}
			objUser.children(".name").html(LOGIN_INFO.name);
			objUser.show();
			objLogin.hide();
		}
		else
		{
			objUser.children(".profile").css({"background-image":""});
			objUser.children(".name").html("");
			objUser.hide();
			objLogin.show();
		}
		
		var	objLogin	= jQuery("footer.aside.left .login a");
		if ( objLogin.length )
		{
			objLogin.html(LOGIN_INFO.isLogin ? getHtmlLinkLogout("로그아웃") : getHtmlLinkLogin("로그인") );
		}
		var	objLogin	= jQuery("footer.main .line1 .login a");
		if ( objLogin.length )
		{
			objLogin.html(LOGIN_INFO.isLogin ? getHtmlLinkLogout("로그아웃") : getHtmlLinkLogin("로그인") );
		}
	}
	
	function	onClickLink(obj)
	{
		var	objLink		= jQuery(obj);
		var	objSlideBox	= objLink.closest(".slide_box");
		var	isValid		= true;
		var	url			= objLink.attr("href");
		var	target		= objLink.attr("target");
		
		if ( objSlideBox.length )
		{
			isValid		= ["0", "1"].indexOf(objSlideBox.attr("data-status")) > -1;
		}
		
		if ( isValid && !objLink.hasClass("checked") )
		{
			var	urlInfo		= parseUrl(url);
			if ( urlInfo["target"]		)	{	objLink.attr("target",	urlInfo["target"]);			target	= urlInfo["target"];		}
			if ( urlInfo["url_changed"]	)	{	objLink.attr("href",	urlInfo["url_changed"]);	url		= urlInfo["url_changed"];	}
		}		
		
		if ( objLink.hasClass("pictorial") )
		{
			if ( url.indexOf("returnUrl") == -1 )
			{
				url	= url+"&returnUrl="+HANI_URL_MOBILE;
				objLink.attr("href", url);
			}
		}
		else if ( objLink.hasClass("goToLoginLink") )
		{
			objLink.attr("href", getUrlLogin());
		}
		else if ( objLink.hasClass("goToLogoutLink") )
		{
			objLink.attr("href", getUrlLogout());
		}		
		else if ( objLink.hasClass("goToLinkPc") )
		{
			objLink.attr("href", getUrlToPC());
		}
		
		if ( IS_PHONEGAP && target )
		{
			window.open(url, target, 'location=no,enableviewportscale=yes');
			isValid	= false;
		}
		
		return	isValid;
	};
	
	function	onClickLink_FB(obj) {
		var facebook_api_url = "http://www.facebook.com/sharer/sharer.php?u=";
		var	obj_a	= jQuery(obj);
		var	link	= obj_a.attr("href") ? obj_a.attr("href") : url;
		if ( link )
		{
			var atc_share_url = link.replace(facebook_api_url,"");
			//linkback solution add
			link = facebook_api_url + linkback.getSNSUrl("FB",atc_share_url);
			//obj_a.attr("href", link);
			window.open(link,"_blank");
	        return false;
		}
		else
		{
			return	true;
		}		
	};

	function	onClickLink_TW(obj) {
		var	obj_a	= jQuery(obj);
		var	link	= obj_a.attr("href") ? obj_a.attr("href") : url;
		if ( link )
		{
			var atc_share_url = link.split("url=");
			//linkback solution add
			link = atc_share_url[0] + linkback.getSNSUrl("TW",atc_share_url[1]);
			//obj_a.attr("href", link);
			window.open(link,"_blank");
	        return false;
		}
		else
		{
			return	true;
		}		
	};
	
	function	parseUrl(url)
	{
		var	urlInfo	= {"url":url, "url_changed":"",	"target":""};
		
		if		( url.match(/^\//gi)								)	{	}
		else if	( url.match(/http:\/\/m.hani.co.kr/gi)				)	{	urlInfo["url_changed"]	= url.replace("http://m.hani.co.kr",			"")					}
		else if	( url.match(/http:\/\/hani.co.kr/gi)				)	{	urlInfo["url_changed"]	= url.replace("http://hani.co.kr",				"")					}
		else if	( url.match(/http:\/\/www.hani.co.kr/gi)			)	{	urlInfo["url_changed"]	= url.replace("http://www.hani.co.kr",			"");				}
		else if	( url.match(/http:\/\/english.hani.co.kr/gi)		)	{	urlInfo["url_changed"]	= url.replace("http://english.hani.co.kr",		"");				}
		else if	( url.match(/http:\/\/multihani.hani.co.kr/gi)		)	{	urlInfo["url_changed"]	= url.replace("http://multihani.hani.co.kr",	"");				}
		else if	( url.match(/http:\/\/pictorial.hani.co.kr/gi)		)	{	urlInfo["url_changed"]	= url.replace("http://pictorial.hani.co.kr",	"/pictorial");		}
		else if	( url.match(/http:\/\/2014vote.hani.co.kr/gi)		)	{	urlInfo["url_changed"]	= url.replace("http://2014vote.hani.co.kr",		"/2014vote");		}
		else if	( url.match(/http:\/\/worldcup2014.hani.co.kr/gi)	)	{	urlInfo["url_changed"]	= url.replace("http://worldcup2014.hani.co.kr",	"/worldcup2014");	}
		else if	( url.match(/mailto:/gi) 							)	{	urlInfo["target"]		= "_blank";	}
		else if	( url.match(/http:\/\/h21.hani.co.kr/gi)			)	{	urlInfo["target"]		= "_blank";	}
		else if	( url.match(/http:\/\/special.hani.co.kr/gi)		)	{	urlInfo["target"]		= "_blank";	}
		else if	( url.match(/http:\/\/well.hani.co.kr/gi)			)	{	urlInfo["target"]		= "_blank";	}
		else if	( url.match(/http:\/\/ecotopia.hani.co.kr/gi)		)	{	urlInfo["target"]		= "_blank";	}
		else if	( url.match(/http:\/\/photovil.hani.co.kr/gi)		)	{	urlInfo["target"]		= "_blank";	}
		else if	( url.match(/http:\/\/scienceon.hani.co.kr/gi)		)	{	urlInfo["target"]		= "_blank";	}
		else if	( url.match(/http:\/\/babytree.hani.co.kr/gi)		)	{	urlInfo["target"]		= "_blank";	}
		else if	( url.match(/http:\/\/defence21.hani.co.kr/gi)		)	{	urlInfo["target"]		= "_blank";	}
		else if	( url.match(/https:\/\/bridge.hani.co.kr/gi)		)	{	urlInfo["target"]		= "_blank";	}
		else if	( url.match(/http:\/\/www.hanitv.com/gi)			)
		{
			urlInfo["url_changed"]	= url+(url.indexOf("?")>0?"&":"?")+"m=1";
			urlInfo["target"]		= "_blank";
		}
		else
		{
			console.log(url);
			urlInfo["target"]	= "_blank";
		}
		
		// special exception
		if (url.match(/\/arti\/ISSUE\/209\/home01.html/gi)) {
			urlInfo["url_changed"] = "http://www.hani.co.kr/arti/ISSUE/209/home01.html";
		}
		
		return	urlInfo;
	};
	
	function	initAside()
	{
		var	objBase			= jQuery(".base_contents");
		var	objContentsL	= jQuery(".base > aside.left");
		var	objContentsR	= jQuery(".base > aside.right");
		var	objSlideL		= objContentsL.find(".aside_left_slide_box");
		var	objSlideR		= objContentsR.find(".aside_right_slide_box");
		var	objScrollL		= objSlideL.find(".slide_top .menu_box_bot .aside_left_menu_slide_box");
		
		if ( TRANSFORM_TYPE == "left" )
		{
			var	leftL	= objBase.offset().left - objBase.width();
			var	leftR	= objBase.offset().left + objBase.width();
			objContentsL.css("left",leftL+"px");
			objContentsR.css("left",leftR+"px");
		}
		else
		{
			addCssTransform(objContentsL, "-100%");
			objContentsL.css("left","");
			
			addCssTransform(objContentsR, "100%");
			objContentsR.css("left","");
		}
		
		haniEventManager.addResize(onResizeAside);		
	};

	function	onResizeAside()
	{
		haniFunctionManager.fire("onResizeAside", onResizeAsideProcess, 200);
	}
	
	function	onResizeAsideProcess()
	{
		var	objContentsL	= jQuery(".base	> aside.left").height(WINDOW_HEIGHT);
		var	objContentsR	= jQuery(".base	> aside.right").height(WINDOW_HEIGHT);
		
		if ( TRANSFORM_TYPE == "left" )
		{
			var	objBase			= jQuery(".base > main");
			var	left1			= objBase.offset().left;
			var	left2			= left1 - objBase.width();
			var	left3			= left1 + objBase.width();
			objContentsL.css("left",(objContentsL.hasClass("on") ? left1 : left2)+"px");
			objContentsR.css("left",(objContentsR.hasClass("on") ? left1 : left3)+"px");
		}
	};
	
	function	openAside(type)
	{
		var	objBase		= jQuery(".base");
		var	objMain		= objBase.children("main");
		var	objAside	= objBase.children("aside."+type);
		
		objMain.attr("data-scroll-top", SCROLL_TOP);
		objAside.css({"position":"absolute", "top":SCROLL_TOP+"px"});

		jQuery(document.body).addClass("lock");
		
		if ( type == "right" )
		{
			getMySubscription();
			getMyScrap(1);
			getScrapCount(true);
		}
		
		if ( TRANSFORM_TYPE == "left" )
		{
			objAside.animate({"left":objMain.offset().left+"px"}, TRANSITION_DURATION, function()
					{
						removeTransition(objAside);
						objAside.css({"position":"fixed","top":"0px"});
						objMain.hide();
					});
		}
		else
		{
			addCssTransition(objAside, "0%", TRANSITION_DURATION, function()
					{
						removeTransition(objAside);
						objAside.css({"position":"fixed","top":"0px"});
						objMain.hide();
					});
		}
		
		objAside.addClass("on").removeClass("off");
		loadHaniImage();
	};
	
	function	closeAside(type)
	{
		var	objBase		= jQuery(".base");
		var	objMain		= objBase.children("main");
		var	objAside	= objBase.children("aside."+type);
		var	objMid		= objMain.find(".main_top_slide_box	> .slide_mid");
		var	objSlide	= objMid.children(".slide_item.selected");
		var	scrollTop	= parseInt(objMain.attr("data-scroll-top"));
		
		objMain.show();
		objMid.height(objSlide.height());
		if ( scrollTop != SCROLL_TOP )
		{
			SCROLL_TOP		= scrollTop + 100;
			SCROLL_TOP_PREV	= SCROLL_TOP;
		}
		jQuery(document.body).removeClass("lock");
		jQuery(document).scrollTop(scrollTop);
		objAside.css({"position":"absolute", "top":scrollTop+"px"});
		
		if ( TRANSFORM_TYPE == "left" )
		{
			var	left	= type == "left" ? objMain.offset().left - objMain.width() : objMain.offset().left + objMain.width();
			objAside.animate({"left":left+"px"}, TRANSITION_DURATION, function(){removeTransition(objAside);});
		}
		else
		{
			var	left	= type == "left" ? "-100%" : "100%";
			addCssTransition(objAside, left, TRANSITION_DURATION, function(){removeTransition(objAside);});
		}		
		
		objAside.addClass("off").removeClass("on");
	};
	
	function	onClickAsideLeftMenu(obj)
	{
		var	objA	= jQuery(obj);
		var	objMenu	= objA.closest(".scroll_x_item");
		if ( objMenu.hasClass("selected") )
		{
			return	onClickLink(obj);
		}
		else
		{
			onClickSlideToByQuery('.aside_left_menu_slide_box', parseInt(objMenu.attr("data-item-no")));
			return	false;
		}
	};
	
	function	viewAsideRightTab(itemNo)
	{
		var	objBase		= jQuery(".base");
		var	objMain		= objBase.children("main");
		var	objAsideL	= objBase.children("aside.left");
		var	objAsideR	= objBase.children("aside.right");
		var	objBoxR		= objAsideR.find(".aside_right_slide_box");
		var	objMenuR	= objAsideR.find(".slide_top .tc.item");
		var	objSlideR	= objAsideR.find(".slide_mid .slide_item");

		getMySubscription();
		
		objBoxR.attr("data-item-no", itemNo);

		for(var i=0;i<3;i++)
		{
			var	objMenuItem		= objMenuR.eq(i);
			var	objSlideItem	= objSlideR.eq(i);
			if ( i == itemNo )
			{
				objMenuItem.addClass("selected").removeClass("unselected");
				objSlideItem.addClass("selected").removeClass("unselected").show();
				addCssTransform(objSlideItem, "0%");
			}
			else
			{
				objMenuItem.addClass("unselected").removeClass("selected");
				objSlideItem.addClass("unselected").removeClass("selected").hide();
				addCssTransform(objSlideItem, "100%");
			}
		}
		
		objAsideL.css({"position":"absolute",	"top":"0px"}).addClass("off").removeClass("on");
		objAsideR.css({"position":"fixed",		"top":"0px"}).addClass("on").removeClass("off");
		if ( TRANSFORM_TYPE == "left" )
		{
			objAsideL.css({"left":(objMain.offset().left - objMain.width())+"px"});
			objAsideR.css({"left":objMain.offset().left+"px"});
		}
		else
		{
			addCssTransform(objAsideL, "-100%");
			addCssTransform(objAsideR, "0%");
		}
	};
	
	function	viewMainSlideTab(itemNo)
	{
		var	objBase		= jQuery(".base");
		var	objMain		= objBase.children("main");
		var	objAside	= objBase.children("aside.right");
		var	objMid		= objMain.find(".main_top_slide_box	> .slide_mid");
		var	objSlide	= objMid.children(".slide_item.selected");
		var	scrollTop	= parseInt(objMain.attr("data-scroll-top"));
		
		objMain.show();
		objMid.height(objSlide.height());
		if ( scrollTop != SCROLL_TOP )
		{
			SCROLL_TOP		= scrollTop + 100;
			SCROLL_TOP_PREV	= SCROLL_TOP;
		}
		jQuery(document.body).removeClass("lock");
		jQuery(document).scrollTop(scrollTop);
		objAside.css({"position":"absolute", "top":scrollTop+"px"});
		
		if ( TRANSFORM_TYPE == "left" )
		{
			objAside.css({"left":objMain.offset().left+"px"});
		}
		else
		{
			addCssTransform(objAsideR, "0%");
		}		
		
		objAside.addClass("off").removeClass("on");
	};
	
	function	toggleAsideLeftSectionList(obj)
	{
		var	objButton		= jQuery(obj);
		var	objFooter		= objButton.closest("footer.aside.left");
		var	objList			= objFooter.find(".section_list");
		var	objSlideItem	= objFooter.closest(".slide_item");
		var	objSection		= objSlideItem.children("section");
		
		if ( objList.hasClass("on") )
		{
			objList.hide().addClass("off").removeClass("on");
		}
		else
		{
			objList.show().addClass("on").removeClass("off");
			objSlideItem.animate({"scrollTop":objSection.height()+"px"});
		}
	};
	
	function	changeTabBox(obj)
	{
		var	objItem			= jQuery(obj);
		var	objBox			= objItem.closest(".tab_box");
		var	objTop			= objBox.children(".tab_top");
		var	objTopTr		= objTop.children(".tr");
		var	objMid			= objBox.children(".tab_mid");
		var	objTopItemList	= objTopTr.children(".top_item");
		var	objMidItemList	= objMid.children(".mid_item");
		
		var	tabNo			= parseInt(objItem.attr("data-tab-no"));
		
		for(var i=0;i<objTopItemList.length;i++)
		{
			if ( i == tabNo )
			{
				objTopItemList.eq(i).addClass("selected").removeClass("unselected");
			}
			else
			{
				objTopItemList.eq(i).addClass("unselected").removeClass("selected");
			}
		}
		for(var i=0;i<objMidItemList.length;i++)
		{
			if ( i == tabNo )
			{
				objMidItemList.eq(i).addClass("selected").removeClass("unselected").show();
			}
			else
			{
				objMidItemList.eq(i).addClass("unselected").removeClass("selected").hide();
			}
		}
	};
	
	function	getSnsCount()
	{
		haniFunctionManager.fire("getSnsCount", getSnsCountProcess, 500);
	};
	
	function	getSnsCountProcess()
	{
		var	snsCountList	= jQuery("article	.sns_count.off");
		var	articleList		= [];
		for(var i=0;i<snsCountList.length;i++)
		{
			var	articleNo	= parseInt(snsCountList.eq(i).attr("data-article-no"));
			if ( articleNo )
			{
				articleList.push(articleNo);
			}
		}
		
		jQuery.getScript("http://rankapi.hani.co.kr/api/snscnt.php?callback=setSnsCount&kisasn="+articleList.join());
	};
		
	function	setSnsCount(data)
	{
		for(var i=0;i<data.length;i++)
		{
			for(var j in data[i])
			{
				var	snsCountItem	= data[i][j];
				var	objItem			= jQuery(".sns_count.off[data-article-no="+snsCountItem.kisasn+"]");
				var	html			= "";
				
				for(var k=0;k<objItem.length;k++)
				{
					var	objItem2	= objItem.eq(k);
					if ( snsCountItem.snscnt )
					{
						html	= "<div class='sns_box'>"+snsCountItem.snscnt+"</div>";
					}				
					if ( snsCountItem.cmt && objItem2.hasClass("with_reply") )
					{
						html	+= "<div class='reply_box'>"+snsCountItem.cmt+"</div>";
					}
					
					if ( html )
					{
						objItem2.html(html).addClass("on").removeClass("off");
					}
				}
			}
		}
		
		haniEventManager.resize();
	};
	
	function	getUrlLogin()
	{
		return	"http://bridge.hani.co.kr/Hani/UserMobile?command=form&formtype=login&nexturl="+encodeURIComponent(HANI_URL_MOBILE);
	};
	
	function	getUrlLogout()
	{
		return	"https://bridge.hani.co.kr/Hani/User?command=logout&site=news&nexturl="+encodeURIComponent(HANI_URL_MOBILE);
	};
	
	function	getUrlToPC()
	{
		return	HANI_URL_WWW.indexOf("?") == -1 ? HANI_URL_WWW+"?fromMobile" : HANI_URL_WWW+"&fromMobile";
	};
	
	function	getHtmlLink(html, url)
	{
		return	'<a href="'+url+'" class="checked" onclick="javascript:return onClickLink(this);">'+html+'</a>';
	};
	
	function	getHtmlLinkLogin(html)
	{
		return	getHtmlLink(html, getUrlLogin());
	};
	
	function	getHtmlLinkLogout(html)
	{
		return	getHtmlLink(html, getUrlLogout());
	};	
	
	function	getHtmlLinkFacebook(url)
	{
		return	"http://www.facebook.com/sharer/sharer.php?u="+url;
	};
	
	function	getHtmlLinkTwitter(url, title)
	{
		return	"http://twitter.com/share?text="+title+"&url="+url;
	};
	
	function	getHtmlLinkGoogle(url)
	{
		return	"https://plus.google.com/share?url="+url;
	};
	
	function	getHtmlLinkNaver(url)
	{
		return	"http://blog.naver.com/openapi/share?url="+url;
	};
	
	function	getHtmlLinkKakaostory(url)
	{
		return	"https://story.kakao.com/share?url="+url;
	};

	function	getHtmlLinkEmail(articleNo)
	{
		return	"http://www.hani.co.kr/popups/sendmail.hani?ksn="+articleNo;
	};
	
	function	sendToKakaotalk(obj)
	{
		var	objLink			= jQuery(obj);
		var	url				= objLink.attr("data-share-url");
		var	title			= objLink.attr("data-share-title");
		var	storeUrlIos		= 'http://itunes.apple.com/us/app/kakaotalk/id362057947?mt=8';
		var	storeUrlAnd		= 'market://details?id=com.kakao.talk';
		var	storeUrlTstore	= "tstore://PRODUCT_VIEW/0000207200/0";		
		var	kakaoApiKey		= "796fdcda56cee32db2cb9f43d28119f5";

		var	appObject	= '%5B%7B%22objtype%22%3A%22label%22%2C%22text%22%3A%22'+title+'%5Cr%5Cn'+url+'%22%7D%5D';
		var	appExtra	= '%7B%22KA%22%3A%22sdk%2F1.0.22%20os%2Fjavascript%20lang%2F'+(navigator.userLanguage || navigator.language)+'%20device%2F'+navigator.platform.replace(/ /g, '_')+'%22%2C%22origin%22%3A%22'+encodeURIComponent(window.location.origin)+'%22%7D';
		var	appUrl		= 'kakaolink://send?appkey='+kakaoApiKey+'&appver=1.0&apiver=3.0&linkver=3.5&extras='+appExtra+'&objs='+appObject;

		if ( IS_PHONEGAP_IOS )
		{
			cordova.exec(null, null, "callNativeApp", "call", [appUrl, storeUrlIos]);
		}
		else if ( IS_PHONEGAP_ANDROID )
		{
			if ( APP_MARKET_TYPE == "tstore" )
			{
				cordova.exec(null, null, "callNativeApp", "call", [appUrl, storeUrlTstore, storeUrlAnd]);
			}
			else
			{
				cordova.exec(null, null, "callNativeApp", "call", [appUrl, storeUrlAnd]);
			}
		}
		else if ( IS_IOS )
		{
			var	clickTime	= (new Date()).getTime();
			location.href	= appUrl;
			setTimeout(function(){callKakaotalkAppCheck(storeUrlIos, clickTime);},1500);
		}
		else if ( IS_ANDROID )
		{
			window.location = "intent:"+appUrl+"#Intent;package=com.kakao.talk;end;";
		}
	};

	function	callKakaotalkAppCheck(storeUrl, clickTime)
	{
		var	nowTime	= (new Date()).getTime();
		if ( nowTime - clickTime < 2000 )
		{
			location.href	= storeUrl;
		}
	};
	
	function	onResizeImage2()
	{
		haniFunctionManager.fire("onResizeImage2", onResizeImage2Process, 500);
	}
	
	function	onResizeImage2Process()
	{
		var	objUlList	= jQuery("ul.image2");
		for(var i=0;i<objUlList.length;i++)
		{
			var	objUlItem	= objUlList.eq(i);
			var	objLiList	= objUlItem.children("li.image2");
			
			var	objL		= null;
			var	objR	= null;
			for(var j=0;j<objLiList.length;j++)
			{
				var	objLiItem	= objLiList.eq(j);
				if ( objLiItem.hasClass("left") )
				{
					objL	= objLiItem;
					objR	= null;
				}
				else if ( objL && objLiItem.hasClass("right") )
				{
					objR	= objLiItem;
					var	objBotL		= objL.find("> article > .bot");
					var	objBotR		= objR.find("> article > .bot");
					var	objTextL1	= objBotL.children(".text");
					var	objTextR1	= objBotR.children(".text");
					
					for(var k=0;k<objTextL1.length&&k<objTextR1.length;k++)
					{
						var	objTextL2	= objTextL1.eq(k);
						var	objTextR2	= objTextR1.eq(k);
						var	heightL		= objTextL2.children().eq(0).height();
						var	heightR		= objTextR2.children().eq(0).height();
						
						if ( heightL > heightR )
						{
							objTextL2.height(heightL);
							objTextR2.height(heightL);
						}
						else
						{
							objTextL2.height(heightR);
							objTextR2.height(heightR);
						}
					}					
				}
				else
				{
					objL	= null;
					objR	= null;
				}
			}
		}
	};
	
	function	initTransformValue()
	{
		var	obj		= jQuery(document.body);
		var	cssList	= [];
		cssList.push(["-webkit-transform",	"-webkit-transition",	"webkitTransitionEnd"]);
		cssList.push(["-ms-transform",		"-ms-transition",		"transitionend"]);
		cssList.push(["-moz-transform",		"-moz-transition",		"transitionend"]);
		cssList.push(["-o-transform",		"-o-transition",		"oTransitionEnd"]);
		cssList.push(["transform",			"transition",			"transitionend"]);
		
		for(var i=0;i<cssList.length;i++)
		{
			var	cssItem	= cssList[i];
			if ( typeof obj.css(cssItem[0]) !== "undefined" )
			{
				TRANSFORM_TYPE		= cssItem[0];
				TRANSITION_NAME		= cssItem[1];
				TRANSITION_EVENT	= cssItem[2];
				break;
			}
		}
	};
	
	function	addCssTransform(obj, left)
	{
		if ( obj )
		{
			if ( TRANSFORM_TYPE == "left" )
			{
				obj.css("left", left);
			}
			else
			{
				obj.css(TRANSFORM_TYPE, "translate3d("+left+", 0px, 0px)");
			}		
		}
	};
	
	function	addCssTransition(obj, left, duration, func)
	{
		if ( obj )
		{
			if ( TRANSFORM_TYPE == "left" )
			{
				obj.animate({"left":left}, duration, "swing", func);
			}
			else
			{
				if ( func )
				{
					obj.on(TRANSITION_EVENT, func)
				}
				obj.css(TRANSITION_NAME, TRANSFORM_TYPE+" "+duration+"ms ease-in-out").css(TRANSFORM_TYPE, "translate3d("+left+",0px,0px)");
			}
		}
	};
	
	function	removeTransition(obj)
	{
		obj.css(TRANSITION_NAME, "").off(TRANSITION_EVENT);
	};
	
	function	search(obj)
	{
		var	objButton	= jQuery(obj);
		var	objBox		= objButton.parent();
		var	objInput	= objBox.children("input");
		
		if ( objInput.val().length < 2 )
		{
			alert("검색어를 2자 이상 입력해 주셔야 합니다.");
			objInput.focus();
		}
		else
		{
			window.location.replace("/arti/SEARCH/all/date/"+encodeURIComponent(objInput.val())+"/home01.html");
		}
	};
	
	function	searchByEnter(event, obj)
	{
		if ( event.keyCode == 13 )
		{
			var	objButton	= jQuery(obj);
			var	objBox		= objButton.parent();
			var	objInput	= objBox.children("input");
			
			if ( objInput.val().length < 2 )
			{
				alert("검색어를 2자 이상 입력해 주셔야 합니다.");
				objInput.focus();
			}
			else
			{
				window.location.replace("/arti/SEARCH/all/date/"+encodeURIComponent(objInput.val())+"/home01.html");
			}
			return	false;
		}
		else
		{
			return	true;
		}
	};
	
	function	goToMainSubscription()
	{
		var	objBox	= jQuery(".main_top_slide_box");
		if ( objBox.length )
		{
			objBox.attr("data-item-no", 2);
			var	objMenu		= jQuery("header.top_menu > .box > .bot.tb > .tr > .tc");
			var	objSlide	= objBox.find("> .slide_mid > .slide_item");
			
			for(var i=0;i<3;i++)
			{
				if ( i == 2 )
				{
					objMenu.eq(i).addClass("selected").removeClass("unselected");
					objSlide.eq(i).addClass("selected").removeClass("unselected");
					addCssTransform(objSlide.eq(i), "0%");
					if ( IS_IOS )
					{
						objItem.show();
					}
				}
				else
				{
					objMenu.eq(i).addClass("unselected").removeClass("selected");
					objSlide.eq(i).addClass("unselected").removeClass("selected");
					addCssTransform(objSlide.eq(i), "100%");
					if ( IS_IOS )
					{
						objItem.hide();
					}
				}
			}
			
			jQuery("main.main").attr("data-scroll-top", 0);
			closeAside("right");
		}
		else
		{
			window.location.replace("/#subscription");
		}
	};
	
	function	openGoToSubscription()
	{
		var	objSubscription	= jQuery("aside.right > main > .subscription");
		objSubscription.css({"line-height":WINDOW_HEIGHT+"px"}).show();
	};
	
	function	closeGoToSubscription()
	{
		var	objSubscription	= jQuery("aside.right > main > .subscription");
		objSubscription.hide();
	};
	
	function	closeAdTop2()
	{
		jQuery(".adTop2Padding").removeClass("adTop2Padding");
		jQuery(".adBox.adTop2").remove();
		haniEventManager.resize();
	};
	
	function	onScrollHeader()
	{
		var	objBody		= jQuery(document.body);
		if ( objBody.hasClass("lock") )
		{
			var	windowHeight	= WINDOW_HEIGHT;
			
			WINDOW_HEIGHT	= window.innerHeight ? window.innerHeight : jQuery(window).height();
			
			if ( windowHeight != WINDOW_HEIGHT )
			{
				haniEventManager.resize();
			}
		}
		else
		{
			var	objHeader	= jQuery("header.top_menu");
			var	objBox		= objHeader.children(".box");
			var	heightTop	= objBox.children(".top").height();
			var	topStatus	= objBox.attr("data-status");
			
			if ( objHeader.hasClass("article" ) )
			{
				var	objMid	= objBox.children(".mid");
				if ( SCROLL_TOP <= heightTop )
				{
					if ( topStatus == "share" )
					{
						objBox.attr("data-status", "normal");
						objBox.addClass("normal").removeClass("share");
						objMid.fadeOut();
					}
					else if ( topStatus == "menu" )
					{
						objBox.attr("data-status", "normal");
						objBox.addClass("normal").removeClass("menu");
					}
				}
				else
				{
					if ( SCROLL_DIRECTION == "top" )
					{
						if ( topStatus == "share" )
						{
							objBox.attr("data-status", "menu");
							objBox.addClass("menu").removeClass("share");
							objMid.stop().fadeOut();
						}
					}
					else if ( SCROLL_DIRECTION == "bottom" )
					{
						if ( topStatus == "normal" )
						{
							objBox.attr("data-status", "share");
							objMid.stop().fadeIn(function(){objBox.addClass("share").removeClass("normal");});
						}
						else if ( topStatus == "menu" )
						{
							objBox.attr("data-status", "share");
							objMid.stop().fadeIn(function(){objBox.addClass("share").removeClass("menu");});
						}
					}
				}
			}
			else
			{
				if ( SCROLL_TOP == 0 )
				{
					objBox.stop().css({"position":"","top":""}).attr("data-status", "normal");
					objBox.addClass("normal").removeClass("fixed");
				}
				else if ( SCROLL_TOP <= heightTop )
				{
					if ( topStatus == "off" )
					{
						objBox.stop().css({"position":"","top":""}).attr("data-status", "normal");
						objBox.addClass("normal").removeClass("fixed");
					}
				}
				else
				{
					if ( SCROLL_DIRECTION == "top" )
					{
						if ( topStatus == "off" )
						{
							objBox.stop().attr("data-status", "on").animate({"top":"0px"});
							objBox.addClass("fixed").removeClass("normal");
						}
					}
					else if ( SCROLL_DIRECTION == "bottom" )
					{
						if ( topStatus == "normal" )
						{
							objBox.stop().attr("data-status", "off").css({"position":"fixed","top":-heightTop+"px"});
							objBox.addClass("fixed").removeClass("normal");
						}
						else if ( topStatus == "on" )
						{
							objBox.stop().attr("data-status", "off").animate({"top":-heightTop+"px"});
							objBox.addClass("fixed").removeClass("normal");
						}
					}
				}
			}
		}
	};
	
	function	strToDate(str, type)
	{
		if ( str )
		{
			var	matches	= str.match(/^([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})$/);
			
			if ( matches && matches.length == 7 )
			{
				if ( type == "type1" )
				{
					return	matches[1]+"년 "+matches[2]+"월 "+matches[3]+"일 "+matches[4]+":"+matches[5];
				}
				else if ( type == "type2" )
				{
					return	matches[1]+"년 "+matches[2]+"월 "+matches[3]+"일";
				}
			}
		}
		return	str;
	};
	
	function	loadAdvertise(obj)
	{
		var	objAdList	= [];
		
		if ( obj )
		{
			objAdList	= obj.find(".adBox.article");
			
			var	articleNo	= obj.attr("data-article-no");
			
			if ( articleNo )
			{
				var	objAd	= jQuery(".adBox.adTop2");
				if ( objAd.length )
				{
					var	objItem		= objAd.children(".adItem");
					var	url			= decodeURIComponent(objAd.attr("data-advertise-url"))+"&kisasn="+articleNo;
					if ( IS_PHONEGAP )
					{
						if ( IS_PHONEGAP_ANDROID )
						{
							url	+= "&app=android&ver="+APP_VERSION_NUMBER;
						}
						else if ( IS_PHONEGAP_IOS )
						{
							url	+= "&app=ios&ver="+APP_VERSION_NUMBER;
						}
					}
					var	html	= '<iframe src="'+url+'" seamless="seamless" frameborder="0" scrolling="no" marginwidth="0" marginheight="0"></iframe>';
					
					objItem.html(html);
				}
			}
		}
		else
		{
			objAdList	= jQuery(".adBox.init");
		}
		
		for(var i=0;i<objAdList.length;i++)
		{
			var	objAd		= objAdList.eq(i);
			var	objItem		= objAd.children(".adItem");
			var	url			= decodeURIComponent(objAd.attr("data-advertise-url"));
			
			if ( IS_PHONEGAP )
			{
				if ( IS_PHONEGAP_ANDROID )
				{
					url	+= "&app=android&ver="+APP_VERSION_NUMBER;
				}
				else if ( IS_PHONEGAP_IOS )
				{
					url	+= "&app=ios&ver="+APP_VERSION_NUMBER;
				}
				
				if ( objAd.hasClass("adBottom") )
				{ // adBottom -> adBottom1 at MobileApp
					objAd.addClass("adBottom1").removeClass("adBottom");
					url		= url.replace("@Bottom", "@Bottom1");
					objAd.attr("data-advertise-url", url);
				} else if (objAd.hasClass("adTop") && /a_main@Top/.test(url)) {
					// adTop -> adTop1 at mobileApp
					//objAd.addClass("adTop1").removeClass("adTop");
					url		= url.replace("a_main@Top", "a_main@Top1");
					objAd.attr("data-advertise-url", url);
				}
			}
			
			var	html	= '<iframe src="'+url+'" seamless="seamless" frameborder="0" scrolling="no" marginwidth="0" marginheight="0"></iframe>';
				
			objItem.html(html);
		}
	};
	
	function	checkPhoneGap()
	{
		try
		{
			if ( window.location.hash )
			{
				var	hash	= window.location.hash.replace("#", "");
				var	params	= hash.split("&");
				var	param	= [];
				for(var i=0;i<params.length;i++)
				{
					var	parts	= params[i].split("=");
					if ( parts[0] == "app" )
					{
						if ( parts[1] == "ios" )
						{
							IS_PHONEGAP			= true;
							IS_PHONEGAP_IOS		= true;
							APP_VERSION_NUMBER	= 200;
							APP_MARKET_TYPE		= "appstore";
						}
						else if ( parts[1] == "android" )
						{
							IS_PHONEGAP			= true;
							IS_PHONEGAP_ANDROID	= true;
							APP_VERSION_NUMBER	= 200;
							APP_MARKET_TYPE		= "googleplay";
						}
						else
						{
							IS_PHONEGAP			= false;
							IS_PHONEGAP_ANDROID	= false;
							APP_MARKET_TYPE		= "";

							if ( window.localStorage )
							{
								window.localStorage.isPhonegap		= "";
								window.localStorage.isPhonegapIos	= "";
								window.localStorage.isPhonegapAnd	= "";
								window.localStorage.appVersion		= APP_VERSION_NUMBER;
								window.localStorage.appMarketType	= "";
							}
						}
					}
					else if ( parts[0] == "ver" )
					{
						APP_VERSION_NUMBER	= parseInt(parts[1]);
					}
					else if ( parts[0] == "market" )
					{
						APP_MARKET_TYPE		= parts[1];
					}
				}
			}

			if ( window.localStorage )
			{
				if ( IS_PHONEGAP )
				{
					window.localStorage.isPhonegap		= IS_PHONEGAP ? "T" : "F";
					window.localStorage.isPhonegapIos	= IS_PHONEGAP_IOS ? "T" : "F";
					window.localStorage.isPhonegapAnd	= IS_PHONEGAP_ANDROID ? "T" : "F";
					window.localStorage.appVersion		= APP_VERSION_NUMBER;
					window.localStorage.appMarketType	= APP_MARKET_TYPE;
				}
				else if ( window.localStorage.isPhonegap )
				{
					IS_PHONEGAP			= window.localStorage.isPhonegap == "T";
					IS_PHONEGAP_IOS		= window.localStorage.isPhonegapIos == "T";
					IS_PHONEGAP_ANDROID	= window.localStorage.isPhonegapAnd == "T";
					APP_VERSION_NUMBER	= window.localStorage.appVersion ? parseInt(window.localStorage.appVersion) : 200;
					APP_MARKET_TYPE		= window.localStorage.appMarketType ? window.localStorage.appMarketType : "";
				}
			}

			if ( IS_PHONEGAP )
			{
				var	app_version_list	= [];
				app_version_list[200]	= "2.0.0";
				app_version_list[210]	= "2.1.0";
				app_version_list[220]	= "2.2.0";
				app_version_list[224]	= "2.2.4";
				app_version_list[230]	= "2.3.0";
				app_version_list[240]	= "2.4.0";
				app_version_list[241]	= "2.4.1";
				app_version_list[250]	= "2.5.0";
				app_version_list[251]	= "2.5.1";
				app_version_list[260]	= "2.6.0";
				app_version_list[261]	= "2.6.1";
				app_version_list[262]	= "2.6.2";
				app_version_list[263]	= "2.6.3";

				if ( app_version_list[APP_VERSION_NUMBER] )
				{
					APP_VERSION_STRING	= app_version_list[APP_VERSION_NUMBER];
				}
				else
				{
					APP_VERSION_NUMBER	= 200;
					APP_VERSION_STRING	= "2.0.0";
				}

				if ( IS_PHONEGAP_ANDROID )
				{
					if ( APP_VERSION_NUMBER < 250 )
					{
						jQuery.getScript("/section-homepage/svc3mobile/js/app.phonegap/cordova.android.2.4.0.js");
					}
					else
					{
						jQuery.getScript("/section-homepage/svc3mobile/js/app.phonegap/3.6.3/cordova.js");
					}
				}
				if ( IS_PHONEGAP_IOS )
				{
					jQuery.getScript("/section-homepage/svc3mobile/js/app.phonegap/cordova.ios.2.4.0.js");
				}
			}
		}
		catch(e)
		{
			
		}
	};
	
	function	HaniFunctionManager()
	{
		this.item	= [];
		
		this.fire	= function(name, func, duration)
		{
			var	item	= {};
			if ( this.item[name] )
			{
				item	= this.item[name];
			}
			else
			{
				item.func		= func;
				item.status		= "wait";
				item.timeout	= null;
				item.duration	= duration;
				this.item[name]	= item;
			}
			
			if ( item.status == "wait" )
			{
				if ( item.timeout )
				{
					clearTimeout(item.timeout);
				}
				var	that	= this;
				item.timeout	= setTimeout(function(){that.run(that, name);}, item.duration);
			}
			else if ( item.status == "run" )
			{
				item.func();
				item.timeout	= null;
				item.status		= "wait";
			}
		}
		
		this.run	= function(that, name)
		{
			var	item		= that.item[name];
			item.timeout	= null;
			item.status		= "run";
			that.fire(name);
		}
	};
	
	function	HaniEventManager()
	{
		this.functions			= {};
		this.functions.resize	= [];
		this.functions.scroll	= [];
		
		this.addResize	= function(func)
		{
			if ( this.functions.resize.indexOf(func) == - 1)
			{
				this.functions.resize.push(func);
			}
		};
		
		this.addScroll	= function(func)
		{
			if ( this.functions.scroll.indexOf(func) == - 1)
			{
				this.functions.scroll.push(func);
			}
		};
		
		this.resize		= function(event)
		{
			WINDOW_HEIGHT	= window.innerHeight ? window.innerHeight : jQuery(window).height();
			for ( var i in this.functions.resize )
			{
				this.functions.resize[i]();
			}
		};
		
		this.scroll		= function(event)
		{
			var	scrollTopPrev	= SCROLL_TOP;
			var	windowHeight	= WINDOW_HEIGHT;
			
			SCROLL_TOP_PREV		= SCROLL_TOP;
			SCROLL_TOP			= jQuery(document).scrollTop();
			SCROLL_DIRECTION	= SCROLL_TOP == scrollTopPrev ? "stop" : ( SCROLL_TOP > scrollTopPrev ? "bottom" : "top" );
			
			for ( var i in this.functions.scroll )
			{
				this.functions.scroll[i]();
			}
		};
	}
	
	function	HaniPageManager()
	{
		this.type	= [];
		this.type.push({"query":".hani_ranking_main",			"url":"/arti/HTML_PARTS/rankingmain.html",			"text":""});
		this.type.push({"query":".hani_ranking_subscription",	"url":"/arti/HTML_PARTS/rankingsubscription.html",	"text":""});
		this.type.push({"query":".hani_suggest_subscription",	"url":"/arti/HTML_PARTS/suggestsubscription.html",	"text":""});
		this.type.push({"query":".hani_ranking_tab",			"url":"/arti/HTML_PARTS/rankingtab.html",			"text":""});
		this.type.push({"query":".hani_ranking_tab_politics",	"url":"/arti/HTML_PARTS/rankingtabpolitics.html",	"text":""});
		this.type.push({"query":".hani_ranking_slide",			"url":"/arti/HTML_PARTS/rankingslide.html",			"text":""});
		this.type.push({"query":".hani_ranking_slide_polibar",	"url":"/arti/HTML_PARTS/rankingslidepolibar.html",	"text":""});
		this.type.push({"query":"main.aside.left",				"url":"/arti/HTML_PARTS/asideleft.html",			"text":""});
		this.type.push({"query":"main.aside.right",				"url":"/arti/HTML_PARTS/asideright.html",			"text":""});
		this.type.push({"query":".huffingtonpost",				"url":"/arti/HTML_PARTS/huffingtonpost.html",		"text":""});
		this.type.push({"query":".hani_ranking_tab_economy",	"url":"/arti/HTML_PARTS/rankingtabeconomy.html",		"text":""});
		
		this.load	= function()
		{
			for(var i=0;i<this.type.length;i++)
			{
				var	type	= this.type[i];
				var	objBox	= jQuery(type["query"]+".off");
				if ( objBox.length )
				{
					if ( type.text )
					{
						objBox.html(type.text).removeClass("off");
					}
					else
					{
						var ajaxOption		= new Object();
						ajaxOption.url		= type["url"];
						ajaxOption.cache	= false;
						ajaxOption.dataType	= "text";
						ajaxOption.success	= function(text){haniPageManager.set(this.itemNo, text);};
						ajaxOption.itemNo	= i;
						
						jQuery.ajax(ajaxOption);
					}
				}
			}
			initSlideBox();
			getSnsCount();
			checkLoginDisplayed();
			initSubscription();
		};
		
		this.set	= function(i, text)
		{
			this.type[i].text	= text;
			
			jQuery(this.type[i]["query"]+".off").html(text).removeClass("off");
			
			initSlideBox();
			getSnsCount();
			checkLoginDisplayed();
			initSubscription();
		};
	};
	
	function	debuglog(data)
	{
		if ( window.SERVER_MODE == "develop" )
		{
			console.log(data);
		}
	};
	
	function	elogn(txt)
	{
		elog(txt+"<br/>");
	};
	
	function	elog(txt)
	{
		var	objBase	= jQuery(".base");
		var	objLog	= objBase.children(".log");
		if ( !objLog.length )
		{
			objLog	= jQuery("<div/>");
			objLog.addClass("log");
			objBase.append(objLog);
		}
		
		objLog.html(txt+objLog.html());
	};
	
	jQuery(document).ready(init);
	
	window.haniFunctionManager	= new HaniFunctionManager();
	window.haniEventManager		= new HaniEventManager();
	window.haniPageManager		= new HaniPageManager();