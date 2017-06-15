	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	if ( window.SERVER_MODE == "develop" )
	{
		ga('create', 'UA-25224435-3', 'auto');
	}
	else
	{
		ga('create', 'UA-25224435-1', 'auto');
	}
	ga('require', 'displayfeatures');
  
	try
	{
		if	( window.googleDimension3	)	{	ga('set',	'dimension3',	window.googleDimension3);	}
		if	( window.googleDimension4	)	{	ga('set',	'dimension4',	window.googleDimension4);	}
		if	( window.googleDimension6	)	{	ga('set',	'dimension6',	window.googleDimension6);	}
		if	( window.googleDimension7	)	{	ga('set',	'dimension7',	window.googleDimension7);	}
		if	( window.googleDimension8	)	{	ga('set',	'dimension8',	window.googleDimension8);	}
		if	( window.googleDimension9	)	{	ga('set',	'dimension9',	window.googleDimension9);	}
		if	( window.googleDimension10	)	{	ga('set',	'dimension10',	window.googleDimension10);	}
	}
	catch(e)
	{
		
	}
		
	window.is_blocked_ad		= true;