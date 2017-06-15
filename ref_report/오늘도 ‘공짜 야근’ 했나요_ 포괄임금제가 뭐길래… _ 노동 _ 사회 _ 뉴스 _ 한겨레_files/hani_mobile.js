function chkMobileParam(param) {
    var returnValue, url = location.href, parameters = (url.slice(url.indexOf('?') + 1, url.length)).split('&');
    for (var i = 0, len = parameters.length; i < len; i++) {
        var varName = parameters[i].split('=')[0];
        if (varName.toUpperCase() == param.toUpperCase()) {
            returnValue = parameters[i].split('=')[1];
            return decodeURIComponent(returnValue);
        }
    }    
}

function chkMobile() {
  var ret = '';
  var mobileAgents = new Array('iPhone', 'iPod', 'iPad', 'Mobile', 'Windows CE', 'BlackBerry', 'Android', 'LG', 'MOT', 'SAMSUNG', 'SonyEricsson');
  for (var key in mobileAgents){
	if (navigator.userAgent.indexOf(mobileAgents[key])>=0) {
	  ret = (mobileAgents[key]=='iPad')? 'iPad' : 'mobile';
	  break;
	}
  }
  return ret;
}

var fromMobile	= (chkMobileParam('fromMobile') == undefined) ? false : true;    
var IsMobile	= chkMobile();