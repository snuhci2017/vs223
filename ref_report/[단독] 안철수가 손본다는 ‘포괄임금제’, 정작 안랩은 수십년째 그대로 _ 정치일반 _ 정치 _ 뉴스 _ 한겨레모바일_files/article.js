	var	haniArticleList	= [];
	var	haniDableUid	= "";
	var	setTimeNav_horizon;
	var	setTimeNav_vertical;

	function	initArticleBox()
	{
		var	objNav		= jQuery("header.top_menu.article > .box > .bot > nav.article");
		var	objSlides	= jQuery(".slide_article");
		var	objSlide	= objSlides.eq(0);
		var	objSection	= objSlide.children("section.article[data-item-no=0]");
		var	articleNo	= objSection.attr("data-article-no");
		var	item		= haniArticleList[articleNo];
		if ( item )
		{
			objSlide.attr("data-article0-type",	item["article_type"]);
			collectHaniSnsCount(item["url_share"]);
		}

		if ( IS_IOS || IS_ANDROID || IS_PHONEGAP )
		{
			jQuery(".base > .article_share .box ul li.kakao").show();
		}

		getArticleBox(1, 0);
		getArticleDableUid();
		initArticleFontSize();
		loadAdvertise(objSection);

		for(var i=0;i<objSlides.length;i++)
		{
			var	objItem	= jQuery("<div/>");

			objItem.addClass("button").attr("data-item-no", i).addClass(i==0?"selected":"unselected");

			objNav.append(objItem);
		}

		haniEventManager.addScroll(onScrollArticle);
		haniEventManager.addResize(onResizeArticle);
		showNavigateArrow("horizon");

	};

	function	getArticleBox(idx1, idx2)
	{
		var	objSlide	= jQuery(".slide_article[data-item-no="+idx1+"]");
		var	objSection	= objSlide.children("section.article.off[data-item-no="+idx2+"]");
		if ( objSection )
		{
			var	articleNo	= objSection.attr("data-article-no");
			if ( articleNo )
			{
				jQuery.get("/arti/TEXT/"+articleNo+".html", {}, function(text){setArticleBox(text, articleNo);}, "text");
			}
		}

	};

	function	setArticleBox(text, articleNo)
	{
		var	objSection	= jQuery("section.article.off[data-article-no="+articleNo+"]");

		objSection.removeClass("off");
		objSection.html(text);

		haniPageManager.load();
	};

	function	setArticleInfo(idx1, idx2)
	{
		var	objSlide	= jQuery(".slide_article[data-item-no="+idx1+"]");
		var	objNav		= jQuery("header.top_menu.article > .box > .bot > nav.article");
		if ( objSlide )
		{
			var	objSection	= objSlide.children("section.article[data-item-no="+idx2+"]");

			if ( objSection )
			{
				var	articleNo	= objSection.attr("data-article-no");

				objSlide.attr("data-item-selected", idx2);
				objSlide.find("section.selected").removeClass("selected");
				objSection.addClass("selected");

				if ( articleNo )
				{
					var	item		= haniArticleList[articleNo];
					if ( item )
					{
						var	objHeader		= jQuery("header.top_menu");
						if ( objHeader.length )
						{
							if ( item["article_type"] == "article0" )
							{
								objHeader.addClass("article0").removeClass("article1");
							}
							else
							{
								objHeader.addClass("article1").removeClass("article0");
							}

							var	objHeaderTitle	= objHeader.find("> .box > .top > .title");
							if ( objHeaderTitle.length )
							{
								objHeaderTitle.find("a").attr("href", item["logo_url"]).html(item["logo_title"]);;
							}
						}

						jQuery("a.goToLoginLink").attr("href", "http://bridge.hani.co.kr/Hani/UserMobile?command=form&formtype=login&nexturl="+encodeURIComponent(item["url_mobile"]));
						jQuery("a.goToLogoutLink").attr("href", "https://bridge.hani.co.kr/Hani/User?command=logout&site=news&nexturl="+encodeURIComponent(item["url_mobile"]));
						jQuery("a.goToLinkPc").attr("href", item["url"]+"?fromMobile");
						jQuery("a.goToLinkFacebook").attr("href", getHtmlLinkFacebook(item["og:url"]));
						jQuery("a.goToLinkTwitter").attr("href", getHtmlLinkTwitter(item["og:url"], item["og:title"]));
						jQuery("a.goToLinkGoogle").attr("href", getHtmlLinkGoogle(item["og:url"]));
						jQuery("a.goToLinkNaver").attr("href", getHtmlLinkNaver(item["og:url"]));
						jQuery("a.goToLinkKakaotalk").attr("data-share-url", item["og:url"]).attr("data-share-title", item["og:title"]);
						jQuery(".goToLinkScrap").attr("data-scrap-url", encodeURIComponent(item["og:url"])).attr("data-scrap-title", encodeURIComponent(item["og:title"])).attr("data-scrap-section", encodeURIComponent(item["sec_name1"])).attr("data-scrap-status", "none");
						jQuery("a.goToLinkEmail").attr("href", getHtmlLinkEmail(articleNo));

						HANI_URL_WWW	= item["url"];
						HANI_URL_MOBILE	= item["url_mobile"];

						jQuery(".article_reply").attr("data-article-no", articleNo);
						jQuery(".article_reply")

						if ( window.history.pushState )
						{
							window.history.pushState(articleNo, item["head_title"], item["url_relative"]);
						}

						collectHaniSnsCount(item["url_share"]);
						loadAdvertise(objSection);
						initScrap();

						jQuery("meta[property='og:url'			]").attr("content", item["og:url"]);
						jQuery("meta[property='og:title'		]").attr("content", item["og:title"]);
						jQuery("meta[property='og:image'		]").attr("content", item["og:image"]);
						jQuery("meta[property='og:image:type'	]").attr("content", item["og:image:type"]);
						jQuery("meta[property='og:image:width'	]").attr("content", item["og:image:width"]);
						jQuery("meta[property='og:image:height'	]").attr("content", item["og:image:height"]);
						jQuery("meta[property='og:description'	]").attr("content", item["og:description"]);
						jQuery("link[rel=canonical				]").attr("href",	item["url"]);
						jQuery("head > title").html(item["head_title"]);

						if	( item["sec_name1"]			)	{	ga('set',	'dimension3',	item["sec_name1"]);							} else { ga('set',	'dimension3',	""); }
						if	( item["sec_name2"]			)	{	ga('set',	'dimension4',	item["sec_name1"]+" > "+item["sec_name2"]);	} else { ga('set',	'dimension4',	""); }
						if	( item["issue_name"]		)	{	ga('set',	'dimension6',	item["issue_name"]);						} else { ga('set',	'dimension6',	""); }
						if	( item["series_name"]		)	{	ga('set',	'dimension7',	item["series_name"]);						} else { ga('set',	'dimension7',	""); }
						if	( item["theme_name"]		)	{	ga('set',	'dimension8',	item["theme_name"]);						} else { ga('set',	'dimension8',	""); }
						if	( item["section_div1_name"] )	{	ga('set',	'dimension9',	item["section_div1_name"]);					} else { ga('set',	'dimension9',	""); }

						ga('set',	'dimension5',	LOGIN_INFO.isLogin?LOGIN_INFO.type:"no");
						ga('set',	'dimension10',	idx1+","+idx2);

						ga('send',	'pageview', item["url_relative"]);
						dable('sendLog', 'view', {'id':item["url_relative"].replace("/arti/", "arti/"),'c1':item["sec_name1"],'c2':item["sec_name2"]});

						var	dableFeedback	= objSection.attr("data-dable-feedback");

						if ( dableFeedback )
						{
							jQuery.getScript(dableFeedback+"&callback=logArticleDableRecommendations");
						}
					}

					if ( objSection.hasClass("tail") )
					{
						getArticleDableRecommendations(articleNo);
						objSection.removeClass("tail");
					}
				}
				
				showNavigateArrow("horizon");
								
			}
		}

		objNav.children(".button").addClass("unselected").removeClass("selected");
		objNav.children(".button[data-item-no="+idx1+"]").addClass("selected").removeClass("unselected")
	};

	function	setArticleSnsCount()
	{
		var	objSlide	= jQuery(".slide_article.selected");
		if ( objSlide )
		{
			var	objSection	= objSlide.children("section.article.selected");

			if ( objSection )
			{
				var	articleNo	= objSection.attr("data-article-no");

				if ( articleNo )
				{
					var	item		= haniArticleList[articleNo];
					if ( item )
					{
						var	objTopSns	= jQuery("header.top_menu	> .box	> .mid	> .box");
						objTopSns.find(".facebook	> a	> .count").html(item["sns_facebook"]);
//						objTopSns.find(".twitter	> a	> .count").html(item["sns_twitter"]);
						objTopSns.find(".reply		> .count").html(item["sns_reply"]);
						objSection.find(".reply		> .count").html(item["sns_reply"]);

						var	objArticleSns	= objSection.find("article.body	.sns_count");
//						objArticleSns.find(".sns_box"	).html(item["sns_facebook"]+item["sns_twitter"]);
						objArticleSns.find(".sns_box"	).html(item["sns_facebook"]);
						objArticleSns.find(".reply_box"	).html(item["sns_reply"]);
					}
				}
			}
		}
	};

	function	getArticleDableUid()
	{
		jQuery.getScript("http://api.dable.io/util/uid?callback=setArticleDableUid");
	};

	function	setArticleDableUid(data)
	{
		if ( data && data.result && data.result.uid )
		{
			haniDableUid	= data.result.uid;

			var	objSlide	= jQuery(".slide_article[data-item-no=0]");
			if ( objSlide.length )
			{
				var	objSection	= objSlide.children("section.article[data-item-no=0]");
				if ( objSection.length )
				{
					var	articleNo	= objSection.attr("data-article-no");
					if ( articleNo )
					{
						getArticleDableRecommendations(articleNo);
					}
				}
			}
		}
	};

	function	getArticleDableRecommendations(articleNo)
	{
		if ( SERVER_MODE == "develop" )
		{
			setArticleDableRecommendations({});
		}
		else if ( articleNo && haniDableUid )
		{
			var	item	= haniArticleList[articleNo];
			if (item )
			{
				var	url	= "http://api.dable.io/recommendations/services/m.hani.co.kr/users/"+haniDableUid
				url	+= "?type=personalized-news&limit=1&channel=article_detail&callback=setArticleDableRecommendations";
				url	+= "&public_key=208b6667da92b80f82337bbd7e9206fd";
				url	+= "&item_id="+item["url_relative"].replace("/arti/", "arti/");

				debuglog(url);

				jQuery.getScript(url);
			}
		}
	};

	function	setArticleDableRecommendations(data)
	{
		debuglog(data);
		var	articleNo		= 0;
		var	dableFeedback	= "";
		if ( data && data.result && data.result.length )
		{
			var	itemId		= data.result[0].id;
			var	itemParts	= itemId.match(/\/([0-9]*).html$/);

			if ( itemParts && itemParts.length > 1 )
			{
				articleNo		= itemParts[1];
				dableFeedback	= data.result[0].clicklog_link;

				debuglog("dable : "+articleNo);

				var	idx			= haniArticleReserved.indexOf(articleNo);
				if ( idx > -1 )
				{
					haniArticleReserved.splice(idx,1);
				}
			}
		}

		if ( articleNo )
		{
			var	item	= haniArticleList[articleNo];
			if ( item )
			{
				debuglog("duplicated : "+articleNo);
				dableFeedback	= "";
				if ( haniArticleReserved.length )
				{
					articleNo	= haniArticleReserved.shift();

					debuglog("reserved : "+articleNo);
				}
			}
		}

		if ( !articleNo )
		{
			if ( haniArticleReserved.length )
			{
				articleNo	= haniArticleReserved.shift();

				debuglog("reserved : "+articleNo);
			}
		}

		if ( articleNo )
		{
			var	objSlide	= jQuery(".slide_article.selected");
			if ( objSlide )
			{
				var	objSectionList	= objSlide.children("section.article");
				var	objSection		= jQuery("<section/>");
				var	idx1			= objSlide.attr("data-item-no");
				var	idx2			= objSectionList.length;

				objSection.addClass("article	off");
				objSection.attr("data-item-no", objSectionList.length);
				objSection.attr("data-article-no", articleNo);
				objSection.attr("data-dable-feedback", dableFeedback);
				if ( objSectionList.length < 9 )
				{
					objSection.addClass("tail");
				}
				objSlide.append(objSection);
				getArticleBox(idx1, idx2);
			}
		}
	};

	function	logArticleDableRecommendations(data)
	{
		debuglog("dable feedback : "+data);
	};

	function	setFacebookCount(data)
	{
		/*
		if ( data && data.data && data.data[0] )
		{
			var	count		= !isNaN(data.data[0].total_count) ? data.data[0].total_count : 0;
			var	url			= data.data[0].url ? data.data[0].url : "";
			var	url_parts	= url.match(/\/([0-9]*).html$/);
			if ( url_parts && url_parts.length > 1 )
			{
				var	articleNo	= url_parts[1];
				var	item		= haniArticleList[articleNo];
				if (item )
				{
					item["sns_facebook"]	= count;
					haniFunctionManager.fire("setArticleSnsCount", setArticleSnsCount, 200);
				}
			}
		}
		*/
		if ( data && data.share && !isNaN(data.share.share_count) )
		{
			var	count		= !isNaN(data.share.share_count) ? data.share.share_count : 0;
			var	url			= data.id ? data.id : "";
			var	url_parts	= data.id.match(/\/([0-9]*).html$/);
			if ( url_parts && url_parts.length > 1 )
			{
				var	articleNo	= url_parts[1];
				var	item		= haniArticleList[articleNo];
				if (item )
				{
					item["sns_facebook"]	= count;
					haniFunctionManager.fire("setArticleSnsCount", setArticleSnsCount, 200);
				}
			}
		}		
	};

	function	setTwitterCount(data)
	{
		if ( data )
		{
			var	count		= !isNaN(data.count) ? data.count : 0;
			var	url			= data.url ? data.url : "";
			var	url_parts	= url.match(/\/([0-9]*).html/);
			if ( url_parts && url_parts.length > 1 )
			{
				var	articleNo	= url_parts[1];
				var	item		= haniArticleList[articleNo];
				if (item )
				{
					item["sns_twitter"]	= count;
					haniFunctionManager.fire("setArticleSnsCount", setArticleSnsCount, 200);
				}
			}
		}
	};

	function	setReplyCount(data)
	{
		if ( data && data.result == 200 && data.resultData )
		{
			var	count		= !isNaN(data.resultData.replyCount) ? data.resultData.replyCount : 0;
			var	url			= data.resultData.refer ? data.resultData.refer : "";
			var	url_parts	= url.match(/\/([0-9]*).html$/);
			if ( url_parts && url_parts.length > 1 )
			{
				var	articleNo	= url_parts[1];
				var	item		= haniArticleList[articleNo];
				if (item )
				{
					item["sns_reply"]	= count;
					haniFunctionManager.fire("setArticleSnsCount", setArticleSnsCount, 200);
				}
			}
		}
	};

	function	initArticleFontSize()
	{
		if ( window.localStorage )
		{
			var	fontSize	= window.localStorage.getItem("hani_mobile_font_size");
			if ( fontSize && !isNaN(fontSize) )
			{
				fontSize	= Math.min(64, Math.max(8, parseInt(fontSize)));

				jQuery(".base > main.article").css({"font-size":fontSize+"px"});

				haniEventManager.resize();
			}
		}
	};

	function	increaseArticleFontSize(obj)
	{
		var	objMain		= jQuery(".base > main.article");
		var	fontSize	= parseInt(objMain.css("font-size"));
		var	fontSizeOld	= fontSize;

		if		( fontSize >= 24 )		{ fontSize += 4;	}
		else if	( fontSize >= 12 )		{ fontSize += 2;	}
		else if	( fontSize >= 8  )		{ fontSize += 1;	}

		fontSize	= Math.min(64, Math.max(8, parseInt(fontSize)));

		if ( fontSize != fontSizeOld )
		{
			objMain.css({"font-size":fontSize+"px"});

			haniEventManager.resize();

			if ( window.localStorage )
			{
				window.localStorage.setItem("hani_mobile_font_size", fontSize);
			}

			arrangeArticleFontSize(obj);
		}
	};

	function	decreaseArticleFontSize(obj)
	{
		var	objMain		= jQuery(".base > main.article");
		var	fontSize	= parseInt(objMain.css("font-size"));
		var	fontSizeOld	= fontSize;

		if		( fontSize >= 28 )		{ fontSize -= 4;	}
		else if	( fontSize >= 14 )		{ fontSize -= 2;	}
		else if	( fontSize >= 8  )		{ fontSize -= 1;	}

		fontSize	= Math.min(64, Math.max(8, parseInt(fontSize)));

		if ( fontSize != fontSizeOld )
		{
			objMain.css({"font-size":fontSize+"px"});

			haniEventManager.resize();

			if ( window.localStorage )
			{
				window.localStorage.setItem("hani_mobile_font_size", fontSize);
			}

			arrangeArticleFontSize(obj);
		}
	};

	function	arrangeArticleFontSize(obj)
	{
		var	objButton	= jQuery(obj);
		var	objSection	= objButton.closest("section.article");
		var	itemNo		= objSection.attr("data-item-no");

		if ( itemNo != 0 )
		{
			var	objHeader	= jQuery("header.top_menu.article	> .box");
			jQuery(document).scrollTop(objButton.offset().top - objHeader.height() - 20);
		}
	};

	function	moveLeftArticle()
	{
		var	objSlideBox	= jQuery(".article_slide_box");
		var	itemNo		= parseInt(objSlideBox.attr("data-item-no"));
		var	itemCount	= parseInt(objSlideBox.attr("data-item-count"));
		if ( itemNo > 0 )
		{
			onClickSlideTo(objSlideBox, itemNo-1);
		}
	};

	function	moveRightArticle()
	{
		var	objSlideBox	= jQuery(".article_slide_box");
		var	itemNo		= parseInt(objSlideBox.attr("data-item-no"));
		var	itemCount	= parseInt(objSlideBox.attr("data-item-count"));
		if ( itemNo < itemCount-1 )
		{
			onClickSlideTo(objSlideBox, itemNo+1);
		}
	};

	function	moveUpArticle()
	{
		var	objSlideBox		= jQuery(".article_slide_box");
		var	objSlideItem	= objSlideBox.find("> .slide_mid > .slide_item.selected");
		var	objArticle		= objSlideItem.children(".article.selected");
		var	itemNo			= parseInt(objArticle.attr("data-item-no"));
		if ( itemNo > 0 )
		{
			jQuery("html, body").stop().animate({"scrollTop":objArticle.prev().offset().top+"px"}, 1000);
		}
	};

	function	moveDownArticle()
	{
		var	objSlideBox		= jQuery(".article_slide_box");
		var	objSlideItem	= objSlideBox.find("> .slide_mid > .slide_item.selected");
		var	objArticle		= objSlideItem.children(".article.selected");
		var	itemNo			= parseInt(objArticle.attr("data-item-no"));
		if ( itemNo < 9 )
		{
			jQuery("html, body").stop().animate({"scrollTop":objArticle.next().offset().top+"px"}, 1000);
		}
	};

	function	onArticleNav()
	{
		var	objShare	= jQuery(".base > .article_share");
		objShare.css({"line-height":WINDOW_HEIGHT+"px"}).show();
		jQuery(document.body).addClass("lock");
	};

	function	openArticleShare()
	{
		var	objShare	= jQuery(".base > .article_share");
		objShare.css({"line-height":WINDOW_HEIGHT+"px"}).show();
		jQuery(document.body).addClass("lock");
		
		(function () {
			if (IS_PHONEGAP && (IS_PHONEGAP_ANDROID || IS_PHONEGAP_IOS) && jQuery("#kakao-link-btn").length > 0) {
				jQuery("#kakao-link-btn").hide(0);
			}
		})();
	};

	function	closeArticleShare()
	{
		var	objShare	= jQuery(".base > .article_share");
		objShare.hide();
		jQuery(document.body).removeClass("lock");
	};
	
	//old
	function	openArticleReply()
	{
		var	objBase		= jQuery(".base");
		var	objMain		= objBase.children("main");
		var	objReply	= objBase.children(".article_reply");
		var	articleNo	= parseInt(objReply.attr("data-article-no"));

		objReply.show();
		objBase.height(WINDOW_HEIGHT);
		objMain.attr("data-scroll-top", SCROLL_TOP);
		objMain.css({"top":-SCROLL_TOP+"px"});

		jQuery(document.body).addClass("lock");

		if ( articleNo )
		{
			var	item		= haniArticleList[articleNo];
			if ( item )
			{
				if ( window.livere_seq )
				{
					livereLib.renewLivere(item["og:url"].replace("http://", ""), item["og:title"]);
				}
				else
				{
					window.consumer_seq		= "587";
					window.livere_seq		= "14223";
					window.smartlogin_seq	= "661";

					window.livereReply		= new Livere(livere_seq, item["og:url"].replace("http://", ""), item["og:title"]);

					livereLib.start();
				}
			}
		}
	};
	//new 2016.05
	function	openArticleReply_new()
	{
		
		var	objBase		= jQuery(".base");
		var	objMain		= objBase.children("main");
		var	objReply	= objBase.children(".article_reply");
		var	articleNo	= parseInt(objReply.attr("data-article-no"));

		objReply.show();
		objBase.height(WINDOW_HEIGHT);
		objMain.attr("data-scroll-top", SCROLL_TOP);
		objMain.css({"top":-SCROLL_TOP+"px"});

		jQuery(document.body).addClass("lock");
		
		if ( articleNo )
		{
			var	item		= haniArticleList[articleNo];
			if ( item )
			{
				if( livereReply ) 
				{
					crawler_index = item["og:url"];
					livereReply.description = item["og:title"];
					livereLib.renewLivere(item["og:url"].replace("http://", ""), item["og:title"]);
				} 
				else 
				{
					crawler_index = item["og:url"];
					window.livereReply		= new Livere(livere_seq, item["og:url"].replace("http://", ""), item["og:title"]);
					livereReply.description = item["og:title"];
					livereLib.start();
				}
			}
		}
	};
	
	function	closeArticleReply()
	{
		var	objBase		= jQuery(".base");
		var	objMain		= objBase.children("main");
		var	objReply	= objBase.children(".article_reply");
		var	scrollTop	= parseInt(objMain.attr("data-scroll-top"));

		objReply.hide();

		jQuery(document.body).removeClass("lock");

		if ( scrollTop != SCROLL_TOP )
		{
			SCROLL_TOP		= scrollTop - 100;
			SCROLL_TOP_PREV	= SCROLL_TOP;
		}
		objMain.css({"top":""});
		objBase.height("");
		jQuery(document.body).removeClass("lock");
		jQuery(document).scrollTop(scrollTop);
		
		if(jQuery("#livereContainer").length) {
			jQuery("#livereContainer").empty();
		}
		if(jQuery("#livereFbContainer").length) {
			jQuery("#livereFbContainer").empty();
		}
	};

	function	onScrollArticle()
	{
		haniFunctionManager.fire("onScrollArticle", onScrollArticleProcess, 100);
	};

	function	onScrollArticleProcess()
	{
		var	objSlide	= jQuery(".slide_article.selected");

		var	objTail		= objSlide.children("section.article.tail");
		var	objSelected	= objSlide.children("section.article.selected");
		if ( objSelected.length )
		{
			var	topSection		= objSelected.offset().top;
			var	heightSection	= objSelected.height();
			var	botSection		= topSection + heightSection;
			var	midWindow		= SCROLL_TOP + (WINDOW_HEIGHT/2);
			var	idx1			= parseInt(objSlide.attr("data-item-no"));
			var	idx2			= parseInt(objSelected.attr("data-item-no"));
			if ( botSection < midWindow )
			{
				setArticleInfo(idx1, idx2+1);
			}
			else if ( topSection > SCROLL_TOP )
			{
				var	objPrev	= objSlide.children("section.article[data-item-no="+(idx2-1)+"]");

				if ( objPrev.length )
				{
					var	objPrevArticle		= objPrev.children("article.body");
					var	topPrevArticle		= objPrevArticle.offset().top;
					var	heightPrevArticle	= objPrevArticle.height();
					var	botPrevArticle		= topPrevArticle + heightPrevArticle;

					if ( botPrevArticle > midWindow )
					{
						setArticleInfo(idx1, idx2-1);
					}
				}
			}
		}
		
		showNavigateArrow("vertical");

	};
	
	function showNavigateArrow(acttype) {
		
		if (acttype=="horizon") {
			
			jQuery("#articleNavWrap .horizon").stop(true).show(100, function(){
			    if(setTimeNav_horizon != undefined) {
			    	clearTimeout(setTimeNav_horizon);
			    }
		  	  setTimeNav_horizon = setTimeout(function(){
		            jQuery("#articleNavWrap .horizon").stop(true).hide(1000);
		        }, 3000);
		    });
			
		} else if (acttype=="vertical") {
			
	    jQuery("#articleNavWrap .vertical").stop(true).show(100, function(){
      	if(setTimeNav_vertical != undefined){
      		clearTimeout(setTimeNav_vertical);
      	}
        setTimeNav_vertical = setTimeout(function(){
        		jQuery("#articleNavWrap .vertical").stop(true).hide(1000);
                  }, 3000);
      });
			
		}
		
	}

	function	onResizeArticle()
	{
		haniFunctionManager.fire("onResizeArticle", onResizeArticleProcess, 200);
	};

	function	onResizeArticleProcess()
	{
		var	objTop		= jQuery("article.body	.headline.type0	.image_ratio_full");
		if ( objTop )
		{
			var	objAdTop2	= jQuery(".adBox.adTop2");
			objTop.height(WINDOW_HEIGHT-(objAdTop2.length?objAdTop2.height():0));
			objTop.find("padding").css({"padding-top":""});
		}
		
	};
	
	function closeAdTop2Article() {
		jQuery(".adTop2Padding").removeClass("adTop2Padding");
		jQuery(".adBox.adTop2").remove();
		haniEventManager.resize();

		jQuery("#articleNavWrap .vertical").css("bottom", "6%");
		
	}

	jQuery(document).ready(initArticleBox);