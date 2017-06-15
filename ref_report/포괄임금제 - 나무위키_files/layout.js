function preLayoutInit() {
	// -- layout start -- //
	$(document).keypress(function (event) {
		if ($(document.activeElement).is('input') || $(document.activeElement).is('textarea') || namu.disableShortcutKey) {
			return;
		}

		if (event.ctrlKey || event.altKey || event.metaKey) {
			return;
		}

		var code = (event.keyCode ? event.keyCode : event.which),
			ch = String.fromCharCode(code);

		switch (ch) {
			case 'a':
				pjaxCall("/random");
				break;

			case 'c':
				pjaxCall("/RecentChanges");
				break;

			case 'd':
				pjaxCall("/RecentDiscuss");
				break;

			case 'e':
				var pathname = namu.currentURL.pathname;
				if (pathname.indexOf("/w/") == 0) {
					pjaxCall(pathname.replace("/w/", "/edit/"));
				}
				break;

			case 'f':
				pjaxCall("/w/" + docEncode("나무위키:대문"));
				break;

			case 'S':
				$(".senkawa .modal#searchModal").modal('toggle');
				$(".senkawa .modal#searchModal .search-box #searchInput").focus();
				break;

			case '?':
				$(".senkawa .modal#shortcutHelpModal").modal('toggle');
				break;
		}
	});
	if ($.support.pjax) {
//		applyPJAX();
	}
	$.datepicker.setDefaults({
		dateFormat: "yy-mm-dd"
	});
	preApplyLayoutCustom();

}

function postLayoutInit() {
	postApplyLayoutCustom();
	$(".senkawa .search-box #searchInput").keypress(function (event) {
		if ((event.keyCode ? event.keyCode : event.which) != 13) { return; }

		event.preventDefault();

		var val = $(this).val();
		if (val.length > 0) {
			pjaxCall("/go/" + docEncode(val));
			$(".senkawa .search-box #searchInput").autocomplete('close');
			$(".senkawa .modal#searchModal").modal('hide');
			$(".senkawa .search-box #searchInput")[0].blur();
		}
	});

	$(".senkawa .search-box #searchInput").autocomplete({
		delay: 100,
		source: function(request, response) {
			$.ajax({
				url: '/complete/' + docEncode(request.term),
				dataType : 'json',
				success: function(data) {
					response(data);
				},
				error: function(data) {
					response([]);
				}
			});
		},
		select: function(event, ui) {
			if(ui.item.value) {
				pjaxCall("/w/" + docEncode(ui.item.value));

				$(".senkawa .search-box #searchInput").autocomplete('close');
				$(".senkawa .modal#searchModal").modal('hide');
				$(".senkawa .search-box #searchInput")[0].blur();

				return false;
			}
		}
	});

	$(".senkawa .search-box #searchBtn").click(function () {
		var val = $(".senkawa .search-box #searchInput").val();
		if (val.length > 0) {
			pjaxCall("/search/" + docEncode(val));
		}
	});

	$(".senkawa .search-box #goBtn").click(function () {
		var val = $(".senkawa .search-box #searchInput").val();
		if (val.length > 0) {
			pjaxCall("/w/" + docEncode(val));
		}
	});

	$("#notiIcon").click(function () {
		//$(".nav_top .noti-box").toggle("blind", {}, 500);
		//$(".nav_top .noti-box").toggle();
	});

	$(".senkawa .nav-control #goTopBtn").click(function (event) {
		$("html, body").animate({ scrollTop: 0 }, '500', 'swing');

		return false;
	});

	$(".senkawa .nav-control #goBottomBtn").click(function (event) {
		$("html, body").animate({ scrollTop: $(document).height() }, '500', 'swing');

		return false;
	});

	$(".senkawa .navbar .user-dropdown #darkToggleLink").click(function () {
		var $this = $(this);

		if (namu.getValue("use_dark")) {
			$(".senkawa").removeClass("dark");
			$("meta[name=theme-color]").attr("content", "#008275");

			$this.text("어두운 화면으로");
			namu.setValue("use_dark", false);
		} else {
			$(".senkawa").addClass("dark");
			$("meta[name=theme-color]").attr("content", "#373A3C");

			$this.text("밝은 화면으로");
			namu.setValue("use_dark", true);
		}

		return false;
	});

	$(".senkawa .modal#searchModal, .senkawa .modal#shortcutHelpModal")
	.on('show.bs.modal', function (e) {
		$(".senkawa").addClass("modal-open-fix");
	});

	$(".senkawa .modal#footnoteModal")
	.on('show.bs.modal', function (e) {
		if ($(".senkawa").hasClass("fixed-navbar")) {
			if (namu.isMobile()) {
				$(".senkawa").addClass("modal-open-fix2");
			} else {
				$(".senkawa").addClass("modal-open-fix3");
			}
		}
	});

	$(".senkawa .modal#searchModal")
	.on('hideen.bs.modal', function (e) {
		$(".senkawa").removeClass("modal-open-fix");
		$(".senkawa .search-box #searchInput")[0].blur();
	});

	$(".senkawa .modal#footnoteModal")
	.on('hideen.bs.modal', function (e) {
		if ($(".senkawa").hasClass("fixed-navbar")) {
			$(".senkawa").removeClass("modal-open-fix2");
			$(".senkawa").removeClass("modal-open-fix3");
		}
	});

	if (window.localStorage) {
		$("#settingsLink").show();
	}

	$(".senkawa").on("click", ".wiki-article #userDiscussAlert .close",
	function (event) {
		namu.setValue("hide_userDiscussAlert", $(this).parent().data('id'));
	});
	// -- layout end -- //


	// -- edit start -- //
	$(".senkawa").on("keypress focusout", ".wiki-article form #logInput",
	function (event) {
		$(this).parent().children("label").text("요약 (" + $(this).val().length + "/190)");
	});
	// -- edit end -- //

	if (!namu.isMobile()) {
		refreshRecentCard(true);
		refreshLiveCard(true);
	} else {
		refreshLiveTopbarArea(true);
	}

	// -- footer start -- //
	$(".footer #timezone").text(getTimezoneString());
	// -- footer end -- //

}


function beforePageLoad() {
	$(".senkawa .wiki-article, .senkawa .wiki-content").removeClass("character sephi-notfound0 sephi-notfound1 munya-notfound");
	discussPollCancel();
}

function onPageLoad() {
	var pathname = namu.currentURL.pathname;

	$(".senkawa .search-box #searchInput").val("");

	var $article = $(".senkawa .wiki-article"),
		$sidebar = $(".senkawa .sidebar");

	var hideopt1 = namu.getValue("hide_wikiNoCategoryAlert"),
		hideopt2 = namu.getValue("hide_historyForkSourceAlert"),
		hideopt3 = namu.getValue("hide_userDiscussAlert");

	if(hideopt3) {
		var userDiscussAlert = $article.find("#userDiscussAlert");
		if(userDiscussAlert.data('id') === hideopt3) userDiscussAlert.hide();
	}

	if (pathname.indexOf("/w/") === 0) {
		if (hideopt1) {
			$article.find("#wikiNoCategoryAlert").hide();
		}

		$(".senkawa").on("click", ".wiki-article #wikiNoCategoryAlert .close",
		function (event) {
			namu.setValue("hide_wikiNoCategoryAlert", true);
		});

		$(".senkawa .wiki-article .alert:last").addClass("last");
	} else if (pathname.indexOf("/history/") == 0) {
		if (hideopt2) {
			$article.find("#historyForkSourceAlert").hide();
		}

		$(".senkawa").on("click", ".wiki-article #historyForkSourceAlert .close",
		function (event) {
			namu.setValue("hide_historyForkSourceAlert", true);
		});
	} else if (pathname.indexOf("/login") == 0) {
		var $redirect = $article.find(".login-form input[name=redirect]");
		if (!$redirect.val()) {
			$redirect.val(namu.pastURL.pathname);
		}
	} else if (pathname.indexOf("/settings") === 0) {
		setSettingsMenu();

		$(".senkawa").on("change", ".settings-section .setting-item",
		function (event) {
			var val = getSettingValueFromTag($(this));

			var key = $(this).attr("data-key");
			namu.userSettings[key] = val;

			namu.saveUserSettings();
			preApplyLayoutCustom();
			postApplyLayoutCustom();
			applyUserCustom();
		});

		$(".senkawa").on("click", ".settings-section #removeHelpAlertHide",
		function (event) {
			namu.setValue("hide_wikiNoCategoryAlert", false);
			namu.setValue("hide_historyForkSourceAlert", false);
			namu.setValue("hide_userDiscussAlert", false);

			alert("OK.");
		});

		$(".senkawa").on("click", ".settings-section #removeAllSettings",
		function (event) {
			localStorage.setItem("namu.user_settings", "{}");
			namu.loadUserSettings();
			setSettingsMenu();

			alert("OK.");
		});

		if (namu.isMobile()) {
			$(".senkawa .settings-section #fixedBody").hide();
			$(".senkawa .settings-section #hideSidebar").hide();
			$(".senkawa .settings-section #leftSidebar").hide();

			if (!namu.userSettings['footnote_type'] && namu.isMobile()) {
				var $fnSelect = $(".setting-item[data-key='footnote_type']");

				$fnSelect.children("option").removeAttr("selected");
				$fnSelect.children("option[value='popup']").attr("selected", true);

				$fnSelect.val('popup');
				$fnSelect.change();
			}
		}
	}

	if ($article.has(".site-notice").length) {
		$sidebar.addClass("has-site-notice");
	} else {
		$sidebar.removeClass("has-site-notice");
	}

	applyUserCustom();

	if(window.localStorage) {
		if(localStorage.getItem("namu.fork_alert") === null) {
			$("#fork-alert").show();
			$("#fork-alert-close").click(function() {
				$('#fork-alert').hide();
				localStorage.setItem("namu.fork_alert", true);
			});
		}
	}


	/*$("img.wiki-lazy-image").removeClass('wiki-lazy-image').each(function() {
		var img = $(this);
		img.attr('src', img.data('original')).removeClass('wiki-lazy-loading');
	});*/
/*
	$('img.wiki-lazy-image').removeClass('wiki-lazy-image').lazyload({
		failure_limit: 1000,
		placeholder:'data:image/gif;base64,R0lGODlhQABAAHAAACH5BAEAAAAALAAAAABAAEAAAAJFhI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zvf+DwwKh8Si8YhMKpfMpvMJjUqn1Kr1is1qt9yuF1AAADs=',
		load: function() {
			$(this).removeClass('wiki-lazy-loading');
		}
	});*/
}

function docEncode(title) {
	if (title === '..') return '..%20';
	if (title === '.') return '.%20';
	return encodeURIComponent(title).replace(/%2F/g, '/');
}

function pjaxCall(url) {
	location.href = url;
/*
	if ($.support.pjax) {
		$.pjax({
			url: url,
			container: ".wiki-article"
		});
	} else {
		location.href = url;
	}
*/
}

function applyPJAX() {
	$.pjax.defaults.timeout = 0;
	$(document).on(
		"click",
		".senkawa a:not(" +
			"[data-npjax]," +
			".wiki-link-external" +
		")",
	function (event) {
		var $this = $(this);
		if ($this.attr('href') == "#") { return; }

		var $container = $(".senkawa .wiki-article");


		$.pjax.click(event, { container: $container });
	});

	NProgress.configure({ showSpinner: false });

	$(document).on('pjax:beforeSend', function () {
		namu.pastURL.href = document.location;
	});

	$(document).on('pjax:beforeReplace', function () {
		beforePageLoad();
	});

	$(document).on('pjax:send', function () {
		NProgress.start();
	});

	$(document).on('pjax:end', function () {
		namu.currentURL.href = document.location;

		NProgress.done();

		onPageLoad();
	});
}

function applyPopoverFootnote() {
	$(".senkawa").on("click", ".popover .popover-title .close",
	function (event) {
		var $p = $(this).parent().parent(),
			$l = $("a[aria-describedby=\"" + $p.attr("id") + "\"]");

		$l.popover('hide');
		$(".senkawa").focus();

		return false;
	});

	$(".senkawa .wiki-article .wiki-fn-content").each(function (item) {
		var target = $(this).attr('href');
		target = target.replace("#", "");

		var $tmp = $("span[class=target][id=\"" + target + "\"]").parent().clone();
		$tmp.children("span[class=target]").remove();
		$tmp.children("a[href^='#rfn-']").remove();

		if (namu.isMobile()) {
			$(this).attr("href", "#");
		}
		$(this).attr("title", "");

		var close_html = '<a class="close" href="#">&times;</a>';

		$(this).popover({
			animation: false,
			container: ".wiki-article",
			trigger: (namu.isMobile() ? "focus" : "focus hover"),
			title: "각주: " + $(this).text() + (namu.isMobile() ? close_html : ""),
			content: $tmp.html(),
			html: true,
			placement: "top",
			template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
		});

		$(this).on('shown.bs.popover', function () {
			var po_id = $(this).attr("aria-describedby");
			if (!po_id) { return; }

			var $po = $("div#" + po_id + ".popover"),
				$arrow = $po.children(".popover-arrow"),
				$win = $("body");

			var t_of = $(this).offset(),
				t_w = this.offsetWidth;

			var tr = $po.css("transform"),
				tr_a = tr.match(/matrix\((.+)\)/)[1].split(', ');

			if (parseInt(tr_a[4]) < 15) {
				tr_a[4] = t_of.left + (t_w / 2) - 14;

				$po.css("transform", "matrix(" + tr_a.join(', ') + ")");
				$arrow.css("left", "14px");
			} else if (parseInt(tr_a[4]) + parseInt($po.width()) > parseInt($win.width())) {
				tr_a[4] = t_of.left - $po.width() + (t_w / 2) + 14;

				$po.css("transform", "matrix(" + tr_a.join(', ') + ")");
				$arrow.css("left", "auto");
				$arrow.css("right", "7px");
			}
		});

		if (namu.isMobile()) {
			$(this).click(function (event) {
				$(this).focus();
				event.preventDefault();
				return false;
			});
		}
	});
}

function applyPopupFootnote() {
	$(".senkawa .wiki-article .wiki-fn-content").click(function () {
		var target = $(this).attr('href');
		target = target.replace("#", "");

		var $tmp = $("span[class=target][id=\"" + target + "\"]").parent().clone();
		$tmp.children("span[class=target]").remove();
		$tmp.children("a[href^='#rfn-']").remove();

		$("#footnoteModal .modal-header").html("<h5 class=\"modal-title\">각주: " + $(this).text() + "</h5>");
		$("#footnoteModal .modal-body").html($tmp.html());

		$("#footnoteModal").modal('show');

		return false;
	});
}

function applyUnfoldFootnote() {
	$(".senkawa .wiki-content .wiki-fn-content").each(function () {
		var $this = $(this);

		var title = $this.attr("title");
		var html = $this.clone().wrapAll("<div>").parent().html();

		$this.attr("title", "");

		$this.wrap("<span class=\"wiki-unfold-fn\">");
		$this.parent().append("<span>&nbsp;" + title + "</span>");
	});
}

function applyUnfoldWikiLink() {
	$(".senkawa .wiki-article .wiki-link-internal")
	.each(function () {
		var $this = $(this);

		var title = $this.attr('title');
		var text = $this.text();

		if (title != text) {
			$("<span class=\"wiki-unfold-fn\">" + title + "</span>").insertAfter($this);
		}
	});
}

function preApplyLayoutCustom() {
	if (namu.getValue("use_dark")) {
		$(".senkawa").addClass("dark");
		$("meta[name=theme-color]").attr("content", "#373A3C");
	}

	if (namu.userSettings['fixed_navbar'] == true) {
		$(".senkawa").addClass("fixed-navbar");
	} else {
		$(".senkawa").removeClass("fixed-navbar");
	}

	if (namu.userSettings['hide_sidebar'] == true) {
		$(".senkawa").addClass("hide-sidebar");
	} else {
		$(".senkawa").removeClass("hide-sidebar");
	}

	if (namu.userSettings['left_sidebar'] == true) {
		$(".senkawa").addClass("left-sidebar");
	} else {
		$(".senkawa").removeClass("left-sidebar");
	}

	var fixedSize = namu.userSettings['fixed_body'];

	$(".senkawa.fixed-size").removeClass("fixed-800 fixed-1000 fixed-1200 fixed-1300 fixed-1500 fixed-1600");

	if (!fixedSize) {
		$(".senkawa").addClass("fixed-size");
		$(".senkawa.fixed-size").addClass("fixed-1300");

		namu.userSettings['fixed_body'] = "1300";
		namu.saveUserSettings();
	} else if (fixedSize && fixedSize != "disable") {
		var size = parseInt(fixedSize);
		$(".senkawa").addClass("fixed-size");
		$(".senkawa.fixed-size").addClass("fixed-" + size);
	} else {
		$(".senkawa").removeClass("fixed-size");
	}
}

function postApplyLayoutCustom() {
	if (namu.getValue("use_dark")) {
		$(".senkawa .navbar .user-dropdown #darkToggleLink").text("밝은 화면으로");
	}

	if (namu.userSettings['fixed_navbar'] == true) {
		$(".senkawa .navbar").addClass("navbar-fixed-top");
	} else {
		$(".senkawa .navbar").removeClass("navbar-fixed-top");
	}

	if (namu.userSettings['left_sidebar'] == true) {
		$(".senkawa").addClass("left-sidebar");
	} else {
		$(".senkawa").removeClass("left-sidebar");
	}

	if (namu.userSettings['hide_navcontrol'] == true) {
		$(".senkawa .nav-control").hide();
	} else {
		$(".senkawa .nav-control").show();
	}

	if (namu.userSettings['hide_live_card'] == true) {
		$(".senkawa .live-list-card").hide();
		$(".senkawa .live-topbar-area").hide();
	} else {
		$(".senkawa .live-list-card").show();
		$(".senkawa .live-topbar-area").show();
	}

	if (!namu.isMobile()) {
		$(".senkawa .live-topbar-area").remove();
	}
}

function applyUserCustom() {
	var pathname = namu.currentURL.pathname;
	if (pathname.indexOf("/w/") === 0) {
		var strike = namu.userSettings['strike'];
		if (strike) {
			if (strike == "remove") {
				$(".wiki-article .wiki-content del").contents().unwrap();
			} else if (strike == "hide") {
				$(".wiki-article .wiki-content del").remove();
			}
		}

		if (namu.userSettings['show_wiki_content_length'] == true) {
			var $ed = $(".senkawa .wiki-article .wiki-edit-date");
			var $ic = $(".senkawa .wiki-article .wiki-inner-content");

			$ed.children(".wiki-content-length").remove();

			$ed.append("<span class=\"wiki-content-length\">&nbsp;/&nbsp;글자 수&nbsp;:&nbsp;" + $ic.text().length + "</span>");
		}

		if (namu.userSettings['footnote_type'] == "popover") {
			applyPopoverFootnote();
		} else if (namu.userSettings['footnote_type'] == "popup") {
			applyPopupFootnote();
		} else if (namu.userSettings['footnote_type'] == "unfold") {
			applyUnfoldFootnote();
		} else if (namu.userSettings['footnote_type'] == "default") {
			// -- do nothing...
		} else if (!namu.userSettings['footnote_type'] && namu.isMobile()) {
			applyPopupFootnote();
		}

		var nowrapWikiTable = namu.userSettings['nowrap_wiki_table'];
		if (nowrapWikiTable) {
			$(".senkawa").addClass("nowrap-wiki-table");
		}

		var unfoldWikiLink = namu.userSettings['unfold_wiki_link'];
		if (unfoldWikiLink) {
			applyUnfoldWikiLink();
		}

		var wikiImageHide = namu.userSettings['wiki_image_hide'];
		if (wikiImageHide == "show" || !wikiImageHide) {
			$(".senkawa .wiki-article img.wiki-lazy-image").removeClass('wiki-lazy-image').each(function () {
				var img = $(this);
				img.attr("src", img.attr("data-original")).removeClass("wiki-lazy-loading");
			});
		} else if (wikiImageHide == "lazyload") {
			$(".senkawa .wiki-article img.wiki-lazy-image").removeClass("wiki-lazy-image").lazyload({
				failure_limit: 1000,
				placeholder: "data:image/gif;base64,R0lGODlhQABAAHAAACH5BAEAAAAALAAAAABAAEAAAAJFhI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zvf+DwwKh8Si8YhMKpfMpvMJjUqn1Kr1is1qt9yuF1AAADs=",
				load: function () {
					$(this).removeClass("wiki-lazy-loading");
				}
			});
		} else if (wikiImageHide == "hide" || wikiImageHide == "hide_1mb") {
			$(".senkawa .wiki-article img.wiki-lazy-image").each(function () {
				var src = $(this).attr("data-original");
				var size = parseInt($(this).attr("data-filesize"));

				if (isNaN(size)) {
					size = null;

					if (wikiImageHide == "hide_1mb") {
						$(this).removeClass('wiki-lazy-image').removeClass("wiki-lazy-loading");
						$(this).attr("src", src);

						return;
					}
				} else {
					if (size < 1024 * 1024 && wikiImageHide == "hide_1mb") {
						$(this).removeClass('wiki-lazy-image').removeClass("wiki-lazy-loading");
						$(this).attr("src", src);

						return;
					}

					size = size2Str(size);
				}

				var $btn = $("<a class=\"btn btn-info-outline btn-sm\" href=\"#\">이미지" + (!!size ? " (" + size + ")" : "") + "</a>");

				$btn.attr("data-src", src);
				$btn.attr("data-width", $(this).attr("width"));
				$btn.attr("data-height", $(this).attr("height"));
				$btn.attr("data-align", $(this).attr("align"));

				$btn.click(function () {
					$img = $("<img class=\"wiki-image\">");

					$img.attr("src", $(this).attr("data-src"));
					$img.attr("width", $(this).attr("data-width"));
					$img.attr("height", $(this).attr("data-height"));
					$img.attr("align", $(this).attr("data-align"));

					$(this).after($img);
					$(this).remove();

					return false;
				});

				$(this).after($btn);
				$(this).remove();
			});
		}
	} else {
		$(".senkawa .wiki-article img.wiki-lazy-image").removeClass('wiki-lazy-image').each(function () {
			var img = $(this);
			img.attr("src", img.attr("data-original")).removeClass("wiki-lazy-loading");
		});
	}

	if (pathname.indexOf("/discuss/") == 0 || pathname.indexOf("/topic/") == 0) {
		var discussStrike = namu.userSettings['discuss_strike'];
		if (discussStrike) {
			if (discussStrike == "remove") {
				$(".wiki-article .res .r-body del").contents().unwrap();
			} else if (discussStrike == "hide") {
				$(".wiki-article .res .r-body del").remove();
			}
		}

		var discussBold = namu.userSettings['discuss_bold'];
		if (discussBold) {
			if (discussBold == "remove") {
				$(".wiki-article .res .r-body strong").contents().unwrap();
				$(".wiki-article .res .r-body b").contents().unwrap();
			} else if (discussBold == "hide") {
				$(".wiki-article .res .r-body strong").remove();
				$(".wiki-article .res .r-body b").remove();
			}
		}
	}

	var forcedFontFamily = namu.userSettings['forced_font_family'];
	if (forcedFontFamily) {
		var $fff = $("style#forcedFontFamily");
		if ($fff.length > 0) {
			$fff.remove();
		}

		if (forcedFontFamily != "disabled") {
			addStyle(
				"forcedFontFamily",
				".senkawa * { font-family: \"" + forcedFontFamily + "\" !important; }"
			);
		}
	}

	var forcedFontSize = namu.userSettings['forced_font_size'];
	if (forcedFontSize) {
		var $ffs = $("style#forcedFontSize");
		if ($ffs.length > 0) {
			$ffs.remove();
		}

		if (forcedFontSize != "disabled") {
			addStyle(
				"forcedFontSize",
				".senkawa .wiki-inner-content td," +
				".senkawa .wiki-inner-content div," +
				".senkawa .wiki-inner-content p," +
				".senkawa .wiki-inner-content li {" +
					"font-size: " + forcedFontSize + " !important;" +
				"}"
			);
		}
	}
}

function refreshRecentCard(isFirst) {
	if (document.hasFocus && !document.hasFocus() && !isFirst) {
		setTimeout(refreshRecentCard, 10000);
		return;
	}

	var $docTable = $(".senkawa .sidebar #recentChangeTable");

	$.ajax({
		url: "/sidebar.json",
		dataType: "json"
	}).done(function (doc) {
		$docTable.empty();

		[].map.call(doc, function (val) {
			var d = new Date(val.date * 1000);

			$docTable.append(
				'<a href="/w/' + docEncode(val.document) + '">' +
					"<span>" + d2md(d) + "</span>" +
					(val.status == "delete" ? "<del>" : "") + val.document + (val.status == "delete" ? "</del>" : "") +
				"</a>"
			);
		});

		setTimeout(refreshRecentCard.bind(null, false), random(30000, 60000));
	}).fail(function () {
		$docTable.empty();
		$docTable.append($("<a>갱신 실패!</a>"));
	});
}

function refreshLiveCard(isFirst) {
	if (document.hasFocus && !document.hasFocus() && !isFirst) {
		setTimeout(refreshRecentCard, 10000);
		return;
	}

	var $cards = $(".senkawa .sidebar .live-list-card");
	$cards.each(function () {
		var $card = $(this);

		var slug = $card.attr("data-slug");
		var count = $card.attr("data-count");

		count = parseInt(count) || 10;

		var $table = $card.children(".link-table");

		$.ajax({
			url: "//namu.live/api/recent.json?slug=" + slug + "&count=" + count,
			dataType: "json"
		}).done(function (data) {
			if (!data.result) {
				$table.empty();
				$table.append($("<a>갱신 실패!</a>"));

				return;
			}

			$table.empty();

			[].map.call(data.data.articles, function (article) {
				$table.append(
					'<a href="//namu.live/b/' + slug + '/' + article.id + '">' +
						article.title +
					"</a>"
				);
			});
		}).fail(function () {
			$table.empty();
			$table.append($("<a>갱신 실패!</a>"));
		});
	});

	setTimeout(refreshRecentCard.bind(null, false), random(30000, 60000));
}

function refreshLiveTopbarArea(isFirst) {
	var $topbarArea = $(".senkawa .live-topbar-area");
	$.ajax({
		url: "//namu.live/api/random.json",
		dataType: "json"
	}).done(function (data) {
		$topbarArea.empty();

		if (data.type === "recent" || data.type === "hot") {
			$topbarArea.append(
				'<span class="leaf-info">나무라이브 ' + (data.type === "recent" ? "최신글" : "인기!") + '</span>&nbsp;' +
				'<a href="//namu.live' + data.link + '">[' + data.board + '] ' + data.title.substr(0,100) + "</a>"
			);
		} else if (data.type === "empty") {
			$topbarArea.append(
				'<span class="leaf-info">나무라이브</span>&nbsp;' +
				'<a href="//namu.live/b/' + data.slug + '/write">\'' + data.board + '\'에 인기글이 아직 없습니다. 인기글에 도전하세요!</a>'
			);
		}

//		setTimeout(refreshLiveTopbarArea.bind(null, false), random(30000, 60000));
	}).fail(function () {
		$topbarArea.empty();
		$topbarArea.append(
			'<span class="leaf-info">에러!</span>&nbsp;갱신 실패!'
		);
	});
}

function setSettingsMenu() {
	for (var key in namu.userSettings) {
		var item = namu.userSettings[key];

		var $tag = $("*[data-key='" + key + "']");

		if (!$tag.length) { continue; }

		var type = $tag.attr("data-type").toLowerCase(),
			tagname = $tag.prop("tagName").toLowerCase(),
			tagtype = $tag.attr("type");

		tagtype = (tagtype ? tagtype.toLowerCase() : null);

		if (type == "boolean") {
			if (tagname == "input" && tagtype == "checkbox") {
				if (item) {
					$tag.attr("checked", true);
				} else {
					$tag.removeAttr("checked");
				}
			} else {
				$tag.val(item ? "true" : "false");
			}
		} else if (type == "string") {
			if (tagname == "select") {
				$tag.children("option").removeAttr("selected");
				$tag.children("option[value='" + item + "']").attr("selected", true);
			}

			$tag.val(item);
		}
	}
}

function getSettingValueFromTag($tag) {
	var tagname = $tag.prop("tagName").toLowerCase(),
		tagtype = $tag.attr("type"),
		type = $tag.attr("data-type").toLowerCase();

	tagtype = (tagtype ? tagtype.toLowerCase() : null);

	var val = null;

	if (type == "boolean") {
		if (tagname == "input" && tagtype == "checkbox") {
			val = ($tag.is(":checked") ? true : false);
		} else {
			val = ($tag.val() ? true : false);
		}
	} else if (type == "string") {
		if (tagname == "select") {
			val = $tag.children("option:selected").val();
		} else {
			val = $tag.val();
		}
	}

	return val;
}

function addStyle(id, css) {
	var tag = document.createElement("style");
	tag.type = "text/css";
	tag.innerHTML = css;
	tag.id = id;

	document.head.appendChild(tag);
}

function d2md(d) {
	var h = d.getHours() + '',
		m = d.getMinutes() + '';

	h = (h.length == 1 ? "0" + h : h);
	m = (m.length == 1 ? "0" + m : m);

	return h + ":" + m;
}

function random(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function size2Str(size) {
	if (size > 1024 * 1024) {
		return (size / 1024 / 1024).toFixed(2) + "MB";
	} else if (size > 1024) {
		return (size / 1024).toFixed(2) + "KB";
	}

	return size + "bytes";
}

function getTimezoneString() {
	var d = new Date();

	var str = "";

	var wtz = getWebkitTimezone();
	var match;

	if (wtz) {
		str = wtz;
	} else if (match = d.toTimeString().match(/\((.+?)\)^/)) {
		str = match[1];
	} else {
		var tz = d.getTimezoneOffset();
	    str = "UTC" + (tz > 0 ? '-' : '+') + (tz / 60 < 10 ? '0' : '') + Math.abs(tz / 60) + '00';
	}

	return str;
}

function getWebkitTimezone() {
	if (typeof Intl !== 'object') {
		return null;
	}

	var format = Intl.DateTimeFormat();
	if (typeof format !== 'object') {
		return null;
	}

	var options = format.resolvedOptions();
	if (typeof options !== 'object') {
		return null;
	}

	return options.timeZone || null;
}


(function () {
	namu.currentURL.href = document.location;
	namu.loadUserSettings();
	namu.pastURL.href = document.location;
	preLayoutInit();
	$(function() {
		postLayoutInit();
		onPageLoad();
	});
})();
