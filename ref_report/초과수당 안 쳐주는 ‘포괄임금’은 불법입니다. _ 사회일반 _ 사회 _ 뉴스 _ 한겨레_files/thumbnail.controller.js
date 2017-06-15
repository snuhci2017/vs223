/* trandBox */
(function (window, $, undefined) {
	'use strict';

	var trandBox = {},
		config = {
			rootSelector: '#ui-trandBox',
			listSelector: '#ui-trandBoxList',
			tmplSelector: '#trandItemTmpl',
			typeSize: {
				width: 150, // 공통 // 2014-08-11 수정: 152에서 150으로
				height: {
					tall: 182,
					short: 179
				}
			},
			typeClass: {
				wide: {
					tall: '',
					short: 'typeh200'
				},
				narrow: {
					tall: 'typePrd1',
					short: 'typePrd1H200'
				}
			}
		};


	// 초기화
	trandBox.init = function (width, height) {
		var type,
			typeClass,
			rootOldDisplay,
			listOldDisplay;

		width = parseInt(width, 10);
		height = parseInt(height, 10);

		// 박스 타입 체크 및 관련 속성 선언
		type = getType(width, height);
		typeClass = config.typeClass[type.width][type.height];
		this.itemWidth = config.typeSize.width;
		this.itemHeight = config.typeSize.height[type.height];

		// HTML 요소 캐쉬
		// 타입 클래스를 추가해야 가용 높이를 제대로 알 수 있음
		this.root = $(config.rootSelector).addClass(typeClass);
		this.list = $(config.listSelector);
		this.tmpl = $(config.tmplSelector).html();

		// 가용 영역 계산
		rootOldDisplay = this.root.css('display');
		listOldDisplay = this.list.css('display');
		this.root.css('display', 'block');
		this.list.css('display', 'block');
		this.availWidth = this.list.width();
		this.availHeight = height - (this.root.height() - this.list.height());
		this.root.css('display', rootOldDisplay);
		this.list.css('display', listOldDisplay);

		if (this.availWidth > width) {
			this.availWidth = width;
		}
		if (this.availHeight > height) {
			this.availHeight = height;
		}

		// 에러 체크
		this.error = false;
		if ((this.availWidth < trandBox.itemWidth) || (this.availHeight < trandBox.itemHeight)) {
			this.error = true;
			throw new Error('사이즈가 규격에 맞지 않습니다.');
		}

		// 그리드 정보
		this.grid = getGrid();

		// 노출 가능 상품 개수
		this.length = this.grid.maxItems;
	};

	// 내용 노출
	trandBox.render = function (data) {
		if (this.error) {
			return;
		}

		var box = this.root,
			list = this.list,
			tmpl = this.tmpl,
			grid = this.grid,
			cols = grid.cols,
			gutter = grid.gutter,
			gutterVertical = gutter.vertical,
			gutterHorizontal = gutter.horizontal,
			htmlPool = [],
			listPad = 0;

		data = getCreatives(data);

		$.each(data, function (i, item) {
			var html = tmpl,
				marginVertical = gutterVertical,
				marginLeft = gutterHorizontal,
				liStyle = 'margin: {{marginVertical}}px 0 {{marginVertical}}px {{marginLeft}}px',
				key;

			for (key in item) {
				if (item.hasOwnProperty(key)) {
					html = html.replace('{{' + key + '}}', item[key]);
				}
			}

			// 열이 하나면
			if (cols < 2) {
				liStyle = ' float: none; margin: {{marginVertical}}px 0';
			// 각 행의 첫번째 항목이면
			} else if (i % cols === 0) {
				marginLeft = 0;
			// 최우측 항목이면
			} else if ((i + 1) % cols === 0) {
				liStyle = ' float: right; margin: {{marginVertical}}px 0';
			}
			liStyle = liStyle
				.replace(/\{\{marginVertical\}\}/g, marginVertical)
				.replace('{{marginLeft}}', marginLeft);

			html = html
				.replace('{{liStyle}}', liStyle)
				.replace('{{trandItemClass}}', trandBox.trandItemClass);

			// svg 아이콘이 불필요 할 경우 삭제
			/*
			if (data[i].svgIco === undefined || data[i].svgIco === false){
				html = html.replace('{{svgStyle}}','display:none')
			}else{
				html = html.replace('{{svgStyle}}','display:block')
			}*/

			htmlPool.push(html);
		});

		if (grid.rows < 2) {
			listPad = (this.availHeight - (trandBox.itemHeight + gutterVertical * 2)) / 2;
			list.css({
				paddingTop: listPad
			});
		}

		list.html(htmlPool.join(''));
	};

	function getType(width, height) {
		var widthType = 'wide',
			heightType = 'tall';

		// widthType
		if (width < 235) {
			widthType = 'narrow';
		}

		// heightType
		if (widthType === 'wide') {
			if (height < 218) {
				heightType = 'short';
			}
		} else {
			if (height < 240) {
				heightType = 'short';
			}
		}

		return {
			width: widthType,
			height: heightType
		};
	}

	function getGutterSize(totalSize, moduleSize, items, divider) {
		var size = (totalSize - (moduleSize * items));

		if ( items < 2) {
			divider = 2;
		}

		return Math.floor(size / divider);
	}

	function getGrid() {
		var availWidth = trandBox.availWidth,
			availHeight = trandBox.availHeight,
			itemWidth = trandBox.itemWidth,
			itemHeight = trandBox.itemHeight,
			cols = Math.floor(availWidth / itemWidth),
			rows = Math.floor(availHeight / itemHeight),
			maxItems = cols * rows,
			gutterHorizontal = getGutterSize(availWidth, itemWidth, cols, cols - 1),
			gutterVertical = Math.floor(getGutterSize(availHeight, itemHeight, rows, rows) / 2);

		return {
			cols: cols,
			rows: rows,
			maxItems: maxItems,
			gutter: {
				// 가로 여백은 좌우 정렬되어야 하므로 cols - 1 로 나눔
				horizontal: gutterHorizontal,
				// 세로 여백은 padding-top, padding-bottom으로 지정되므로 2로 나눔
				vertical: gutterVertical
			}
		};
	}

	function getCreatives(data) {
		var creatives = data.creatives;

		if (!$.isArray(creatives)) {
			return [];
		}

		if (creatives.length > trandBox.length) {
			creatives = creatives.slice(0, trandBox.length);
		}
		if (creatives.length < trandBox.length) {
			trandBox.length = creatives.length;
		}

		return creatives;
	}

	window.trandBox = trandBox;
}(this, this.jQuery));


function adbayThumbnailCallback()
{
	
	trandBox.render(adbayAdsContents);
	
	//if(trandBox.render(adbayAdsContents))
	//{
		$("#ui-trandBox").show();

		var area = $('.svgArea');

		area.bind('mouseenter',function(){
			$(this).addClass('svgHover');
		}).bind('mouseleave',function(){
			$(this).removeClass('svgHover');
		});
		
		//browser-userAgent
		var ua = window.navigator.userAgent;
		if(ua.indexOf("MSIE") > -1&&ua.substr(30,1)=="8"||ua.substr(30,1)=="7")
		{
			$('.trandBox .lowBro8').css("display","block");
			$('.trandBox .svgArea').css("display","none");
		}
	//}
}
