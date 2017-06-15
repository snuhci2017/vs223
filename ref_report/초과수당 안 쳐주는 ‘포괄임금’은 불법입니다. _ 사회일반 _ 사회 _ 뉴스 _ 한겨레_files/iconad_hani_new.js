
var IconAd_ConfChild = function(){
	this.media = "hani_new";
	this.mainId = "contents-article";
	this.posFromBot = 280;
	this.delay = 200;
	this.encoding = "utf-8";
	this.isRelNews = true;
	this.relNewsSelector = '.article-popularity';
	this.relNewsTitle = '오늘의 핫뉴스';
	this.cssUrl = "//css2.keywordsconnect.com/iconad_hani.css";
	this.rejectIp = "103.10.199.38";
	this.isDenyAd = true;
	this.rejectWord = ["옥시","www.oxy.co.kr"];

};

var IconAd_MainChild = function(){

	this.beforeInit = function(){
		if(IconAd_Vars.util.cT(18,9)) IconAd_Vars.iconAdConf.delay=200;
		//IconAd_Vars.util.createScript("//cm.keywordsconnect.com/getLocalIp");
	};

	this.scrollPosCheck = function(adObj){
		var curIconTop = IconAd_Vars.util.getPageSize().height + IconAd_Vars.util.scrollY() - IconAd_Vars.iconAdConf.posFromBot;
		var obj = document.getElementById("left_wing");
		if(obj){
			if(curIconTop > IconAd_Vars.util.objXorY(obj, "offsetTop") + obj.offsetHeight + 60) {
				adObj.style.display = "block";
			}else {
				adObj.style.display = "none";
			}
		}else{
			adObj.style.display = "block";
		}
	};

	this.extraProcess = function(){
		var relaCateList = jQuery(IconAd_Vars.iconAdConf.relNewsSelector);
		var relaList = jQuery(relaCateList).find(".list .article-right .title");
		var relItemHtml = "";
		for(var i = 0; i < relaList.size(); i++){
			var relItem = jQuery(relaList[i]).find("a");
			var title = IconAd_Vars.util.cutStr(relItem.text(), 36);
			if(relItem.find("strong").text().length > 0){
				title = title.replace(title.substring(0,relItem.find("strong").text().length),"");
			}
			relItemHtml += "<a href='" + relItem.attr("href") + "'> - " + title + "</a><br>";
			if(i==2) break;
		}
		document.getElementById("iconAdRel").innerHTML = "<div id='iconAdRelSplit'></div><div id='iconAdRelTitle'>["+IconAd_Vars.iconAdConf.relNewsTitle+"]</div>" + relItemHtml;

		var adObj = jQuery("#scrollDiv");
		var textAdTitle = adObj.find(".textAdTitle");
		var textAdDesc = adObj.find(".textAdDesc");
		var textAdSite = adObj.find(".textAdSite");
		if(textAdSite.text() == "www.mygudok.com"){
			textAdTitle.text(textAdTitle.text().replace("한국일보","한겨레"));
			textAdDesc.text("한겨레 전문구독센터");
		}
	};

	this.ipChk = function(){
		//IconAd_Vars.util.createScript("http://test.inbnet.co.kr/ipsearch.php");
		IconAd_Vars.util.createScript("//cm.keywordsconnect.com/getLocalIp");
	};
};

var iconAdMain = null;

iconAdLaunch = function(){

	IconAd_ConfChild.prototype = new IconAd_Config();
	IconAd_MainChild.prototype = new IconAd_Main();

	IconAd_Vars.iconAdConf = new IconAd_ConfChild();
	iconAdMain = new IconAd_MainChild();

	IconAd_Vars.util = new IconAd_Util();
	iconAdMain.ipChk();
};

getClientLocalIp = function(ip){
	if(ip != IconAd_Vars.iconAdConf.rejectIp){
		iconAdMain.init();
	}
}

var iconAdScript = document.createElement("script");
iconAdScript.id = "iconAdSetScript";
iconAdScript.src = "//js2.keywordsconnect.com/IconAd_New_v1.1.js";
iconAdScript.type = "text/javascript";
var iconAdHeader = document.getElementsByTagName("head")[0];
iconAdHeader.appendChild(iconAdScript);