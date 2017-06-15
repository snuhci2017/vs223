	$(document).ready(function() {	
		/*
		$('.kisa-sponsor-list li,.num_money_in_text').click(function(){
			$('.kisa-sponsor-list li').removeClass('check');
			$(this).addClass('check');
		});
		$('.item-none').click(function() {
			$('.num_money_in_text').focus();
			var user_money = $('#num_money_free').val();
			//default free select money
			if(user_money=='') {
				 $('#num_money_free').val('30,000');
			}
		});	*/
		$('.kisa-sponsor-list li,.num_money_in_text').click(function(){
			if($(this).hasClass('check')){
				$(this).find('.num_money_in_text').focus();
			} else {
				$(this).addClass('check').siblings().removeClass('check').find('.num_money_in_text').val('');
				$(this).find('.num_money_in_text').val('30,000');
			}
		});
	});	
	var rgx1 = /\D/g;  // /[^0-9]/g 와 같은 표현
	var rgx2 = /(\d+)(\d{3})/; 
	//numberformat comma get
	function remove_comma(inNum){
		var outNum = inNum.replace(rgx1,"");
		return outNum;
	}
	function getNumber(obj){
	     var num01;
	     var num02;
	     num01 = obj.value;
	     num02 = num01.replace(rgx1,"");
	     num01 = setComma(num02);
	     obj.value =  num01;
	}
	//numberformat comma set
	function setComma(inNum){
	     var outNum;
	     outNum = inNum; 
	     while (rgx2.test(outNum)) {
	          outNum = outNum.replace(rgx2, '$1' + ',' + '$2');
	      }
	     return outNum;
	}		
	function pop_center(w,h,tb,st,di,mb,sb,re) {
		//url
		var url = "http://cnspay.hani.co.kr/donate.jsp";
		var cw=screen.availWidth;     //화면 넓이
		var ch=screen.availHeight;    //화면 높이
		var sw=600;    //띄울 창의 넓이
		var sh=470;    //띄울 창의 높이
		var ml=(cw-sw)/2;   //가운데 띄우기위한 창의 x위치
		var mt=(ch-sh)/2;   //가운데 띄우기위한 창의 y위치		
		var position ='width='+sw+',height='+sh+',top='+mt+',left='+ml+',resizable=no,scrollbars=yes';
		
		var obj_radio_chk = $(':input[name=chk_box]:radio:checked');
	   	var input_price = obj_radio_chk.val();
	   	var input_item_no = obj_radio_chk.data("item_no");
	   	var input_select_no = obj_radio_chk.data("select_no");
		var input_price_free = $('#num_money_free').val();

		//free select money process
		if(input_price_free!="") {
			input_price = $('#num_money_free').val();
			input_select_no = 4;
			input_item_no = 'free';
		} 
	   	if(typeof input_price == 'undefined' || typeof input_item_no == 'undefined' || typeof input_select_no == 'undefined' || input_price==0 || input_price=='') {
	   		alert('아이템 선택 및 금액을 입력해주세요.');
	   		return false;
	   	}
	   	var pay_url = url + '?price=' + remove_comma(input_price) +'&item_no=' + input_item_no +'&select_no=' + input_select_no + '&article_no=' + aticle_no;
	    window.open( pay_url, 'news_pay', position);
	}
