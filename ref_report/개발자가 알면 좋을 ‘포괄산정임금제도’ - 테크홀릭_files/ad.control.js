// 광고출력
function ADWriteTag(tag){
	if(!tag) return false;

	if(tag=="stop"){
		// 관리자일때,
		if(location.pathname.indexOf("/edit/admin") >= 0) document.write('<div style="text-align:center;margin:10px;">정지된 광고입니다.</div>');

		return false;
	}

	tag = decodeURIComponent(tag);//decode
	document.write(tag);
}