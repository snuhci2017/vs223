	function	onScrollArticleTopFix()
	{
		jQuery(window).scroll
		(
			function()
			{
				var	topFix			= jQuery("#top-fix");
				var	menuAll			= jQuery("#menu-all");
				var	windowHeight	= jQuery(window).height();
				var	scrollTop		= jQuery(document).scrollTop();
				var	articleTop		= jQuery("#contents-article .article-body").offset().top;
				var	isTopOn			= topFix.attr("data-is-on") == "T";

				if ( scrollTop < articleTop )
				{
					if ( isTopOn )
					{
						topFix.stop();
						topFix.animate({"opacity":0}, 500, "swing", function(){topFix.css({"visibility":"hidden"});});
						topFix.attr("data-is-on", "F");
						
						closeLayerMenuSitemap();
					}
				}
				else
				{
					if ( !isTopOn )
					{
						topFix.css({"visibility":"visible"});
						topFix.stop();
						topFix.animate({"opacity":1}, 500);
						topFix.attr("data-is-on", "T");
						
						closeLayerMenuSitemap();
					}
				}
			}
		).scroll();

	};
	
	function	onScrollArticleFootFix(foot_fix_query, quide_query, foot_margin_query)
	{
		jQuery(window).scroll
		(
			function()
			{
				var	obj_foot_fix	= jQuery(foot_fix_query);
				var	obj_foot_margin	= jQuery(foot_margin_query);
				var	obj_guide		= jQuery(quide_query);

				var	windowHeight	= jQuery(window).height();
				var	scrollTop		= jQuery(document).scrollTop();
				var	top_guide		= obj_guide.offset().top;

				if ( scrollTop + windowHeight < top_guide )
				{
					if ( obj_foot_fix.attr("data-is-on") == "T" )
					{
						obj_foot_fix.animate({"bottom":-194}, 500);
						obj_foot_margin.animate({"height":0}, 500);
						obj_foot_fix.attr("data-is-on", "F");
					}
				}
				else
				{
					if ( obj_foot_fix.attr("data-is-on") != "T")
					{
						obj_foot_fix.animate({"bottom":0}, 500);
						obj_foot_margin.animate({"height":194}, 500);
						obj_foot_fix.attr("data-is-on", "T");
					}
				}
			}
		).scroll();
	};

	function	hideTopAd()
	{
		jQuery("#ad_top").hide();
	};
	
	function	onScrollArticleTopButton()
	{
		window.timeoutid_scroll_top_button	= null;
		jQuery(window).scroll
		(
			function()
			{
				if ( window.timeoutid_scroll_top_button )
				{
					clearTimeout(window.timeoutid_scroll_top_button);
				}
				else
				{
					jQuery("#scroll_top_button").animate({"opacity":1.0}, 500);
				}

				window.timeoutid_scroll_top_button	= setTimeout
				(
					function()
					{
						window.timeoutid_scroll_top_button	= null;
						jQuery("#scroll_top_button").animate({"opacity":0.1}, 1000);
					},
					2000
				);
			}
		).scroll();
	};
	
	function	increaseFontsize(query)
	{
		var	obj		= jQuery(query);
		var size	= Math.min(160, Math.max(8, parseInt(obj.css("font-size").replace("px", ""))));
		
		size	= size + Math.ceil(size/20);
		
		obj.css("font-size", size+"px");
		
		if ( window.localStorage )
		{
			window.localStorage.setItem("hani_article_font_size", size);
		};
	};
	
	function	decreaseFontsize(query)
	{
		var	obj		= jQuery(query);
		var size	= Math.min(160, Math.max(8, parseInt(obj.css("font-size").replace("px", ""))));
		
		size	= size - Math.ceil(size/20);
		
		obj.css("font-size", size+"px");
		
		if ( window.localStorage )
		{
			window.localStorage.setItem("hani_article_font_size", size);
		};
	};
	
	function	adjustFontsize(query)
	{
		if ( window.localStorage )
		{
			var	size	= Math.min(160, Math.max(8, parseInt(window.localStorage.getItem("hani_article_font_size"))));
			
			var	obj		= jQuery(query);
			
			obj.css("font-size", size+"px");
		};
	};
	//old version
	function	setLivereReply(title, url)
	{
		window.consumer_seq		= "587";
		window.livere_seq		= "14223";
		window.smartlogin_seq	= "661";

		window.livereReply		= new Livere( livere_seq, url, title );

		livereLib.start();
	};
	//new version 2016.03
	function	setLivereReply_new(title, url)
	{
		//window.consumer_seq		= "587";
		//window.livere_seq		= "14223";
		//window.smartlogin_seq	= "661";
		//var crawler_facebook = "113685238657736"; 
		//var crawler_index = location.href;

		window.livereReply		= new Livere( livere_seq, url, title );
		livereReply.description = title;
		livereLib.start();
	};
	
	function	checkScrap(url)
	{
		var	is_login = (document.cookie.indexOf("CLTCOOKINFO")) > -1;
		
		if ( is_login )
		{
			jQuery.getScript("http://scrapapi.hani.co.kr/node/s?callback=checkScrapDone&u="+url);
		}
	};
	
	function	checkScrapDone(data)
	{
		if ( data )
		{
			var	obj	= jQuery(".tool-scrap");
			if ( obj )
			{
				obj.addClass("selected");
			}
		}
	};
	
	function	toogleScrap(url, title, sec_name)
	{
		var	is_login = (document.cookie.indexOf("CLTCOOKINFO")) > -1;
		
		if ( is_login )
		{
			var	obj	= jQuery(".tool-scrap");
			if ( obj.hasClass("selected") )
			{
				if ( confirm("이미 스크랩된 기사입니다.\n\n스크랩 페이지로 이동하시겠습니까?") )
				{
					window.location.href	= "http://scrap.hani.co.kr/";
				}
			}
			else
			{
				jQuery.getScript("http://scrapapi.hani.co.kr/node/i?callback=addScrapDone&u="+url+"&s="+sec_name+"&t="+title+"&m=hani&"+(new Date().getTime()));
			}
		}
		else
		{
			if ( confirm("로그인 후 이용하실 수 있습니다.\n\n로그인하시겠습니까?") )
			{
				window.location.href	= "http://bridge.hani.co.kr/Hani/User?command=form&formtype=login&site=news&nexturl="+encodeURIComponent(document.location.href);
			}
		}
	};
	
	function	addScrapDone(data)
	{
		if (data == "success" )
		{
			var	obj	= jQuery(".tool-scrap");
			obj.addClass("selected");

			if ( confirm("스크랩 되었습니다.\n\n스크랩 페이지로 이동하시겠습니까?") )
			{
				window.location.href	= "http://scrap.hani.co.kr/";
			}
		}
	};