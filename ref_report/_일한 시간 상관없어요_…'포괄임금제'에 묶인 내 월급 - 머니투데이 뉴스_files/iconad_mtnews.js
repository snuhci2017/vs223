
var IconAd_ConfChild = function(){
	this.media = "moneytoday_news";
	this.mainId = "textBody";
	this.posFromBot = 200;
	this.delay = 200;
	this.leftPos = -20;
	this.cssUrl = "//css2.keywordsconnect.com/iconad_mtnews.css";
};

var IconAd_MainChild = function(){
	this.beforeInit = this.startScrollCheck = function(){
		if(IconAd_Vars.util.cT(18,9)) IconAd_Vars.iconAdConf.delay=200;

		var isDisable = false;

		var curIconTop = IconAd_Vars.util.getPageSize().height + IconAd_Vars.util.scrollY() - 60 - IconAd_Vars.iconAdConf.posFromBot;
		var adObj = document.getElementById("scrollDiv");
		var posObj = document.getElementById("tab_sec1");
		if(posObj){
			if(curIconTop > IconAd_Vars.util.objXorY(posObj, "offsetTop") + posObj.offsetHeight + 80)	isDisable = false;
			else 	isDisable = true;
		} 

		if(isDisable) adObj.style.display = "none";
		else if(!IconAd_Vars.isSliderClosed) {
			adObj.style.display = "block";
		}
	};

	this.scrollPosCheck = function(adObj){
		
	};
};

var iconAdMain = null;

iconAdLaunch = function(){

	IconAd_ConfChild.prototype = new IconAd_Config();
	IconAd_MainChild.prototype = new IconAd_Main();

	IconAd_Vars.iconAdConf = new IconAd_ConfChild();
	iconAdMain = new IconAd_MainChild();

	iconAdInit(); 
};

var iconAdScript = document.createElement("script");
iconAdScript.id = "iconAdSetScript";
iconAdScript.src = "//js2.keywordsconnect.com/IconAd_New_v1.1.js";
iconAdScript.type = "text/javascript";
var iconAdHeader = document.getElementsByTagName("head")[0];
iconAdHeader.appendChild(iconAdScript);