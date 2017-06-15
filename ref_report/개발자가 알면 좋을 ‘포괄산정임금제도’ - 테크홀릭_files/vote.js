var vote = {
	voteCheck:function(replyform, division, backurl){
		
	    if (typeof $j == 'function') var j = $j;
		else var j = jQuery;
	   	
		j.when( 
			j.post("/vote/ajax.vote.check.php")
		).then(function(voteCheck){
			//alert(voteCheck);

			var voteCheckArr = voteCheck.split('|');
			var voteFlag = voteCheckArr[0];     // 실명제 진행여부
			var voteType = voteCheckArr[1];     // 실명제 형식(@C 행안부 실명 @D 폐쇄)
			var voteCode = voteCheckArr[2];     // 행안부 기관코드
			
			
			var voteName = voteCheckArr[3];		// 선거이름
			var voteDate = voteCheckArr[4];		// 선거기간
			var voteCertName = voteCheckArr[5]; // 행안부로 부터 받아온 실명 
			
			
			// css append 
			if(voteFlag == '1'){				
				var css = '';
				css += '<style type = "text/css">';
				css += '.voteBox, .voteBox *{';
				css += '	float:none;';
				css += '	margin: 0;';
				css += '	padding: 0;';
				css += '	border: 0;';
				css += '	font-size: 100%;';
				css += '	font: inherit;';
				css += '	vertical-align: baseline;';
				css += '}';		
				css += '.vote-container{margin:15px 0; clear:both;}';
				css += '.voteBox p{margin:0 !important}';
				css += '.voteBox{background-color:#eee; border:1px solid #dedede; padding:15px; clear:both}';
				css += '.voteBox .voteInfo{font-size:110%; line-height:1.6em; letter-spacing:1px; color:#8e783c; text-align:left}';
				css += '.voteBox .red{font-weight:bold; color:red}';
				css += '.voteBox .under{font-weight:bold; text-decoration:underline}';
				css += '.voteBox ul.voteFlag{margin-top:10px; text-align:center;}';
				css += '.voteBox ul.voteFlag li{display:inline-block;padding:0 10px; font-size:115%; color:#333;}';
				css += '.voteBox a.vote-btn{color:blue; font-size:1.4em; font-weight:bold; display:inline-block; margin:15px 0}';
				css += '</style>';
				j("body").append(css);
			}
			
			// 폐쇄 
			if(voteFlag == '1' && voteType == 'D'){
				var close = '';
				close += '<div class = "voteBox">';
				close += '<p class = "voteInfo">';
				close += '<strong class = "red">'+voteName+'('+voteDate+')동안 게시물 작성을 금지합니다.</strong>';
				close += '</p>';
				close += '</div>';

				j('.vote-container').html(close);
				j(replyform).hide();
			}

			// 실명제
			else if(voteFlag == '1' && voteType == 'C' && voteCode){
				var mogaha = '';
				var href = window.location.href;
				var queryString = href.split('?');
				

				mogaha += '<div class = "voteBox">';
				mogaha += '<div class = "voteInfo">';
				mogaha += voteName+'('+voteDate+')동안 정당후보자에 대한 지지 또는 반대의 글을 게시하고자 할 경우에는 게시물을 <strong class = "red">\'실명등록\'</strong>하셔야 합니다. <strong class = "under">실명확인 된 게시물은 작성자가 파란색으로 표시</strong>되며, 실명확인이 되지 않은 선거관련 지지 혹은 반대 게시물은 선관위의 요청 또는 관리자의 판단에 의해 임의로 삭제될 수 있습니다. <br />';
				mogaha += '<strong class = "red">※ 본 실명확인 서비스는 선거운동기간('+voteDate+')에만 제공됩니다.</strong>';
				mogaha += '</div>';
				
				
				if(voteCertName)
					mogaha += '<p style = "text-align:center"><a class ="vote-btn">'+voteCertName+'님 실명확인 되었습니다.</a></p>';					
				else 
					mogaha += '<p style = "text-align:center"><a href = "/vote/vote_request.php?mogahaRPGB='+division+'&backurl='+backurl+'&'+queryString[1]+'" class ="vote-btn">실명확인 하러가기</a></p>';				
				
				mogaha += '</div>';



				j('.vote-container').html(mogaha);
				
			}
			
		});
	}
}