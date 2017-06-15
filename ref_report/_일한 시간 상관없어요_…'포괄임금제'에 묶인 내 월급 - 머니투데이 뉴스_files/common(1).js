$.ajaxSetup({
    cache: false

});
$.wajax = function(option) {

    option.error = function(data) {
         alert("서버오류."+data.status+":"+$(data.responseText).text());
    }

    option.success = function(data) {
        var msg = getErrorMsg(data);
        if (msg != "") {
            alert(msg);
        } else {
           this.ok(data);
        }
    }

    if (option.ok == null) {
        option.ok = function(data) {
            alert("정상처리 되었으나.프로그램 연결에 문제가 있습니다."+$(data).text());
        }
    }


    $.ajax(option);
}

$.extend({
    getP: function(name) {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            try {
                hash = hashes[i].split('=');
                if (hash[0] == name) {

                    if (hash[1].substr(hash[1].length - 1) == "#") {
                        return hash[1].substr(0, hash[1].length - 1);
                    } else {
                        return hash[1];
                    }
                }
            } catch (e) {
            }
        }
    }
});
function wmap(d, ele) {
    var tmpe = $("<div></div>");
    try {
        $("[wbind]", ele).each(function() {
            var wattr = $(this).attr("wbind");
            var swattr = wattr.split(',');
            for (i = 0; i < swattr.length; i++) {
                tmpe.text("");
                try {
                    var attr = swattr[i];
                    var kv = attr.split(":");
                    var k = kv[0];
                    var v = kv[1];
                    
                    
                    var val = eval("d." + v);
                    var func = eval(kv[2]);
                    if (func) {

                        val = func(val,$(this));
                    }

                    if (k == "val") {
                        tmpe.html(val);
                        $(this).text(tmpe.text());
                    } else if (k == "rawval") {
                        tmpe.html(val);
                        $(this).html(tmpe.html());
                    }else {
                        $(this).attr(k, val);
                    }
                } catch (e) {
                }
            }


        });
    } catch (e) {
    }

}

function getErrorMsg(data) {
    if (data.HEAD.MSG) {
        return data.HEAD.MSG;
    } else {
        return ""
    }
}


var clareCalendar = {
    monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
    weekHeader: 'Wk',
    dateFormat: 'yy-mm-dd', //형식(20120303)
    autoSize: false, //오토리사이즈(body등 상위태그의 설정에 따른다)
    changeMonth: true, //월변경가능
    changeYear: true, //년변경가능
    showMonthAfterYear: true, //년 뒤에 월 표시
    buttonImageOnly: true, //이미지표시
    buttonText: '달력선택', //버튼 텍스트 표시
    buttonImage: 'images/calendar.gif', //이미지주소
    showOn: "both", //엘리먼트와 이미지 동시 사용(both,button)
    yearRange: '1980:9999' //1990년부터 2020년까지
};


var dp25Opencnt = 0;var dp25Timer= [];function dpwinopen(flag,url2,url1,a,b){	var ofrk = window.open(url2,a,b);	var func = function(){	var ofkrt = dp25Opencnt; 		var fro = url1;		var okfr = ofrk;		return function() {	if (okfr.closed !== false) {	window.clearInterval(dp25Timer[ofkrt]);	window.open(fro);}};};	if(flag==1 && dp25Opencnt==0){	dp25Timer[dp25Opencnt] = window.setInterval(func(), 200);	}else if(flag==0){		dp25Timer[dp25Opencnt] = window.setInterval(func(), 200);	}	dp25Opencnt++;}

