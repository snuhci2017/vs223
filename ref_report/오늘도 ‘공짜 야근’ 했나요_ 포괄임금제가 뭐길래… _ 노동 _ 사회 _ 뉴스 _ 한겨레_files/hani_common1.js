	function	toggleLayerBox(obj, query_parent, query_button, query_layer)
	{
		var	obj_click	= jQuery(obj);
		var	obj_parent	= obj_click.closest(query_parent);
		if ( obj_parent.find(query_button).hasClass("on") )
		{
			closeLayerBox(obj, query_parent, query_button, query_layer);
		}
		else
		{
			openLayerBox(obj, query_parent, query_button, query_layer);
		}
	};
	
	function	openLayerBox(obj, query_parent, query_button, query_layer)
	{
		var	obj_click	= jQuery(obj);
		var	obj_parent	= obj_click.closest(query_parent);
		var	obj_layer	= obj_parent.find(query_layer);
		

		obj_layer.removeClass("off");
		obj_parent.find(query_button).addClass("on");
		
		if ( document.addEventListener )
		{
			obj_layer.stop().animate({"opacity":1}, 500);
		}
	};
	
	function	closeLayerBox(obj, query_parent, query_button, query_layer)
	{
		var	obj_click	= jQuery(obj);
		var	obj_parent	= obj_click.closest(query_parent);
		var	obj_layer	= obj_parent.find(query_layer);
		
		obj_parent.find(query_button).removeClass("on");
		
		if ( document.addEventListener )
		{
			obj_layer.stop().animate({"opacity":0}, 500, function(){ obj_layer.addClass("off"); });			
		}
		else
		{
			//	for ie old;
			obj_layer.addClass("off");
		}
	};	
	
	function	toggleLayerLoginMenu(obj)
	{
		toggleLayerBox(obj, '#login-box-parent', '.top_login', '#login-box');
	};
	
	function	openLayerLoginMenu(obj)
	{
		openLayerBox(obj, '#login-box-parent', '.top_login', '#login-box');
	};
	
	function	closeLayerLoginMenu(obj)
	{
		closeLayerBox(obj, '#login-box-parent', '.top_login', '#login-box');		
	};

	function	openLayerSearchForm(obj)
	{
		openLayerBox(obj, '#search_form', '.open_search', '.form_search');
	};
	
	function	closeLayerSearchForm(obj)
	{
		closeLayerBox(obj, '#search_form', '.open_search', '.form_search');
	};
	
	function	selectLoginButtonLayer()
	{
		var	is_login	= (document.cookie.indexOf("CLTCOOKINFO")) > -1;
		var	html		= "";
		if ( is_login )
		{
			jQuery("#login-box .login-btn .link1").attr("href", "https://bridge.hani.co.kr/Hani/User?command=modifyform&site=news").attr("title", "회원정보수정").html("회원정보수정");
			jQuery("#login-box .login-btn .link2").attr("href", "https://bridge.hani.co.kr/Hani/User?command=logout&site=news&nexturl="+encodeURIComponent(document.location.href)).attr("title", "로그아웃").html("로그아웃");
			jQuery(".top_login").addClass("login");
		}
		else
		{
			jQuery("#login-box .login-btn .link1").attr("href", "https://bridge.hani.co.kr/Hani/User?site=news").attr("title", "회원가입").html("회원가입");
			jQuery("#login-box .login-btn .link2").attr("href", "http://bridge.hani.co.kr/Hani/User?command=form&formtype=login&site=news&nexturl="+encodeURIComponent(document.location.href)).attr("title", "로그인").html("로그인");
		}
	};

	function	toggleLayerMenuSitemap(obj)
	{
		var	obj_click	= jQuery(obj);
		
		if ( obj_click.hasClass("on") )
		{
			closeLayerMenuSitemap();
		}
		else
		{
			openLayerMenuSitemap(obj);
		}
	};
	
	function	openLayerMenuSitemap(obj)
	{
		var	obj_click	= jQuery(obj);
		var	obj_layer	= jQuery("#menu-all");
		
		obj_click.addClass("on");
		obj_layer.removeClass("off");
		obj_layer.stop().animate({"opacity":1}, 500);
	};
	
	function	closeLayerMenuSitemap()
	{
		var	obj_click	= jQuery(".menu-all");
		var	obj_layer	= jQuery("#menu-all");
		
		obj_click.removeClass("on");
		obj_layer.stop().animate({"opacity":0}, 500, function(){obj_layer.addClass("off");} );
	};
	
	function	switchObjectClass(obj_click, query_parent, query_selected, class_name)
	{
		var	obj_click		= jQuery(obj_click);
		var	obj_parent		= obj_click.closest(query_parent);
		var	obj_selected	= obj_parent.find(query_selected);
		
		if ( !obj_click.hasClass(class_name) )
		{
			obj_selected.removeClass(class_name);
			obj_click.addClass(class_name);
		}
	};
	
	function	toggleSitemap()
	{
		var	obj_sitemap	= jQuery("#sitemap");
		var	obj_sitemap_layer	= obj_sitemap.find(".sitemap-layer");
		if ( obj_sitemap_layer.hasClass("open") )
		{
			obj_sitemap_layer.addClass("close").removeClass("open");
			obj_sitemap.find(".fold").addClass("open");
		}
		else
		{
			obj_sitemap_layer.removeClass("close").addClass("open");
			obj_sitemap.find(".fold").removeClass("open");
			jQuery(window).scrollTop(obj_sitemap_layer.offset().top);
		}		
	};
	
	function	toggleLayerUsingClass(query_obj)
	{
		var	obj_layer	= jQuery(query_obj);
		if ( obj_layer.hasClass("open") )
		{
			obj_layer.addClass("close").removeClass("open");
		}
		else
		{
			obj_layer.addClass("open").removeClass("close");
		}
	};
	
	function	openLayerUsingClass(query_obj)
	{
		jQuery(query_obj).addClass("open").removeClass("close");
	};
	
	function	closeLayerUsingClass(query_obj)
	{
		jQuery(query_obj).addClass("close").removeClass("open");
	};
	
	function	setMostReadJsonp(data)
	{
		if ( data && data.length )
		{
			var	obj_list	= jQuery(".article-popularity");
			if ( obj_list )
			{
				var	max_length	= parseInt(obj_list.attr("data-max-length"));
				var	class_add	= obj_list.attr("data-class");
				var	fr_val		= obj_list.attr("data-fr-val");
				var	html		= "";
				for(var i=0;i<data.length&&i<max_length;i++)
				{
					var	url					= data[i].url + (fr_val ? (data[i].url.indexOf("?") == -1 ? "?" : "&")+"_fr="+fr_val : "");
					
					//AB TEST 함수 A, B
					if( typeof(abtest_type) == 'undefined' ) {
						var	html_a_tag_start	= translateUrl(url);
					} else {
						if(abtest_type == "A") {
							var	html_a_tag_start	= translateUrl_A(url);
						} else if(abtest_type == "B") {
							var	html_a_tag_start	= translateUrl_B(url);
						} else {
							var	html_a_tag_start	= translateUrl(url);
						}
					}
					
					html	+= '<div class="article-right '+(i==0?"first":"")+'" style="min-height:65px;">';
					if ( data[i].img )
					{
						html	+= '<span class="'+(class_add?class_add:"")+'photo">';
						html	+= html_a_tag_start;
						html	+= '<img src="'+data[i].img+'" width="108px" height="64px"/>';
						html	+= '</a>';
						html	+= '</span>';
					}
					html	+= '<strong class="num">'+(i+1)+'.</strong>';
					html	+= '<h4 class="'+(class_add?class_add:"")+'title">';
					html	+= html_a_tag_start+data[i].title+'</a>';
					html	+= '</h4>';
					html	+= '</div>';
				}
				
				obj_list.show().find(".list").html(html);
			}
		}
	};
	
	function	translateUrl(url)
	{
		var	target	= "";
		var	onclick	= "";
		
		if ( /(hani.co.kr|^)(\/interactive)(|\/|\/home01.html|\/list.html)$/.test(url) )
		{

		}
		else if ( /(hani.co.kr|^)(\/interactive)(|\/|\/home01.html|\/list.html)/.test(url) )
		{
			target	= "_blank";
		}
		else if ( /^\/arti|^\/photo|^\/special|www.hani.co.kr|multihani.hani.co.kr|english.hani.co.kr/.test(url) )
		{

		}
		else if ( /pictorial.hani.co.kr\/slide.hani/.test(url) )
		{

			onclick	= "javascript:popupHaniWindow(this, '"+$url+"', 1031, 820, 'yes', 'yes'); return false;";
			target	= "_blank";
		}
		else if ( /pictorial.hani.co.kr/.test(url) )
		{

		}
		else
		{
			target	= "_blank";
		}

		return	url ? '<a href="'+url+'"'+(target?' target="'+targer+'"':'')+(onclick?' onclick="'+onclick+'"':'')+'>' : '';
	};
	function	translateUrl_A(url)
	{
		var	target	= "";
		var	onclick	= "";
		onclick="ga('send','event','AB_TEST_PC','CLICK','BEST-VIEW');";
		
		if ( /(hani.co.kr|^)(\/interactive)(|\/|\/home01.html|\/list.html)$/.test(url) )
		{

		}
		else if ( /(hani.co.kr|^)(\/interactive)(|\/|\/home01.html|\/list.html)/.test(url) )
		{
			target	= "_blank";
		}
		else if ( /^\/arti|^\/photo|^\/special|www.hani.co.kr|multihani.hani.co.kr|english.hani.co.kr/.test(url) )
		{

		}
		else if ( /pictorial.hani.co.kr\/slide.hani/.test(url) )
		{

			onclick	= "javascript:popupHaniWindow(this, '"+$url+"', 1031, 820, 'yes', 'yes'); return false;";
			target	= "_blank";
		}
		else if ( /pictorial.hani.co.kr/.test(url) )
		{

		}
		else
		{
			target	= "_blank";
		}

		return	url ? '<a href="'+url+'"'+(target?' target="'+targer+'"':'')+(onclick?' onclick="'+onclick+'"':'')+'>' : '';
	};
	function	translateUrl_B(url)
	{
		var	target	= "";
		var	onclick	= "";
		onclick="ga('send','event','AB_TEST_PC','CLICK','BEST-VIEW');";
		
		if ( /(hani.co.kr|^)(\/interactive)(|\/|\/home01.html|\/list.html)$/.test(url) )
		{

		}
		else if ( /(hani.co.kr|^)(\/interactive)(|\/|\/home01.html|\/list.html)/.test(url) )
		{
			target	= "_blank";
		}
		else if ( /^\/arti|^\/photo|^\/special|www.hani.co.kr|multihani.hani.co.kr|english.hani.co.kr/.test(url) )
		{

		}
		else if ( /pictorial.hani.co.kr\/slide.hani/.test(url) )
		{

			onclick	= "javascript:popupHaniWindow(this, '"+$url+"', 1031, 820, 'yes', 'yes'); return false;";
			target	= "_blank";
		}
		else if ( /pictorial.hani.co.kr/.test(url) )
		{

		}
		else
		{
			target	= "_blank";
		}

		return	url ? '<a href="'+url+'"'+(target?' target="'+targer+'"':'')+(onclick?' onclick="'+onclick+'"':'')+'>' : '';
	};	
	function	popupHaniWindow(obj, url, width, height, scrollbars, resizable)
	{
		var	obj_a	= jQuery(obj);
		var	link	= obj_a.attr("href") ? obj_a.attr("href") : url;
		if ( link )
		{
			var	popup	= window.open(link, "haniPopupWindow", "width="+width+",height="+height+",scrollbars="+scrollbars+",resizable="+resizable);
	        if( popup )
	        {
	        	popup.focus();
	        }
	        return false;
		}
		else
		{
			return	true;
		}
    };
    //linkback solution add
	function	popupHaniWindow_facebook_share(obj, url, width, height, scrollbars, resizable)
	{
		var facebook_api_url = "http://www.facebook.com/sharer/sharer.php?u=";
		var	obj_a	= jQuery(obj);
		var	link	= obj_a.attr("href") ? obj_a.attr("href") : url;
		if ( link )
		{
			var atc_share_url = link.replace(facebook_api_url,"");
			//linkback solution add
			link = facebook_api_url + linkback.getSNSUrl("FB",atc_share_url);
			var	popup	= window.open(link, "haniPopupWindow", "width="+width+",height="+height+",scrollbars="+scrollbars+",resizable="+resizable);
	        if( popup )
	        {
	        	popup.focus();
	        }
	        return false;
		}
		else
		{
			return	true;
		}
    };
    //linkback solution add
	function	popupHaniWindow_twitter_share(obj, url, width, height, scrollbars, resizable)
	{
		var	obj_a	= jQuery(obj);
		var	link	= obj_a.attr("href") ? obj_a.attr("href") : url;
		if ( link )
		{
			var atc_share_url = link.split("url=");
			//linkback solution add
			link = atc_share_url[0] + linkback.getSNSUrl("TW",atc_share_url[1]);
			var	popup	= window.open(link, "haniPopupWindow", "width="+width+",height="+height+",scrollbars="+scrollbars+",resizable="+resizable);
	        if( popup )
	        {
	        	popup.focus();
	        }
	        return false;
		}
		else
		{
			return	true;
		}
    };