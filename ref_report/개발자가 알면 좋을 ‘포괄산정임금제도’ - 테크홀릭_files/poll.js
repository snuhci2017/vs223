// 투표만 할 때 항목 체크
//기본은 쿠키 체크하고
function pollSubmit() {
	var form=document.voteForm;

	// 일단 종료일부터 체크해서 지난설문이면 메세지를 띄운다 - 시작	
	var end_date=form.end_date.value;	// 종료일

	// 오늘 날짜를 구합니다.
	var now=new Date();

	var Y=now.getYear(); //년
	var M=now.getMonth()+1; //월
	var D=now.getDate(); //일
	
	// 월이 한자리면 0을 붙여준다
	if(M <= 9) Mon="0"+M;
	else Mon=M;
	// 일이 한자리면 0을 붙여준다
	if(D <= 9) Day="0"+D;
	else Day=D;

	//Cutdate=end_date.split("-");
	//eval()

	var today=Y +"-"+ Mon +"-"+ Day

	if(end_date.value != "N") {
		if(end_date < today) {
			alert("투표가 종료되었습니다.");
			return false;
		}
	}	

	// 항목 선택했는지 체크
	var gr_checked = 0; 

	for(i=0; i<form.answer.length; i++) {
		if(form.answer[i].checked==true) {
			gr_checked=1;
			break;
		}
	}
	
	if(gr_checked==0) {
		alert("투표할 항목을 선택해주세요.");
		return false;
	} else {
		form.reply_mode.value="A";
	}
}


function pollReplySubmit(form, ans_type) {
	
	// 일단 종료일부터 체크해서 지난설문이면 메세지를 띄운다 - 시작
	var form=document.voteForm;
	
	var end_date=form.end_date.value;	// 종료일

	// 오늘 날짜를 구합니다.
	var now=new Date();

	var Y=now.getYear(); //년
	var M=now.getMonth()+1; //월
	var D=now.getDate(); //일
	
	// 월이 한자리면 0을 붙여준다
	if(M <= 9) Mon="0"+M;
	else Mon=M;
	// 일이 한자리면 0을 붙여준다
	if(D <= 9) Day="0"+D;
	else Day=D;

	//Cutdate=end_date.split("-");
	//eval()

	var today=Y +"-"+ Mon +"-"+ Day

	if(end_date.value != "N") {
		if(end_date < today) {
			alert("투표가 종료되었습니다.");
			return;
		}
	}
	
	
	// 투표항목체크
	if(ans_type=="A") {
		var gr_checked = 0; 
		for(i=0; i<form.answer2.length; i++) {
			if(form.answer2[i].checked==true) {
				gr_checked=1;
				break;
			}
		}

		if(gr_checked==0) {
			alert("찬/반 등록을 선택해주세요.");
			return;
		} else {
			form.reply_mode.value="B";
		}
	}
	
	var flag = 0;

    if(!form.name.value){
		alert("이름을 바르게 입력하세요.");
		form.name.focus();
    	flag=1;
		return;
	}else if(!form.password.value){
    	alert("비밀번호를 바르게 입력하세요.");
        form.password.focus();
        flag=1;
		return;
	}else if(!form.email.value){
    	alert("이메일을 바르게 입력하세요.");
        form.email.focus();
        flag=1;
		return;
	}else if(!form.title.value){
    	alert("제목을 바르게 입력하세요.");
        form.title.focus();
        flag=1;
		return;
	}else if(!form.content.value){
       	alert("내용을 바르게 입력하세요.");
      	form.content.focus();
       	flag=1;
		return;
	}

	form.reply_mode.value="B";

	if(flag == 0) {
		form.submit();
	}
}
