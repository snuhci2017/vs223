var vote = {
	voteCheck:function(replyform, division, backurl){
		
	    if (typeof $j == 'function') var j = $j;
		else var j = jQuery;
	   	
		j.when( 
			j.post("/vote/ajax.vote.check.php")
		).then(function(voteCheck){
			//alert(voteCheck);

			var voteCheckArr = voteCheck.split('|');
			var voteFlag = voteCheckArr[0];     // �Ǹ��� ���࿩��
			var voteType = voteCheckArr[1];     // �Ǹ��� ����(@C ��Ⱥ� �Ǹ� @D ���)
			var voteCode = voteCheckArr[2];     // ��Ⱥ� ����ڵ�
			
			
			var voteName = voteCheckArr[3];		// �����̸�
			var voteDate = voteCheckArr[4];		// ���űⰣ
			var voteCertName = voteCheckArr[5]; // ��Ⱥη� ���� �޾ƿ� �Ǹ� 
			
			
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
			
			// ��� 
			if(voteFlag == '1' && voteType == 'D'){
				var close = '';
				close += '<div class = "voteBox">';
				close += '<p class = "voteInfo">';
				close += '<strong class = "red">'+voteName+'('+voteDate+')���� �Խù� �ۼ��� �����մϴ�.</strong>';
				close += '</p>';
				close += '</div>';

				j('.vote-container').html(close);
				j(replyform).hide();
			}

			// �Ǹ���
			else if(voteFlag == '1' && voteType == 'C' && voteCode){
				var mogaha = '';
				var href = window.location.href;
				var queryString = href.split('?');
				

				mogaha += '<div class = "voteBox">';
				mogaha += '<div class = "voteInfo">';
				mogaha += voteName+'('+voteDate+')���� �����ĺ��ڿ� ���� ���� �Ǵ� �ݴ��� ���� �Խ��ϰ��� �� ��쿡�� �Խù��� <strong class = "red">\'�Ǹ���\'</strong>�ϼž� �մϴ�. <strong class = "under">�Ǹ�Ȯ�� �� �Խù��� �ۼ��ڰ� �Ķ������� ǥ��</strong>�Ǹ�, �Ǹ�Ȯ���� ���� ���� ���Ű��� ���� Ȥ�� �ݴ� �Խù��� �������� ��û �Ǵ� �������� �Ǵܿ� ���� ���Ƿ� ������ �� �ֽ��ϴ�. <br />';
				mogaha += '<strong class = "red">�� �� �Ǹ�Ȯ�� ���񽺴� ���ſ�Ⱓ('+voteDate+')���� �����˴ϴ�.</strong>';
				mogaha += '</div>';
				
				
				if(voteCertName)
					mogaha += '<p style = "text-align:center"><a class ="vote-btn">'+voteCertName+'�� �Ǹ�Ȯ�� �Ǿ����ϴ�.</a></p>';					
				else 
					mogaha += '<p style = "text-align:center"><a href = "/vote/vote_request.php?mogahaRPGB='+division+'&backurl='+backurl+'&'+queryString[1]+'" class ="vote-btn">�Ǹ�Ȯ�� �Ϸ�����</a></p>';				
				
				mogaha += '</div>';



				j('.vote-container').html(mogaha);
				
			}
			
		});
	}
}