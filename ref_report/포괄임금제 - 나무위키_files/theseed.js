$(function() {
	$("body").on("click","#editBtn",function (event) {
		event.preventDefault();
		var $ef = $("#editForm");

		if (!$("#editForm #agreeCheckbox").is(":checked")) {
			alert("수정하기 전에 먼저 문서 배포 규정에 동의해 주세요.");
			return;
		}

		$ef.attr({
			"method": "POST",
			"target": "",
			"action": "/edit/" + encodeURIComponent($ef.attr('data-title'))
		});

		if($ef.children('#recaptcha').length && window.grecaptcha) window.grecaptcha.execute();
		else $ef.submit();
	});

	$("body").on("click","#previewLink",function (event) {
		event.preventDefault();
		var $ef = $("#editForm"), $pf = $("#previewFrame");

		if ($pf.length > 0) {
			$pf.remove();
		}

		$pf = $("<iframe></iframe>").attr({
			"name": "previewFrame",
			"id": "previewFrame"
		});

		$(".tab-pane#preview").append($pf);

		$ef.attr({
			"method": "POST",
			"target": "previewFrame",
			"action": "/preview/" + encodeURIComponent($ef.attr('data-title'))
		});
		$ef.submit();
	});


	$("body").on("submit", "#deleteForm", function (event) {
		var val = $("#deleteForm #logInput").val();
		if (val.length < 5) {
			alert("5자 이상의 요약을 입력해 주세요.");
			return false;
		}
		if (!$("#deleteForm #agreeCheckbox").is(":checked")) {
			alert("문서 삭제에 대한 안내를 확인해 주세요.");
			return false;
		}
		if(!$('#submitBtn').attr('disabled') &&
			$("#deleteForm #recaptcha").length &&
			window.grecaptcha) {
			window.grecaptcha.execute();
			return false;
		}
	});

	$("body").on("submit", "#moveForm", function (event) {
		var val = $("#moveForm #titleInput").val();
		if (val.length < 1) {
			alert("변경할 문서 제목을 입력해 주세요.");
			return false;
		}
		val = $("#moveForm #logInput").val();
		if (val.length < 5) {
			alert("5자 이상의 요약을 입력해 주세요.");
			return false;
		}
		if(!$('#moveBtn').attr('disabled') &&
			$("#moveForm #recaptcha").length &&
			window.grecaptcha) {
			window.grecaptcha.execute();
			return false;
		}
	});

	$("body").on("change", "#fileInput", function () {
		var file = $(this)[0].files[0];
		if (!file.type.match(/image.*/)) {
			$(this).val('');
			alert('이미지가 아닙니다.');
			return;
		}
		var path = $(this).val().split('\\');
		if(!$("#documentInput").val()) {
			$("#documentInput").val("파일:" + path[path.length - 1]);
		}
		$("#fakeFileInput").val($(this).val());
	});

	$("body").on("click", "#fakeFileInput, #fakeFileButton", function () {
		$("#fileInput").click();
	});

	$("body").on("submit", "#uploadForm", function() {
		var licenseSelect = $('#licenseSelect');
		var categorySelect = $('#categorySelect');
		var textInput = $('#textInput');
		if(licenseSelect.length) {
			var license = licenseSelect.val();
			if(!license) {
				alert("올바른 라이선스를 선택해주세요.");
				return false;
			}
		}
		if(categorySelect.length) {
			var category = categorySelect.val();
			if(!category) {
				alert("올바른 분류를 선택해주세요.");
				return false;
			}
		}
		if(licenseSelect.length && categorySelect.length) {
			textInput.val('[include(' + license + ')]\n' + '[[' + category + ']]\n' + textInput.val());
		}

		if(!$('#uploadBtn').attr('disabled') &&
			$("#uploadForm #recaptcha").length &&
			window.grecaptcha) {
			window.grecaptcha.execute();
			return false;
		}

		return true;
	});
});

function historyInit(docName) {
	$('INPUT[name=oldrev], INPUT[name=rev]').click(function() {
		var oldrev = $('INPUT[name=oldrev]:checked').val();
		if(oldrev) {
			oldrev = parseInt(oldrev);
			$('INPUT[name=rev]').each(function() {
				if( parseInt($(this).val()) <= oldrev) {
					$(this).attr('checked', false);
					$(this).css('visibility', 'hidden');
				} else {
					$(this).css('visibility', 'visible');
				}
			});
		}
		var rev = $('INPUT[name=rev]:checked').val();
		if(rev) {
			rev = parseInt(rev);
			$('INPUT[name=oldrev]').each(function() {
				if( parseInt($(this).val()) >= rev) {
					$(this).attr('checked', false);
					$(this).css('visibility', 'hidden');
				} else {
					$(this).css('visibility', 'visible');
				}
			});
		}
	});
	$('#diffbtn').click(function() {
		var oldrev = $('INPUT[name=oldrev]:checked').val();
		var rev = $('INPUT[name=rev]:checked').val();
		if(oldrev && rev) {
			if(window.pjaxCall) window.pjaxCall('/diff/' + docName + '?oldrev='+ oldrev + '&rev=' + rev);
			else location.href = '/diff/' + docName + '?oldrev='+ oldrev + '&rev=' + rev;
		}
	});
}

var discussFetchWorking = [];
var discussPolling = false;
var discussTimer = null;
var discussXhr = null;
var discussXhr2 = null;

function discussFetch(topic, cb) {
	discussFetchWorking.push(cb);
	if(discussFetchWorking.length > 1) {
		return;
	}
	var currid = 0;
	$('#res-container').children().each(function() {
		currid = $(this).data('id');
	});
	discussXhr2 = $.ajax({
		type: "GET",
		url: "/topic/" + topic + "/" + currid,
		async: true,
		cache: false,
		dataType: 'html',
		error: function() {
			discussXhr2 = null;
			if(!discussPolling) return;
			location.reload();
		},
		success: function(data) {
			discussXhr2 = null;
			if(!discussPolling) return;
			$(data).appendTo($('#res-container'));

			$("#res-container time").each(function () {
				var format = $(this).attr("data-format");
				var time = $(this).attr("datetime");
				$(this).text(formatDate(new Date(time), format));
			});
			$("#res-container img.wiki-lazy-image").removeClass('wiki-lazy-image').removeClass('wiki-lazy-loading').each(function () {
				$(this).attr('src', $(this).attr("data-original"));
			});

			for(var i in discussFetchWorking) discussFetchWorking[i]();
			discussFetchWorking = [];
		}
	});
}

function discussPollCancel() {
	discussPolling = false;
	if(discussTimer) clearTimeout(discussTimer);
	discussTimer = null;
	if(discussXhr) discussXhr.abort();
	if(discussXhr2) discussXhr2.abort();
}

function discussPoll(topic) {
	if(!discussPolling) return;
	discussXhr = $.ajax({
		type: "POST",
		url: "/notify/topic/" + topic,
		async: true,
		cache: false,
		timeout: 20000,
		dataType: 'json',
		success: function(data) {
			discussXhr = null;
			if(!discussPolling) return;
			if(data.status !== 'event') {
				discussTimer = setTimeout(function() {
					discussTimer = null;
					if(!discussPolling) return;
					discussPoll(topic);
				}, 100);
				return;
			}
			discussFetch(topic, function() {
				discussTimer = setTimeout(function() {
					discussTimer = null;
					if(!discussPolling) return;
					discussPoll(topic);
				}, 10);
			});
		},
		error: function() {
			discussXhr = null;
			if(!discussPolling) return;
			discussFetch(topic, function() {
				discussTimer = setTimeout(function() {
					discussTimer = null;
					if(!discussPolling) return;
					discussPoll(topic);
				}, 10);
			});
		}
	});
}

function discussPollStart(topic) {
	discussPolling = true;
	$('#new-thread-form').submit(function() {
		var self = $(this);
		if(!self.find("TEXTAREA").val()) return false;
		var data = self.serialize();
		self.find("BUTTON, TEXTAREA").attr("disabled", "disabled");
		$.ajax({
			type: "POST",
			url: "/topic/" + topic,
			data: data,
			dataType: 'json',
			success: function(data) {
				self.find("BUTTON, TEXTAREA").removeAttr("disabled");
				self.find("TEXTAREA").val('');
			},
			error: function(data) {
				alert((data && data.responseJSON && data.responseJSON.status) ? data.responseJSON.status :'문제가 발생했습니다!');
				self.find("BUTTON, TEXTAREA").removeAttr("disabled");
			}
		});
		return false;
	});
	$('#thread-status-form').submit(function() {
		var self = $(this);
		var data = self.serialize();
		self.find("BUTTON").attr("disabled", "disabled");
		$.ajax({
			type: "POST",
			url: "/admin/topic/" + topic + "/status",
			data: data,
			dataType: 'json',
			success: function(data) {
				self.find("BUTTON").removeAttr("disabled");
				location.reload();
			},
			error: function(data) {
				alert((data && data.responseJSON && data.responseJSON.status) ? data.responseJSON.status :'문제가 발생했습니다!');
				self.find("BUTTON").removeAttr("disabled");
			}
		});
		return false;
	});
	discussPoll(topic);
}

var recaptchaInitCallbacks = [];

function recaptchaInit(id, opt) {
	if(window.grecaptcha) return window.grecaptcha.render(id, opt);
	recaptchaInitCallbacks.push(recaptchaInit.bind(null, id, opt));
}

function recaptchaOnLoad() {
	for(var i = 0; i < recaptchaInitCallbacks.length; i++) recaptchaInitCallbacks[i]();
	recaptchaInitCallbacks = [];
}
jQuery(function() {
	$("time").each(function () {
		var format = $(this).attr("data-format");
		var time = $(this).attr("datetime");

		if (!format || !time) {
			return;
		}
		$(this).text(formatDate(new Date(time), format));
	});
});

