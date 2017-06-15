/*
김윤호 2011.02.24
본문내 이미지의 실제 넓이가 제한된 넓이보다 클경우 줄여보여주고,
레이어 띄워 원본 보이게

2011.10.20 - 본문내 테이블 크기초과시도 줄이게

2014.12.04 - 테이블 이미지크기와 맞게, 이미지위 + 버튼 이미지 제자리에 가도록 수정
*/

var resizePhoto = {
	vars : {"width":630, "element":"articleBody", "tables":true},//초기값.. 뭐하면 본문 테이블 넓이를 재어 와도 됨, 한정지을 elementById , tables 테이블크기가 초과하는것두 줄이기(true:줄이기, false:안함)

	addEvt:function(obj, evt, fun){
		if(obj.addEventListener)	obj.addEventListener(evt, fun, false);
		else obj.attachEvent("on"+evt, fun);
	},

	init:function(){
		var  imgs = document.getElementById(resizePhoto.vars.element);///한정할 부분 .. 여기선 기사 본문 이니 거기부터 이미지 탐색

		if(imgs && imgs!="undefined"){
			resizePhoto.vars.imgs=imgs;
			resizePhoto.findImgTags();
		}

		// 본문내 테이블 크기까지 줄이고 싶다면
		if(resizePhoto.vars.tables==true) resizePhoto.resizeBigTable();
	},

	findImgTags:function(){//이미지 찾기
		var imgs = this.vars.imgs.getElementsByTagName('img');
		if(imgs.length>0){
			this.vars.imgObj=imgs;
			this.sizeOf();
		}
	},

	chkImg:function(img, src){//원본파일의 확장자가 뭔지 모르니, 일단 이것만 체크
		//var arr = ["_src.jpg","_src.gif","_src.png","_src.JPG","_src.GIF","_src.PNG"];
		//var _file = src.replace(".",arr[resizePhoto.vars.cnt]);
		//var _file = src.replace(/\.(jpg|JPG|png|PNG|gif|GIF)$/,"_src.$1"); //이건 _src라는 원본이미지를 또다시 남겨놓을때..
		var _file = src;
		var bigImg = document.createElement("img");

		try{
			bigImg.setAttribute("src", _file); //추가 시킨후 실제 넓이만 재어 옴
			this.addEvt(bigImg, "error", function(){//에러일땐 아무일안함
				/*
				if(resizePhoto.vars.cnt<5){
					resizePhoto.vars.cnt++;
					resizePhoto.chkImg(bigImg, _file);
				}
				*/
			});

			if(window.navigator.userAgent.indexOf("MSIE")>0){ //ie 는 짱나게 하네;
				var realWidth = resizePhoto.realSize(bigImg);//실제 넓이

				if(realWidth!=false && realWidth.w>resizePhoto.vars.width && img.width!="undefined"){
					var w = img.width;//태그 넓이
					var h = img.height;
					var src = realWidth.file;

					img.setAttribute("width", w<resizePhoto.vars.width?w:resizePhoto.vars.width);
					img.setAttribute("title", "클릭하면 큰 이미지로 볼수 있습니다.");
					img.style.border = "2px solid #f4f4f4";
					img.setAttribute("class","border-box");
					resizePhoto.clickPhotoEvt(img, _file, realWidth.w, realWidth.h);
					resizePhoto.resizeParentTable(img); //상위테이블크기도 줄이기
				}else resizePhoto.resizeParentTable(img, realWidth.w);
			}else{
				this.addEvt(bigImg, "load", function(){//파일이 있을때만 처리
					var realWidth = resizePhoto.realSize(bigImg);//실제 넓이

					if(realWidth!=false && realWidth.w>resizePhoto.vars.width && img.width!="undefined"){
						var w = img.width;//태그 넓이
						var h = img.height;
						var src = realWidth.file;

						img.setAttribute("width", w<resizePhoto.vars.width?w:resizePhoto.vars.width);
						img.setAttribute("title", "클릭하면 큰 이미지로 볼수 있습니다.");
						img.style.border = "2px solid #f4f4f4";
						img.setAttribute("class","border-box");
						resizePhoto.clickPhotoEvt(img, _file, realWidth.w, realWidth.h);
						resizePhoto.resizeParentTable(img); //상위테이블크기도 줄이기
					}else resizePhoto.resizeParentTable(img, realWidth.w);
				});
			}
		}catch(e){}

		return _file;
	},

	resizeParentTable:function(img, width){
		var obj = img.parentNode.parentNode.parentNode.parentNode;

		//try{
			if(obj.tagName.toLowerCase() == "table"){
				//var width = parseInt(resizePhoto.vars.width);
				//if(obj.getAttribute("width")) obj.width=width;//obj.setAttribute("width", width);
				if(!width)	obj.removeAttribute("width");
				else		obj.setAttribute("width", width);

				// center 가 아닐때 마진값
				//if(obj.align!="center") obj.style.margin="0 10px";
			}
		//}catch(e){}
	},

	realSize:function(img){
		//this.chkImg(img, src)

		if(img != "undefined"){
			var _w = img.width;
			var _h = img.height;
			var _file = img.src;
			//document.body.appendChild(img);
			//document.body.removeChild(img);//꿀럭 거리는게 싫어서 주석, 무슨일 있으려나 ㅡㅡa
			//return {w:_w, file:_file};
		}else return false;

		//this.vars.imgRst = {}; //초기화
		return {w:_w, h:_h, file:_file};
	},

	sizeOf:function(){//사이즈 조절
		var obj = this.vars.imgObj;

		for(var i=0; i<obj.length; i++){
			if(obj[i].src.indexOf("icon_p.gif")<0){
				this.chkImg(obj[i], obj[i].src);
			}
		}
	},

	//IE 절대 좌표 구하기, daum.net 소스임 (body 부터 차례로 계산해서 옴)
	getAbsoluteTop:function(oNode) { // 절대 높이 계산
	    var oCurrentNode=oNode;
	    var iTop=0;
	    while(oCurrentNode.tagName!="BODY") {
	        iTop+=oCurrentNode.offsetTop;
	        oCurrentNode=oCurrentNode.offsetParent;
	    }
	    return iTop;
	},

	getAbsoluteLeft:function(oNode) { // 절대 좌측 계산
	    var oCurrentNode=oNode;
	    var iLeft=0;
	    while(oCurrentNode.tagName!="BODY"){
	        iLeft+=oCurrentNode.offsetLeft;
	        oCurrentNode=oCurrentNode.offsetParent;
	    }
	    return iLeft;//(iLeft>600?390:iLeft);
	},

	addMoreImg:function(obj, src, w, h){
		if(document.getElementById("bigSizePhoto")) resizePhoto.removeMoreImg();

		var img = document.createElement("img");
		img.setAttribute("src","/image2006/icon_p.gif");
		img.setAttribute("title","큰 이미지 보기");
		//img.setAttribute("id", "bigSizePhoto");
		img.style.position = "absolute";
		img.style.cursor = "pointer";
		img.style.opacity = "0.7";
		img.style.filter = "alpha(opacity:70)";
		img.style.bottom = "10px";
		img.style.right = "10px";

		//this.addEvt(img, "mouseover", function(){resizePhoto.addMoreImg(obj, src, w, h);});
		this.addEvt(img, "mousedown", function(){resizePhoto.clickPhoto(src, w, h);});

		//var pos = this.getPosition(obj);

		//img.style.left = pos.x+"px";
		//img.style.top = pos.y+"px";

		if(!document.getElementById("cardNewsImg")){ //카드뉴스 이미지 스크립트와 충돌로 인해...
			// 새로추가 2014.12.04
			// 부모 객체 relative  -> 자리잡음
			var parents = obj.parentNode;
			parents.style.position="relative";

			parents.appendChild(img);
		}

		// 윈도우 resize 시 따라서 이동
		/*
		this.addEvt(window, "resize", function(){
													var pos = resizePhoto.getPosition(obj);
													img.style.left = pos.x+"px";
													img.style.top = pos.y+"px";

												});
		*/
	},

	// 위치값
	getPosition:function(obj){
		var ___x=0, ___y=0;
		if(obj.x){
			//img.style.left = (obj.x>600?390:obj.x)+(obj.width-24)+"px";
			___x = obj.x+(obj.width-24);
			___y = obj.y+(obj.height-22);
		}else{
			___x = this.getAbsoluteLeft(obj)+(obj.width-24);
			___y = this.getAbsoluteTop(obj)+(obj.height-22);
		}
		return {"x":___x, "y":___y}
	},

	removeMoreImg:function(){
		if(document.getElementById("bigSizePhoto"))
		document.getElementById("bigSizePhoto").parentNode.removeChild(document.getElementById("bigSizePhoto"));
	},

	clickPhotoEvt:function(obj, src, w, h){//이벤트 줌
		obj.style.cursor = "pointer";

		// 리사이즈 되기 전에 아이콘이 먼저 자리를 잡아서 타이밍을 늦춤;
		setTimeout(function(){
			resizePhoto.addMoreImg(obj, src, w, h);
		},70);

		this.addEvt(obj, "mouseover", function(){
									obj.style.border = "2px solid #696969";
									//resizePhoto.addMoreImg(obj, src, w, h);
								});

		this.addEvt(obj, "mouseout", function(){
									obj.style.border = "2px solid #f4f4f4";
									//resizePhoto.removeMoreImg();
								});

		this.addEvt(obj, "mousedown", function(){
									try{
										var target = (window.event.srcElement||this).parentNode; // IE || etc
										if(target.tagName.toLowerCase()=="a"){
											// a 링크가 있고, 링크 url 이있따면 무시
											if(target.getAttribute("href")!="") return false;
										}
									}catch(e){}

									resizePhoto.clickPhoto(src, w, h);
								});

	},

	clickPhoto:function(src, w, h){//클릭
		this.positionLayer(src, w, h);
		this.addEvt(window, "resize", function(){
													if(document.getElementById("imgResizeView") || document.getElementById("imgResizeBox")){
														resizePhoto.closeLayer();//리사이즈 하기전 제거
														resizePhoto.positionLayer(src, w, h);
													}else{//remove event
														if(window.removeEventListener) window.removeEventListener("resize");
														else window.detachEvent("resize");
													}
												 });
	},

	positionLayer:function(src, w, h){//이미지 띄우기 실행
		var cw = document.body.clientWidth >  document.body.scrollWidth ? document.body.clientWidth : document.body.scrollWidth;
		var ch = document.body.clientHeight > document.body.scrollHeight ? document.body.clientHeight : document.body.scrollHeight;
		var st = document.body.scrollTop || document.documentElement.scrollTop;

		var xc = cw>w ? (cw/2)-(w/2) : 0; //가운데 찾기
		var tp = st + 10; //위로 부터 띄워서

		var tw = cw>w ? cw : w; //레이어크기 , 이미지가 더 크다면 이미지 크기로
		var th = (ch>h ? ch : h)+tp; //레이어크기 , 이지가 더 크다면 이미지 크기로 + 스크롤탑

		xc = parseInt(xc);
		tp = parseInt(tp);
		tw = parseInt(tw);
		th = parseInt(th);

		//background div
		var div = document.createElement("div");
		div.setAttribute("width", tw);
		div.setAttribute("height", th);
		div.setAttribute("id", "imgResizeView");
		div.setAttribute("title", "클릭하면 이미지가 사라집니다.");
		div.style.position = "absolute";
		div.style.width = tw + "px";
		div.style.height = th + "px";
		div.style.top = "0px";
		div.style.left = "0px";
		div.style.backgroundColor = "#000";
		div.style.opacity = "0.0"; //0.7
		div.style.filter = "alpha(opacity:0)";//70
		div.style.cursor = "pointer";
		div.style.zIndex = "10000000";
		this.addEvt(div, "click", resizePhoto.closeLayer);


		//이미지 div
		var imgDiv = document.createElement("div");
		imgDiv.setAttribute("width", w);
		imgDiv.setAttribute("height", h);
		imgDiv.setAttribute("id", "imgResizeBox");
		imgDiv.setAttribute("title", "클릭하면 이미지가 사라집니다.");
		imgDiv.style.position = "absolute";
		imgDiv.style.top = tp + "px";
		imgDiv.style.left = xc + "px";
		imgDiv.style.width = w + "px";
		imgDiv.style.height = h + "px";
		imgDiv.style.opacity = "0.0"; //0.7
		imgDiv.style.filter = "alpha(opacity:0)";//70
		imgDiv.style.backgroundImage = "url("+src+")";
		imgDiv.style.cursor = "pointer";
		imgDiv.style.border = "10px solid #e6e6e6";
		imgDiv.style.zIndex = "10000000";
		this.addEvt(imgDiv, "click", resizePhoto.closeLayer);


		document.body.appendChild(div); /////레이어 뜸.
		document.body.appendChild(imgDiv);//그위에 이미지(img는 absolute ;;;

		this.fadeIn(document.getElementById("imgResizeView"), document.getElementById("imgResizeBox"), 10, 30);
	},

	fadeIn:function(obj1, obj2, duration, speed){//객체1, 객체2, 간격, 속도
		var untilAlpha = 50;
		var alpha = 0;

		var st1 = setInterval(function(){
									if(alpha < untilAlpha){
										alpha += speed;
										obj1.style.opacity = (alpha/100);
										obj1.style.filter = "alpha(opacity:"+alpha+")";
									}else{
										alpha = 0;
										clearInterval(st1);
										var st2 = setInterval(function(){
																	if(alpha <= 100){
																		alpha += speed;
																		obj2.style.opacity = (alpha/100);
																		obj2.style.filter = "alpha(opacity:"+alpha+")";
																	}else clearInterval(st2);
																}, duration);
									}
								}, duration);
	},

	closeLayer:function(){
		var div = document.getElementById("imgResizeView");
		var imgbox = document.getElementById("imgResizeBox");

		if(imgbox) document.body.removeChild(imgbox);
		if(div) document.body.removeChild(div);
	},


	// 기사내 검색 크기보다 작을때 줄이기
	resizeBigTable:function(){
		var  table = document.getElementById(resizePhoto.vars.element).getElementsByTagName("table");
		try{
			if(table.length>0){
				for(var i=0; i<table.length; i++){
					//if(parseInt(table[i].getAttribute("width")) > parseInt(resizePhoto.vars.width)) table[i].removeAttribute("width"); // table[i].setAttribute("width", resizePhoto.vars.width);
					var width = parseInt(String((table[i].getElementsByTagName("img")[0].style.width||table[i].getElementsByTagName("img")[0].getAttribute("width"))).replace("px",""),10);

					if(width && width < resizePhoto.vars.width) {
						//console.log(table[i].width)
						//table[i].setAttribute("width", width);
						table[i].style.width = width+"px";
					}
				}
			}
		}catch(e){}
	}
}

/*적용
resizePhoto.addEvt(window, 'load', resizePhoto.init);
*/