	var	MOVE_THRESHOLD				= 10;
	var	SLIDE_THRESHOLD				= 100;
	var	SLIDE_DURATION				= 500;
	
	function	initSlideBox()
	{
		var	objBoxList	= jQuery(".slide_box.off");
		
		for(var j=0;j<objBoxList.length;j++)
		{
			var	objBox		= objBoxList.eq(j);
			var	objTop		= objBox.children(".slide_top");
			var	objMid		= objBox.children(".slide_mid");
			var	objBot		= objBox.children(".slide_bot");
			var	objItemList	= objMid.children(".slide_item");
			var	itemCount	= objItemList.length;
			
			objBox.removeClass("off").attr("data-status", 0).attr("data-item-no", 0).attr("data-item-count", itemCount);
			
			if ( objBox.hasClass("scroll_x") )
			{
				var	objXBox			= objMid.children(".scroll_x_box");
				var	objXItemList	= objXBox.children(".scroll_x_item");
				var	itemYCount		= objXItemList.length;
				var	left			= 0;
				
				for(var i=0;i<itemYCount;i++)
				{
					var	objXItem	= objXItemList.eq(i);
					
					objXItem.attr("data-item-no", i);
					
					if ( i == 0 )
					{
						objXItem.addClass("selected");
						left	= Math.floor((objMid.width() - objXItem.width())/2);
					}
					if ( objBox.hasClass("has_bottom_menu") && objBot )
					{
						var	objMenuItem	= jQuery("<div/>");
						
						objMenuItem.addClass("menu_item"+(i==0?" selected":""));
						objMenuItem.attr("data-item-no", i).attr("onclick", "javascript:onClickSlideToByObj(this);");
						objMenuItem.html("●");
						
						objBot.append(objMenuItem);
					}
				}
				
				objBox.attr("data-item-count", itemYCount).attr("data-left", left);
				addCssTransform(objXBox, (left*100/objMid.width())+"%");
			}
			else
			{
				var	selectedNo	= 0;
				if ( objBox.hasClass("main_top_slide_box") )
				{
					if ( location.hash == "#subscription" )
					{
						selectedNo = 2;
						objBox.attr("data-item-no", 2);
						var	objMenu	= jQuery("header.top_menu > .box > .bot.tb > .tr > .tc");
						objMenu.eq(0).addClass("unselected").removeClass("selected");
						objMenu.eq(2).addClass("selected").removeClass("unselected");
					}
				}
				for(var i=0;i<itemCount;i++)
				{
					var	objItem		= objItemList.eq(i);
					
					objItem.attr("data-item-no", i);
					if ( i == selectedNo )
					{
						addCssTransform(objItem, "0%");
						objItem.addClass("selected");
					}
					else
					{
						addCssTransform(objItem, "100%");
						objItem.addClass("unselected");
						if ( IS_IOS )
						{
							objItem.hide();
						}
					}
					if ( objBox.hasClass("has_bottom_menu") && objBot )
					{
						var	objMenuItem	= jQuery("<div/>");
						
						objMenuItem.addClass("menu_item"+(i==0?" selected":"unselected"));
						objMenuItem.attr("data-item-no", i).attr("onclick", "javascript:onClickSlideToByObj(this);");
						objMenuItem.html("●");
						
						objBot.append(objMenuItem);
					}
				}
				
				objBox.attr("data-item-count", itemCount);
			}
			
			if ( IS_MOBILE )
			{
				objMid
					.attr("ontouchstart",	"javascript:onMoveStartByTouch	(this, event);")
					.attr("ontouchmove",	"javascript:onMoveMoveByTouch	(this, event);")
					.attr("ontouchend",		"javascript:onMoveStopByTouch	(this, event);")
					.attr("ontouchcancel",	"javascript:onMoveStopByTouch	(this, event);");
			}
			else
			{
				objMid
					.attr("onmousedown",	"javascript:onMoveStartByMouse	(this, event);")
					.attr("onmousemove",	"javascript:onMoveMoveByMouse	(this, event);")
					.attr("onmouseup",		"javascript:onMoveStopByMouse	(this, event);")
					.attr("onmouseleave",	"javascript:onMoveStopByMouse	(this, event);");
			}			
		}
		
		haniEventManager.addResize(onResizeSlideBox);
		haniEventManager.resize();
	};

	function	onResizeSlideBox()
	{
		haniFunctionManager.fire("onResizeSlideBox", onResizeSlideBoxProcess, 200);
	};
	
	function	onResizeSlideBoxProcess()
	{
		var	objBody		= jQuery(document.body);
		var	objBoxList	= jQuery(".slide_box.height_selected");
		for(var i=0;i<objBoxList.length;i++)
		{
			var	objBox		= objBoxList.eq(i);
			if ( !objBox.hasClass("article_slide_box") || !objBody.hasClass("lock") )
			{
				var	objMid		= objBox.children(".slide_mid");
				var	objItemList	= objMid.children(".slide_item");
				var	itemNo		= parseInt(objBox.attr("data-item-no"));
				var	objItem		= objItemList.eq(itemNo);
				
				objMid.height(objItem.height());
			}
		}
		
		objBoxList	= jQuery(".slide_box.height_all");
		for(var i=0;i<objBoxList.length;i++)
		{
			var	objBox		= objBoxList.eq(i);
			var	objMid		= objBox.children(".slide_mid");
			var	objItemList	= objMid.children(".slide_item");
			var	height		= 0;
			for(var j=0;j<objItemList.length;j++)
			{
				height	= Math.max(height, objItemList.eq(j).height());
			}			
			objMid.height(height);
		}
		
		objBoxList	= jQuery(".slide_box.height_window");
		for(var i=0;i<objBoxList.length;i++)
		{
			var	objBox		= objBoxList.eq(i);
			var	objTop		= objBox.children(".slide_top");
			var	objBot		= objBox.children(".slide_bot");
			var	objMid		= objBox.children(".slide_mid");
			var	height		= WINDOW_HEIGHT - objTop.height() - objBot.height();
			if ( objBox.hasClass("aside_left_slide_box") )
			{
				height	= height - jQuery(".base > aside.left > header").height();
			}
			if ( objBox.hasClass("aside_right_slide_box") )
			{
				height	= height - jQuery(".base > aside.right > header").height();
			}
			objMid.height(height);
		}
		
		objBoxList	= jQuery(".slide_box.scroll_x");
		for(var i=0;i<objBoxList.length;i++)
		{
			var	objBox			= objBoxList.eq(i).width(jQuery(".base > main").width());
			var	objMid			= objBox.children(".slide_mid").width(objBox.width());
			var	objXBox			= objMid.children(".scroll_x_box");
			var	objXItemList	= objXBox.children(".scroll_x_item");
			var	itemNo			= parseInt(objBox.attr("data-item-no"));
			var	itemCount		= parseInt(objBox.attr("data-item-count"));
			var	imageRatio		= parseFloat(objBox.attr("data-image-ratio"));
			var	left			= Math.floor(objMid.width()/2);
			var	leftThresholdL	= left;
			var	leftThresholdR	= left;
			var	widthBox		= 1;
			
			for(var j=0;j<itemCount;j++)
			{
				var objXItem	= objXItemList.eq(j);
				if ( objXItem.hasClass("image1") )
				{
					objXItem.width(Math.floor(objBox.width()*imageRatio));
				}				
				
				var	width		= objXItem.width();
				
				widthBox	+= width;
				
				if ( j == itemNo )
				{
					left			-= Math.floor(width/2);
				}
				else if ( j < itemNo )
				{
					left			-= width;
				}
				
				if ( j == 0 )
				{
					leftThresholdL	-= Math.floor(width/2);
				}
				
				if ( j == itemCount - 1 )
				{
					leftThresholdR	-= Math.floor(width/2);
				}
				else
				{
					leftThresholdR	-= width;
				}
			}
			objBox.attr("data-left", left).attr("data-left-threshold-l", leftThresholdL).attr("data-left-threshold-r", leftThresholdR);
			objXBox.width(widthBox);
			addCssTransform(objXBox, (left*100/objXBox.width())+"%");
		}
	};
	
	function	onMoveStartByMouse(obj, event)
	{
		event.preventDefault();
		event.stopPropagation();
		if ( event.button == 0 )
		{
			onMoveStart(obj, event, event.clientX, event.clientY);
		}
	};

	function	onMoveMoveByMouse(obj, event)
	{
		if ( event.button == 0 )
		{
			onMoveMove(obj, event, event.clientX, event.clientY);
		}
	};

	function	onMoveStopByMouse(obj, event)
	{
		if ( event.button == 0 )
		{
			onMoveStop(obj, event);
		}
	};

	function	onMoveStartByTouch(obj, event)
	{
		onMoveStart(obj, event, event.touches[0].clientX, event.touches[0].clientY);
	};

	function	onMoveMoveByTouch(obj, event)
	{
		onMoveMove(obj, event, event.touches[0].clientX, event.touches[0].clientY);
	};

	function	onMoveStopByTouch(obj, event)
	{
		onMoveStop(obj, event);
	};

	function	onMoveStart(obj, event, x, y)
	{
		var	objMid	= jQuery(obj);
		var	objBox	= objMid.parent(".slide_box");
		var	status	= objBox.attr("data-status");
		if ( status == "0" )
		{
			objBox.attr("data-status", "1");
			objBox.attr("data-x0",	x);
			objBox.attr("data-y0",	y);
		}
	};

	function	onMoveMove(obj, event, x, y)
	{
		var	objMid		= jQuery(obj);
		var	objBox		= objMid.parent(".slide_box");
		var	status		= objBox.attr("data-status");
		var	statusOld	= status;
		
		if ( hasChildSlideBox(objBox) )
		{
			objBox.attr("data-status", "0");
		}
		else
		{
			if ( status == "1X" || status == "1R" || status == "1L" || status == "1RB" || status == "1LB" )
			{ 
				event.preventDefault();
				event.stopPropagation();
			}
	
			if ( status == "1" || status == "1X" || status == "1R" || status == "1L" || status == "1RB" || status == "1LB" )
			{
				var	objChildBox	= objMid.find(".slide_box");
				var	itemNo		= parseInt(objBox.attr("data-item-no"));
				var	itemCount	= parseInt(objBox.attr("data-item-count"));
				var	x0			= parseInt(objBox.attr("data-x0"));
				var	y0			= parseInt(objBox.attr("data-y0"));
				var	xd			= x - x0;
				var yd			= y - y0;
				var	xD			= Math.abs(xd);
				var yD			= Math.abs(yd);
					
				objBox.attr("data-x1",	x);
				objBox.attr("data-y1",	y);
				
				if ( status == 1 )
				{
					if ( xD >= MOVE_THRESHOLD && xD > 2*yD )
					{
						event.preventDefault();
						event.stopPropagation();
						
						if ( objBox.hasClass("end_return") || objBox.hasClass("scroll_x") )
						{
							status	= xd > 0 ? "1L" : "1R";
						}
						else if ( objBox.hasClass("end_stop") )
						{
							status	= xd > 0 ? (itemNo > 0 ? "1L" : "1LB") : (itemNo < itemCount-1 ? "1R" : "1RB"); 
						}
					}
					else if ( yD >= MOVE_THRESHOLD )
					{
						status	= "1Y";
					}
				}
				else if ( status == "1Y" )
				{
					
				}
				else
				{
					if ( xD >= MOVE_THRESHOLD )
					{
						if ( objBox.hasClass("end_return") || objBox.hasClass("scroll_x") )
						{
							status	= xd > 0 ? "1L" : "1R";
						}
						else if ( objBox.hasClass("end_stop") )
						{
							status	= xd > 0 ? (itemNo > 0 ? "1L" : "1LB") : (itemNo < itemCount-1 ? "1R" : "1RB"); 
						}
					}
					else
					{
						status	= "1X";
					}
				}
	
				objBox.attr("data-status", status);
				
				if ( statusOld == "1" && ["1R","1L", "1RB", "1LB"].indexOf(status) > -1 )
				{
					if ( objBox.hasClass("scroll_x") )
					{
					}
					else
					{
						var	objItemList	= objMid.children(".slide_item");
						var	objItemC	= objItemList.eq(itemNo);
						var	objItemL	= itemNo == 0				? (objBox.hasClass("end_stop") ? null : objItemList.eq(itemCount-1	)) : objItemList.eq(itemNo-1);
						var	objItemR	= itemNo == itemCount -1	? (objBox.hasClass("end_stop") ? null : objItemList.eq(0			)) : objItemList.eq(itemNo+1);
		
						if ( IS_IOS )
						{
							if ( objItemL )	{	objItemL.show();	}
							if ( objItemR )	{	objItemR.show();	}
						}

						if ( objBox.hasClass("main_top_slide_box") )
						{
							onResizeHaniMainRanking();
							
							var	objHeader	= jQuery("header.top_menu	> .box");
							
							if ( objHeader.hasClass("fixed") )
							{
								var	topGap		= objHeader.attr("data-status") == "off" ? SCROLL_TOP - objHeader.children(".top").height() : SCROLL_TOP;
								
								if ( objItemL )	{	objItemL.css({"top":topGap+"px"});	}
								if ( objItemR )	{	objItemR.css({"top":topGap+"px"});	}
							}
							
							if ( objItemL )	{	objItemL.height(WINDOW_HEIGHT);	}
							if ( objItemR )	{	objItemR.height(WINDOW_HEIGHT);	}
						}
						else if ( objBox.hasClass("article_slide_box") )
						{
							for(var k=0;k<2;k++)
							{
								var	objItem	= k == 0 ? objItemL : objItemR;
								if ( objItem )
								{
									var	topGap		= 0;
									var	heightGap	= 0;
									var	objArticle	= objItem.find("section.article.selected");
									
									if ( objArticle.length )
									{
										var	objHeader	= jQuery("header.top_menu	> .box");
										var	itemNo2		= parseInt(objArticle.attr("data-item-no"));
										
										if ( itemNo2 == 0 )
										{
											topGap	= objHeader.hasClass("normal") ? 0 : SCROLL_TOP;
										}
										else
										{
											var	topArticle	= objArticle.offset().top;
											
											topGap		= SCROLL_TOP-topArticle+objHeader.children(".top").height();
											heightGap	= topArticle;
											
										}
										
										objItem.css({"top":topGap+"px"});
										objItem.height(WINDOW_HEIGHT + heightGap);
									}
								}
							}
						}						
					}
				}
				
				if ( status == "1X" || status == "1R" || status == "1L" || status == "1RB" || status == "1LB" )
				{
					if ( objBox.hasClass("scroll_x") )
					{
						var	objXBox			= objMid.children(".scroll_x_box");
						var	objXItemList	= objXBox.children(".scroll_x_item");
						var	left0			= parseInt(objBox.attr("data-left"));
						var	left1			= left0;
						var	leftC			= Math.floor(objXBox.width()/2);
		
						if ( status == "1L" )
						{
							var	leftThreshold	= parseInt(objBox.attr("data-left-threshold-l"));
							
							left1	= left0 + xd - MOVE_THRESHOLD
							
							if ( left1 > leftThreshold )
							{
								left1	= Math.min(leftThreshold + ((left1 - leftThreshold)/3), Math.floor(objMid.width()/2)-1);
							}
						}
						else if ( status == "1R" )
						{
							var	leftThreshold	= parseInt(objBox.attr("data-left-threshold-r"));
							
							left1	= left0 + xd + MOVE_THRESHOLD;
							
							if ( left1 < leftThreshold )
							{
								left1	= Math.max(leftThreshold + ((left1 - leftThreshold)/3), Math.floor(objMid.width()/2)-objXBox.width()+1);
							}
						}
						
						addCssTransform(objXBox, (left1*100/objXBox.width())+"%");
					}
					else
					{
						var	objItemList	= objMid.children(".slide_item");
						var	objItemC	= objItemList.eq(itemNo);
						var	objItemL	= itemNo == 0				? (objBox.hasClass("end_stop") ? null : objItemList.eq(itemCount-1	)) : objItemList.eq(itemNo-1);
						var	objItemR	= itemNo == itemCount -1	? (objBox.hasClass("end_stop") ? null : objItemList.eq(0			)) : objItemList.eq(itemNo+1);
						var	widthMid	= objMid.width();
						var	leftC		= 0;
						var	leftL		= widthMid;
						var	leftR		= -widthMid;
		
						if ( status == "1L" )
						{
							leftC	= xd - MOVE_THRESHOLD;
							leftL	= leftC - widthMid;
							leftR	= widthMid;
							if ( itemCount == 2 )
							{
								objItemR	= null;
							}
						}
						else if ( status == "1R" )
						{
							leftC	= xd + MOVE_THRESHOLD;
							leftL	= -widthMid;
							leftR	= leftC + widthMid;
							if ( itemCount == 2 )
							{
								objItemL	= null;
							}
						}
						else if ( status == "1LB" )
						{
							leftC	= Math.min((xd - MOVE_THRESHOLD)/3, SLIDE_THRESHOLD);
							objItemL	= null;
							objItemR	= null;
						}
						else if ( status == "1RB" )
						{
							leftC	= Math.max((xd + MOVE_THRESHOLD)/3, -SLIDE_THRESHOLD);;
							objItemL	= null;
							objItemR	= null;
						}
						else
						{
							leftC	= 0;
							leftL	= -widthMid;
							leftR	= widthMid;
							if ( itemCount == 2 && objItemR && objItemL )
							{
								objItemR	= null;
							}
						}
						
						addCssTransform(objItemC, (leftC*100/widthMid)+"%");
						addCssTransform(objItemL, (leftL*100/widthMid)+"%");
						addCssTransform(objItemR, (leftR*100/widthMid)+"%");
					}
				}
			}
		}
	};

	function	onMoveStop(obj, event)
	{
		var	objMid		= jQuery(obj);
		var	objBox		= objMid.parent(".slide_box");
		var	objChildBox	= objMid.find(".slide_box");
		var	status		= objBox.attr("data-status");
		var	itemNo		= parseInt(objBox.attr("data-item-no"));
		var	itemCount	= parseInt(objBox.attr("data-item-count"));
		
		if ( status == "1R" || status == "1L" || status == "1RB" || status == "1LB" )
		{
			var	itemNo2		= itemNo;
			var	x			= parseInt(objBox.attr("data-x1"));
			var	y			= parseInt(objBox.attr("data-y1"));
			var	x0			= parseInt(objBox.attr("data-x0"));
			var	xd			= x - x0;
			var	xD			= Math.abs(xd);
			
			if ( objBox.hasClass("scroll_x") )
			{
				var	objXBox			= objMid.children(".scroll_x_box");
				var	objXItemList	= objXBox.children(".scroll_x_item");
				var	leftThresholdL	= parseInt(objBox.attr("data-left-threshold-l"));
				var	leftThresholdR	= parseInt(objBox.attr("data-left-threshold-r"));
				var	left0			= parseInt(objBox.attr("data-left"));
				var	left1			= left0;
				var	left2			= 0;
				var	leftC			= objBox.width()/2;
				
				if ( status == "1L" )
				{
					left1	= left0 + xd - MOVE_THRESHOLD;
					status	= "2L";
				}
				else if ( status == "1R" )
				{
					left1	= left0 + xd + MOVE_THRESHOLD;
					status	= "2R";
				}
				
				var	left3		= left0;
				
				objXItemList.removeClass("selected");
				
				if ( left1 > leftThresholdL )
				{
					left3	= leftThresholdL;
					itemNo2	= 0;
					
				}
				else if ( left1 < leftThresholdR )
				{
					left3	= leftThresholdR;
					itemNo2	= itemCount - 1;
				}
				else
				{
					for(var i=0;i<itemCount;i++)
					{
						var	objXItem	= objXItemList.eq(i);

						if ( left1 + left2 <= leftC && leftC <= left1 + left2 + objXItem.width() )
						{
							if ( itemNo == i && xD > SLIDE_THRESHOLD )
							{
								if ( status == "2L" )
								{
									var	objXItemPrev	= objXItemList.eq(i-1);
									itemNo2	= itemNo - 1;
									left3	= leftC - left2 + objXItemPrev.width() - parseInt(objXItemPrev.width()/2);
									break;
								}
								else if ( status == "2R" )
								{
									var	objXItemNext	= objXItemList.eq(i+1);
									itemNo2	= itemNo + 1;
									left3	= leftC - left2 - objXItem.width() - parseInt(objXItemNext.width()/2);
									break;
								}
							}
							else
							{
								itemNo2	= i;
								left3	= leftC - left2 - parseInt(objXItem.width()/2);
								break;
							}
						}
						else
						{
							left2	+= objXItem.width();
						}
					}
				}
				
				objXItemList.eq(itemNo2).addClass("selected");
				
				if ( itemNo != itemNo2 )
				{
					if ( objBox.hasClass("aside_left_menu_slide_box") )
					{
						onClickSlideToByQuery(".aside_left_slide_box", itemNo2);
					}
					if ( objBox.hasClass("aside_right_slide_box") )
					{
						onClickSlideToByQuery(".aside_right_slide_box", itemNo2);
					}
				}
				
				objBox.attr("data-item-no", itemNo2);
				
				if ( left1 == left3 )
				{
					setTimeout(function(){objBox.attr("data-status", "0");},100);
				}
				else
				{
					addCssTransition(objXBox,	(left3*100/objXBox.width())+"%",	SLIDE_DURATION, onSlideDone);
					objBox.attr("data-status",	status).attr("data-left", left3);
				}
			}
			else
			{
				var	objItemList	= objMid.children(".slide_item");
				var	objItemC	= objItemList.eq(itemNo);
				var	objItemL	= itemNo == 0				? (objBox.hasClass("end_stop") ? null : objItemList.eq(itemCount-1	)) : objItemList.eq(itemNo-1);
				var	objItemR	= itemNo == itemCount -1	? (objBox.hasClass("end_stop") ? null : objItemList.eq(0			)) : objItemList.eq(itemNo+1);
				var	leftC		= 0;
				var	leftL		= 100;
				var	leftR		= -100;
				var	funcC		= null;
				var	funcL		= null;
				var	funcR		= null;
				
				if ( status == "1LB" )
				{
					initSlideItem(objItemL);
					initSlideItem(objItemR);
					
					status		= "0L";
					leftC		= 0;
					objItemL	= null;
					objItemR	= null;
					funcC		= initSlideItemC;
				}
				else if ( status == "1RB" )
				{
					initSlideItem(objItemL);
					initSlideItem(objItemR);

					status		= "0R";
					leftC		= 0;
					objItemL	= null;
					objItemR	= null;
					funcC		= initSlideItemC;
				}
				else if ( xD > SLIDE_THRESHOLD )
				{
					if ( status == "1L" )
					{
						initSlideItem(objItemR);

						status		= "2L";
						leftC		= 100;
						leftL		= 0;
						objItemR	= null;
						funcL		= onSlideDone;
						funcC		= initSlideItemLR;
						itemNo2		= parseInt(objItemL.attr("data-item-no"));
					}
					else
					{
						initSlideItem(objItemL);
						
						status		= "2R";
						leftC		= -100;
						objItemL	= null;
						leftR		= 0;
						funcR		= onSlideDone;
						funcC		= initSlideItemLR;
						itemNo2		= parseInt(objItemR.attr("data-item-no"));
					}
					if ( objBox.hasClass("aside_left_slide_box") )
					{
						onClickSlideToByQuery(".aside_left_menu_slide_box", itemNo2);
					}
					if ( objBox.hasClass("aside_right_slide_box") )
					{
						var	objTop		= objBox.children(".slide_top");
						var	objItems	= objTop.find(".item");
						for(var i=0;i<objItems.length;i++)
						{
							if ( i == itemNo2 )
							{
								objItems.eq(i).addClass("selected");
							}
							else
							{
								objItems.eq(i).removeClass("selected");
							}
						}
					}
				}
				else
				{
					if ( status == "1L" )
					{
						initSlideItem(objItemR);
						
						status		= "0L";
						leftC		= 0;
						leftL		= -100;
						objItemR	= null;
						funcL		= initSlideItemLR;
						funcC		= initSlideItemC;
					}
					else
					{
						initSlideItem(objItemL);
						
						status		= "0R";
						leftC		= 0;
						objItemL	= null;
						leftR		= 100;
						funcR		= initSlideItemLR;
						funcC		= initSlideItemC;
					}
				}
				
				addCssTransition(objItemC,	leftC+"%",	SLIDE_DURATION,	funcC);
				addCssTransition(objItemL,	leftL+"%",	SLIDE_DURATION,	funcL);
				addCssTransition(objItemR,	leftR+"%",	SLIDE_DURATION,	funcR);
			}
			
			objBox.attr("data-status",	status).attr("data-item-no", itemNo2);
		}
		else if ( status == "1X" || status == "1Y" )
		{
			setTimeout(function(){objBox.attr("data-status", "0");},100);
		}
		else if ( status == "2R" || status == "2L" )
		{

		}
		else
		{
			objBox.attr("data-status", "0");
		}
	};
	
	function	onClickSlideToByObj(obj)
	{
		var	objItem	= jQuery(obj);
		var	objBox	= objItem.closest(".slide_box");
		var	itemNo	= parseInt(objItem.attr("data-item-no"));
		onClickSlideTo(objBox, itemNo);
	};
	
	function	onClickSlideToByQuery(query, itemNo2)
	{
		var	objBox	= jQuery(query);
		onClickSlideTo(objBox, itemNo2);
	};
	
	function	onClickSlideTo(objBox, itemNo2)
	{
		var	objSlideBox	= objBox.closest(".slide_box");
		var	isValid		= true;
		if ( objSlideBox )
		{
			isValid		= ["0", "1"].indexOf(objSlideBox.attr("data-status")) > -1;
		}

		if ( isValid )
		{
			var	objMid		= objBox.children(".slide_mid");
			var	status		= objBox.attr("data-status");
			var	itemNo1		= parseInt(objBox.attr("data-item-no"));
			var	itemCount	= parseInt(objBox.attr("data-item-count"));
			
			if ( status == "0" && itemNo1 != itemNo2 )
			{
				if ( objBox.hasClass("scroll_x") )
				{
					var	objXBox			= objMid.children(".scroll_x_box");
					var	objXItemList	= objXBox.children(".scroll_x_item");
					var	left1			= 0;
					var	left2			= 0;
					var	leftC			= objBox.width()/2;
					
					objXItemList.removeClass("selected");
					
					for(var i=0;i<itemCount;i++)
					{
						var	objXItem	= objXItemList.eq(i);
						if ( i == itemNo2 )
						{
							left2	= leftC - left1 - parseInt(objXItem.width()/2);
							objXItem.addClass("selected");
							if ( objBox.hasClass("aside_left_menu_slide_box") )
							{
								onClickSlideToByQuery(".aside_left_slide_box", i);
							}
							break;
						}
						else
						{
							left1	+= objXItem.width();
						}
					}
					
					addCssTransition(objXBox,	(left2*100/objXBox.width())+"%",	SLIDE_DURATION, onSlideDone);
					objBox.attr("data-status",	status).attr("data-left", left2);
				}
				else
				{
					var	objItemList	= objMid.children(".slide_item");
					var	objItemC	= objItemList.eq(itemNo1);
					var	objItemL	= null;
					var	objItemR	= null;
					var	leftC		= 0;
					var	funcC		= null;
					var	funcL		= null;
					var	funcR		= null;
					
					if ( itemNo2 > itemNo1 )
					{
						status		= "2R";
						objItemR	= objItemList.eq(itemNo2);
						leftC		= -100;
						funcR		= onSlideDone;
						if ( IS_IOS )
						{
							objItemR.show();
						}
					}
					else
					{
						status		= "2L";
						objItemL	= objItemList.eq(itemNo2);
						leftC		= 100;
						funcL		= onSlideDone;
						if ( IS_IOS )
						{
							objItemL.show();
						}
					}
					
					if ( objBox.hasClass("main_top_slide_box") )
					{
						onResizeHaniMainRanking();
						
						var	objHeader	= jQuery("header.top_menu	> .box");
						
						if ( objHeader.hasClass("fixed") )
						{
							var	topGap		= objHeader.attr("data-status") == "off" ? SCROLL_TOP - objHeader.children(".top").height() : SCROLL_TOP;
							
							if ( objItemL )	{	objItemL.css({"top":topGap+"px"});	}
							if ( objItemR )	{	objItemR.css({"top":topGap+"px"});	}
						}
						
						if ( objItemL )	{	objItemL.height(WINDOW_HEIGHT);	}
						if ( objItemR )	{	objItemR.height(WINDOW_HEIGHT);	}
					}
					else if ( objBox.hasClass("article_slide_box") )
					{
						for(var k=0;k<2;k++)
						{
							var	objItem	= k == 0 ? objItemL : objItemR;
							if ( objItem )
							{
								var	topGap		= 0;
								var	heightGap	= 0;
								var	objArticle	= objItem.find("section.article.selected");
								
								if ( objArticle.length )
								{
									var	objHeader	= jQuery("header.top_menu	> .box");
									var	itemNo3		= parseInt(objArticle.attr("data-item-no"));
									
									if ( itemNo3 == 0 )
									{
										topGap	= objHeader.hasClass("normal") ? 0 : SCROLL_TOP;
									}
									else
									{
										var	topArticle	= objArticle.offset().top;
										
										topGap		= SCROLL_TOP-topArticle+objHeader.children(".top").height();
										heightGap	= topArticle;
										
									}
									
									objItem.css({"top":topGap+"px"});
									objItem.height(WINDOW_HEIGHT + heightGap);
								}
							}
						}
					}
					else if ( objBox.hasClass("aside_right_slide_box") )
					{
						var	objTop		= objBox.children(".slide_top");
						var	objItems	= objTop.find(".item");
						for(var i=0;i<objItems.length;i++)
						{
							if ( i == itemNo2 )
							{
								objItems.eq(i).addClass("selected");
							}
							else
							{
								objItems.eq(i).removeClass("selected");
							}
						}
					}
					
					addCssTransform(objItemL, "-100%");
					addCssTransform(objItemR, "100%");
					
					setTimeout(
						function()
						{
							addCssTransition(objItemC, leftC+"%",	SLIDE_DURATION,	initSlideItemLR);
							addCssTransition(objItemL, "0%",		SLIDE_DURATION,	funcL);
							addCssTransition(objItemR, "0%",		SLIDE_DURATION,	funcR);
						}, 10
					);
				}
	
				objBox.attr("data-status",	status).attr("data-item-no", itemNo2);
			}
		}
	};

	function	initSlideItemC()
	{
		var	objItem	= jQuery(this);
		var	objMid	= objItem.parent(".slide_mid");
		var	objBox	= objMid.parent(".slide_box");
		
		removeTransition(objItem);
		
		objBox.attr("data-status", "0");
	};
	
	function	initSlideItemLR()
	{
		var	objItem	= jQuery(this);
		
		initSlideItem(objItem);
	};
	
	function	initSlideItem(objItem)
	{
		if ( objItem )
		{
			var	objMid	= objItem.parent(".slide_mid");
			var	objBox	= objMid.parent(".slide_box");
			
			removeTransition(objItem);
			
			objItem.addClass("unselected").removeClass("selected")
			
			if ( objBox.hasClass("height_selected") )
			{
				objItem.css({"top":"", "height":""});
				if ( IS_IOS )
				{
					objItem.hide();
				}
			}
			
			if ( objBox.hasClass("height_window") )
			{
				objItem.scrollTop(0);
			}
		}
	};
	
	function	onSlideDone()
	{
		var	objItem		= jQuery(this);
		var	objMid		= objItem.parent(".slide_mid");
		var	objBox		= objMid.parent(".slide_box");
		var	itemNo		= parseInt(objBox.attr("data-item-no"));
		var	itemCount	= parseInt(objBox.attr("data-item-count"));
		
		if ( objBox.hasClass("scroll_x") )
		{
			var	objXBox		= objMid.children(".scroll_x_box");
			
			removeTransition(objXBox);
		}
		else
		{
			removeTransition(objItem);
			
			objItem.addClass("selected").removeClass("unselected").css({"top":"","height":""});
			
			if ( objBox.hasClass("height_selected") )
			{
				objMid.height(objItem.height());
			}
			
			if ( objBox.hasClass("main_top_slide_box") )
			{
				var	objHeader	= jQuery("header.top_menu	> .box");
				
				if ( objHeader.hasClass("fixed") )
				{
					var	scrollTop	= objHeader.attr("data-status") == "off" ? objHeader.children(".top").height() : 0;
					
					jQuery(document).scrollTop(scrollTop);
				}
				
				var	objMenuList	= jQuery("header.top_menu.main	> .box > .bot	.menu_item");
				for(var i=0;i<objMenuList.length;i++)
				{
					var	objMenuItem	= objMenuList.eq(i);
					if ( i == itemNo )
					{
						objMenuItem.addClass("selected").removeClass("unselected");
					}
					else
					{
						objMenuItem.removeClass("selected").addClass("unselected");
					}
				}
			}			
			else if ( objBox.hasClass("article_slide_box") )
			{
				var	objArticle	= objItem.find("section.article.selected");
				var	objHeader	= jQuery("header.top_menu	> .box");
				var	itemNo2		= parseInt(objArticle.attr("data-item-no"));
				
				if ( itemNo2 == 0 )
				{
					if ( !objHeader.hasClass("normal") )
					{
						jQuery(document).scrollTop(0);
					}
				}
				else
				{
					var	topArticle	= objArticle.offset().top;
					
					scrollTop		= topArticle-objHeader.children(".top").height();
					
					if ( scrollTop != SCROLL_TOP )
					{
						SCROLL_TOP		= scrollTop + (objHeader.hasClass("menu") ? 100 : -100);
						SCROLL_TOP_PREV	= SCROLL_TOP;
					}
					
					jQuery(document).scrollTop(scrollTop);					
				}
				
				setArticleInfo(itemNo, itemNo2);
				getArticleBox(itemNo+1, 0);				
			}
		}
		
		if ( objBox.hasClass("has_bottom_menu") )
		{
			var	objMenuList	= objBox.find(".slide_bot .menu_item");
			for(var i=0;i<objMenuList.length;i++)
			{
				var	objMenuItem	= objMenuList.eq(i);
				if ( i == itemNo )
				{
					objMenuItem.addClass("selected").removeClass("unselected");
				}
				else
				{
					objMenuItem.removeClass("selected").addClass("unselected");
				}
			}
		}
		
		if ( loadHaniImage )
		{
			loadHaniImage();
		}
		
		objBox.attr("data-status", "0");
	};
	
	function	hasChildSlideBox(objBox)
	{
		return	objBox.find(".slide_box[data-status!=0]").length > 0;
	}
	
	function	preventScroll(event)
	{
		event.preventDefault();
		event.stopPropagation();
	};
	
	jQuery(document).ready(initSlideBox);