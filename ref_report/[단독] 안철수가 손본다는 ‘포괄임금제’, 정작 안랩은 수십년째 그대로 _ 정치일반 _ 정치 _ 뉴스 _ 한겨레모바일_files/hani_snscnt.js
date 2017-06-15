	function	HaniSnsCollector(url)
	{
		this.facebook	= -2;
		this.twitter	= -2;
		this.livere		= -2;
		this.url		= url;
		this.status		= 1;
		this.head		= null;
		this.timeoutId	= null;
		
		this.getFacebook	= function(data)
		{
			/////v2.7/ facebook api Scheduled to expire (2018-08)
			//this.facebook	= ( data && data.data && data.data[0] && !isNaN(data.data[0].total_count) ) ? data.data[0].total_count : -1;
			this.facebook	= ( data && data.share && !isNaN(data.share.share_count) && !isNaN(data.share.comment_count) ) ? (data.share.share_count + data.share.comment_count ) : -1;			
			this.send();
			if ( window.setFacebookCount )
			{
				window.setFacebookCount(data);
			}
		}
		
		this.getTwitter		= function(data)
		{
			this.twitter	= (data && !isNaN(data.count)) ? data.count : -1;
			this.send();
			if ( window.setTwitterCount )
			{
				window.setTwitterCount(data);
			}
		}
		
		this.getLivere		= function(data)
		{
			this.livere		= (data && data.result == 200 && data.resultData && !isNaN(data.resultData.replyCount)) ? data.resultData.replyCount : -1;
			this.send();
			if ( window.setReplyCount )
			{
				window.setReplyCount(data);
			}
		};
		
		this.call			= function(url)
		{
			var	obj		= document.createElement("script");
			obj.src		= url;
			obj.async	= 1;
			this.head.appendChild(obj);
		};
		
		this.start			= function()
		{
			this.status	= 1;
			
			var	list	= document.getElementsByTagName("script");
			this.head	= list.length ? list[0].parentElement : document.body;

			//this.call('https://graph.facebook.com/fql?q=SELECT%20url,normalized_url,share_count,like_count,comment_count,total_count,commentsbox_count,comments_fbid,click_count%20FROM%20link_stat%20WHERE%20url="'+encodeURIComponent(this.url)+'"&callback=window.haniSnsCollector.getFacebook');
			this.call('https://graph.facebook.com/v2.7/?id='+encodeURIComponent(this.url)+'&access_token=262286613837221|bTNeUttLjpgvLU3CW0Z7ah7EUFg&callback=window.haniSnsCollector.getFacebook');
//			this.call('http://urls.api.twitter.com/1/urls/count.json?url='+encodeURIComponent(this.url)+'&callback=window.haniSnsCollector.getTwitter');
			this.call('https://dev.livere.co.kr/API_Livere?command=getCount&calltype=refer&consumer_seq=587&livere_seq=14257&refer='+encodeURIComponent(this.url.replace("http://", ""))+'&liverecallback=window.haniSnsCollector.getLivere');
			
			this.timeoutId	= setTimeout(function(){window.haniSnsCollector.timeout();}, 5000);
		};
		
		this.timeout		= function()
		{
			this.timeoutId	= null;
			
			if ( this.status == 1 )
			{
				if ( this.facebook	== -2 )	{	this.facebook	= -1;	}
//				if ( this.twitter	== -2 )	{	this.twitter	= -1;	}
				if ( this.livere	== -2 )	{	this.livere		= -1;	}
				
				this.send();
			}
		};
		
		this.send			= function()
		{
			if ( this.status == 1 )
			{
//				if ( this.url && this.facebook > -2 && this.twitter > -2 && this.livere > -2 )
				if ( this.url && this.facebook > -2 && this.livere > -2 )
				{
					clearTimeout(this.timeoutId);
					this.timeoutId	= null;
					
					var	pageUrl	= location.href;

					if ( window.SERVER_MODE == "develop" )
					{
//						console.log("SnsCount:TestServer - F:"+this.facebook+" T:"+this.twitter+" R:"+this.livere);
						console.log("SnsCount:TestServer - F:"+this.facebook+" R:"+this.livere);
					}
					else
					{
//						this.call("http://sc.hani.co.kr/snscount.php?svcurl="+encodeURIComponent(this.url)+(this.facebook>-1?"&fbcnt="+this.facebook:"")+(this.twitter>-1?"&twcnt="+this.twitter:"")+(this.livere>-1?"&cmt="+this.livere:""));
						this.call("http://sc.hani.co.kr/snscount.php?svcurl="+encodeURIComponent(this.url)+(this.facebook>-1?"&fbcnt="+this.facebook:"")+(this.livere>-1?"&cmt="+this.livere:""));
						this.status	= 2;
					}
				}
			}
		};
	};
	
	function	collectHaniSnsCount(url)
	{
		if ( url )
		{
			window.haniSnsCollector	=	new HaniSnsCollector(url);
			window.haniSnsCollector.start();
		}
	};