/*---------------------------------------------------------------------------------------------
                                      JAVASCRIPT CODE
  ---------------------------------------------------------------------------------------------
	function name						| description				| use process
  ---------------------------------------------------------------------------------------------
	viewFlash()							| 플래시 출력					| 플래시 출력
  ---------------------------------------------------------------------------------------------*/



// 플래시 출력
function viewFlash(src, width, height)
{
	document.write("<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='https://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0' width='"+width+"' height='"+height+"' id='FLVPlayer' align='top'><param name='allowScriptAccess' value='always' /><param name='allowFullScreen' value='true' /><param name='movie' value='"+src+"' /><param name='quality' value='high' /><param name='wmode' value='transparent' /><embed src='" + src + "' quality='high' pluginspage='https://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash' type='application/x-shockwave-flash' width='" + width + "' height='" + height + "' wmode='transparent'></embed></object>");
}


function viewFlash_tv(src, width, height)
{
	document.write("<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='https://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0' width='"+width+"' height='"+height+"' id='FLVPlayer' align='top'><param name='allowScriptAccess' value='always' /><param name='allowFullScreen' value='true' /><param name='movie' value='"+src+"' /><param name='quality' value='high' /><param name='wmode' value='transparent' /><embed src='" + src + "' quality='high' pluginspage='https://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash' type='application/x-shockwave-flash' width='" + width + "' height='" + height + "' bgcolor='#353536' ALIGN='bottom' wmode='transparent'></embed></object>");
}

// 프리에그 동영상
function viewFlashVod(src, width, height)
{
	document.write("<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='https://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0' width='"+width+"' height='"+height+"' id='FLVPlayer' align='top'><param name='allowScriptAccess' value='always' /><param name='bgcolor' value='#000000' /><param name='allowFullScreen' value='true' /><param name='movie' value='"+src+"' /><param name='quality' value='high' /><param name='wmode' value='transparent' /><embed src='"+src+"' quality='high' bgcolor='#000000' width='"+width+"' height='"+height+"' name='FLVPlayer' align='top' allowScriptAccess='always' allowFullScreen='true' type='application/x-shockwave-flash' pluginspage='https://www.macromedia.com/go/getflashplayer' wmode='transparent' /></embed></object>");
}


function  clrImg(obj){
	obj.style.backgroundImage="";obj.onkeydown=obj.onmousedown=null;
}



//-----------------추가---------------------//
// bannermanager 추가
function BMWriteTag(tag, start, end){
	if(!tag) return false;

	if(tag=="del"){
		// 관리자일때,
		if(location.pathname.indexOf("/edit/admin") >= 0) document.write('<div style="text-align:center;margin:10px;">삭제된 배너입니다.</div>');

		return false;
	}

	___currentTime = ___currentTime||Math.floor(new Date().getTime()/1000); // 서버 시간 , 없다면 js 시간으로
	tag = decodeURIComponent(tag);//decode
	start=parseInt(start, 10)||0, end=parseInt(end, 10)||0;

	// 예약이 안되어 있다면,
	if(start<=0 && end<=0){
		document.write(tag);
		return false;
	}

	// 예약 시간이 설정 되어 있다면,
	if(___currentTime >= start && ___currentTime < end){
		document.write(tag);
	}else{
		var e=new Date(start*1000);
		var reserv=e.getFullYear()+"년"+(e.getMonth()+1)+"월"+e.getDate()+"일 "+e.getHours()+"시"+e.getMinutes()+"분";
		if(location.pathname.indexOf("/edit/admin") >= 0){ // 관리자일때,
			if(___currentTime > end) {document.write('<div style="text-align:center;margin:10px;">종료된 배너입니다.</div>');}
			else if(___currentTime < start) document.write('<div style="text-align:center;margin:10px;">['+(reserv)+'] 이후에 노출될 배너입니다.</div>');
		}
	}
}

// 팝업 띄위기 추가
/*
	obj : array

	obj[0] : josn ===>
	idxno : 고유키,
	start : 스타트 시간
	end : 종료시간
	width : 넓이
	height : 높이
	top : 위치 y
	left : 위치 x
*/
function POPWriteTag(obj){
	if(!obj || (typeof obj).toLowerCase() !== "object") return false;

	try{
		var ___currentTime = ___currentTime||Math.floor(new Date().getTime()/1000); // 서버 시간 , 없다면 js 시간으로
		var cnt = obj.length||0;

		if(cnt<=0) return false;

		for(var i=0; i<cnt; i++){
			var arr = obj[i];
			if(!arr || !arr.idxno) continue;

			var idxno = arr.idxno,
				start = parseInt((arr.start||0), 10),
				end = parseInt((arr.end||0), 10),
				width = parseInt((arr.width||300), 10),
				height = parseInt((arr.height||200), 10),
				top = parseInt((arr.top||0), 10),
				left = parseInt((arr.left||0), 10),
				cookie = document.cookie;

				// 날짜가 되었다면
				if((___currentTime > start && ___currentTime < end) || (start!=0 && end==0)){
					// cookie가 없거나, 관리자 모두보기 페이지라면...
					if(location.pathname.indexOf("allView.php")>=0 || cookie.indexOf("pop"+idxno+"=ok")<0) {
						window.open("/popupManager/pop.html?idxno="+idxno,"notice"+idxno,"width="+width+",height="+height+",top="+top+",left="+left+",scrollbars=no");
					}
				}

		}
	}catch(e){
		return false;
	}
}



/* 
	롤링 기사 오버시 나옴(네이버 인기검색어 참고) 
	@params
		id : 이벤트줄 객체
		delay : 멈춤시간
		speed : 속도

	.rollBox{position:relative;}
	.rollBox .rollInBox{position:absolute;top:0
*/
function rollArticle(id, delay, speed){
	if(!id) return ;

	if(!speed) speed = 10;
	if(!delay) delay = 1300;

	var $id = jQuery(id)
		,$rollBox = $id.find(".rollBox")
		,$rollInBoxA = $rollBox.find(".rollInBoxA")
		,cnt = $rollInBoxA.length
		,is = cnt>0
		,marginTop = Number($rollInBoxA.css("margin-top").replace(/px$/i,""))||0
		,marginBottom = Number($rollInBoxA.css("margin-bottom").replace(/px$/i,""))||0
		,margin = marginTop+marginBottom
		,height = ($rollInBoxA.outerHeight()+margin||25)*-1
		,$parent = $rollInBoxA.parent(".rollInBox")
		,si = null
		,si2=null
		,st = null
		,num = 1
		,max=5;

	if(!is) return false;

	for(var i=1; i<max; i++){
		$parent.append($rollInBoxA.clone(true));
	}

	// 롤링
	function roll(){
			var _height = null
				,__height = null;
			
			_height = height*num;

			if(_height>0) _height = _height*-1;
			__height = _height-height;

			si2 = setInterval(function(){
							var _interval = __height--;

							if(_interval===_height){
								clearTimeout(st);
								clearTimeout(si);
								clearInterval(si2);
								st = null;
								si = null;
								si2 = null;
								si = setTimeout(roll, delay);

								//처음으로 되돌리기
								if(num>=(max*cnt)){
									$parent.css({"top":"0px"});
									num=1;
								}else num++;

								return false;
							}
							
							$parent.css({ "top":_interval+"px" });
							_interval = null;
						},speed); 
	}

	// 실행
	if(is){
		st = setTimeout(roll,delay);
	}

	// mouseenter, mouseleave 이벤트
	$id.bind(
	{
		mouseenter:function(){
			if(!is) return ;

			var $this = jQuery(this)
				,pos = $this.position()
				,width = $this.width()
				,$box2 = $this.find(".rollBox2");

			// 롤링 멈춤
			clearTimeout(st);
			clearTimeout(si);
			clearInterval(si2);
			st = null;
			si = null;
			si2 = null;

			$box2.css({"left":pos.left+"px","display":"block","width":width+"px"});
		}
		,mouseleave:function(){
			if(!is) return ;

			var $this = jQuery(this)
				,width = $this.width()
				,$box2 = $this.find(".rollBox2");

			// 롤링 재시작

			$box2.css("display","none");

			if(si===null) roll();
		}
	});
}