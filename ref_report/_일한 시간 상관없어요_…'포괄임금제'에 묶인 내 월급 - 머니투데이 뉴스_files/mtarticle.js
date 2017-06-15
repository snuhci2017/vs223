
//article fontsize
var mtfontSize = parseInt(getCookie("mtfontSize")); 
var lineHeight = 18;

if (isNaN(mtfontSize) == true) {
	mtfontSize = 18;	
}

function saveFaceSize()
{
	var expire = new Date ();
	expire.setTime (expire.getTime() + (6000 * 24 * 3600000)); //expires in 6 days from users clock
	expire = expire.toGMTString();
	document.cookie="mtfontSize="+mtfontSize+"; path=/; expires="+expire;
}

function setFaceSize()
{
//	lineHeight = mtfontSize+Math.round(1.1*mtfontSize);
	obj = document.getElementById("textBody");
	obj.style.fontSize = mtfontSize+"px";
//	obj.style.lineHeight = lineHeight+"px"

	saveFaceSize();
}

function FontSmall()
{
//	alert(mtfontSize);
	if (mtfontSize >= 12) {
		mtfontSize = mtfontSize - 2; 
		setFaceSize(); 
	} 
}

function FontLarge()
{
//	alert(mtfontSize);
	if (mtfontSize < 25) {
		mtfontSize = mtfontSize + 2; 
		setFaceSize(); 
	}
}


function article_print( gid, gtype, gb ) {
	if(!gtype){gtype = '1';}
	window.open('http://news.mt.co.kr/newsPrint.html?no='+gid+'&type='+gtype+'&gubn='+gb,'printpop','toolbar=0,scrollbars=0,width=720,height=600,scrollbars=yes,resizable=yes,left=0,top=0');
}

function article_sendmail( gid, gtype, gb ) {
	if(!gtype){gtype = '1';}
	window.open('http://news.mt.co.kr/newsEmail.html?no='+gid+'&type='+gtype+'&gubn='+gb,'printpop','toolbar=0,scrollbars=0,width=720,height=600,scrollbars=yes,resizable=yes,left=0,top=0');
}

function downloadPdf(article_no, article_type) {
	$('#iframeForPdf').attr('src', 'https://login.mt.co.kr/pdf/makeAndDownloadPdf.php?no=' + article_no + '&type=' + article_type);
}

function image_open(url, winName, width, height, ckScroll, ckTool)
{
	var window_top = 50;
	var window_left =  50;
	if(!ckTool){ckTool='no';}
	window.open(url,winName,'width='+ width +',height=' + height + ',scrollbars=' + ckScroll + ',toolbar=' + ckTool + ',top=' + window_top + ',left=' + window_left + '');
}

/*---------------------------------------------------------------------------------------------------------*/
//# 네이트스크랩API연동 POPUP
/*---------------------------------------------------------------------------------------------------------*/
function scrapNateConnect (sFrom, sType, sNo) {
	var sID = (sFrom == "STAR") ? "s0300003" : "s0300002";
	var strUrl = "http://api.cyworld.com/openscrap/post/v1/?";
	strUrl += "xu=" + escape("http://www.mt.co.kr/view/xml/makeNateScrapXml.php?stype=" + sType + "&sno=" + sNo);
	strUrl += "&sid=" + sID;
	
	var strOption = "width=450,height=410";

	var objWin = window.open(strUrl, 'cyopenscrap',  strOption);
	objWin.focus();
}


function imgResize(arg){
	if(arg.width >= 550 && arg.height >= 900){
		if(arg.width < arg.height) {
			arg.width = parseInt(arg.width*(900/arg.height)); 
		}
		else arg.width = 550; 
	}
	else if(arg.width >= 550 ) {
		arg.width = 550; 
	}
	else if(arg.height >= 900) {
		arg.height = 900; 
	}
}
