	function	subscribe(obj)
	{
		var	objSubscription		= jQuery(obj);
		var	subscriptionStatus	= objSubscription.attr("data-subscription-status");
		var	subscriptionType	= objSubscription.attr("data-subscription-type");
		var	subscriptionNo		= objSubscription.attr("data-subscription-no");
		
		var	userType	= getSubscriptionUserType();
		if ( userType && subscriptionType && subscriptionNo )
		{
			if ( subscriptionStatus == "none" )
			{
				var	url		= "http://subscr.hani.co.kr/subscribe/a/"+userType+"/"+LOGIN_INFO.uid+"/news/"+subscriptionType+"/"+subscriptionNo+"?cb=subscribeResult";
				jQuery.getScript(url);
			}
			else
			{
				var	url		= "http://subscr.hani.co.kr/subscribe/d/"+userType+"/"+LOGIN_INFO.uid+"/news/"+subscriptionType+"/"+subscriptionNo+"?cb=unsubscribeResult";
				jQuery.getScript(url);
			}
		}
		else
		{
			if ( confirm("로그인 해야 이용할 수 있습니다. 로그인 하시겠습니까?") )
			{
				window.location.replace(getUrlLogin());
			}
		}
	};
	
	function	getSubscriptionUserType()
	{
		checkLogin();
		
		if ( LOGIN_INFO.isLogin )
		{
			var	idMap	= {"HANI":"hani","FACEBOOK":"fb","TWITTER":"tw","GOOGLE":"gp","KAKAO":"ka","NAVER":"na"};
			var	type	= idMap[LOGIN_INFO.type];
			
			if ( type )
			{
				return	type;
			}
		}
		
		return	"";
	};
	
	function	subscribeResult(data)
	{
		debuglog(data);
		if ( data )
		{
			if ( data.result == "ok" )
			{
				var	info			= data.subscrInfo.split("||");
				var	objSubscription	= jQuery(".subscription	> .button[data-subscription-type="+info[1]+"][data-subscription-no="+info[2]+"]");
				if ( objSubscription.length )
				{
					objSubscription.addClass("done").removeClass("none");
					objSubscription.attr("data-subscription-status", "subscription");
					objSubscription.attr("title", "구독중");
					
					var	url		= "http://subscr.hani.co.kr/view/subscribeusers/news/"+info[1]+"/"+info[2]+"?cb=checkSubscriptionCount";
					jQuery.getScript(url);
				}
				getMySubscriptionCount();
			}
		}
	};
	
	function	unsubscribeResult(data)
	{
		debuglog(data);
		if ( data )
		{
			if ( data.result == "ok" )
			{
				var	info			= data.subscrInfo.split("||");
				var	objSubscription	= jQuery(".subscription	> .button[data-subscription-type="+info[1]+"][data-subscription-no="+info[2]+"]");
				if ( objSubscription.length )
				{
					objSubscription.addClass("none").removeClass("done");
					objSubscription.attr("data-subscription-status", "none");
					objSubscription.attr("title", "구독하기");
					
					var	url		= "http://subscr.hani.co.kr/view/subscribeusers/news/"+info[1]+"/"+info[2]+"?cb=checkSubscriptionCount";
					jQuery.getScript(url);
				}
				getMySubscriptionCount();
			}
		}
	};
	
	function	initSubscription()
	{
		haniFunctionManager.fire("initSubscription", initSubscriptionProcess, 500);
	}
	
	function	initSubscriptionProcess()
	{
		var	objSubscriptionList	= jQuery(".subscription	> .button.off");
		
		if ( objSubscriptionList.length )
		{
			var	userType			= getSubscriptionUserType();
			
			if ( userType )
			{
				for(var i=0;i<objSubscriptionList.length;i++)
				{
					var	objSubscription		= objSubscriptionList.eq(i);
					var	subscriptionType	= objSubscription.attr("data-subscription-type");
					var	subscriptionNo		= objSubscription.attr("data-subscription-no");
					
					if ( subscriptionType && subscriptionNo )
					{
						var	url		= "http://subscr.hani.co.kr/subscribe/ismember/"+userType+"/"+LOGIN_INFO.uid+"/news/"+subscriptionType+"/"+subscriptionNo+"?cb=checkSubscriptionButton";
						jQuery.getScript(url);
					}
				}			
			}
			else
			{
				objSubscriptionList.removeClass("off").show();
			}
		}
		
		objSubscriptionList	= jQuery(".subscription	> .text.off");
		
		if ( objSubscriptionList.length )
		{
			for(var i=0;i<objSubscriptionList.length;i++)
			{
				var	objSubscription		= objSubscriptionList.eq(i);
				var	subscriptionType	= objSubscription.attr("data-subscription-type");
				var	subscriptionNo		= objSubscription.attr("data-subscription-no");
				
				if ( subscriptionType && subscriptionNo )
				{
					var	url		= "http://subscr.hani.co.kr/view/subscribeusers/news/"+subscriptionType+"/"+subscriptionNo+"?cb=checkSubscriptionCount";
					jQuery.getScript(url);
				}
			}			
		}
	};
	
	function	checkSubscriptionButton(data)
	{
		if ( data && data.result == "ok" )
		{
			var	info			= data.subscrInfo.split("||");
			var	objSubscription	= jQuery(".subscription	> .button.off[data-subscription-type="+info[1]+"][data-subscription-no="+info[2]+"]");
			
			if ( objSubscription.length )
			{
				objSubscription.show();
				if ( data.message )
				{
					objSubscription.addClass("done").removeClass("none");
					objSubscription.attr("data-subscription-status", "subscription");
					objSubscription.attr("title", "구독중");
				}
			}
		}
	};
	
	function	checkSubscriptionCount(data)
	{
		if ( data )
		{
			var	objSubscription	= jQuery(".subscription	> .text.off");
			
			if ( objSubscription.length )
			{
				objSubscription.children("span.count").html(data.subscribeUserCnt);
				objSubscription.show();
			}
		}
	};
	
	function	getMySubscription()
	{
		if ( LOGIN_INFO.isLogin )
		{
			var	userType	= getSubscriptionUserType();
			if ( userType )
			{
				var	url	= "http://subscr.hani.co.kr/view/subscribeall/"+userType+"/"+LOGIN_INFO.uid+"?cb=setMySubscription";
				jQuery.getScript(url);
				jQuery(".my_subscription	> ul").html('<li	class="loading"><div class="image"></div></li>');
				jQuery(".my_subscription	> nav").hide();
			}
		}
	};
	
	function	setMySubscription(data)
	{
		if ( data )
		{
			var	objMenu			= jQuery(".aside_right_slide_box > .slide_top .title[data-item-no=0] > .text > .count");
			if ( objMenu.length )
			{
				if ( data.unreadCnt )
				{
					objMenu.html(data.unreadCnt>9?"9+":data.unreadCnt).show();
					
					if ( LOGIN_INFO.isLogin )
					{
						var	userType	= getSubscriptionUserType();
						if ( userType )
						{
							var	url		= "http://subscr.hani.co.kr/subscribe/resetcount/"+userType+"/"+LOGIN_INFO.uid+"?cb=resetMySubscriptionCount";
							jQuery.getScript(url);
						}
					}
				}
				else
				{
					objMenu.hide();
				}
			}
			
			if ( data.data )
			{
				var	objUl1	= jQuery(".my_subscription	> ul");
				objUl1.html("");
				
				if ( data.data.length )
				{
					var	pageMax	= Math.ceil(data.data.length/10);
					var	objNav	= jQuery(".my_subscription	> nav");
					var	htmlNav	= "";
					
					for(var k=0;k<pageMax;k++)
					{
						var	objLi1			= jQuery("<li/>");
						var	objUl2			= jQuery("<ul/>");
						
						objLi1.addClass("page").attr("data-item-no", k);
						if ( k == 0 )
						{
							objLi1.addClass("selected");
						}
						else
						{
							objLi1.addClass("unselected");
						}
						
						objLi1.append(objUl2);
						objUl1.append(objLi1);
						
						for(var i=k*10;i<data.data.length&&i<(k+1)*10;i++)
						{
							var	item		= data.data[i];
							var	objLi2		= jQuery("<li/>");
							var	objArticle2	= jQuery("<article/>");
							var	objText		= jQuery("<div/>");
							
							var	html		= "";
							var	title		= "";
							var	url			= "";
							
							if ( item.subscrType == "series" )
							{
								title	= '<span class="type">연재</span>'+item.subscrTitle;
								url		= "/arti/SERIES/"+item.subscrSn+"/home01.html";
							}
							else if ( item.subscrType == "issue" )
							{
								title	= '<span class="type">이슈</span>'+item.subscrTitle;
								url		= "/arti/ISSUE/"+item.subscrSn+"/home01.html";
							}
							else if ( item.subscrType == "kija" )
							{
								title	= item.subscrTitle + " 기자";
								url		= "/arti/JOURNALIST/"+item.subscrSn+"/home01.html";
							}
							
							html	+= '<div class="text_in"><h4>'+getHtmlLink(title, url)+'</h4><div class="date">'+strToDate(item.lastUpdated, "type2")+'</div></div>';
							html	+= '<div class="subscription"><div class="button	done" onclick="javascript:subscribe(this);" data-subscription-status="subscription" data-subscription-type="'+item.subscrType+'" data-subscription-no="'+item.subscrSn+'" title="구독중"></div></div>';
							
							objLi2.addClass("box asideR subscription");
							objText.addClass("text").html(html);
							objArticle2.append(objText);
							objLi2.append(objArticle2);
							
							if ( item.unread && item.unread.length )
							{
								var	objUl3		= jQuery("<ul/>");
								
								objUl3.addClass("related1");
								
								for(var j=0;j<item.unread.length;j++)
								{
									var	item2		= item.unread[j];
									var	objLi3		= jQuery("<li/>");
									var	objArticle3	= jQuery("<article/>");
									var	objH5		= jQuery("<h5/>");
									
									objLi3.addClass("related1");
									objH5.html(getHtmlLink(item2.title, item2.svcurl));
									objArticle3.append(objH5);
									objLi3.append(objArticle3);
									objUl3.append(objLi3);
								}								
								objLi2.append(objUl3);
							}					
							objUl2.append(objLi2);
						}
						htmlNav	+= '<span	class="'+(k==0?"selected":"unselected")+'" onclick="javascript:moveMySubscription('+k+');" data-item-no="'+k+'">'+(k+1)+'</span>';
					}
					
					objNav.show();
					objNav.children(".page_body").html(htmlNav);
				}
				else
				{
					objUl1.html('<li	class="no_article"><div class="image"></div><div class="text">구독중인 기사가 없습니다.</div></li>');
				}
			}			
		}
	};

	function	moveMySubscription(pageNo)
	{
		var	objUl	= jQuery(".my_subscription	> ul");
		var	objLi	= objUl.children("li.selected");
		var	pageNo2	= parseInt(objLi.attr("data-item-no"));
		if ( pageNo != pageNo2 )
		{
			var	objNav	= jQuery(".my_subscription	> nav");
			objNav.find("> .page_body > span.selected").addClass("unselected").removeClass("selected");
			objNav.find("> .page_body > span[data-item-no="+pageNo+"]").addClass("selected").removeClass("unselected");
			objUl.find("> li[data-item-no="+pageNo+"]").addClass("selected").removeClass("unselected");
			objLi.addClass("unselected").removeClass("selected");
		}
		
	};
	
	function	getMySubscriptionCount()
	{
		if ( LOGIN_INFO.isLogin )
		{
			var	userType	= getSubscriptionUserType();
			if ( userType )
			{
				var	url	= "http://subscr.hani.co.kr/view/unreadCnt/"+userType+"/"+LOGIN_INFO.uid+"?cb=setMySubscriptionCount";
				jQuery.getScript(url);
			}
		}
	};
	
	function	setMySubscriptionCount(data)
	{
		debuglog(data);
		if ( LOGIN_INFO.isLogin )
		{
			LOGIN_INFO.subscription	= (data && data.unreadCnt) ? data.unreadCnt : 0;
			checkLoginIcon();
		}
	};
	
	function	resetMySubscriptionCount(data)
	{
		if ( data && data.result == "ok" )
		{
			if ( LOGIN_INFO.isLogin )
			{
				LOGIN_INFO.subscription	= 0;
				checkLoginIcon();				
			}
		}
	};
	
	function	scrap(obj)
	{
		var	objScrap		= jQuery(obj);
		var	scrapStatus		= objScrap.attr("data-scrap-status");
		var	scrapUrl		= objScrap.attr("data-scrap-url");
		var	scrapTitle		= objScrap.attr("data-scrap-title");
		var	scrapSection	= objScrap.attr("data-scrap-section");
		
		checkLogin();
		if ( LOGIN_INFO.isLogin )
		{
			console.log(scrapStatus);
			if ( scrapStatus == "none" )
			{
				var	url		= "http://scrapapi.hani.co.kr/node/i";
				url		+= "?u="+scrapUrl;
				url		+= "&s="+scrapSection;
				url		+= "&t="+scrapTitle;
				url		+= "&m=hani";
				url		+= "&callback=scrapResult";
				jQuery.getScript(url);
			}
			else
			{
				alert("이미 스크랩된 기사입니다.");
			}
		}
		else
		{
			if ( confirm("로그인 해야 이용할 수 있습니다. 로그인 하시겠습니까?") )
			{
				window.location.replace(getUrlLogin());
			}	
		}
	};
	
	function	unscrap(scrapId)
	{
		checkLogin();
		if ( LOGIN_INFO.isLogin )
		{
			var	url	= "http://scrapapi.hani.co.kr/node/d?list="+JSON.stringify([scrapId])+"&callback=unscrapResult";
			jQuery.getScript(url);
		}
		else
		{
			if ( confirm("로그인 해야 이용할 수 있습니다. 로그인 하시겠습니까?") )
			{
				window.location.replace(getUrlLogin());
			}
		}
	};
	
	function	scrapResult(data)
	{
		jQuery(".goToLinkScrap").attr("data-scrap-status", data == "success" ? "done" : "none");
		if ( data == "success" )
		{
			alert("스크랩 되었습니다.");
			var	url		= "http://scrapapi.hani.co.kr/node/c?callback=checkScrapCount";
			jQuery.getScript(url);
		}
	};
	
	function	unscrapResult(data)
	{
		if ( data == "success" )
		{
			var	objNav		= jQuery(".my_scrap	> nav");
			var	pageNo		= parseInt(objNav.attr("data-page-no"));
			var	itemCount	= parseInt(objNav.attr("data-item-count"));
			if ( itemCount == 1 )
			{
				pageNo--;
			}
			pageNo	= Math.max(1, pageNo);
			getMyScrap(pageNo);
		}
	};
	
	function	initScrap()
	{
		haniFunctionManager.fire("initScrap", initScrapProcess, 500);
	};
	
	function	initScrapProcess()
	{
		checkLogin();
		if ( LOGIN_INFO.isLogin )
		{
			var	objScrapList	= jQuery(".goToLinkScrap");
			if ( objScrapList.length )
			{
				var	objScrap	= objScrapList.eq(0);
				var	scrapUrl	= objScrap.attr("data-scrap-url");
				
				var	url		= "http://scrapapi.hani.co.kr/node/s?u="+scrapUrl+"&callback=checkScrap";
				jQuery.getScript(url);
			}
			
			getScrapCount(false);
		}
	};
	
	function	checkScrap(data)
	{
		jQuery(".goToLinkScrap").attr("data-scrap-status", data == 0 ? "none" : "done");
	};
	
	function	getScrapCount(willReset)
	{
		var	url		= "http://scrapapi.hani.co.kr/node/c?callback=checkScrapCount"+(willReset?"A":"B");
		jQuery.getScript(url);
	};
	
	function	checkScrapCountA(data)
	{
		checkScrapCount(data, true);
	};
	
	function	checkScrapCountB(data)
	{
		checkScrapCount(data, false);
	};
	
	function	checkScrapCount(data, willReset)
	{
		if ( LOGIN_INFO.isLogin )
		{
			LOGIN_INFO.scrap	= data;
			var	objMenu			= jQuery(".aside_right_slide_box > .slide_top .title[data-item-no=1] > .text > .count");
			if ( objMenu.length )
			{
				if ( data )
				{
					objMenu.html(data>9?"9+":data).show();
				}
				else
				{
					objMenu.hide();
				}
			}
			checkLoginIcon();
			if ( willReset )
			{
				jQuery.getScript("http://scrapapi.hani.co.kr/node/u?callback=resetMyScrapCount");
			}
		}
	};
	
	function	getMyScrap(pageNo)
	{
		checkLogin();
		if ( LOGIN_INFO.isLogin )
		{
			jQuery(".my_scrap	> ul").html('<li	class="loading"><div class="image"></div></li>');
			
			var	url		= "http://scrapapi.hani.co.kr/node/l/?page_no="+pageNo+"&callback=setMyScrap";
			jQuery.getScript(url);
		}
	};
	
	function	setMyScrap(data)
	{
		if ( data && data.documents )
		{
			var	objUl	= jQuery(".my_scrap	> ul");
			var	objNav		= jQuery(".my_scrap	> nav");
			objUl.html("");
			
			if ( data.documents.length )
			{				
				var	pageNo		= data.currentPage;
				var	totalPage	= data.totalPages;
				var	pageStart	= pageNo + 1 - (pageNo % 5);
				var	pagePrev	= pageStart-5;
				var	pageNext	= pageStart+5;
				var	navHtml		= "";
			
				for(var i=0;i<data.documents.length;i++)
				{
					var	item		= data.documents[i];
					var	objLi		= jQuery("<li/>");
					var	objArticle	= jQuery("<article/>");
					var	objText		= jQuery("<div/>");
					
					var	html		= "";
					var	url			= parseUrl(item.url);
					
					html	+= '<div class="text_in"><h4>'+getHtmlLink(item.title, url["url_changed"]?url["url_changed"]:url)+'</h4><div class="date">'+strToDate(item.regdate, "type1")+'</div></div>';
					html	+= '<div class="delete" onclick="javascript:unscrap(\''+item._id+'\');">삭제</div>';
					
					objLi.addClass("box asideR scrap");
					objText.addClass("text").html(html);
					objArticle.append(objText);
					objLi.append(objArticle);
					objUl.append(objLi);
				}
				
				if ( pagePrev >= 1 )
				{
					objNav.children(".page_side.prev").html('<div class="jump on" title="이전으로" onclick="javascript:getMyScrap('+pagePrev+')"></div>');
				}
				else
				{
					objNav.children(".page_side.prev").html('<div class="jump off" title="이전으로(없음)"></div>');
				}
				
				for(var i=0;i<5;i++)
				{
					var	pageNo2	= pageStart+i;
					if ( pageNo == pageNo2 )
					{
						navHtml	+= '<span	class="selected">'+pageNo2+'</span>';
					}
					else
					{
						navHtml	+= '<span	class="unselected" onclick="javascript:getMyScrap('+pageNo2+')">'+pageNo2+'</span>';
					}

					if ( pageNo2 >= totalPage )
					{
						break;
					}
				}
				
				objNav.children(".page_body").html(navHtml);
				
				if ( pageNext <= totalPage )
				{
					objNav.children(".page_side.next").html('<div class="jump on" title="다음으로" onclick="javascript:getMyScrap('+pageNext+')"></div>');
				}
				else
				{
					objNav.children(".page_side.next").html('<div class="jump off" title="다음으로(없음)"></div>');
				}
					
				objNav.show().attr("data-page-no", pageNo).attr("data-item-count", data.documents.length);
			}
			else
			{
				objUl.html('<li	class="no_article"><div class="image"></div><div class="text">스크랩한 기사가 없습니다.</div></li>');
				objNav.hide();
			}
		}
	};
	
	function	resetMyScrapCount(data)
	{
		if ( LOGIN_INFO.isLogin )
		{
			if ( data == "success" )
			{
				if ( LOGIN_INFO.isLogin )
				{
					LOGIN_INFO.scrap	= 0;
					checkLoginIcon();				
				}
			}
		}
	};
	
	jQuery(document).ready(initSubscription);
	jQuery(document).ready(initScrap);