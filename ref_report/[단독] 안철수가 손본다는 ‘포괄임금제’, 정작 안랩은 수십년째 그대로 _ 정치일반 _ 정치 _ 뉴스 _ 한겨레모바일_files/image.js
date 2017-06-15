	function	initHaniImage()
	{
		haniEventManager.addResize(loadHaniImage);
		haniEventManager.addScroll(loadHaniImage);
	};
	
	function	loadHaniImage()
	{
		haniFunctionManager.fire("loadHaniImage", loadHaniImageProcess, 200);
	};
	
	function	loadHaniImageProcess()
	{
		var	objImageList	= jQuery(".background.lazy.off");
		for(var i=0;i<objImageList.length;i++)
		{
			var	objImage	= objImageList.eq(i);

			if	(
					objImage.closest("aside.left.on > main.aside > .aside_left_slide_box > .slide_mid > .slide_item.selected").length > 0 ||
					objImage.closest("main.article > .article_slide_box > .slide_mid > .slide_item.selected > .article.selected").length > 0
				)
			{
				loadHaniBackgroundImage(objImage);
			}
			else if ( objImage.offset().top < SCROLL_TOP + WINDOW_HEIGHT )
			{
				if	( 	
						objImage.closest(".main_top_slide_box > .slide_mid > .slide_item.selected").length > 0 ||
						objImage.closest("main.common").length > 0
					)
				{
					loadHaniBackgroundImage(objImage);
				}				
			} 
		}
	};
	
	function	loadHaniBackgroundImage(objImage)
	{
		objImage.removeClass("off").css({"background-image":"url("+decodeURIComponent(objImage.attr("data-image-url"))+")"});
	}
	
	jQuery(document).ready(initHaniImage);