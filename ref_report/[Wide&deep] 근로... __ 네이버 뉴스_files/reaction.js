/**
* @fileOverview [PC/M] 공감하기 > 초기화 파일
* @author moonseok.kim@navercorp.com(Naver)
* @since 2016.01.04
*/

/**
* @namespace reaction
*/
window.___ReactionFactory___ = function(window, document) {
	var buildString = "/static20170525135620",
		configures = {
			moduleClassname: "_reactionModule",
			iconToggleClassname: ["on", "off"],
			dependentLibrary: "jquery", /* "jquery" or "jindo" */
			domain: "", //도메인
			staticDomain: "", //for static-file(css/js-library)
			isMobile: true, //모바일 여부
			isDebugMode: false, //msin.js 디버깅 모드
			cssId: "", //css suffix로 지정하지 않으면 css를 로드하지 않는다.(local용 css를 사용하는 경우 빈값으로 처리하면 됨)
			devCssUrl: "", //개발용 css 경로
			language: "ko", //노출 언어
			buttonTemplate: "<span class='u_ico _icon'></span><em class='u_txt _label'>{label}</em><em class='u_cnt _count'></em>",
			faceButtonTemplate: "<span class='u_likeit_blind'>좋아요 평가하기</span><span class='u_likeit_text _count'>{label}</span>",
			faceButtonMaxIconCount: 2,
			isHiddenLayerAfterSelection: false, // 표정 형태(face/multi)일 경우, 레이어를 표정 선택 후에 감출지 여부
			isHiddenIcon: false, //아이콘 감춤 여부
			isHiddenLabel: false, //라벨 감춤 여부
			isHiddenCount: false, //카운트 감춤 여부
			isHiddenZeroCount: false, //카운트가 0일때만 감춤 여부
			isUsedLabelAsZeroCount: false, //카운트가 0일때 라벨을 대신 노출
			maxCount: 99999, //버튼에 노출할 최대 카운트 수(이상인 경우 maxCount 뒤에 '+' 기호가 붙는다)
			contentCountPerOnceRequest: 50, //한번의 카운트 조회시 파라미터로 사용할 컨텐츠의 갯수(url 길이 제한 대응)
			clicklog: null,
			type: "basic",
			isDuplication: true,
			callback: {
				updated: function() {}, //공감하기 카운트 초기화/갱신(update 실행) 시 실행할 콜백 함수
				clicked: function() {}, //공감하기/취소하기 시 실행할 콜백 함수
				updateParent: function() {} // parentContent 데이터 전달시 실행할 콜백 함수
			},
			/* neoid 인증 관련 옵션 - Start */
			authType: "nid",
			authInfo: {
				domain: "",
				token: "",
				consumerKey: "",
				snsCode: "",
				loginHandler: function() {},
				pool: "common"
			}
			/* neoid 인증 관련 옵션 - End */
		},
		resources = {
			js: {
				"jquery": "/js/reaction/dist/jquery.js",
				"basic": "/js/reaction/dist/reaction.basic.js",
				"basic@jindo": "/js/reaction/dist/jindo.reaction.basic.js",
				"friends": "/js/reaction/dist/reaction.basic.friends.js",
				"friends@jindo": "/js/reaction/dist/jindo.reaction.basic.friends.js"
			},
			css: {
				common_basic: "/css/reaction/mobile/likeit.css",
				common_multi: "/css/reaction/mobile/likeit_multi.css",
				service: "/css/reaction/mobile/likeit_{cssId}.css"
			}
		};

	/**
	* Polyfill of Object.assign(supported in ES6) - shallow object copy
	* @see https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	*/
	var assignObject = function(target) {
		if (typeof Object.assign === "function") {
			return Object.assign.apply(null, arguments);
		} else {
			var output = Object(target);
			for (var index = 1; index < arguments.length; index++) {
				var source = arguments[index];
				if (source !== undefined && source !== null) {
					for (var nextKey in source) {
						if (source.hasOwnProperty(nextKey)) {
							output[nextKey] = source[nextKey];
						}
					}
				}
			}
			return output;
		}
	};

	var loadFile = function(url, callback) {
		var headElement = document.head || document.getElementsByTagName("head")[0],
			isCssFile = /\.css\??/.test(url),
			createdElement = isCssFile ? document.createElement("link") : document.createElement("script"),
			isFullUrl = /^(http|https)/.test(url),
			staticUrl = isFullUrl ? url : (configures.staticDomain || configures.domain) + url,
			isHttps = isFullUrl ? /^(https)/.test(url) : /^(https)/.test(configures.domain);

		createdElement.charset = "utf-8";

		if (isCssFile) {
			createdElement.type = "text/css";
			createdElement.rel = "stylesheet";
			createdElement.href = isHttps ? staticUrl.replace("/css/reaction/", "/css/ssl/reaction/") : staticUrl;
		} else {
			createdElement.type = "text/javascript";
			createdElement.src = staticUrl;
		}

		if (callback) {
			//Pollyfill of Function.bind
			callback = callback.bind ? callback.bind(this) : (function(fn, ctx) {
				return function() {
					fn.call(ctx);
				};
			})(callback, this);

			if (createdElement.addEventListener) {
				createdElement.onload = callback;
			} else if (createdElement.readyState) {
				createdElement.onreadystatechange = function() {
					(createdElement.readyState === "loaded" || createdElement.readyState === "complete") && callback();
				};
			}
		}

		headElement.appendChild(createdElement);
	};

	var getJsUrl = function(isJindo) {
		var url = (configures.isDebugMode ? "" : buildString) + resources.js[(configures.type === "friends" ? "friends" : "basic") + (isJindo ? "@jindo" : "")];
		return configures.isDebugMode ? url.replace(".min.", ".") : url;
	};

	var getCssUrl = function(url) {
		return (configures.isDebugMode ? "" : buildString) + (configures.isMobile ? url : url.replace("/mobile/", "/desktop/"));
	};

	var getResourceUrl = function() {
		var res = [];

		//cssId를 지정한 경우에만 css를 받도록 함.
		if (!!configures.cssId) {
			res.push(getCssUrl(/face|multi/.test(configures.type) ? resources.css.common_multi : resources.css.common_basic));
			res.push(configures.devCssUrl || getCssUrl(resources.css.service.replace("{cssId}", configures.cssId.toLowerCase())));
		}

		// jindo버전인 경우에는 jindo와 Component가 존재해야만 한다. 별도로 jindo를 다운받지 않음.
		if (configures.dependentLibrary === "jindo" && window.jindo && (window.jindo.Component || (window.jindo.m && window.jindo.m.Component))) {
			res.push(getJsUrl(true));
		} else {
			if (window.jQuery) {
				res.push(getJsUrl());
			} else {
				res = [ resources.js.jquery, res.concat([getJsUrl()]) ];
			}
		}
		return res;
	};

	var loadResource = function() {
		var i, len, res = getResourceUrl();

		// jquery를 먼저 받고, css, js를 받는다.
		if (res.length === 2 &&
			(typeof res[0] === "string" && typeof res[1] === "object" && res[1].length)) {
			loadFile(res[0], function() {
				for (i = 0, len = res[1].length; i < len; i++) {
					loadFile(res[1][i]);
				}
			});
		} else {
			for (i = 0, len = res.length; i < len; i++) {
				loadFile(res[i]);
			}
		}
	};

	var clicklogs = {
		"nclicks": function(el, log, event) {
			if (configures.isMobile) {
				(typeof window.nclk === "function") && window.nclk(el, log, "", "");
			} else {
				(typeof window.clickcr === "function") && window.clickcr(el, log, "", "", event);
			}
		},
		"laim": function(el, log) {
			var rx = /\{(\w+)\}/g;

			//친구목록레이어의 클릭로그는 수집하지 않는다.
			if (el.className.indexOf("_button") === -1) {
				return;
			}

			//템플릿문자열("{xxx}")이 있는지 확인
			if (rx.test(log)) {
				//템플릿 문자열을 치환환다.
				log = log.replace(rx, function(matched) {
					//템플릿 문자열에서 중괄호({})를 제거한다.
					var removedTag = matched.replace(rx, "$1");

					//전역변수이면 변수의 값으로 사용하고, 아니면 문자열 그대로 반환한다.
					return window[removedTag] || removedTag;
				});
			}

			window.tCR.apply(this, log.split(","));
		}
	};

	var instance = {
		/**
		* 설정된 환경 변수셋을 반환한다.
		*
		* @method reaction#conf
		* @return {Object}
		*/
		conf: function() {
			//configures는 참조 변수로 외부에서 변경이 가능하므로, 새로운 객체에 복사하여 반환한다.
			return assignObject({}, configures);
		},

		assignObject: assignObject,

		/**
		* 클릭로그 함수(내부적으로 nClicks or LAIM을 판별하여 로깅함)
		*
		* @method reaction#clicklog
		* @param {HTMLElement} el 클릭된 엘리먼트
		* @param {Array} log 로깅할 파라미터 셋(영역명, 랭킹, 문서아이디)
		* @param {Envet} [event] 이벤트 객체
		*/
		clicklog: function(el, log, event) {
			if (typeof configures.clicklog === "function") {
				configures.clicklog(el, log, event);
			} else {
				clicklogs[(typeof window.tCR === "function") ? "laim" : "nclicks"](el, log, event);
			}
		},

		/**
		 * 초기화 함수
		 *
		 * @method reaction#init
		 * @param {Object} userConfigures 서비스에서 설정할 환경 변수 객체
		 *   @param {String} userConfigures.domain 서비스에서 사용할 공감하기 도메인
		 *   @param {String} [userConfigures.type="basic"] 좋아요 타입. (basic:기본형, friends: 기본형 + 친구목록, face: 표정형, multi: 표정형 기반 기본형)
		 *   @param {String} [userConfigures.moduleClassname="_reactionModule"] 공감하기 모듈의 기준엘리먼트를 나타내는 클래스명
		 *   @param {Array} [userConfigures.iconToggleClassname=["on","off"]] 공감하기 모듈 내 버튼 토글 클래스명
		 *   @param {String} [userConfigures.dependentLibrary="jquery"] 의존관계에 있는 라이브러리명("jquery" or "jindo")
		 *   @param {Boolean} [userConfigures.isMobile=true] 모바일 버전을 사용할지 여부(true: mobile, false: desktop)
		 *   @param {Boolean} [userConfigures.isDebugMode=false] reaction.main.js를 디버깅 모드로 사용할지 여부(true: reaction.main.js 로드, false: reaction.main.min.js 로드)
		 *   @param {String} [userConfigures.cssId=""] 서비스에서 로드할 css의 아이디(/likeit_{cssId}.css 로 사용됨)
		 *   @param {String} [userConfigures.devCssUrl=""] 개발용 css의 절대 경로로 설정하게되면 최우선으로 로드된다.
		 *   @param {String} [userConfigures.language="ko"] 사용할 언어셋("ko" or "en" or "jp" or "cn")
		 *   @param {String} [userConfigures.buttonTemplate="<span class="u_ico _icon"></span><em class="u_txt _label">{label}</em><em class="u_cnt _count">0</em>"] 버튼 내부의 마크업 템플릿
		 *   @param {String} [userConfigures.faceButtonTemplate="<em class='_label'>{label}</em><em class='_count'></em>"] face 버튼 내부의 마크업 템플릿
		 *   @param {Number} [userConfigures.faceButtonMaxIconCount=2] face 버튼 내부의 아이콘 최대 개수
		 *   @param {String} [userConfigures.isHiddenLayerAfterSelection=false] 표정 형태(face/multi)일 경우, 레이어를 표정 선택 후에 감출지 여부
		 *   @param {Number} [userConfigures.faceButtonMaxIconCount=2] face 버튼 내부의 아이콘 최대 개수
		 *   @param {Boolean} [userConfigures.isHiddenIcon=false] 버튼 내 아이콘은 감출지 여부
		 *   @param {Boolean} [userConfigures.isHiddenLabel=false] 버튼 내 라벨을 감출지 여부
		 *   @param {Boolean} [userConfigures.isHiddenCount=false] 버튼 내 카운트를 감출지 여부
		 *   @param {Boolean} [userConfigures.isHiddenZeroCount=false] 버튼 내 카운트가 0일때만 카운트를 감출지 여부
		 *   @param {Boolean} [userConfigures.isUsedLabelAsZeroCount=false] 버튼 내 카운트가 0일때 라벨을 대신 노출할지 여부
		 *   @param {Number} [userConfigures.maxCount=99999] 버튼에 표시될 Max 공감수(초과되면 {maxCount}+로 표기됨)
		 *   @param {Function} [userConfigures.clicklog=function(el,name,event) {}] 클릭로그 함수를 구현할 콜백함수로 '클릭된 엘리먼트', '영역명', '이벤트' 순으로 arguments를 받는다.
		 *   @param {String} [userConfigures.authType="nid"] 사용할 로그인 인증 방식("nid" or "neoid")
		 *   @param {Object} [userConfigures.authInfo] neoid 인증을 사용할 경우 필수로 설정해야할 값 모음
		 *       @param {String} userConfigures.authInfo.domain
		 *       @param {String} userConfigures.authInfo.token
		 *       @param {String} userConfigures.authInfo.consumerKey
		 *       @param {String} userConfigures.authInfo.snsCode
		 *       @param {Function} userConfigures.authInfo.loginHandler 로그인이 필요한 경우 실행될 콜백함수로 서비스에서 인증관련 프로세스를 여기에 구현한다.
		 *       @param {Function} userConfigures.authInfo.pool common(공용), blog, comic, search, main, news, sports, cafe로 나뉘며  pool에 따라 좋아요 서버군이 달라진다.
		 *   @param {Object} [userConfigures.callback] 콜백함수 셋
		 *       @param {Function} [userConfigures.callback.updated=function(param) {}] 공감하기 카운트 초기화/갱신(update 실행) 시 실행할 콜백 함수
		 *       @param {Function} [userConfigures.callback.updateParent=function(param) {}] 공감하기 카운트 초기화/갱신(update 실행) 시 실행할 parentContent 콜백 함수
		 *       @param {Function} [userConfigures.callback.clicked=function(param) {}] 공감하기/취소하기 시 실행할 콜백 함수
		 */
		init: function(userConfigures, useLocalResource) {
			userConfigures = userConfigures || {};
			userConfigures.authInfo = assignObject(configures.authInfo, userConfigures.authInfo || {});
			assignObject(configures, userConfigures || {});
			if (/face|multi/.test(configures.type)) {
				// 타입이 face인 경우 기본 마크업을 변경
				if (typeof userConfigures.buttonTemplate === "undefined") {
					configures.buttonTemplate = "<span class='u_likeit_list_name _label'>{label}</span><span class='u_likeit_list_count _count'></span>";
				}
				if (typeof userConfigures.isDuplication === "undefined") {
					configures.isDuplication = false;
				}
			}
			!useLocalResource && loadResource();
		}
	};
	return {
		reaction: instance,
		resources: resources,
		configures: configures,
		getResourceUrl: getResourceUrl,
		getCssUrl: getCssUrl
	};
};
window.reaction = window.___ReactionFactory___(window, document).reaction;

/**
* @fileOverview [PC/M] 공감하기 > 기본 메세지 셋
* @author moonseok.kim@navercorp.com(Naver)
* @since 2016.01.04
*/
/**
* 공감하기에서 클라이언트단에서 사용되는 언어별 메세지셋
*
* @static
* @memberof reaction
*/
window.___ReactionMessageFactory___ = function() {
	return {
		"ko": {
			"label": {
				"like": "좋아요",
				"love": "사랑해요",
				"haha": "재밌어요",
				"yay": "기뻐요",
				"wow": "놀랍네요",
				"sad": "슬퍼요",
				"angry": "화나요",
				"useful": "유익해요",
				"likead": "광고같아요",
				"toobad": "아쉬워요",
				"cheer": "응원해요",
				"recommend": "추천했어요",
				"help": "도움됐어요",
				"want": "후속기사원해요",
				"warm": "훈훈해요",
				"touched": "감동받았어요",
				"expect": "다음작품원해요",
				"wantbuy": "사고싶어요"
			},
			"face": {
				"default": "표정",
				"news": "공감",
				"zero": "0",
				"blank": ""
			},
			"error": "잠시후 다시 이용해주세요",
			"templates": {
				"common": {
					"btnClose": "닫기",
					"chkboxDontShow": "한 달간 다시 보지 않기",
					"onlyMobile": "안드로이드 또는 iOS만 접근 가능합니다."
				},
				"friendsLayer": {
					"loading": "친구 정보를 불러오는 중입니다.",
					"me": "<%=firstFriendName%>님이 '<%=label%>' 했습니다.",
					"friends": "라인친구 <%=count%>명이 '<%=label%>' 했습니다.",
					"meAndFriends": "<%=firstFriendName%>님외 라인친구 <%=count%>명이 '<%=label%>' 했습니다.",
					"error": "현재 사용이 원활하지 않습니다. <span class='u_in'>잠시후 다시 이용해 주세요.</span>",
					"btnShareSetting": "공유설정"
				},
				"shareLayer": {
					"shareConfirm": "라인 타임라인 공유하시면, 친구들과 함께 볼 수 있습니다.",
					"btnOnceShare": "한번 공유하기",
					"btnAutoShare": "자동 공유하기"
				},
				"linkWithLineLayer": {
					"msgInfo": "네이버와 라인을 연동하면, 타임라인 공유<span class='u_in'>&amp;좋아요 한 친구를 알 수 있습니다.</span>",
					"btnLink": "연동하기"
				}
			}
		},
		"en": {
			"label": {
				"like": "like",
				"love": "love",
				"haha": "haha",
				"yay": "yay",
				"wow": "wow",
				"sad": "sad",
				"angry": "angry",
				"useful": "useful",
				"likead": "likead",
				"toobad": "toobad",
				"cheer": "cheer",
				"recommend": "recommend",
				"help": "help",
				"want": "want",
				"warm": "warm",
				"touched": "touched",
				"expect": "expect",
				"wantbuy": "wantbuy"
			},
			"face": {
				"default": "Expression",
				"news": "React",
				"zero": "0",
				"blank": ""
			},
			"error": "Please try again later.",
			"templates": {
				"common": {
					"btnClose": "Close",
					"chkboxDontShow": "Don't show again for a month",
					"onlyMobile": "Only Android or iOS is allowed."
				},
				"friendsLayer": {
					"loading": "Loading friend's information…",
					"me": "'<%=label%>' by <%=firstFriendName%>.",
					"friends": "'<%=label%>' by <%=count%> LINE Friend(s)",
					"meAndFriends": "'<%=label%>' by <%=firstFriendName%> and <%=count%> other LINE Friend(s).",
					"noFriend": "No friend who '<%=label%>' it.",
					"error": "The service is not in normal operation. Please try again later.",
					"btnShareSetting": "Sharing Settings"
				},
				"shareLayer": {
					"shareConfirm": "If you share your LINE Timeline, you can view them with your friends.",
					"btnOnceShare": "Share once",
					"btnAutoShare": "Auto Share"
				},
				"linkWithLineLayer": {
					"msgInfo": "If you connect NAVER with LINE, you can find out the friends who shared&amp;liked your Timeline.",
					"btnLink": "Connect"
				}
			}
		},
		"ja": {
			"label": {
				"like": "いいね",
				"love": "love",
				"haha": "haha",
				"yay": "yay",
				"wow": "すごい",
				"sad": "sad",
				"angry": "angry",
				"useful": "useful",
				"likead": "likead",
				"toobad": "toobad",
				"cheer": "cheer",
				"recommend": "recommend",
				"help": "help",
				"want": "want",
				"warm": "warm",
				"touched": "感激",
				"expect": "次も期待",
				"wantbuy": "ほしい"
			},
			"face": {
				"default": "表情",
				"news": "共感",
				"zero": "0",
				"blank": ""
			},
			"error": "しばらくしてから再度ご利用ください。",
			"templates": {
				"common": {
					"btnClose": "閉じる",
					"chkboxDontShow": "1ヶ月間表示しない",
					"onlyMobile": "AndroidまたはiOSからのみアクセスできます。"
				},
				"friendsLayer": {
					"loading": "友だち情報を読み込んでいます。",
					"me": "<%=firstFriendName%>さんが'<%=label%>'しました。",
					"friends": "LINEの友だち<%=count%>人が'<%=label%>'しました。",
					"meAndFriends": "<%=firstFriendName%>さんと他のLINEの友だち<%=count%>人が'<%=label%>'しました。",
					"error": "現在、正常にご利用いただけない状態となっております。しばらくしてから再度ご利用ください",
					"btnShareSetting": "共有設定"
				},
				"shareLayer": {
					"shareConfirm": "LINEのタイムラインに共有すると、友だちと一緒に楽しむことができます。",
					"btnOnceShare": "1回共有する",
					"btnAutoShare": "自動で共有する"
				},
				"linkWithLineLayer": {
					"msgInfo": "NAVERとLINEを連携すると、タイムライン共有や&amp;「いいね」をした友だちが分かります。",
					"btnLink": "連携する"
				}
			}
		},
		"zh_hans": {
			"label": {
				"like": "喜欢",
				"love": "love",
				"haha": "haha",
				"yay": "yay",
				"wow": "惊讶",
				"sad": "sad",
				"angry": "angry",
				"useful": "useful",
				"likead": "likead",
				"toobad": "toobad",
				"cheer": "cheer",
				"recommend": "recommend",
				"help": "help",
				"want": "want",
				"warm": "warm",
				"touched": "感动",
				"expect": "期待",
				"wantbuy": "想买"
			},
			"face": {
				"default": "表情",
				"news": "共鸣",
				"zero": "0",
				"blank": ""
			},
			"error": "请稍后再使用",
			"templates": {
				"common": {
					"btnClose": "关闭",
					"chkboxDontShow": "一个月内不再显示",
					"onlyMobile": "只有Android或iOS才可访问。"
				},
				"friendsLayer": {
					"loading": "正在读取好友信息。",
					"me": "<%=firstFriendName%>已'<%=label%>'。",
					"friends": "<%=count%>名LINE好友已'<%=label%>'。",
					"meAndFriends": "除了<%=firstFriendName%>之外，<%=count%>名LINE好友已'<%=label%>'。",
					"error": "目前使用不畅。请稍后再使用。",
					"btnShareSetting": "分享设定"
				},
				"shareLayer": {
					"shareConfirm": "若分享到LINE动态消息时，好友们也能一起查看。",
					"btnOnceShare": "分享一次",
					"btnAutoShare": "自动分享"
				},
				"linkWithLineLayer": {
					"msgInfo": "若同步NAVER和LINE，就能知道分享动态消息&amp;点击喜欢的好友。",
					"btnLink": "同步"
				}
			}
		},
		"zh_hant": {
			"label": {
				"like": "讚",
				"love": "love",
				"haha": "haha",
				"yay": "yay",
				"wow": "驚",
				"sad": "sad",
				"angry": "angry",
				"useful": "useful",
				"likead": "likead",
				"toobad": "toobad",
				"cheer": "cheer",
				"recommend": "recommend",
				"help": "help",
				"want": "want",
				"warm": "warm",
				"touched": "感動",
				"expect": "期待",
				"wantbuy": "想買"
			},
			"face": {
				"default": "「表情」",
				"news": "「共鳴」",
				"zero": "0",
				"blank": ""
			},
			"error": "「請稍後再使用」",
			"templates": {
				"common": {
					"btnClose": "「關閉」",
					"chkboxDontShow": "「一個月內不再顯示」",
					"onlyMobile": "「僅Andorid或iOS可訪問」"
				},
				"friendsLayer": {
					"loading": "「讀取好友資訊中」",
					"me": "「<%=firstFriendName%>已'<%=label%>'。」",
					"friends": "「<%=count%>位LINE好友已'<%=label%>'。」",
					"meAndFriends": "「<%=firstFriendName%>與<%=count%>位LINE好友已'<%=label%>'。」",
					"error": "「目前使用不穩定，請稍後再使用。」",
					"btnShareSetting": "「同步設定」"
				},
				"shareLayer": {
					"shareConfirm": "「若分享LINE動態消息，可與好友一同觀看。」",
					"btnOnceShare": "「分享一次」",
					"btnAutoShare": "「自動分享」"
				},
				"linkWithLineLayer": {
					"msgInfo": "「若同步NAVER與LINE，可得知於分享的動態消息&amp;按讚的好友。」",
					"btnLink": "「同步」"
				}
			}
		},
		"es": {
			"label": {
				"like": "Me gusta",
				"love": "love",
				"haha": "haha",
				"yay": "yay",
				"wow": "Me asombra ",
				"sad": "sad",
				"angry": "angry",
				"useful": "useful",
				"likead": "likead",
				"toobad": "toobad",
				"cheer": "cheer",
				"recommend": "recommend",
				"help": "help",
				"want": "want",
				"warm": "warm",
				"touched": "Me encanta",
				"expect": "Me espera",
				"wantbuy": "Quiero comprar"
			},
			"face": {
				"default": "Expresión",
				"news": "Reaccionar",
				"zero": "0",
				"blank": ""
			},
			"error": "Por favor, intente de nuevo más tarde.",
			"templates": {
				"common": {
					"btnClose": "Cerrar",
					"chkboxDontShow": "No mostrar de nuevo durante un mes",
					"onlyMobile": "Solo está permitido en Android o iOS"
				},
				"friendsLayer": {
					"loading": "Cargando la información de sus amigos",
					"me": "'<%=label%>' de <%=firstFriendName%>.",
					"friends": "'<%=label%>' de <%=count%> Amigo(s) de LINE",
					"meAndFriends": "'<%=label%>' de <%=firstFriendName%> y de <%=count%> otro(s) Amigo(s) de LINE.",
					"error": "El servicio no está funcionando como normalmente. Por favor, inténtelo de nuevo más tarde.",
					"btnShareSetting": "Compartir Ajustes"
				},
				"shareLayer": {
					"shareConfirm": "Si comparte su Timeline de LINE, puede verlo con sus amigos.",
					"btnOnceShare": "Compartir Una Vez",
					"btnAutoShare": "Auto Compartir"
				},
				"linkWithLineLayer": {
					"msgInfo": "Si se conecta a NAVER con LINE, puede descubrir que amigos compartieron&amp;a quienes les gusto su Timeline.",
					"btnLink": "Conectar"
				}
			}
		},
		"es_mx": {
			"label": {
				"like": "Me gusta",
				"love": "love",
				"haha": "haha",
				"yay": "yay",
				"wow": "Me asombra",
				"sad": "sad",
				"angry": "angry",
				"useful": "useful",
				"likead": "likead",
				"toobad": "toobad",
				"cheer": "cheer",
				"recommend": "recommend",
				"help": "help",
				"want": "want",
				"warm": "warm",
				"touched": "Me encanta",
				"expect": "Me espera",
				"wantbuy": "Quiero comprar"
			},
			"face": {
				"default": "Expresión",
				"news": "Reaccionar",
				"zero": "0",
				"blank": ""
			},
			"error": "Por favor, pruebe de nuevo más tarde",
			"templates": {
				"common": {
					"btnClose": "Cerrar",
					"chkboxDontShow": "No mostrar de nuevo en un mes",
					"onlyMobile": "Solo se permite en Android o iOS"
				},
				"friendsLayer": {
					"loading": "Cargando la información de sus amigos",
					"me": "'<%=label%>' de <%=firstFriendName%>.",
					"friends": "'<%=label%>' de <%=count%> Amigo(s) de LINE",
					"meAndFriends": "'<%=label%>' de <%=firstFriendName%> y de <%=count%> otro(s) Amigo(s) de LINE.",
					"error": "El servicio no está en funcionamiento normal. Por favor, pruebe de nuevo más tarde.",
					"btnShareSetting": "Compartir Ajustes"
				},
				"shareLayer": {
					"shareConfirm": "Si comparte su Timeline de LINE, puede verlo con sus amigos.",
					"btnOnceShare": "Compartir Una Vez",
					"btnAutoShare": "Auto Compartir"
				},
				"linkWithLineLayer": {
					"msgInfo": "Si se conecta a NAVER con LINE, puede averiguar que amigos compartieron&amp;a quienes les gusto su Timeline.",
					"btnLink": "Conectar"
				}
			}
		},
		"fr": {
			"label": {
				"like": "J'aime",
				"love": "love",
				"haha": "haha",
				"yay": "yay",
				"wow": "Wow",
				"sad": "sad",
				"angry": "angry",
				"useful": "useful",
				"likead": "likead",
				"toobad": "toobad",
				"cheer": "cheer",
				"recommend": "recommend",
				"help": "help",
				"want": "want",
				"warm": "warm",
				"touched": "Ému",
				"expect": "Je m'attends",
				"wantbuy": "Je veux acheter"
			},
			"face": {
				"default": "Expression",
				"news": "Réaction",
				"zero": "0",
				"blank": ""
			},
			"error": "Veuillez réessayer plus tard.",
			"templates": {
				"common": {
					"btnClose": "Fermer",
					"chkboxDontShow": "Ne plus afficher pendant un mois",
					"onlyMobile": "Seuls Android ou iOS sont autorisés."
				},
				"friendsLayer": {
					"loading": "Chargement des informations d'ami",
					"me": "'<%=label%>' par <%=firstFriendName%>.",
					"friends": "'<%=label%>' par <%=count%> ami(s) LINE",
					"meAndFriends": "'<%=label%>' par <%=firstFriendName%> et <%=count%> autres amis LINE.",
					"error": "Le service ne fonctionne pas normalement. Veuillez réessayer plus tard.",
					"btnShareSetting": "Paramètres de partage"
				},
				"shareLayer": {
					"shareConfirm": "Si vous partagez sur Timeline LINE, vous pouvez les voir avec vos amis.",
					"btnOnceShare": "Partager une fois",
					"btnAutoShare": "Partage auto"
				},
				"linkWithLineLayer": {
					"msgInfo": "Si vous connectez NAVER avec LINE, vous pourrez trouver les amis qui ont partagé&amp;aimé votre Timeline.",
					"btnLink": "Connecter"
				}
			}
		}
	};
};
reaction.message = window.___ReactionMessageFactory___();
