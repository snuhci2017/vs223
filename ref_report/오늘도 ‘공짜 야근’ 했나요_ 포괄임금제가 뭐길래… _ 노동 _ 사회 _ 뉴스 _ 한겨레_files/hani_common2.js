	function	toggleObjectClass(obj, query_parent, query_selected, class_name)
	{
		var	obj_click		= jQuery(obj);
		var	obj_parent		= obj_click.closest(query_parent);
		var	obj_selected	= obj_parent.find(query_selected);
		
		if ( obj_click.hasClass(class_name) )
		{
			obj_click.removeClass(class_name);
		}
		else
		{
			obj_selected.removeClass(class_name);
			obj_click.addClass(class_name);
		}
	};
	
	function	toggleLayerBoxBubble(obj, query_item, query_parent, query_bubble, query_selected, class_name, height, offset)
	{
		var	obj_click			= jQuery(obj);
		var	obj_click_item		= obj_click.closest(query_item);
		
		if ( obj_click_item.hasClass(class_name) )
		{
			closeLayerBoxBubble(obj, query_item, query_parent, query_bubble, query_selected, class_name, height, offset);
		}
		else
		{
			openLayerBoxBubble(obj, query_item, query_parent, query_bubble, query_selected, class_name, height, offset);
		}
	};
	
	function	openLayerBoxBubble(obj, query_item, query_parent, query_bubble, query_selected, class_name, height, offset)
	{
		var	obj_click			= jQuery(obj);
		var	obj_click_item		= obj_click.closest(query_item);
		var	obj_click_bubble	= obj_click_item.find(query_bubble);
		var	obj_parent			= obj_click_item.closest(query_parent);
		var	obj_selected		= obj_parent.find(query_selected);
		var	obj_selected_bubble	= obj_selected.find(query_bubble);
		
		if ( !obj_click_item.hasClass(class_name) )
		{
			obj_selected.removeClass(class_name);
			obj_selected_bubble.stop().css({"height":0+"px", "top":((height/2)+offset)+"px"});
			obj_click_item.addClass(class_name);
			obj_click_bubble.stop().animate({"height":height+"px", "top":(0+offset)+"px"}, 150);
		}
	}
	
	function	closeLayerBoxBubble(obj, query_item, query_parent, query_bubble, query_selected, class_name, height, offset)
	{
		var	obj_click			= jQuery(obj);
		var	obj_click_item		= obj_click.closest(query_item);
		var	obj_click_bubble	= obj_click_item.find(query_bubble);
		
		if ( obj_click_item.hasClass(class_name) )
		{
			obj_click_item.removeClass(class_name);
			obj_click_bubble.stop().animate({"height":0+"px", "top":((height/2)+offset)+"px"}, 150);
		}
	}
	
	function	toggleLayerMenuSnsBubble(obj)
	{
		toggleLayerBoxBubble(obj, '.top-sns-button', '.top-sns', '.overlay', 'li.selected', 'selected', 40, -40);
	}
	
	function	openLayerMenuSnsBubble(obj)
	{
		openLayerBoxBubble(obj, '.top-sns-button', '.top-sns', '.overlay', 'li.selected', 'selected', 40, -40);
	}
	
	function	closeLayerMenuSnsBubble(obj)
	{
		closeLayerBoxBubble(obj, '.top-sns-button', '.top-sns', '.overlay', 'li.selected', 'selected', 40, -40);
	}
	
	function	openObjectClassBound(obj, end_width)
	{
		var	obj_layer		= jQuery(obj);
		var	max_width		= end_width +30;		
		var	layer_status	= obj_layer.attr("data-status");
		
		if ( layer_status == "1" )
		{
			obj_layer.attr("data-status", "2").animate({"width":max_width+"px"}, 200,
					function()
					{
						if ( obj_layer.attr("data-status") == "2" )
						{
							obj_layer.attr("data-status", "3").animate({"width":end_width+"px"}, 200,
									function()
									{
										if ( obj_layer.attr("data-status") == "3" )
										{
											obj_layer.attr("data-status", "4").addClass("selected");
										}
									});
						}
					});
		}
	};
	
	function	hideObjectClassBound(obj, query_in)
	{
		var	obj_layer		= jQuery(obj);
		var	obj_in			= obj_layer.find(query_in);
		var	width			= obj_in.width();
		var	layer_status	= obj_layer.attr("data-status");
		
		if ( layer_status != "1" )
		{
			obj_layer.attr("data-status", "1").animate({"width":width+"px"}, 200,
					function()
					{
						if ( obj_layer.attr("data-status") == "1" )
						{
							obj_layer.removeClass("selected");
						}
					});
		}
	};
	
	function	toggleLayerHomeTopMenuSub(obj)
	{
		var	obj_click	= jQuery(obj);
		var	obj_parent	= obj_click.closest(".navi-menu");
		var	obj_item	= obj_click.hasClass(".hani_main_top_menu_sub") ? obj_click : obj_click.closest(".hani_main_top_menu_sub");
		if ( obj_item.hasClass("selected") )
		{
			closeLayerHomeTopMenuSub(obj);
		}
		else
		{
			openLayerHomeTopMenuSub(obj);
		}
	};
	
	function	openLayerHomeTopMenuSub(obj)
	{
		var	obj_click	= jQuery(obj);
		var	obj_parent	= obj_click.closest(".navi-menu");
		var	obj_item	= obj_click.closest(".hani_main_top_menu_sub");
		obj_parent.find("li.selected").removeClass("selected").addClass("unselected").find(".over-list");
		obj_item.addClass("selected").removeClass("unselected").find(".over-list");
	};
	
	function	closeLayerHomeTopMenuSub(obj)
	{
		var	obj_click	= jQuery(obj);
		var	obj_parent	= obj_click.closest(".navi-menu");
		var	obj_item	= obj_click.hasClass(".hani_main_top_menu_sub") ? obj_click : obj_click.closest(".hani_main_top_menu_sub");
		obj_item.removeClass("selected").addClass("unselected").find(".over-list");
	};

	function	slideHaniLayerAuto(query_parent, auto_scroll_id)
	{
		if ( auto_scroll_id )
		{
			if ( window[auto_scroll_id] )
			{
				clearTimeout(window[auto_scroll_id]);
				
				window[auto_scroll_id]	= null;
			}
			
			window[auto_scroll_id]	= setTimeout(function(){slideHaniLayer(query_parent, 1, auto_scroll_id);}, 6000);
		}
	};
	
	function	slideHaniLayer(query_parent, offset, auto_scroll_id)
	{
		var	obj_parent	= jQuery(query_parent);
		var	obj_box		= obj_parent.find(".slide_box");
		var	obj_layers	= obj_box.find(".slide_part");
		var	obj_count	= obj_parent.find(".slide_no");
		var	status		= obj_box.attr("data-status");
		var	slideCount	= obj_layers.length;
		var	slideNoOld	= parseInt(obj_box.attr("data-slide-no"));
		obj_layers.css({"position":"absolute"});
		if ( status == 1 )
		{
			obj_box.attr("data-status", "2");
			if ( slideCount > 1 )
			{
				if ( offset < 0 )
				{
					var	slideNoNew	= (slideCount + slideNoOld - 1) % slideCount;
					
					obj_box.find(".slide_part"+slideNoOld).animate({"left":"100%"},1000);
					obj_box.find(".slide_part"+slideNoNew).css({"left":"-100%"}).animate({"left":"0%"},1000, function(){obj_box.attr("data-status", "1");});
					obj_box.attr("data-slide-no", slideNoNew);
					obj_count.html(slideNoNew+1);
				}
				else if ( offset > 0 )
				{
					var	slideNoNew	= (slideCount + slideNoOld + 1) % slideCount;
					
					obj_box.find(".slide_part"+slideNoOld).animate({"left":"-100%"},1000);
					obj_box.find(".slide_part"+slideNoNew).css({"left":"100%"}).animate({"left":"0%"},1000, function(){obj_box.attr("data-status", "1");});
					obj_box.attr("data-slide-no", slideNoNew);
					obj_count.html(slideNoNew+1);
				}
			}
		}
		
		slideHaniLayerAuto(query_parent, auto_scroll_id);
	};
	
	function	slideHaniLayerGoLayer(query_parent, slide_no, auto_scroll_id)
	{
		var	obj_parent	= jQuery(query_parent);
		var	obj_box		= obj_parent.find(".slide_box");
		var	obj_layers	= obj_box.find(".slide_part");
		var	obj_count	= obj_parent.find(".slide_no");
		var	status		= obj_box.attr("data-status");
		var	slideCount	= obj_layers.length;
		
		obj_box.attr("data-status", "1");
		obj_box.attr("data-slide-no", slide_no);
		obj_count.html(slide_no+1);
		
		if ( slideCount > 1 )
		{
			for(var i=0;i<slideCount;i++)
			{
				var	obj_layer	= obj_layers.eq(i);
				obj_layer.stop();
				if ( i == slide_no )
				{
					obj_layer.css({"left":"0%"});
				}
				else
				{
					obj_layer.css({"left":"100%"});
				}
			}
		}
		
		if ( auto_scroll_id )
		{
			if ( window[auto_scroll_id] )
			{
				clearTimeout(window[auto_scroll_id]);
				
				window[auto_scroll_id]	= null;
			}
		}
	};
	
	function	getSnsCount()
	{
		var	snsCountList	= jQuery(".sns_count.off");
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
				
				objItem.children(".icon_share").html(snsCountItem.snscnt);
				objItem.children(".icon_reply").html(snsCountItem.cmt);
				objItem.removeClass("off");
			}
		}
	};
	
	var	top_last_scroll		= 0;
	var	diff_scroll			= 0;
	
	function	onScrollDirection()
	{
		var	function_direction	= function()
		{
			var	top_scroll	= jQuery(document).scrollTop();
			window.diff_scroll		= top_scroll - window.top_last_scroll;
			window.top_last_scroll	= top_scroll;
			
			jQuery(window).trigger("onScrollAdjustEndLine");
		};
		
		jQuery(window).scroll(function_direction);
		jQuery(window).resize(function_direction);
		
		setTimeout(function(){window.diff_scroll=-1;jQuery(window).trigger("onScrollAdjustEndLine");}, 200);
	};
	
	function	onScrollAdjustEndLine(query_start, query_end, query_in)
	{
		jQuery(window).on
		(
			"onScrollAdjustEndLine",
			function()
			{
				var	obj_start	= jQuery(query_start);
				var	obj_end		= jQuery(query_end);
				var	obj_in		= jQuery(query_in);
				
				if ( obj_start && obj_end && obj_in )
				{
					var	top_in		= obj_in.offset().top;
					var	top_win		= jQuery(document).scrollTop();
					var	top_start	= obj_start.offset().top;
					var	top_end		= obj_end.offset().top;
					var	left_start	= obj_start.offset().left;
					var	width_start	= obj_start.width();
					var	height_win	= jQuery(window).height();
					var	height_end	= obj_end.height();
					var	height_in	= obj_in.height();
					var	bot_win		= top_win + height_win;
					var	bot_end		= top_end + height_end;
					var	bot_in		= top_in + height_in;
					
					var	gap_max		= top_end + height_end - top_start - height_in;
					
					obj_start.css({"height":height_in+"px"});
					
					if ( window.diff_scroll == 0 )
					{
						if ( obj_in.css("position") == "fixed" )
						{
							obj_in.css({"left":left_start+"px"});
						}
					}
					
					if ( height_in >= bot_end - top_start )
					{
						//	움직일 필요가 없음
						obj_in.css({"position":"relative","top":"0px","left":"0px","width":""});
					}
					else if ( height_win > top_end + height_end - top_start )
					{
						obj_in.css({"position":"relative","top":"0px","left":"0px","width":""});
					}					
					else if ( height_win > height_in )
					{
						if ( top_start >= top_win )
						{
							obj_in.css({"position":"relative","top":"0px","left":"0px","width":""});
						}
						else if ( top_start + gap_max <= top_win )
						{
							obj_in.css({"position":"relative","top":gap_max+"px","left":"0px","width":""});
						}						
						else
						{
							obj_in.css({"position":"fixed","top":"0px","left":left_start+"px","width":width_start+"px"});
						}
					}
					else
					{
						if ( window.diff_scroll < 0 )
						{
							if ( top_start >= top_win )
							{
								obj_in.css({"position":"relative","top":"0px","left":"0px","width":""});
							}
							else if ( top_in >= top_win )
							{
								obj_in.css({"position":"fixed","top":"0px","left":left_start+"px","width":width_start+"px"});
							}
							else if ( obj_in.attr("data-direction") == "down" && obj_in.css("position") == "fixed" )
							{
								obj_in.css({"position":"relative","top":(top_in-top_start-diff_scroll)+"px","left":"0px","width":""});
							}
							obj_in.attr("data-direction", "up");
						}
						
						if ( window.diff_scroll > 0 )
						{
							if ( bot_end <= bot_win )
							{
								obj_in.css({"position":"relative","top":gap_max+"px","left":"0px","width":""});
							}
							else if ( bot_in <= bot_win )
							{
								obj_in.css({"position":"fixed","top":(height_win-height_in)+"px","left":left_start+"px","width":width_start+"px"});
							}
							else if ( obj_in.attr("data-direction") == "up" && obj_in.css("position") == "fixed" )
							{
								obj_in.css({"position":"relative","top":(top_in-top_start-diff_scroll)+"px","left":"0px","width":""});
							}
							obj_in.attr("data-direction", "down");
						}
					}
				}
			}
		);
	};
	
	function	setMenuAllPosition(type)
	{
		if ( type == 2 )
		{
			jQuery("#menu-all .article-plus").css({"position":"fixed"});
		}
		else
		{
			jQuery("#menu-all .article-plus").css({"position":"absolute"});
		}
	};
	
	function	setHomeMostRead(tag_query)
	{
		jQuery.getJSON
		(
			"/section-homepage/bestJson/today/section-total.json",
			function(data)
			{
				if ( data && data.length )
				{
					var	obj_list	= jQuery(tag_query);
					if ( obj_list )
					{
						var	html	= '<h3 class="section-title">많이 보는 기사</h3>';
						
						for(var i=0;i<data.length&&i<10;i++)
						{
							html	+= '<div class="article-right '+(i==0?"first":"")+'">';
							if ( data[i].img )
							{
								html	+= '<span class="article-photo">';
								html	+= '<a href="'+data[i].url+'" title="">';
								html	+= '<img src="'+data[i].img+'" width="108px" height="64px"  title=""/>';
								html	+= '</a>';
								html	+= '</span>';
							}
							html	+= '<h4 class="article-title">';
							html	+= '<a href="'+data[i].url+'" title="">'+'<strong class="num">'+(i+1)+'.</strong>'+data[i].title+'</a>';
							html	+= '</h4>';
							html	+= '</div>';
						}
						
						obj_list.html(html);
					}
				}
			}
		);
	};
	
	function	changeTabInMultihani(obj, tab_no)
	{
		var	obj_menu	= jQuery(obj);
		if ( !obj_menu.hasClass("on") )
		{
			var	obj_parent	= obj_menu.closest("#photoNews");
			var	obj_list	= obj_parent.find("#photo-tab-content"+tab_no);
			
			obj_parent.find(".on").removeClass("on");
			obj_parent.find(".display_on").removeClass("display_on").addClass("display_off");
			
			obj_menu.addClass("on");
			obj_list.removeClass("display_off").addClass("display_on");
		}
	};
	
	function	changeImageInMultihani(obj)
	{
		var	obj_selected	= jQuery(obj);
		
		if ( !obj_selected.hasClass("selected") )
		{
			var	obj_parent	= obj_selected.closest("#multimedia");
			var	obj_img		= obj_selected.find("img");
			var	obj_a		= obj_selected.find("a");

			var	src			= obj_img.attr("src");
			var	url			= obj_a.attr("href");
			var	title		= obj_selected.attr("data-title");
			
			obj_parent.find(".main-image a").attr("href", url);
			obj_parent.find(".main-image img").attr("src", src);
			obj_parent.find(".main-image .desc").html(title);
			obj_parent.find(".selected").removeClass("selected").find(".overlay").hide();
			
			obj_selected.addClass("selected").find(".overlay").show();
		}
	};
	
	function	changeImageInOpinion(obj)
	{
		var	obj_selected	= jQuery(obj);
		
		if ( !obj_selected.hasClass("selected") )
		{
			var	obj_parent	= obj_selected.closest("#related-photo-box");
			var	obj_img		= obj_selected.find("img");
			var	obj_a		= obj_selected.find("a");

			var	src			= obj_img.attr("src");
			var	url			= obj_a.attr("href");
			
			obj_parent.find(".main-image a").attr("href", url);
			obj_parent.find(".main-image img").attr("src", src);
			obj_parent.find(".selected").removeClass("selected").find(".overlay").hide();
			
			obj_selected.addClass("selected").find(".overlay").show();
		}
	};
	
	function	changeImageInEducation(obj)
	{
		var	obj_selected	= jQuery(obj);
		
		if ( !obj_selected.hasClass("selected") )
		{
			var	obj_parent	= obj_selected.closest("#together-photo-box");
			var	obj_img		= obj_selected.find("img");
			var	obj_a		= obj_selected.find("a");

			var	src			= obj_img.attr("src");
			var	url			= obj_a.attr("href");
			var	title		= obj_selected.attr("data-title");
			var	prologue	= obj_selected.attr("data-prologue");
			
			obj_parent.find(".main-image img").attr("src", src);
			obj_parent.find(".entry-content h3 a").attr("href", url).html(title);
			obj_parent.find(".entry-content .text a").attr("href", url).html(prologue);
			obj_parent.find(".selected").removeClass("selected").find(".overlay").hide();
			
			obj_selected.addClass("selected").find(".overlay").show();
		}
	};
	
	function	changeImageInIssueViewHome(obj)
	{
		var	obj_selected	= jQuery(obj);
		
		if ( !obj_selected.hasClass("selected") )
		{
			var	obj_parent	= obj_selected.closest(".issue-main-visual-parent");
			var	obj_img		= obj_selected.find("img");
			var	obj_a		= obj_selected.find("a")
			
			var	obj_target	= obj_parent.find(".issue-main-photo");
			
			obj_parent.find(".issue-main-photo a").attr("href", obj_a.attr("href"));
			obj_parent.find(".issue-main-photo img").attr("src", obj_img.attr("src"));
			obj_parent.find(".issue-main-photo p").html(obj_selected.attr("data-title"));
			
			obj_parent.find(".selected").removeClass("selected");
			obj_selected.addClass("selected");
		}
	};
	
	jQuery(document).ready
	(
		function()
    	{
			jQuery(".skipMenu a").click
			(
				function()
				{
					var thisHref	= jQuery(this).attr("href");
					jQuery(thisHref).attr("tabindex","-1");
					jQuery(thisHref).focus();
				}
			);
    	}
	);
	
	var	snsCountUrl			= '';
	
	function	setFacebookCount(data)
	{
		jQuery(".facebook-count").html(( data && data.share && !isNaN(data.share.share_count) && !isNaN(data.share.comment_count) ) ? (data.share.share_count + data.share.comment_count) : 0);
	};
	
	function	setTwitterCount(data)
	{
		jQuery(".twitter-count").html((data && data.count) ? data.count : 0);
	};
	
	function rssActivate()
	{
        if(!(jQuery('.rss').length == 0))
        {
        	jQuery.getScript("http://www.hani.co.kr/section-homepage/svc/js/ZeroClipboard.js", rssAct)
        }
        //polibar, weconomy menu add function
    	$('.bar-menu .plus').click(function(){
    		/*
			$(this).siblings().removeClass('selected');
			$(this).addClass('selected');	
	        if ($('.over-list' ).hasClass('open')){
	            $( '.over-list' ).removeClass ('open');
				$( '.bar-menu .plus' ).removeClass ("selected");
	            $( '.over-list' ).hide();
	        } else {
	            $('.over-list').addClass('open');
	            $( '.over-list' ).show();
	        };
	        */
    		var over_list = $( "#navi-sub.navi-left li.plus .over-list" );
    		var over_list2 = $( "#bar-navi li.plus .over-list" );
    		if(over_list.length > 0) {
    			over_list.toggle();
    		}
    		if(over_list2.length > 0) {
    			over_list2.toggle();
    		}
    		
    	});
    	$( ".bar-menu .plus" ).mouseleave(function() {
	        if ($('.over-list' ).hasClass('open')){
	            $( '.over-list' ).removeClass ('open');
				$( '.bar-menu .plus' ).removeClass ("selected");
	            $( '.over-list' ).hide();
	        }
    	});	
    };

    function rssAct(){
        if(document.all){
            jQuery('.rss').each(function(){
                jQuery(this).click(function(){
                    var CP_url=jQuery(this).attr("value");
                    window.clipboardData.setData("Text",CP_url);
                    alert('The RSS address was copied.\nPaste (ctrl+v) in order to use.\nRSS: '+CP_url);
                });
            });
        }else{
            function CP_init(){
                jQuery('.rss').each(function(i){
                    var clip=null;
                    clip = new ZeroClipboard.Client();
                    clip.setHandCursor(true);
                    jQuery(this).unbind("mouseover");
                    jQuery(this).mouseover(function(){
                        var CP_url=jQuery(this).attr("value");
                        clip.setText(CP_url);
                        clip.addEventListener('complete', function(client, text){
                        	alert('The RSS address was copied.\nPaste (ctrl+v) in order to use.\nRSS: '+CP_url);
                        });
                        if(clip.div){clip.receiveEvent('mouseout', null);}
                        else{clip.glue(this);}
                        clip.receiveEvent('mouseover', null);
                    });
                });
            }
            jQuery(document).ready(function(){
                CP_init();
            });
        }
    };
    
    $(document).ready(rssActivate);
    
