var nowurl = document.location.href;
var nowurl2 = document.location.href;
nowurl = nowurl.split('//');
nowurl = nowurl[1].substr(0,nowurl[1].indexOf('/'));
var referrer = document.referrer;

if(referrer){
	referrer = referrer.split('//');
	referrer = referrer[1].substr(0,referrer[1].indexOf('/'));
	var referrer2 = encodeURIComponent(document.referrer);
}

function pppClose(){
	document.location.replace("http://m.hani.co.kr/");
}

var closeState = 1;
if(navigator.userAgent.indexOf("KAKAO") == -1){
	if(nowurl2.indexOf("fr=du") == -1 && nowurl2.indexOf("fr=kt") == -1){
		if(referrer){
			if(nowurl != referrer){
				
				var w = (jQuery(window).width() - 320) / 2;
				var h = (jQuery(window).height() - 505) / 2;
				var hh = document.body.scrollHeight;
				document.write("<div style='width:100%;height:"+hh+"px;background-color: rgba(0,0,0,0.5);position:absolute;top:0;left:0;z-index:2147483646;display:none;' id='pppBack'></div><div style='width:320px;height:480px;position:fixed;top:"+h+"px;left:"+w+"px;z-index:2147483647;display:none;' id='pppBox'><div style='position:absolute;width:30px;height:30px;top:0;right:0;'><img src='http://ads.priel.co.kr/img/close.gif' width='30' height='30' alt='close' style='margin:0;vertical-align:top;' onclick='pppClose()' /></div><iframe src='http://ads.priel.co.kr/cgi-bin/PelicanC.dll?impr?pageid=034K&out=iframe' scrolling='no' border='0' marginWidth='0' marginHeight='0' frameBorder='0' width='320' height='480'></iframe></div>");

				history.pushState(null, null, "#cb");
				jQuery(window).bind("hashchange", function(){
					if(closeState == 1){
						jQuery("#pppBack").show();
						jQuery("#pppBox").show();
						history.pushState(null, null, "#cb");
						closeState = 2;
					}else{
						pppClose();
					}
				});
			}
		}
	}
}