/*------------------------------------------------------------------------------------
	광고 관리 스크립트
	
	# 스크립트 로드
	<script type="text/javascript" src="http://menu.mt.co.kr/js/AdsDispatcher.js" async defer></script>
	
	# 스크립트 초기화 및 사용.
		- 광고가 들어갈 위치를 <div> 태그로 id와 함께 지정해 줍니다.
			ex) <div id="ad_01"></div>
		- 스크립트는 Footer 전 부분에 삽입하며, 초기화는 onload($(document).ready()) 시점에 초기화합니다.
		- 생성자 파라미터
			@param1(String) Element 이름(간단한 Selector 사용 가능합니다)
			@param2(Array) 광고 JSON 데이터입니다.
				- id: 광고가 들어갈 <div>의 id
				- src: 광고 스크립트 
					* 태그 보낼 때(src 값) </> 태그를 제외하고 보내주세요.
					* 태그 속성에 key = "value" 이렇게 되어있으면 key="value" 로 바꿔주세요(스페이스 제거)

		- 초기화를 전부 하고 dispatch()를 실행하면 순차적으로 광고가 들어갑니다.

	<script type="text/javascript" async defer>
		$(document).ready(function(){
			var dispatcher = new AdsDispatcher('body',[{
				id:	'DIV_ID',
				src: '<iframe width="100%" height="30" src="AD_SRC" allowTransparency="true" marginwidth="0" marginheight="0" hspace="0" vspace="0" frameborder="0" scrolling="no">'
			}];

			dispatcher.dispatch();
		});
	</script>
	
	@date 2016.08.08
	@author LaValse
-------------------------------------------------------------------------------------*/
var AdsDispatcher = (function (){
	"use strict";

	var elem;
	var datas;
	var adObjs = new Array();
	var delays = 500;

	function AdsDispatcher(_elName, _datas){
		if(!_elName){
			console.log('set element name');
		}else{
			elem = (_elName.indexOf("#") != -1) ? document.getElementById(_elName) : ((_elName.indexOf('.') != -1) ? document.getElementsByClassName(_elName) : document.getElementsByName(_elName));
			
			if(!_datas){
				console.log('set arrays');
			}else{
				datas = _datas;
				init();	
			}
		}
	}

	AdsDispatcher.prototype.getSourceOfIndex = function(index){
		return datas[index].src;
	}

	AdsDispatcher.prototype.setSources = function(_datas){
		datas = _datas;
		init();
	}

	AdsDispatcher.prototype.dispatch = function(){
		datas.forEach(function(obj){
			var target = document.getElementById(obj.id);

			if(target != null){
				setTimeout(function(){
					target.appendChild(obj.src);
				},delays);
			}
		});
	}

	function init(){
		var regex = /(script|iframe)|[a-zA-Z]+=?[\'\"](.*?)[\'\"]/ig;
		
		datas.forEach(function(obj){
			var id = obj.id;
			var src = obj.src;
			
			if(src != '') {
				var match = src.match(regex);
				var tagName = match[0];
				
				var codeObj = document.createElement(tagName);

				for(var i=1; i<match.length; i++){
					var separateIndex = match[i].indexOf('=');

					var attrName = match[i].substring(0, separateIndex);
					var attrValue = removeSpecialString(match[i].substring(separateIndex+1));

					if(attrName == 'src'){
						attrValue = decodeAmp(attrValue);
					}
					
					codeObj.setAttribute(attrName, attrValue);
				}

				obj.src = codeObj;
			}
		});
	}

	function removeSpecialString (value){
		var regex = /[\'\"]/g;
		
		return value.replace(regex,'');
	}

	function decodeAmp(value){
		var regex = /(&amp;)/g;

		return value.replace(regex, '&');
	}

	return AdsDispatcher;
})();