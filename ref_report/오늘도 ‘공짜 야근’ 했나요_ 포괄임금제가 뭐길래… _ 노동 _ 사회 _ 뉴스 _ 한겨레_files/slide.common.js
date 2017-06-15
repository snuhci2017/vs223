(function (window, $, undefined) {
	'use strict';
	var slide = {}
	slide.install = function(){
		var privateData = {
			Html : [],
			insertObj : undefined,
			count : 0,
			page : 0,
			nextPage : 0,
			course : 'next',
			maxPage : 0,
			motionSize : 0,
			status : 'stop',
			mouseStatus : false,
			autoSlideTimer : null,
			settingMargin : 0
		}
		var clickEve = function(obj,target){
			if(privateData.status !== 'stop'){return false};
			var course = target.hasClass('next');
			if(course){
				privateData.nextPage = (privateData.page == privateData.maxPage-1)?0:(privateData.page+1);
				privateData.course = 'next';
			}else{
				privateData.nextPage = (privateData.page == 0)?privateData.maxPage-1:(privateData.page-1);
				privateData.course = 'prev';
			};
			obj.insertHtm();
		}
		var autoSlide = function(obj){
			if(privateData.autoSlideTimer === null && privateData.mouseStatus === false){
				privateData.autoSlideTimer = setInterval(function(){
					obj.$obj.find('a.next').click();
				},5000)
			}else{
				if(privateData.autoSlideTimer !== null){
					clearInterval(privateData.autoSlideTimer);
					privateData.autoSlideTimer = null;
				}
			}
		}
		this.Data = {
			json : null, // 상품 DATA
			$obj : null, // 베너 최상위 박스
			Class : null, // 추가할 클래스명
			moveType : null, // 모션 타입(vertical, horizon선)
			width : 0, // 박스 가로폭
			height : 0, // 박스 세로폭
			viewLength : 2, // 화면에 보여지는 베너 갯수
			MarginLeft : 4,				// 코딩별 ul 요소의 마진값이 달라서...
			MarginTop : 0, 				// 코딩별 ul 요소의 마진값이 달라서...
			borderClick : 0 			// 보더라인 클릭시 클릭 될 상품(좌측 혹은 상단 부터)
			
		};
		this.motion = function(){
			var outputThis = this;

			if(privateData.course === 'next'){
				if(this.Data.moveType === 'vertical'){
					privateData.insertObj.find('li').eq(this.Data.viewLength).show()
					privateData.insertObj.animate({
						'margin-left' : -(privateData.motionSize-privateData.settingMargin)
					},'normal',function(){
						privateData.insertObj
							.find('li:last').after(privateData.insertObj.find('li:first'))
							.end()
							.find('li:last').hide()
							.end()
							.css('margin-left',privateData.settingMargin);
						privateData.page = privateData.nextPage;
						privateData.status = 'stop';
					})
				}else{
					privateData.insertObj.find('li').eq(this.Data.viewLength).show()
					privateData.insertObj.animate({
						'margin-top' : -(privateData.motionSize - privateData.settingMargin)
					},'normal',function(){
						privateData.insertObj
							.find('li:last').after(privateData.insertObj.find('li:first'))
							.end()
							.find('li:last').hide()
							.end()
							.css('margin-top',privateData.settingMargin);
						privateData.page = privateData.nextPage;
						privateData.status = 'stop';
					})
				}
			}else{
				if(this.Data.moveType === 'vertical'){
					privateData.insertObj
						.find('li:first').before(privateData.insertObj.find('li:last'))
						.end()
						.find('li:first').show()
						.end()
						.css('margin-left',-(privateData.motionSize-privateData.settingMargin));
					privateData.insertObj.animate({
						'margin-left' : privateData.settingMargin
					},'normal',function(){
						privateData.insertObj.find('li').eq(outputThis.Data.viewLength).hide();
						privateData.page = privateData.nextPage;
						privateData.status = 'stop';
					})
				}else{
					privateData.insertObj
						.find('li:first').before(privateData.insertObj.find('li:last'))
						.end()
						.find('li:first').show()
						.end()
						.css('margin-top',-(privateData.motionSize-privateData.settingMargin));
					privateData.insertObj.animate({
						'margin-top' : privateData.settingMargin
					},'normal',function(){
						privateData.insertObj.find('li').eq(outputThis.Data.viewLength).hide();
						privateData.page = privateData.nextPage;
						privateData.status = 'stop';
					})
				}
			}
		}
		this.insertHtm = function(){
			var tmpHtm = '',
				i,
				loadCounter = 0;
			if(privateData.count === 0){
				privateData.status = 'work';
				for(i=0;i<this.Data.viewLength;i++){
					tmpHtm += privateData.Html[i];
					privateData.Html[i] = 'insert';
				};
				privateData.insertObj.html(tmpHtm);
				privateData.count = this.Data.viewLength;
				if(this.Data.moveType == 'vertical'){
					privateData.motionSize = privateData.insertObj.find('li:first').width();
					privateData.insertObj.css('width',privateData.motionSize*(this.Data.viewLength+1))
				}else{
					privateData.motionSize = privateData.insertObj.find('li:first').height();
					privateData.insertObj.css('height',privateData.motionSize*(this.Data.viewLength+1))
				}
				
				privateData.status = 'stop';
			}else{
				privateData.status = 'work';
				var checkerHtml = (privateData.course === 'next')?(privateData.page + this.Data.viewLength):privateData.nextPage;
				if(checkerHtml > privateData.maxPage-1 || privateData.Html[checkerHtml] == 'insert'){
					this.motion();
				}else{
					if(privateData.course === 'next'){
						privateData.insertObj.find('li.'+this.Data.Class+'_item__'+(checkerHtml-1)).after(privateData.Html[checkerHtml]);
						privateData.Html[checkerHtml] = 'insert';
					}else{
						privateData.insertObj.find('li:last').after(privateData.Html[checkerHtml]);
						privateData.Html[checkerHtml] = 'insert';
					}
					this.motion();
				}
			};
			return this;
		};
		
		this.setting = function(){
			// data checker
			var thisData = this.Data,
				outputThis = this;
			if(thisData.json === null || thisData.$obj === null || thisData.Class === null || thisData.moveType ===null || thisData.width === 0 || thisData.height === 0){
				throw new Error('Data 가 올바르게 정의되지 않았습니다.');
				return;
			}else{
				$.each(thisData.json,function(index){
					privateData.Html[index] = '<li class="'+thisData.Class+'_item__'+index+'"><a href="'+this.click+'" target="_blank"><span class="img_area"><img src="'+this.src+'" alt="" /></span><span class="txt"><em>'+this.txt+'</em></span></a></li>'
				});
				thisData.$obj
					.addClass(thisData.Class)
					.on('mouseenter',function(){
						$(this).addClass('enterArea');
						privateData.mouseStatus = true;
						autoSlide(thisData);
					})
					.on('mouseleave',function(){
						$(this).removeClass('enterArea');
						privateData.mouseStatus = false;
						autoSlide(thisData);
					})
					.find('div.svgArea').on('mouseenter',function(){
						$(this).addClass('svgHover');
					})
					.on('mouseleave',function(){
						$(this).removeClass('svgHover');	
					})
					.end()
					.find('div.prod_list').addClass((thisData.moveType === 'vertical')?'list_h':'list_v')
					.html('<ul '+ ((thisData.moveType == 'vertical')?'style="margin-left:'+thisData.MarginLeft+'px"':'style="margin-top:'+thisData.MarginTop+'px"') +'></ul>')
					.end()
					.find('a.next, a.prev').on('click',function(){
						clickEve(outputThis,$(this));
					})
					.end()
					.find('a.frame').on('click',function(){
						var tmpHref = thisData.$obj.find('div.prod_list li').eq(thisData.borderClick).find('a').attr('href');
						$(this).attr('href',tmpHref);
					})
				privateData.insertObj = thisData.$obj.find('div.prod_list ul');
				privateData.maxPage = thisData.json.length;
				privateData.settingMargin = (thisData.moveType == 'vertical')?thisData.MarginLeft:thisData.MarginTop;
				this.insertHtm();
				autoSlide(thisData);
			};
		};

	}
	window.slide = slide;
}(this, this.jQuery));