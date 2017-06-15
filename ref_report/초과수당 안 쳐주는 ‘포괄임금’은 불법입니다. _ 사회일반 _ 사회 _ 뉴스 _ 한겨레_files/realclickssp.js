var loc = '';
if(document.referrer != '') {
    loc = document.referrer;
}
else {
    loc = document.location;
}

function addListener(target, type, handler) {
	if (target.addEventListener) {
		target.addEventListener(type, handler, false);
	} else if (target.attachEvent) {
		target.attachEvent("on" + type, handler);    
	} else {
		target["on" + type] = handler;
	}
}

function realFadeIn(id){
    var level=0;
    var inTimer=null;
    inTimer=setInterval(function(){
        level=fadeInAction(id,level,inTimer);
    },50);
}

function fadeInAction(id,level,inTimer){
    level=level+0.1;
    changeOpacity(id,level);
    if(level>1){
        clearInterval(inTimer);
    }
    return level;
}

function realFadeOut(id, ctype){
    var level=1;
    var outTimer=null;
    outTimer=setInterval(function(){
        level=fadeOutAction(id,level,outTimer,ctype);
    },50);
}

function fadeOutAction(id, level, outTimer, ctype){
    level=level-0.1;
    changeOpacity(id,level);
    if(level<0){
        clearInterval(outTimer);
        document.getElementById(id).style.display="none";
    }
    return level;
}

function changeOpacity(id,level){
    var obj=document.getElementById(id);
    obj.style.opacity=level;
    obj.style.MozOpacity=level;
    obj.style.KhtmlOpacity=level;
    obj.style.MsFilter="\'progid:DXImageTransform.Microsoft.Alpha(Opacity="+(level*100)+")\'";
    obj.style.filter="alpha(opacity="+(level*100)+");";
}

function elementInViewport(el) {
    var rect = el.getBoundingClientRect();
    if (typeof rect.width === 'undefined') {
        return true;
    }
    else if(el.getAttribute('dload')) {
        if(el.getAttribute('dload') == 'true') {
            return true;
        }
        else {
            return (rect.top>=0 && rect.left>=0 && rect.top <= (window.innerHeight + 300 || document.documentElement.clientHeight + 300));
        }
    }
    else {
        return (rect.top>=0 && rect.left>=0 && rect.top <= (window.innerHeight + 300 || document.documentElement.clientHeight + 300));
    }
}
function loadRealSSP(mo, m, t, v, eff) {
    var load = false;
    var processScroll = function(){
        clearTimeout(reloadTimer_hanibiz00001_6928);

        if(!load){
            if(t=='i') {
                if(elementInViewport(mo)) {
                    mo.src = mo.getAttribute('data-src');
                    load=true;
                }
            }
            else if(t=='j') {
                if(elementInViewport(mo)) {
                    var so = document.createElement('script');
                    so.setAttribute("src", "//nw.realssp.co.kr/?v="+v+"&m="+mo.getAttribute('data-mcode'));
                    document.getElementsByTagName('head')[0].appendChild(so);
                    load=true;
                }
            }
        }
        else {
            if(eff != 'off' && document.getElementById("real_ad_ui_hanibiz00001_6928")) {
                if(new RegExp('(\\s|^)real_toast(\\s|$)').test(document.getElementById("real_ad_ui_hanibiz00001_6928").className)) {
                    changeOpacity("real_ad_ui_hanibiz00001_6928", 0);
                    reloadTimer_hanibiz00001_6928 = setTimeout("realFadeIn(\'real_ad_ui_hanibiz00001_6928\')", 500);
                }
            }
        }
    };

    processScroll();
    addListener(window, 'scroll',processScroll);
}

var mo_hanibiz00001_6928=document.getElementById("realssp_hanibiz00001_6928");
var reloadTimer_hanibiz00001_6928;
loadRealSSP(mo_hanibiz00001_6928, "hanibiz00001_6928", "j", "1.0", "");

function Real_Set_Cookie(Name,NameVlaue,validDays){
    if(validDays > 0){
        var validDays=validDays; 
        var exp=new Date(); 
        exp.setDate(exp.getDate()+validDays); 
        var expires = "; expires=" + exp.toGMTString();
    }
    else{
         var expires = "";
    }

    var location_domain = document.domain;
    var domain= location_domain.split(".");
    var domain1 = "";

    // 자리수 체크 해서 메인도메인 가져오기.
    if(domain.length > 3){
        for(var i=1; i < domain.length; i++){
            domain1 = domain1 + "." + domain[i];
        }        
    }
    else if(domain.length==3){
        domain1 = domain[1] + "." + domain[2];
        if(domain1=='co.kr' || domain1=='pe.kr' ){
            domain1 = "." + domain[0] + "." + domain1;
        }
        else{
            domain1 = "." + domain1;
        }
    }
    else{
        domain1 = "." + domain[0] + "." + domain[1];            
    }
    document.cookie = Name + "=" + escape(NameVlaue) + ";  " + expires + "; domain=" + domain1 + ";";

	var so = document.createElement('script');
	so.setAttribute("src", "http://nw.realssp.co.kr/realSetCookie.js?cn="+Name);
	document.getElementsByTagName('head')[0].appendChild(so);
	load=true;
}

function Real_getCookie( name ){
    var nameOfCookie = name + "=";
    var x = 0;
        while ( x <= document.cookie.length ) {
            var y = (x+nameOfCookie.length);
                if ( document.cookie.substring( x, y ) == nameOfCookie ) {
                if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
                    var endOfCookie = document.cookie.length;
                return unescape( document.cookie.substring( y, endOfCookie ) );
            }
        x = document.cookie.indexOf( " ", x ) + 1;
        if ( x == 0 )
        break;
    }
    return "";
}