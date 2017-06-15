<!-- 블럭 없애 주기-->
function flashload(flsName,flsWidth,flsHeigt)
{
	var wirtTxt = " <object classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" codebase=\"http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0\" width="+flsWidth+" height="+flsHeigt+" id=\"sub_menu_2\" align=\"middle\">"
				+ " <param name=\"movie\" value="+flsName+" /> "
				+ " <param name=\"quality\" value=\"high\" />"
				+ " <param name=\"allowScriptAccess\" value=\"always\">"
				+ " <PARAM NAME=\"wmode\" VALUE=\"transparent\">"
				+ " <embed src="+flsName+" quality=\"high\" bgcolor=\"#ffffff\" width="+flsWidth+" height="+flsHeigt+" name=\"sub_menu_2\" align=\"middle\"  type=\"application/x-shockwave-flash\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" allowScriptAccess=\"always\" />"
				+ " </object>"
	document.write(wirtTxt);
}

function swf(fw,fh,_src,_id,vars){
	var html = ''
	+ '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0" id="'+_id+'" width="'+fw+'" height="'+fh+'" align="middle">\n'
	+ '<param name="allowScriptAccess" value="always" />'
	+ '<param name="movie" value="'+_src+'" />\n'
	+ '<param name="quality" value="high" />\n'
	+ '<param name="scale" value="exactfit" />\n'
	+ '<param name="wmode" value="transparent" />\n'
	+ '<param name="flashvars" value="'+vars+'" />\n'
	+ '<embed src="'+_src+'" wmode="transparent" flashvars="'+vars+'" scale="exactfit" quality="high" width="'+fw+'" height="'+fh+'" id="'+_id+'" name="'+_id+'" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />\n'
	+ '</object>\n';
	document.write(html);
}

<!-- 블럭 없애 주기 완료 -->
