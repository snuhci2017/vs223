
function ADT_Create_Img_Log(cod,kind)
{
	var dt = new Date();
	var dtt = dt.getTime();
	_Img = new Image();
	_Img.src = "http://183.110.235.2/ck_log.html?code="+cod+"&dtt="+dtt+"&skind="+kind;
}

function ad_clk(cod)
{
	var oForm = document.thisForm;
	oForm.method='get';
	oForm.code.value=cod;
	oForm.target="thisFrame";
	oForm.action="http://183.110.235.2/ck_log.html?skind=clk&code="+cod;
	oForm.submit();
}

var get_params = function(search_string) {

	  var parse = function(params, pairs) {
	    var pair = pairs[0];
	    var parts = pair.split('=');
	    var key = decodeURIComponent(parts[0]);
	    var value = decodeURIComponent(parts.slice(1).join('='));

	    // Handle multiple parameters of the same name
	    if (typeof params[key] === "undefined") {
	      params[key] = value;
	    } else {
	      params[key] = [].concat(params[key], value);
	    }

	    return pairs.length == 1 ? params : parse(params, pairs.slice(1))
	  }

	  // Get rid of leading ?
	  return search_string.length == 0 ? {} : parse({}, search_string.substr(1).split('&'));
	}
var params = get_params(location.search);

// Finally, to get the param you want
var ck=params['ck'];
if(ck==undefined) ck='y';
else ck='n';
