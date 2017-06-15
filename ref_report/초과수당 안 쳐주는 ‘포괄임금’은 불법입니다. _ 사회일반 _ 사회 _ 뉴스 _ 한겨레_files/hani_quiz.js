	/*
	 * quiz_status
	 * 0 : 시작
	 * 1 : tag를 확인하고 해당 퀴즈의 데이터를 요청하였다.
	 * 2 : 데이터를 확인하고 quiz의 layer를 수성하였다.
	 * 3 : 정답을 확인하였다.
	 */

	function	loadHaniQuizCss()
	{
		if ( jQuery("#hani_quiz_link_css").length == 0 )
		{
			var     objHead = jQuery("head");
			if ( objHead.length > 0 )
			{
				var     objLink = jQuery("link");
				if ( objLink.length > 0 )
				{
					objHead = objLink.eq(0).parent();
				}
				else
				{
					var     objScript       = jQuery("script");
					if ( objScript.length > 0 )
					{
						objHead = objScript.eq(0).parent();
					}
					else
					{
						objHead = document.body ? jQuery(document.body) : jQuery(document);
					}
				}
			}

			if ( objHead )
			{
				var     objLinkItem     = jQuery("<link/>").attr("id", "hani_quiz_link_css").attr("rel", "stylesheet").attr("type", "text/css").attr("href", "http://img.hani.co.kr/section-image/15/hani/css/quiz.css");
				objHead.append(objLinkItem);
			}
		}
	};

	window.isLoadedHighcartJavascript       = false;

	function	loadHaniQuizHighchart()
	{
		if ( !window.isLoadedHighcartJavascript )
		{
			window.isLoadedHighcartJavascript       = true;
			jQuery.getScript("http://www.hani.co.kr/section-homepage/svc3/js/lib/highcharts.js");
		}
	};

	function	startHaniQuiz()
	{
		var     objQuizList	     = jQuery(".hani_quiz");
		for(var i=0;i<objQuizList.length;i++)
		{
			var     objQuizItem     = objQuizList.eq(i);
			var     quiz_no	 = parseInt(objQuizItem.attr("data-quiz-no"));
			var     quiz_status     = objQuizItem.attr("data-quiz-status") ? parseInt(objQuizItem.attr("data-quiz-status")) : 0;

			if ( quiz_status < 2 )
			{
				loadHaniQuizCss();
				objQuizItem.attr("data-quiz-status", 1);
				jQuery.getScript("http://www.hani.co.kr/section-homepage/svc3/json/quiz/"+(quiz_no%10)+"/quiz_"+quiz_no+".js");
			}
		}

		var     objQuiz2List    = jQuery(".hani_quiz2");
		for(var i=0;i<objQuiz2List.length;i++)
		{
			var     objQuizItem     = objQuiz2List.eq(i);
			var     quiz_no	 = parseInt(objQuizItem.attr("data-quiz-no"));
			var     quiz_status     = objQuizItem.attr("data-quiz-status") ? parseInt(objQuizItem.attr("data-quiz-status")) : 0;

			if ( quiz_status < 2 )
			{
				loadHaniQuizCss();
				objQuizItem.attr("data-quiz-status", 1);
				jQuery.getScript("http://www.hani.co.kr/section-homepage/svc3/json/quiz2/"+(quiz_no%10)+"/quiz_"+quiz_no+".js");
			}
		}
	};

	function	makeHaniQuizHtml(data)
	{
		if ( data && data.quizsn )
		{
			var     objQuizBase     = jQuery(".hani_quiz[data-quiz-no="+data.quizsn+"]");
			var     quiz_status     = parseInt(objQuizBase.attr("data-quiz-status"));
			if ( quiz_status < 2 )
			{
				objQuizBase.attr("data-quiz-status", 2);
				if ( objQuizBase )
				{
					var     objQuizArea	     = jQuery("<div/>"       ).addClass("quiz-area");
					var     objQuizQ		= jQuery("<div/>"       ).addClass("quiz-q");
					var     objQuizQTitle   = jQuery("<div/>"       ).addClass("quiz-q-title"       );
					var     objQuizQText    = jQuery("<div/>"       ).addClass("quiz-q-text"	);
					var     objQuizQImg	     = jQuery("<div/>"       ).addClass("quiz-q-img"	 );
					var     objQuizO		= jQuery("<ul/>"	).addClass("quiz-a"		     );
					var     objQuizA		= jQuery("<div/>"       ).addClass("quiz-box"	   ).css({"display":"none"});
					var     objQuizATitle   = jQuery("<div/>"       ).addClass("quiz-a-title"       );
					var     objQuizAText    = jQuery("<div/>"       ).addClass("quiz-a-text"	);
					var     objQuizAImg	     = jQuery("<div/>"       ).addClass("quiz-a-img"	 );

					if ( data.q )
					{
						if	      ( data.q.title	  )       {       objQuizQTitle.html('<strong>Q</strong><span>'+data.q.title+( data.q.hint ? ' <a href="'+data.q.hint+'" target="_blank"><img src="http://img.hani.co.kr/section-image/15/hani/images/icon/icon_hint.gif" title="힌트"/></a>' : '')+'</span>');    }
						if	      ( data.q.desc	   )       {       objQuizQText.html(data.q.desc);			       }
						if	      ( data.q.img	    )       {       objQuizQImg.html('<img src="'+data.q.img+'"/>');	}
						else if ( data.q.youtube	)
						{
							var     youtube = data.q.youtube.replace("https://youtu.be/", "https://www.youtube.com/embed/");
							objQuizQImg.html('<iframe width="100%" height="360px" src="'+youtube+'" frameborder="0" allowfullscreen></iframe>');
						}
					}
					if ( data.a )
					{
						if	      ( data.a.ans	    )       {       objQuizBase.attr("data-answer-no", data.a.ans);	 }
						if	      ( data.a.desc	   )       {       objQuizAText.html(data.a.desc);			       }
						if	      ( data.a.img	    )       {       objQuizAImg.html('<img src="'+data.a.img+'"  title="더 자세한 설명"/>');   }
						else if ( data.a.youtube	)
						{
							var     youtube = data.a.youtube.replace("https://youtu.be/", "https://www.youtube.com/embed/");
							objQuizAImg.html('<iframe width="100%" height="360px" src="'+youtube+'" frameborder="0" allowfullscreen></iframe>');
						}
					}
					if ( data.e && data.e.examples )
					{
						for(var i=0;i<data.e.examples.length;i++)
						{
							var     objQuizOItem    = jQuery('<li/>'	).attr("data-option-no", data.e.examples[i].entry);
							var     htmlItem		= "";
							if ( data.e.examples[i].img )   {       htmlItem	+= '<img src="'+data.e.examples[i].img+'"/>';   }
							if ( data.e.examples[i].txt )   {       htmlItem	+= '<span>'+data.e.examples[i].txt+'</span>';   }
							htmlItem	= '<div data-option-no="'+data.e.examples[i].entry+'" onclick="javascript:solveHaniQuiz(this);" class="option">'+htmlItem+'</div>';
							objQuizOItem.html(htmlItem);
							objQuizO.append(objQuizOItem);
						}
					}
					if ( data.attr )
					{
						if ( data.attr.disp == "2x2" )
						{
							objQuizO.addClass("img-ex");
						}
					}

					objQuizBase.append(objQuizArea);
					objQuizArea.append(objQuizQ);
					objQuizQ.append(objQuizQTitle);
					objQuizQ.append(objQuizQText);
					objQuizQ.append(objQuizQImg);
					objQuizArea.append(objQuizO);
					objQuizArea.append(objQuizA);
					objQuizA.append(objQuizATitle);
					objQuizA.append(objQuizAText);
					objQuizA.append(objQuizAImg);
				}
			}
		}
	};

	function	solveHaniQuiz(obj)
	{
		var     objQuizOItem    = jQuery(obj);
		var     objQuizBase	     = objQuizOItem.closest(".hani_quiz");
		var     objQuizA		= objQuizBase.find(".quiz-box");
		var     objQuizATitle   = objQuizA.find(".quiz-a-title");
		var     quiz_status	     = parseInt(objQuizBase.attr("data-quiz-status"));

		if ( quiz_status < 3 )
		{
			var     answer_no       = parseInt(objQuizBase.attr("data-answer-no"));
			var     selected_no     = parseInt(objQuizOItem.attr("data-option-no"));

			if ( answer_no == selected_no )
			{
				objQuizOItem.closest("li").addClass("correct");
				objQuizATitle.addClass("corect").html("정답입니다.");
			}
			else
			{
				objQuizBase.find("li[data-option-no="+answer_no+"]").addClass("correct ok");
				objQuizOItem.closest("li").addClass("wrong");
				objQuizATitle.addClass("wrong").html("오답입니다.");
			}

			objQuizA.css({"display":""});
			objQuizBase.attr("data-quiz-status", 3);
		}
	};

	function	makeHaniQuiz2Html(data)
	{
		if ( data && data[0] && data[0].sn )
		{
			var     objQuizBase     = jQuery(".hani_quiz2[data-quiz-no="+data[0].sn+"]");
			var     quiz_status     = parseInt(objQuizBase.attr("data-quiz-status"));
			if ( quiz_status < 2 )
			{
				var     objQuizQBase    = jQuery("<div/>").addClass("hani_quiz2_question");
				var     objQuizBBase    = jQuery("<div/>").addClass("quiz-btn-total");
				var     objQuizRBase    = jQuery("<div/>").addClass("hani_quiz2_result");
				var     objQuizABase    = jQuery("<div/>").addClass("quiz-box2").css({"display":"none"});
				var     quizType		= data[0].type;
				var     resulturl	       = data[0].resulturl ? data[0].resulturl : (( window.controller && controller.action && controller.action.shareUrl ) ? decodeURIComponent(controller.action.shareUrl) : "http://www.hani.co.kr/arti/QUIZ2/"+data[0].sn+".html");

				for(var i=0;i<data[0].quiz.length;i++)
				{
					var     qItem		   = data[0].quiz[i];
					var     qTitle		  = quizType == "poll" ? data[0].title : qItem.title;
					var     objQuizArea	     = jQuery("<div/>").addClass("quiz-area").attr("data-quiz-status", 2);
					var     objQuizQ		= jQuery("<div/>").addClass("quiz-q");
					var     objQuizQTitle   = jQuery("<div/>").addClass("quiz-q-title").html('<strong>Q</strong><span>'+qTitle+( qItem.hint ? ' <a href="'+qItem.hint+'" target="_blank"><img src="http://img.hani.co.kr/section-image/15/hani/images/icon/icon_hint.gif" title="힌트" /></a>' : '')+'</span>');
					var     objQuizQText    = jQuery("<div/>").addClass("quiz-q-text").html(qItem.desc);
					var     objQuizQImg	     = jQuery("<div/>").addClass("quiz-q-img");
					var     objQuizO		= jQuery("<ul/>" ).addClass("quiz-a");

					if	      ( qItem.img	     )       {       objQuizQImg.html('<img src="'+qItem.img+'"/>'); }
					else if ( qItem.youtube )
					{
						var     youtube = qItem.youtube.replace("https://youtu.be/", "https://www.youtube.com/embed/");
						objQuizQImg.html('<iframe width="100%" height="360px" src="'+youtube+'" frameborder="0" allowfullscreen></iframe>');
					}

					if ( qItem.condition )
					{
						objQuizO.addClass("img-ex");
					}
					for(var j=0;j<qItem.example.length;j++)
					{
						var     eItem		   = qItem.example[j];
						var     objQuizOItem    = jQuery('<li/>').addClass("hani_quiz2_answer_"+(eItem.answer?"T":"F"));
						var     htmlItem		= "";
						if ( eItem.img )	{       htmlItem	+= '<img src="'+eItem.img+'"/>';	}
						if ( eItem.title )      {       htmlItem	+= '<span>'+eItem.title+'</span>';      }
						htmlItem	= '<div onclick="javascript:solveHaniQuiz2(this);" class="option">'+htmlItem+'</div>';
						objQuizOItem.html(htmlItem);
						objQuizO.append(objQuizOItem);
					}

					objQuizQBase.append(objQuizArea);
					objQuizArea.append(objQuizQ);
					objQuizQ.append(objQuizQTitle);
					objQuizQ.append(objQuizQText);
					objQuizQ.append(objQuizQImg);
					objQuizArea.append(objQuizO);
				}

				if ( quizType == "quiz" )
				{
					objQuizBBase.html('<div class="quiz-btn" onclick="javascript:submitHaniQuiz2(this);"><span>확인</span></div>');

					for(var i=0;i<data[0].answer.length;i++)
					{
						var     aItem   = data[0].answer[i];
						var     objQuizA		= jQuery("<div/>").addClass("quiz-a-box").css({"display":"none"});
						var     objQuizAScore   = jQuery("<div/>").addClass("quiz-a-score").html('<strong class="score">0</strong>개 맞혔네요');
						var     objQuizATitle   = jQuery("<div/>").addClass("quiz-a-title").html(aItem.title);
						var     objQuizAImg	     = jQuery("<div/>").addClass("quiz-a-img");
						var     objQuizAText    = jQuery("<div/>").addClass("quiz-a-text").html(aItem.desc);

						if	      ( aItem.img	     )       {       objQuizAImg.html('<img src="'+aItem.img+'"/>'); }
						else if ( aItem.youtube )
						{
							var     youtube = aItem.youtube.replace("https://youtu.be/", "https://www.youtube.com/embed/");
							objQuizAImg.html('<iframe width="100%" height="360px" src="'+youtube+'" frameborder="0" allowfullscreen></iframe>');
						}

						objQuizA.attr("data-result-max",	aItem.max);
						objQuizA.attr("data-result-min",	aItem.min);

						objQuizABase.append(objQuizA);
						objQuizA.append(objQuizAScore);
						objQuizA.append(objQuizATitle);
						objQuizA.append(objQuizAText);
						objQuizA.append(objQuizAImg);
					}
				}
				else if ( quizType == "poll" )
				{
					objQuizABase.html('<div class="quiz-a-img"></div>');

					loadHaniQuizHighchart();
				}

				objQuizABase.append(jQuery("<div/>").addClass("quiz-sns").html('<a href="http://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(resulturl)+'" onclick="javascript:return shareHaniQuiz2Facebook(this);" target="_blank"><div class="quiz-btn-sns"><span>페이스북에 결과 공유하기</span></div></a>'));

				objQuizRBase.append(objQuizABase);
				objQuizBase.append(objQuizQBase);
				objQuizBase.append(objQuizBBase);
				objQuizBase.append(objQuizRBase);

				objQuizBase.attr("data-quiz-status",    2);
				objQuizBase.attr("data-question-count", data[0].quiz.length);
				objQuizBase.attr("data-answer-count",   0);
				objQuizBase.attr("data-correct-count",  0);
				objQuizBase.attr("data-option-no",	      0);
				objQuizBase.attr("data-quiz-type",	      quizType);
				if ( data[0].quiz && data[0].quiz[0] && data[0].quiz[0].condition2 )
				{
					objQuizBase.attr("data-poll-type",	      data[0].quiz[0].condition2);
				}
			}
		}
	};

	function	solveHaniQuiz2(obj)
	{
		var     objQuizOItem    = jQuery(obj);
		var     objQuizGBase    = objQuizOItem.closest(".hani_quiz2");
		var     quizGStatus	     = parseInt(objQuizGBase.attr("data-quiz-status"));
		var     quizType		= objQuizGBase.attr("data-quiz-type");

		if ( quizGStatus < 3 )
		{
			var     objQuizQBase    = objQuizOItem.closest(".quiz-area");
			if ( quizType == "quiz" )
			{
				var     quizQStatus	     = parseInt(objQuizQBase.attr("data-quiz-status"));

				if ( quizQStatus < 3 )
				{
					var     objQuizOBase    = objQuizOItem.closest("li");
					var     correctCount    = parseInt(objQuizGBase.attr("data-correct-count"));
					var     answerCount	     = parseInt(objQuizGBase.attr("data-answer-count"));

					if ( objQuizOBase.hasClass("hani_quiz2_answer_T") )
					{
						objQuizOBase.addClass("correct");
						correctCount++;
					}
					else
					{
						objQuizOBase.addClass("wrong");
						objQuizQBase.find(".hani_quiz2_answer_T").addClass("correct ok");
					}
					answerCount++;
					objQuizQBase.attr("data-quiz-status",   3);
					objQuizGBase.attr("data-correct-count", correctCount);
					objQuizGBase.attr("data-answer-count",  answerCount);
				}
			}
			else if ( quizType == "poll" )
			{
				objQuizGBase.find("li.check").removeClass("check");
				objQuizGBase.attr("data-option-no",	     objQuizOItem.closest("li").addClass("check").attr("data-option-no"));
				objQuizQBase.attr("data-quiz-status",   3);

				submitHaniQuiz2(obj);
			}
		}
	};

	function	submitHaniQuiz2(obj)
	{
		var     objQuizSubmit   = jQuery(obj);
		var     objQuizGBase    = objQuizSubmit.closest(".hani_quiz2");
		var     quizGStatus	     = parseInt(objQuizGBase.attr("data-quiz-status"));
		var     quizType		= objQuizGBase.attr("data-quiz-type");
		var     quizNo		  = parseInt(objQuizGBase.attr("data-quiz-no"));

		if ( quizGStatus < 3 )
		{
			if ( quizType == "quiz" )
			{
				var     questionCount   = parseInt(objQuizGBase.attr("data-question-count"));
				var     correctCount    = parseInt(objQuizGBase.attr("data-correct-count"));
				var     answerCount	     = parseInt(objQuizGBase.attr("data-answer-count"));

				if ( questionCount == answerCount || confirm("모든 문제의 정답을 입력하지 않으셨습니다.\n\n결과를 확인하시겠습니까?") )
				{
					var     objQuizRBase    = objQuizGBase.find(".quiz-box2");
					var     objResultList   = objQuizGBase.find(".quiz-a-box");
					var     objShareButton  = objQuizRBase.find(".quiz-sns a");
					for(var i=0;i<objResultList.length;i++)
					{
						var     objResult       = objResultList.eq(i);
						var     minCorrect      = parseInt(objResult.attr("data-result-min"));
						var     maxCorrect      = parseInt(objResult.attr("data-result-max"));

						if ( minCorrect <= correctCount && correctCount <= maxCorrect )
						{
							objResult.css({"display":""});
							objResult.find(".quiz-a-score strong").html(correctCount);
							var resultUrl   = objShareButton.attr("href")+encodeURIComponent("?quiz2="+quizNo+"_"+correctCount);
							if ( /mobile|android|bada|blackberry|blazer|ip(hone|od|ad)|windows (ce|phone)/i.test(navigator.userAgent||navigator.vendor||window.opera) )
							{
								resultUrl       = resultUrl.replace("www.facebook.com/sharer/sharer.php", "m.facebook.com/sharer.php");
							}
							objShareButton.attr("href", resultUrl);

							break;
						}
					}
					objQuizRBase.css({"display":""});
					objQuizGBase.attr("data-quiz-status",   3);
				}
			}
			else if ( quizType == "poll" )
			{
				var     optionNo		= parseInt(objQuizGBase.attr("data-option-no"));
				jQuery.getScript("http://www.hani.co.kr/hani_manager3/poll.hani?q="+quizNo+"&o="+optionNo);
			}
		}
	};

	function	buildHaniQuiz2PollResult(data)
	{
		if ( data && data.quiz_no )
		{
			var     objQuizGBase    = jQuery(".hani_quiz2[data-quiz-no="+data.quiz_no+"]");
			var     objQuizRBase    = objQuizGBase.find(".quiz-box2");
			var     objQuizOList    = objQuizGBase.find("li span");
			var     chartTitle	      = objQuizGBase.find(".quiz-area .quiz-q-title span").html();
			var     chartData	       = [];
			var     chartInfo	       = {};
			var     chartType	       = objQuizGBase.attr("data-poll-type");
			var     chartColors	     = ["rgba(35,201,217,1)","rgba(136,196,72,1)","rgba(239,127,76,1)","rgba(247,113,131,1)","rgba(239,211,200,1)","rgba(122,141,151,1)"];
			var     labelItems	      = [];

			objQuizRBase.css({"display":""});
			objQuizGBase.attr("data-quiz-status",   3);

			for(var i=0;i<objQuizOList.length;i++)
			{
				var     objQuizOItem    = objQuizOList.eq(i);
				var     chartItem	       = {};
				var     chartItemName   = objQuizOItem.html() || ((i+1)+"번");
				if ( chartItemName.length > 54 )
				{
					chartItemName   = chartItemName.substring(0,18)+"<br/>"+chartItemName.substring(18,36)+"<br/>"+chartItemName.substring(36,54)+"<br/>"+chartItemName.substring(54);
				}
				else if ( chartItemName.length > 36 )
				{
					chartItemName   = chartItemName.substring(0,18)+"<br/>"+chartItemName.substring(18,36)+"<br/>"+chartItemName.substring(36);
				}
				else if ( chartItemName.length > 18 )
				{
					chartItemName   = chartItemName.substring(0,18)+"<br/>"+chartItemName.substring(18);
				}
				chartItem.name	  = chartItemName;
				chartItem.y		     = 0;
				chartItem.data	  = [0];
				chartItem.color	 = chartColors[i%chartColors.length];

				for(var j=0;j<data.data.length;j++)
				{
					if ( i+1 == data.data[j].option_no )
					{
						chartItem.y		     = parseInt(data.data[j].poll_count);
						chartItem.data[0]       = chartItem.y;
						break;
					}
				}

				if ( chartType == "pie" )
				{
					if ( objQuizRBase.width() > 579 )
					{
						chartData.unshift(chartItem);
					}
					else
					{
						chartData.push(chartItem);
					}
				}
				else if ( chartType == "bar" )
				{
					chartData.unshift(chartItem);
				}
			}

			if ( chartType == "pie" )
			{
				chartInfo.chart		 = {"type":"pie","backgroundColor":null};
				chartInfo.tooltip	       = {"enabled":false};
				chartInfo.series		= [{"name":"통계","colorByPoint":true,"data":chartData}];
				if ( objQuizRBase.width() > 579 )
				{
					chartInfo.title = {"text":chartTitle,"margin":30,"style":{"color":"#000000","fontWeight":"bold","fontSize":"25px"}};
					chartInfo.plotOptions   = {"pie":{"dataLabels":{"enabled":true,"softConnector": false,"useHTML":true,"format":'<div class="hani_quiz_chart_pie"><div class="name">{point.name}</div><div class="percent">{point.percentage:.1f}%</div><div class="count">({point.y}명)</div></div>',"distance":45,"x":0,"y":-20}}};
					chartInfo.series		= [{"name":"통계","colorByPoint":true,"data":chartData}];
				}
				else
				{
					chartInfo.title = {"text":chartTitle,"margin":10,"style":{"color":"#000000","fontWeight":"bold","fontSize":"18px"}};
					chartInfo.plotOptions   = {"pie":{"showInLegend":true,"dataLabels":{"enabled":false}}};
					chartInfo.legend		= {"useHTML":true,"width":(objQuizRBase.width()-50),"labelFormat":'<div class="hani_quiz_chart_pie_legend2"><div class="name">{name}</div><div class="percent">{percentage:.1f}%</div><div class="count">({y}명)</div></div>'};
				}
			}
			else if ( chartType == "bar" )
			{
				chartInfo.title = {"text":chartTitle,"margin":30,"style":{"color":"#000000","fontWeight":"bold","fontSize":"25px"}};
				chartInfo.chart		 = {"type":'bar',"backgroundColor":null};
				chartInfo.xAxis		 = {"categories":['결과']};
				chartInfo.yAxis		 = {"min":0,"title":{"text":""}};
				chartInfo.tooltip	       = {"enabled":false};
				chartInfo.plotOptions   = {"series":{"stacking":"percent","dataLabels":{"enabled":true,"useHTML":true,"format":'<div class="hani_quiz_chart_bar"><div class="name">{series.name}</div><div class="percent">{point.percentage:.1f}%</div><div class="count">({point.y}명)</div></div>'}}};
				chartInfo.series		= chartData;
			}

			objQuizRBase.find(".quiz-a-img").highcharts(chartInfo);
		}
	};

	function	shareHaniQuiz2Facebook(obj)
	{
		var     objA    = jQuery(obj);
		var     link    = objA.attr("href") ? objA.attr("href") : url;
		if ( link )
		{
			var     popup   = window.open(link, "haniPopupWindow", "width=800,height=600,scrollbars=yes,resizable=yes");
		if( popup )
		{
			popup.focus();
		}
		return false;
		}
		else
		{
			return  true;
		}
	};

	if ( window.jQuery )
	{
		startHaniQuiz();
	}
	else
	{
		var     objHead	 = null;
		var     objHeadList     = document.getElementsByTagName("head");
		if ( objHeadList.length )
		{
			objHead = objHeadList[0];
		}
		else
		{
			var     objScriptList   = document.getElementsByTagName("script");
			if ( objScriptList.length )
			{
				objHead = objScriptList[0].parentElement;
			}
			else
			{
				objHead = document.body ? document.body : document;
			}
		}

		if ( objHead )
		{
			var     scriptTag	       = document.createElement("script");
			scriptTag.src	   = "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js";
			scriptTag.async	 = 1;
			scriptTag.onload	= startHaniQuiz;
			objHead.appendChild(scriptTag);
		}
	}