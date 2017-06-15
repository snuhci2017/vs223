	ga('set',	'dimension1',	(window.is_blocked_ad ? 'blocked' : 'displayed'));
	
	try
	{
		var	cookies		= document.cookie.split(";");
		var	loginStatus	= "no";
		for(var i=0;i<cookies.length;i++)
		{
			var	cookie	= cookies[i].trim().split("=");
			if ( cookie[0] == "SNS" )
			{
				var	values	= decodeURIComponent(cookie[1]).split("|");
				loginStatus	= values[4];
				break;
			}
		}
		ga('set',	'dimension5',	loginStatus);
	}
	catch(e)
	{
		
	}
	
	ga('send',	'pageview');