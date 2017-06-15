	var	IS_PHONEGAP			= false;
	var	IS_PHONEGAP_IOS		= false;
	var	IS_PHONEGAP_ANDROID	= false;
	var	APP_VERSION_NUMBER	= 200;
	var	ON_DEVICE_READY		= false;
	
	function	checkPhoneGap()
	{
		try
		{
			if ( window.location.search )
			{
				var	search	= window.location.search.replace("?", "");
				var	params	= search.split("&");
				var	param	= [];
				for(var i=0;i<params.length;i++)
				{
					var	parts	= params[i].split("=");
					if ( parts[0] == "app" )
					{
						if ( parts[1] == "ios" )
						{
							IS_PHONEGAP			= true;
							IS_PHONEGAP_IOS		= true;
						}
						else if ( parts[1] == "android" )
						{
							IS_PHONEGAP			= true;
							IS_PHONEGAP_ANDROID	= true;
						}
						else
						{
							IS_PHONEGAP			= false;
							IS_PHONEGAP_ANDROID	= false;
						}
					}
					else if ( parts[0] == "ver" )
					{
						APP_VERSION_NUMBER	= parseInt(parts[1]);
					}
				}
			}

			if ( IS_PHONEGAP )
			{
				var	url	= "";
				if ( IS_PHONEGAP_ANDROID )
				{
					if ( APP_VERSION_NUMBER < 250 )
					{
						url	= "http://m.hani.co.kr/section-homepage/svc3mobile/js/app.phonegap/cordova.android.2.4.0.js";
					}
					else
					{
						url	= "http://m.hani.co.kr/section-homepage/svc3mobile/js/app.phonegap/3.6.3/cordova.js";
					}
				}
				if ( IS_PHONEGAP_IOS )
				{
					url	= "http://m.hani.co.kr/section-homepage/svc3mobile/js/app.phonegap/cordova.ios.2.4.0.js";
				}

				document.addEventListener("deviceready", function(){ON_DEVICE_READY=true;}, false);
				
				var	objScript		= document.createElement("script");
				objScript.src		= url;
				document.body.appendChild(objScript);				
			}			
		}
		catch(e)
		{
			
		}
	};	
	
	function	onClickLink(obj)
	{
		var	url	= obj.getAttribute("href");
		
		if ( IS_PHONEGAP && ON_DEVICE_READY && url )
		{
			window.open(url, "_blank", 'location=no,enableviewportscale=yes');
			
			return	false;
		}
		else
		{
			return	true;
		}
	};