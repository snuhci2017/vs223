		var aticle_no ="";
		var navigator_ua = navigator.userAgent;
		if( navigator_ua.match(/HANI_MOBILE_APP_TYPE\(IOS\)/i) =='HANI_MOBILE_APP_TYPE(IOS)' ) {
			IOS = "HANI_APP_IOS";
		}else if( navigator_ua.match(/HANI_MOBILE_APP_TYPE\(ANDROID\)/i) == 'HANI_MOBILE_APP_TYPE(ANDROID)'){
			IOS = "HANI_APP_ANDROID";
		}else if(navigator_ua.match(/FB_|NAVER|KAKAO|DAUM|FBIOS/i) != null) {
			if(navigator_ua.match(/iPod|iPhone|iPad/i) == null) {
				IOS = 'APP_ANDROID';
			} else {
				IOS = 'APP_IOS';
			}
		}else {
			IOS = 'WEB';
		}
		$(document).ready(function(){	
			$('.kisa-sponsor-list li,.num_money_in_text').click(function(){
				aticle_no = $(this).data("atc_id");
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
			var url = "http://cnspay.hani.co.kr/donatem.jsp";
			//var position ="width="+w+",height="+h+",left=" + ((screen.width-w)/2) + ",top=" + ((screen.height-h)/2) + ",toolbar="+tb+",directories="+di+",status="+st+",menubar="+mb+",scrollbars="+sb+",resizable="+re+"";

			var obj_radio_chk = $(':input[name=chk_box_'+aticle_no+']:radio:checked');
		   	var input_price = obj_radio_chk.val();
		   	var input_item_no = obj_radio_chk.data("item_no");
		   	var input_select_no = obj_radio_chk.data("select_no");
			var input_price_free = $('#num_money_free_'+aticle_no).val();

			//free select money process
			if(input_price_free!="") {
				input_price = $('#num_money_free_'+aticle_no).val();
				input_select_no = 4;
				input_item_no = 'free';
			} 
		   	if(typeof input_price == 'undefined' || typeof input_item_no == 'undefined' || typeof input_select_no == 'undefined' || input_price==0 || input_price=='') {
		   		alert('아이템 선택 및 금액을 입력해주세요.');
		   		return false;
		   	}
		   	var pay_url = url + '?price=' + remove_comma(input_price) +'&item_no=' + input_item_no +'&select_no=' + input_select_no + '&article_no=' + aticle_no;
			//mobile popup not use => _blank
		   	window.open( pay_url, '_blank');
		}
		//pop_center() 함수 업그레이드

	    function OnCnspayWebViewCall(){
			url = "http://cnspay.hani.co.kr/donatem.jsp";
			//url = "http://cnspay.hani.co.kr/test_donatem.jsp";
			obj_radio_chk = $(':input[name=chk_box_'+aticle_no+']:radio:checked');
		   	input_price = obj_radio_chk.val();
		   	input_item_no = obj_radio_chk.data("item_no");
		   	input_select_no = obj_radio_chk.data("select_no");
			input_price_free = $('#num_money_free_'+aticle_no).val();

			//free select money process
			if(input_price_free!="") {
				input_price = $('#num_money_free_'+aticle_no).val();
				input_select_no = 4;
				input_item_no = 'free';
			} 
		   	if(typeof input_price == 'undefined' || typeof input_item_no == 'undefined' || typeof input_select_no == 'undefined' || input_price==0 || input_price=='') {
		   		alert('아이템 선택 및 금액을 입력해주세요.');
		   		return false;
		   	}
		   	pay_url = url + '?price=' + remove_comma(input_price) +'&item_no=' + input_item_no +'&select_no=' + input_select_no + '&article_no=' + aticle_no;
			//mobile popup not use => _blank
			if(IOS=='APP_IOS') {
		    	var openAt = new Date;
		    	setTimeout(
		    	 	function() {
		    	 		if (new Date - openAt < 1000)
		    	 			goAppStoreOrPlayStore();
	    	 				
		    	 	}, 500);
				var appUriScheme = "haniurlscheme://"+encodeURIComponent(pay_url);
				document.location.href = appUriScheme;
			} else if(IOS=='APP_ANDROID') {
				
            	var appUriScheme = "haniurlscheme://info?url="+encodeURIComponent(pay_url);
				var scheme = appUriScheme
                var fallbackURL = "market://details?id=Hani.nemo.huyu";
                var iframe = document.createElement('IFRAME'),
                start;
                iframe.style.display = 'none';
                iframe.src = scheme;
                document.body.appendChild(iframe);

                start = +new Date();
                setTimeout(function() {
                    var now = +new Date();
                    if (now - start < 2000) {
                        location.href = fallbackURL;
                    }
                }, 500);

	    	} else if(IOS=='HANI_APP_IOS') {
				window.location="jscall://OnCnspayWebViewCall_"+encodeURIComponent(pay_url);
			} else if(IOS=='HANI_APP_ANDROID') {
		    	window.Android.OnCnspayWebViewCall(pay_url);
			} else {
				//case mobile web
				window.open( pay_url, '_blank');
			}
	    }
	    function goAppStoreOrPlayStore() {
	    	var storeURL ="";
	    	if(IOS=='HANI_APP_IOS' || IOS=='APP_IOS') {
	    		//storeURL = "http://itunes.apple.com/app/id420600963?mt=8";
	    		storeURL =  "https://fb.me/1246573228789299";
	    	} else {
	    		storeURL = "https://play.google.com/store/apps/details?id=Hani.nemo.huyu";
	    	}
	    	location.replace(storeURL);
	    } 
	    function executeAppOrGoStore() {
	    	var openAt = new Date;
	    	setTimeout(
	    	 	function() {
	    	 		if (new Date - openAt < 1000)
	    	 			goAppStoreOrPlayStore();
	    	 	}, 500);
	    	 OnCnspayWebViewCall();
	    }