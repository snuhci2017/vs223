var Type = {
	PageIn : "pagein",
	PageOut : "pageout",
	Subscriber : "subscriber",
	RankArticle : "rankatc"
};

var ArticleStatistic = (function(){
	"use strict";
	
	var _p = ArticleStatistic.prototype;
	var URL = "http://g.mt.co.kr/lgetAsyncConnection.php",
		doAlreadyExist = false;
	
	var options = {
		ArticleID: "",
		Title:"",
		ArticleType: "",
		ArticleImg: "",
		ArticleCode: ""
	}

	var callbacks = {
		onPageIn: null,
		onPageOut: null,
		receivedDataOfCurrentSubscriber: null,
		receivedDataOfList: null
	}

	function ArticleStatistic(_options, _callbacks){
		jQuery.extend(options, _options);
		jQuery.extend(callbacks, _callbacks);

		if(options.ArticleID == ""){
			console.warn("Set the article id and reload page");
			return;
		}

		var param = {
			type: Type.PageIn,
			articleId: options.ArticleID,
			articleTitle: options.Title,
			articleType:options.ArticleType,
			articleImg: options.ArticleImg,
			articleCode: options.ArticleCode,
			ref: encodeURIComponent(document.referrer)
		};

		ajaxProc(param);
	}

	_p.getCountOfSubscriber = function(){
		parseCountOfSubscriber();
	}

	_p.getListOfTopArticle = function(){
		parseListOfTopArticle();
	}
	
	function parseCountOfSubscriber(){
		var param = {
			type: Type.Subscriber,
			articleId: options.ArticleID,
			articleType: options.ArticleType,
			articleCode: options.ArticleCode
		}

		ajaxProc(param);
	}

	function parseListOfTopArticle(){
		var param = {
			type: Type.RankArticle,
			articleId: options.ArticleID,
			articleType: options.ArticleType,
			articleCode: options.ArticleCode
		}

		ajaxProc(param);
	}

	function ajaxProc(param){
		jQuery.ajax({
			url: URL,
			data: param,
			success: function(datas){
				if(datas == "ERR_ALREADY_EXIST"){
					console.log("Already exist");

					doAlreadyExist = true;
				}else if(datas == "RETURN_FALSE"){
					console.warn(param.type+" data can't be received");
				}else{
					var callback = null;
					switch(param.type){
						case Type.PageIn:
							callback = callbacks['onPageIn'];
							break;
						case Type.PageOut:
							callback = callbacks['onPageOut'];
							break;
						case Type.Subscriber:
							callback = callbacks['receivedDataOfCurrentSubscriber'];
							break;
						case Type.RankArticle:
							callback = callbacks['receivedDataOfList'];
							break;
					}
					callback.call(this, (datas == "RETURN_TRUE") ? "" : JSON.parse(datas));
					
				}
			}
		});
	}

	jQuery(window).on('beforeunload', function(){
		if(!doAlreadyExist){
			var param = {
				type: Type.PageOut,
				articleId: options.ArticleID
			};

			ajaxProc(param);
		}
	});

	return ArticleStatistic;
})();
