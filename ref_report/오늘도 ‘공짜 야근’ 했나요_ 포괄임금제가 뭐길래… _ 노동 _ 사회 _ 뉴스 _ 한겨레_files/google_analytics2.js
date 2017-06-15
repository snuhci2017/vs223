	ga('set',	'dimension1',	(window.is_blocked_ad ? 'blocked' : 'displayed'));
	try
	{
		var	is_login	= (document.cookie.indexOf("CLTCOOKINFO")) > -1;
		ga('set',	'dimension5',	(is_login ? "yes" : "no"));
	}
	catch(e)
	{
		
	}
	ga('send',	'pageview');