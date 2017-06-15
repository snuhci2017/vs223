var articleReply = {
	md5_norobot_key:'',
	writeCheck:'',
	loginCheck:'',
	adminCheck:'',
	writeMessage:'',
	// 초기화
	init:function(){

		$j.when(
			$j.post("/news/reply/ajax.auth.check.php"),
			$j.post( "/news/reply/ajax.admin.check.php"),
			$j.post( "/news/reply/ajax.login.check.php")
		).then(function(replyAuth, adminCheckData, LoginCheckData){
			articleReply.adminCheck = (adminCheckData[0] == "LOGIN") ? true:false;
			articleReply.loginCheck = (LoginCheckData[0] == "LOGIN") ? true:false;
			articleReply.writeCheck = (replyAuth[0] == "MEMBER") ? true:false;



			// 댓글 메시지셋
			if(articleReply.writeCheck && !articleReply.loginCheck && !articleReply.adminCheck){
				articleReply.writeMessage = "기사댓글은 회원제로 운영하고 있습니다.\n로그인후 이용해 주세요";
			}else{
				articleReply.writeMessage = "기사의견을 등록해주세요.\n욕설등 인신공격성 글은 삭제합니다";
			}
			$j("#article-reply .reply-content").val(articleReply.writeMessage);


			if(articleReply.writeCheck && !articleReply.loginCheck && !articleReply.adminCheck){
				// 로그인 처리
				$j("#article-reply .reply-content, #article-reply .reply-write-container input[name=writekey], #article-reply .reply-write-container input[name=name], #article-reply .reply-write-container input[name=password]").focus(function(){
					var temp = confirm('로그인 페이지로 이동하시겠습니까');
					if(temp){
						location.href = '/member/login.html?backUrl='+location.href;
					}else{
						$j(this).blur();
					}
				});
			}else{

				// placeholder 댓글
				$j("#article-reply .reply-content").bind("focus", function(){
					if($j(this).val() == articleReply.writeMessage){
						$j(this).val('');
					}
				});

				// 댓글검사
				$j("#article-reply .reply-content").bind("keyup blur", function(e){
					articleReply.replyCheck($j(this), e);
				});

				// 자동등록방지 불러오기
				$j("#article-reply .reply-write-container input[name=writekey]").focus(function(){
					articleReply.kcaptcha( $j(this).closest(".reply-write-container").find(".kcaptcha_image") );
				});

				// 폼검사 및 전송
				$j("#article-reply .reply-write-container .w-button").bind("click", function(){
					articleReply.formCheck( $j(this).closest(".reply-write-container") );
				});

				// placeholder검사
				$j("#article-reply .input-placeholder").bind("blur keyup", function(e){
					articleReply.placeholderCheck($j(this), e);
				});

			}

			// 답글보기
			$j("#article-reply .rreply a").bind("click", function(){
				articleReply.loadRreply($j(this), $j(this).closest("li").find(".reply-list-rr"));
			});

			// 추천, 반대
			$j("#article-reply .vote .recommend, #article-reply .vote .dissent").bind("click", function(){
				articleReply.setVote($j(this));
			});

			// 신고
			$j("#article-reply .reply-list-body .declare").bind("click", function(){
				var idxno = $j(this).closest("li").attr('data-article-idx');
				window.open('/news/articleSingo.html?idxno='+idxno, 'articleSingo', 'width=660,height=500,scrollbars=yes');
			});

			// 삭제
			$j("#article-reply .reply-list-body .delete").bind("click", function(){
				articleReply.replyDelete($j(this));
			});
		});
	},

	// 폼검사 및 전송
	placeholderCheck:function(o, e){
		switch(e.type){
			case "keyup" :
				o.removeClass("input-placeholder");
			case "blur" :
				if(o.val() == "" && o.hasClass("input-placeholder") == false){
					o.addClass("input-placeholder");
				}
			break;
		}
	},

	// 댓글삭제
	replyDelete:function(o){

		var idxno = o.closest("li").attr('data-self-idx');
		var parent_idxno = o.closest("li").attr('data-parent-idx');


		if(articleReply.loginCheck || articleReply.adminCheck){
			var temp = confirm('선택된 댓글/답글을 삭제하시겠습니까?');
			if(!temp){
				return false;
			}
		}

		var html = "";
		if(articleReply.loginCheck || articleReply.adminCheck)
			html += "<div class = \"reply-delete-container\" style = \"display:none\">";
		else
			html += "<div class = \"reply-delete-container\">";

		html += "<div class = \"reply-delete-header\">";
		html += "비밀번호를 입력하세요";
		html += "</div>";
		html += "<form class = \"reply-delete-body\">";
		html += "<p><input type = \"hidden\" name = \"idxno\" value = \""+idxno+"\" /></p>";
		html += "<p><input type = \"password\" name = \"password\" /></p>";
		html += "<button class = \"btn reply-delete\" style = \"margin-top:7px\"><i class=\"fa fa-check\"></i> 삭제</button> ";
		html += "<button class = \"btn reply-cancel\" style = \"margin-top:7px\"><i class=\"fa fa-times\"></i> 취소</button>";
		html += "</form>";
		html += "</div>";

		$j("#article-reply .reply-delete-container").remove();
		o.after(html);

		$j("#article-reply .reply-delete").click(function(){

			if(!articleReply.loginCheck && !articleReply.adminCheck){
				if($j(this).closest(".reply-delete-body").find("input[name=password]").val() == ''){
					alert('비밀번호를 입력하세요');
					$j(this).closest(".reply-delete-body").find("input[name=password]").focus();
					return false;
				}
			}

			var mode = '';
			if(o.closest("ul.reply-list").hasClass("origin") == true){
				mode = 'reply';
			}else if(o.closest("ul.reply-list").hasClass("sub") == true){
				mode = 'rreply';
			}

			$j.ajax({
					  type: "post",
					  dataType: "json",
					  url: "/news/reply/ajax.reply.delete.php",
					  data:{
						  idxno:idxno,
						  parent_idxno:parent_idxno,
						  mode:mode,
						  password:$j(this).closest(".reply-delete-body").find("input[name=password]").val()
					  },
					  success: function(json) {

						  if(json.result == 'success'){

							switch(mode){
								case "reply" :
									var temp = $j("#article-reply .reply-header.list .title strong").text()
									$j("#article-reply .reply-header.list .title strong").text(parseInt(temp) - 1);
									if($j("#article-reply .reply-msg.more").length > 0){
										$j("#article-reply .reply-msg.more strong").text(parseInt(temp) - 1);
									}
								break;
								case "rreply" :
									var temp = o.closest(".reply-list.sub").closest(".reply-list-rr").siblings(".reply-list-footer").find(".rreply-count").text();
									o.closest(".reply-list-rr").siblings(".reply-list-footer").find(".rreply-count").text(parseInt(temp) - 1);
									break;
							}

							o.closest("li").fadeOut("slow");
						  }else{
							  alert(json.msg);
						  }
					  },
					  error: function(e) {
						 alert('정상처리되지 않았습니다.');
					  }
				});

				return false;

			});

			$j("#article-reply .reply-cancel").click(function(){
				$j("#article-reply .reply-delete-container").remove();
				return false;
			});

			if(articleReply.loginCheck || articleReply.adminCheck){
				$j("#article-reply .reply-delete").click();
			}


	},

	// 추천반대
	setVote:function(o){
		if(o.hasClass('recommend') == true){
			var voteType = "recommend";
			var tempText = "<i class=\"fa fa-thumbs-o-up\"></i> 추천";
		}else if(o.hasClass('dissent') == true){
			var voteType = "dissent";
			var tempText = "<i class=\"fa fa-thumbs-o-down\"></i> 반대";
		}
		var idxno = o.closest(".reply-list-footer").siblings(".reply-list-rr").find(".reply-write-container input[name=parent_idxno]").val();

		o.find(".text").html('<i class="fa fa-spinner fa-spin"></i> 처리중');
		$j.ajax({
					  type: "post",
					  dataType: "json",
					  url: "/news/reply/ajax.reply.vote.php",
					  data:{
						  idxno:idxno,
						  voteType:voteType
					  },
					  success: function(json) {
						  if(json.result == 'success'){
							  var temp = o.find(".count").text();
							  o.find(".count").text(parseInt(temp) + 1);
						  }else{
  							  alert(json.msg);
						  }
					  },
					  error: function(e) {
						 alert('정상처리되지 않았습니다.');
					  },
					  complete:function(){
						  o.find(".text").html(tempText);
					  }
			});

	},

	// 대댓글 불러오기
	loadRreply:function(self, o){

		//$j("#article-reply .rreply a").find("i").removeClass('fa-caret-up').addClass('fa-caret-down');
		//$j("#article-reply .reply-list-rr").hide();

		o.toggle();
		if(self.find("i").hasClass('fa-caret-down') == true){
			self.find("i").removeClass('fa-caret-down').addClass('fa-caret-up');
		}else if(self.find("i").hasClass('fa-caret-up') == true){
			self.find("i").removeClass('fa-caret-up').addClass('fa-caret-down');
		}

		if(self.attr('data-loaded') != 'true'){
			var parent_idxno = o.find(".reply-write-container input[name=parent_idxno]").val();

			$j.ajax({
					  type: "post",
					  dataType: "json",
					  url: "/news/reply/ajax.reply.get.php",
					  data:{
						  parent_idxno:parent_idxno,
					  },
					  success: function(json) {

						  //alert(json);

						  if(json.result == 'failed'){
							  alert(json.msg);
						  }else{
  							  self.attr('data-loaded', 'true');

							  if(json.total > 0){
								  for(var i=0; i<json.total; i++){
									 //alert(json.rreply[i].name);
									 articleReply.appendReply(json.rreply[i], o.find(".reply-write-container"));
								  }
							  }
							 // articleReply.appendReply(json, o);
						  }
					  },
					  error: function(e) {
						 alert('정상처리되지 않았습니다.');
					  }
			});
		}
	},

	// 댓글검사
	replyCheck:function(o, e){
		var cur = Math.min(o.val().length,300) ;
		o.closest(".reply-write-body").find('.cur').text(cur);

		if(o.val().length > cur) o.val(  o.val().substring(0, cur) );
		o.css('height', '40px');
		o.css('height', o.prop('scrollHeight'));


		if(e.type == "blur" && o.val() == ''){
			o.val(articleReply.writeMessage);
		}

	},

	// 자동등록방지 글생성
	kcaptcha:function(o){

		$j(".reply-write-container .kcaptcha_image").css('display', 'none');
		var kcaptchaPath = "/kcaptcha";
		o.css('display', 'inline');
		$j.post(kcaptchaPath + '/kcaptcha_session.php', function(data) {
			o.attr('src', kcaptchaPath + "/kcaptcha_image.php?t=" + (new Date).getTime());
			articleReply.md5_norobot_key = data;
	    });


	},

	// 폼검사 및 전송
	formCheck:function(o){


		$j.when(
			$j.post( "/news/reply/ajax.admin.check.php"),
			$j.post( "/news/reply/ajax.login.check.php")
		).then(function(adminCheckData, LoginCheckData){


			var adminCheck = (adminCheckData[0] == "LOGIN") ? true:false;
			var loginCheck = (LoginCheckData[0] == "LOGIN") ? true:false;


			if( o.find("input[name=name]").val() == ""){
				alert("작성자를 입력하세요");
				o.find("input[name=name]").focus();
				return false;
			}

			if(!adminCheck && !loginCheck){
				if( o.find("input[name=password]").val() == ""){
					alert("비밀번호를 입력하세요");
					o.find("input[name=password]").focus();
					return false;
				}else if( o.find("input[name=writekey]").val() == ""){
					alert("자동등록방지글을 입력하세요");
					o.find("input[name=writekey]").focus();
					return false;
				}else if(hex_md5(o.find("input[name=writekey]").val()) != articleReply.md5_norobot_key) {
					alert("자동등록방지용 글자를 바르게 입력하세요.");
					o.find("input[name=writekey]").focus();
					flag=1;
					return;
				}
			}

			if( o.find("textarea[name=content]").val() == ""){
				alert("본문을 입력하세요");
				o.find("textarea[name=content]").focus();
				return false;
			}


			o.find(".w-button").html("<i class=\"fa fa-circle-o-notch fa-spin\"></i> 댓글등록중");
			$j(".reply-write-container .w-button").unbind("click");


			var delay=500;
			setTimeout(function(){

				$j.ajax({
						  type: "post",
						  dataType: "json",
						  url: "/news/reply/ajax.reply.insert.php",
						  data:{
							  mode:o.find("input[name=mode]").val(),
							  article_idxno:o.find("input[name=article_idxno]").val(),
							  parent_idxno:o.find("input[name=parent_idxno]").val(),
							  name:o.find("input[name=name]").val(),
							  password:o.find("input[name=password]").val(),
							  writekey:o.find("input[name=writekey]").val(),
							  content:o.find("textarea[name=content]").val()
						  },
						  success: function(json) {
							  //alert(json);
							  //return false;

							  if(json.result == 'success'){

								  //alert(json.content + "\n" + json.reg_time + "\n" + json.reply_count);
								  // 초기화
								  o.find("input[name=name]").val('').addClass("input-placeholder");
								  o.find("input[name=password]").val('').addClass("input-placeholder");
								  o.find("input[name=writekey]").val('').addClass("input-placeholder");
								  o.find("textarea[name=content]").val('');
								  o.find(".n-check .cur").text('0');

								  // 카운트 변경
								  if(o.find("input[name=mode]").val() == "input"){
										var temp = $j("#article-reply .reply-header.list .title strong").text()
										$j("#article-reply .reply-header.list .title strong").text(parseInt(temp) + 1);

										if($j("#article-reply .reply-msg.more").length > 0){
											$j("#article-reply .reply-msg.more strong").text(parseInt(temp) + 1);
										}
								  }else if(o.find("input[name=mode]").val() == "rreply"){
										var temp = o.closest(".reply-list-rr").siblings(".reply-list-footer").find(".rreply-count").text();
										o.closest(".reply-list-rr").siblings(".reply-list-footer").find(".rreply-count").text(parseInt(temp) + 1);
								  }

								  // 요소 삽입
								  articleReply.appendReply(json, o);

							  }else if(json.result == 'failed'){
								  alert(json.msg);
							  }
						  },
						  error: function(e) {
							 alert('정상처리되지 않았습니다.');
						  },
						  complete:function(){

							  $j(".reply-write-container .kcaptcha_image").css('display', 'none');
							  $j(".reply-write-container input[name=writekey]").val('');
							  o.find(".w-button").html("<i class=\"fa fa-check\"></i> 등록");
							  $j(".reply-write-container .w-button").bind("click", function(){
									articleReply.formCheck( $j(this).closest(".reply-write-container") );
							   });

						  }
				});

			//your code to be executed after 1 seconds
			},delay);
		});


	},

	// HTML추가
	appendReply:function(data, o){
		switch( o.find("input[name=mode]").val() ){
			case "input" :

				var liClass = (data.user_id== "admin")?"admin-row":"user-row";
				var html = "";
				html += "<li class = \""+liClass+"\" data-article-idx = \""+data.article_idxno+"\" data-self-idx = \""+data.idxno+"\"  data-parent-idx = \""+data.idxno+"\">";
				html += "<div class = \"reply-list-header\">";
				html += "	<strong class = \"name\">"+util.urldecode(data.name)+"</strong>";
				html += "	<span class = \"date\">"+data.reg_date+ " " +data.reg_time+"</span>";
				html += "</div>";
				html += "<div class = \"text-box\">";
				html += "<div class = \"text-arrow\"></div>";
				html += "<p class = \"reply-list-body origin\">";
				html += util.urldecode(data.content);
				//html += "<a class = \"declare\">신고</a>";
				//html += " <font style=\"color:#cfcfcf; font-family:dotum;\">|</font> ";
				html += "<a class = \"declare\">&nbsp;</a>";
				html += "<a class = \"delete\">삭제</a>";
				html += "</p>";
				html += "<div class = \"reply-list-footer\">";
				html += "	<div class = \"rreply\">";
				html += "		<a>";
				html += "		답글 <span class = \"rreply-count\">0</span> <i class=\"rreply-toggle fa fa-caret-down\"></i>";
				html += "		</a>";
				html += "	</div>";
				html += "	<div class = \"vote\">";
				html += "		<a class = \"btn recommend\">";
				html += "			<span class = \"text\"><i class=\"fa fa-thumbs-o-up\"></i> 추천</span>";
				html += "			<span class = \"count\">0</span>";
				html += "		</a>";
				html += "		<a class = \"btn dissent\">";
				html += "			<span class = \"text\"><i class=\"fa fa-thumbs-o-down\"></i> 반대</span>";
				html += "			<span class = \"count\">0</span>";
				html += "		</a>";
				html += "	</div>";
				html += "</div>";
				html += "<div class = \"reply-list-rr\">";

				html += "<ul class = \"reply-list sub\"></ul>";
				html += "	<form class = \"reply-write-container\">";
				html += "		<div class = \"reply-write-header\">";
				html += "			<input name = \"mode\" type = \"hidden\" value = \"rreply\" />";
				html += "			<input name = \"article_idxno\" type = \"hidden\" value = \""+data.article_idxno+"\" />";
				html += "			<input name = \"parent_idxno\" type = \"hidden\" value = \""+data.parent_idxno+"\" />";
				html += "			<input name = \"name\" type = \"text\" class = \"input-box input-placeholder placeholder-name\" />";

				if(!articleReply.adminCheck && !articleReply.loginCheck){
					html += "			<input name = \"password\" type = \"password\" class = \"input-box input-placeholder placeholder-password\" />";
					html += "			<div class = \"writekey-container\">";
					html += "				<div class = \"input-box-group\">";
					html += "				<img class=\"kcaptcha_image\" border=\"1\" style=\"cursor:pointer;\" align=\"absmiddle\" />";
					html += "				<input type=\"text\" name=\"writekey\" class=\"writekey input-placeholder placeholder-writekey\" maxlength=\"4\" />";
					html += "				</div>";
					html += "			</div>";
				}

				html += "		</div>";
				html += "		<div class = \"reply-write-body\">";
				html += "		<div class = \"reply-content-container\">";
				html += "			<textarea class = \"reply-content\" name = \"content\"></textarea>";
				html += "		</div>";
				html += "			<div class = \"reply-write-footer\">";
				html += "				<div class = \"n-check\"><span class = \"cur\">0</span>/<span class = \"max\">300</span></div>";
				html += "				<button class = \"w-button\" onclick = \"return false\"><i class=\"fa fa-check\"></i> 등록</button>";
				html += "			</div>";
				html += "		</div>";
				html += "	</form>";
				html += "</div>";
				html += "</div>";
				html += "</li>";

				// 첫 댓글 요소 제거
				if($j("#article-reply .reply-msg.info").length > 0){
					$j("#article-reply .reply-msg.info").css('display', 'none');
				}

				// 요소 삽입
				$j("#article-reply .reply-list.origin").prepend(html);

				// 댓글 메시지셋
				if(articleReply.writeCheck && !articleReply.loginCheck && !articleReply.adminCheck){
					articleReply.writeMessage = "기사댓글은 회원제로 운영하고 있습니다.\n로그인후 이용해 주세요";
				}else{
					articleReply.writeMessage = "기사의견을 등록해주세요.\n욕설등 인신공격성 글은 삭제합니다";
				}
				$j("#article-reply .reply-list.origin li:eq(0) .reply-content").val(articleReply.writeMessage);

				if(articleReply.writeCheck && !articleReply.loginCheck && !articleReply.adminCheck){

					// 로그인 처리
					$j("#article-reply .reply-list.origin li:eq(0) .reply-content, #article-reply .reply-list.origin li:eq(0) .reply-write-container input[name=writekey], #article-reply .reply-list.origin li:eq(0) .reply-write-container input[name=name], #article-reply .reply-list.origin li:eq(0) .reply-write-container input[name=password]").focus(function(){
						var temp = confirm('로그인 페이지로 이동하시겠습니까');
						if(temp){
							location.href = '/member/login.html?backUrl='+location.href;
						}else{
							$j(this).blur();
						}
					});


				}else{

					// placeholder 댓글
					$j("#article-reply .reply-list.origin li:eq(0) .reply-content").bind("focus", function(){
						if($j(this).val() == articleReply.writeMessage){
							$j(this).val('');
						}
					});

					// 댓글검사
					$j("#article-reply .reply-list.origin li:eq(0) .reply-content").bind("keyup blur", function(e){
						articleReply.replyCheck($j(this), e);
					});

					// placeholder검사
					$j("#article-reply .reply-list.origin li:eq(0) .input-placeholder").bind("blur keyup", function(e){
						articleReply.placeholderCheck($j(this), e);
					});

					// 답글 이벤트 설정
					$j("#article-reply .reply-list.origin li:eq(0) .rreply a").bind("click", function(){
							articleReply.loadRreply($j(this), $j(this).closest("li").find(".reply-list-rr"));
					});

					// 자동등록방지 이벤트 설정
					$j("#article-reply .reply-list.origin li:eq(0) .reply-write-container input[name=writekey]").focus(function(){
						articleReply.kcaptcha( $j(this).closest(".reply-write-container").find(".kcaptcha_image") );
					});

				}

				// 추천, 반대
				$j("#article-reply .reply-list.origin li:eq(0) .vote .recommend, #article-reply .reply-list li:eq(0) .vote .dissent").bind("click", function(){
					articleReply.setVote($j(this));
				});

				// 신고
				$j("#article-reply .reply-list.origin li:eq(0) .declare").bind("click", function(){
					var idxno = $j(this).closest("li").attr('data-article-idx');
					window.open('/news/articleSingo.html?idxno='+idxno, 'articleSingo', 'width=660,height=500,scrollbars=yes');
				});

				// 삭제
				$j("#article-reply .reply-list.origin li:eq(0) .delete").bind("click", function(){
					articleReply.replyDelete($j(this));
				});
			break;

			case "rreply" :

				var liClass = (data.user_id== "admin")?"admin-row":"user-row";
				var html = "";
				html += "	<li class = \""+liClass+"\" data-article-idx = \""+data.article_idxno +"\" data-self-idx = \""+data.idxno+"\" data-parent-idx = \""+data.parent_idxno+"\">";
				html += "		<div class = \"reply-list-header\">";
				html += "			<strong class = \"name\">"+util.urldecode(data.name)+"</strong> ";
				html += "			<span class = \"date\">"+data.reg_date+" " +data.reg_time+"</span>";
				html += "		</div>";
				html += "		<p class = \"reply-list-body sub\">";
				html += util.urldecode(data.content);
				//html += "<a class = \"declare\">신고</a>";
				//html += " <font style=\"color:#cfcfcf; font-family:dotum;\">|</font> ";
				html += "<a class = \"declare\">&nbsp;</a>";
				html += "<a class = \"delete\">삭제</a>";
				html += "		</p>	";
				html += "	</li>";


				// 요소삽입
				o.siblings(".reply-list.sub").append(html);

				// 신고
				$j("#article-reply .reply-list.sub li").last().find(".declare").bind("click", function(){
					var idxno = $j(this).closest("li").attr('data-article-idx');
					window.open('/news/articleSingo.html?idxno='+idxno, 'articleSingo', 'width=660,height=500,scrollbars=yes');
				});

				// 삭제
				$j("#article-reply .reply-list.sub li").last().find(".delete").bind("click", function(){
					articleReply.replyDelete($j(this));
				});

			break;
		}
	}
}

var util = {
	urlencode:function(str) {
	  str = (str + '')
		.toString();
	  return encodeURIComponent(str)
		.replace(/!/g, '%21')
		.replace(/'/g, '%27')
		.replace(/\(/g, '%28')
		.
	  replace(/\)/g, '%29')
		.replace(/\*/g, '%2A')
		.replace(/%20/g, '+');
	},

	// url decode ( php와 동일한 결과)
	urldecode:function(str) {
	  return decodeURIComponent((str + '')
		.replace(/%(?![\da-f]{2})/gi, function() {
		  // PHP tolerates poorly formed escape sequences
		  return '%25';
		})
		.replace(/\+/g, '%20'));
	},

	loginCheck:function(){
		$j.post( "/news/reply/ajax.login.check.php", function( data ) {
			if(data == "LOGIN") return true;
			else return false;
		});
	},

	adminCheck:function(){
		$j.post( "/news/reply/ajax.admin.check.php", function( data ) {
			if(data == "LOGIN") return true;
			else	return false;
		});
	}
}

var articleReplyAdmin = {
	// 관리자초기화
	init:function(){

		// 개별삭제
		$j(".reply-admin-list .delete").click(function(){

			var temp = confirm('선택된 댓글/답글을 삭제하시겠습니까?');
			if(!temp) return false;

			var idxno = $j(this).closest("li").attr("data-self-idxno");
			var parent_idxno = $j(this).closest("li").attr("data-parent-idxno");
			var removeTarget = $j(this).closest("li");
			var mode = (idxno == parent_idxno)?"reply":"rreply";

			/*removeTarget.fadeOut( "slow", function() {
				alert('test');
			});*/
			articleReplyAdmin.replyDelete(idxno, parent_idxno, mode, removeTarget);

		});

		// 전체삭제
		$j(".reply-admin-header .select-delete").click(function(){

			var temp = confirm('선택된 댓글/답글을 삭제하시겠습니까?');
			if(!temp) return false;

			var cnt = 0;
			$j(".reply-admin-list .chk_idxno").each(function(i){
				//alert(i);
				if( $j(this).prop('checked') ){

					var idxno = $j(this).closest("li").attr("data-self-idxno");
					var parent_idxno = $j(this).closest("li").attr("data-parent-idxno");
					var removeTarget = $j(this).closest("li");
					var mode = (idxno == parent_idxno)?"reply":"rreply";
					articleReplyAdmin.replyDelete(idxno, parent_idxno, mode, removeTarget)
					cnt++;
				}

			});

			if(cnt < 1){
				alert('기사를 선택해주세요');
			}

		});

		// 전체선택
		$j(".reply-admin-header .select-all").click(function(){
			var p = $j(this);
			$j(".reply-admin-list .chk_idxno").each(function(i){

				if(p.attr('data-checked') == 'checked'){
					$j(this).prop('checked',false);


				}else{
					$j(this).prop('checked',true);
				}

			});

			if(p.attr('data-checked') == 'checked'){
				$j(this).text('전체선택');
				$j(this).attr('data-checked', 'not-checked');
			}else{
				$j(this).text('전체해제');
				$j(this).attr('data-checked', 'checked');
			}
		});

	},

	// 댓글삭제
	replyDelete:function(idxno, parent_idxno, mode, removeTarget){


		while( parent_idxno == removeTarget.attr("data-parent-idxno")){
			var temp = removeTarget.next()
			removeTarget.remove();
			removeTarget = temp;
		}

		$j.ajax({
				  type: "post",
				  dataType: "json",
				  url: "/news/reply/ajax.reply.delete.php",
				  data:{
					  idxno:idxno,
					  parent_idxno:parent_idxno,
					  mode:mode
				  },
				  success: function(json) {

					  if(json.result == 'success'){

						while( parent_idxno == removeTarget.attr("data-parent-idxno")){
							removeTarget.fadeOut("slow", function() {
								removeTarget = removeTarget.next();
								removeTarget.remove();
							});
						}

						var temp = $j(".reply-admin-list-container .total .num ").text();
						$j(".reply-admin-list-container .total .num").text(parseInt(temp) - 1);


					  }else{
						  alert(json.msg);
					  }
				  },
				  error: function(e) {
					 alert('정상처리되지 않았습니다.');
				  }
		});



	}
}