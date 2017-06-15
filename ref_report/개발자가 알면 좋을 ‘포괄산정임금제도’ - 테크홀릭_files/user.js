/*---------------------------------------------------------------------------------------------
                                      JAVASCRIPT CODE
  ---------------------------------------------------------------------------------------------
	function name						| description				| use process
  ---------------------------------------------------------------------------------------------
	checkMotion()	                  	| 약관 동의 검사         			| 회원가입
	memberCheck()						| 주민등록번호로 중복 가입 검사	| 회원가입
	findId()							| ID 중복 검사				| 회원가입
	findNickname()						| 필명 중복 검사				| 회원가입·정보수정
	findAddress()						| 주소 검색					| 회원가입·정보수정
	memberSubmit()						| 회원가입 입력 항목 검사			| 회원가입
	checkNum()							| 주민번호 유효성 검사			| 회원가입·정보수정
	memberModSubmit()					| 회원 정보수정 입력 항목 검사		| 정보수정
	bbsWriteSubmit()					| 게시물 등록 검사				| 게시판
	articlePrint()						| 인쇄창 오픈					| 기사인쇄
	moveNext()					| 포커스 자동 이동				| 회원가입
  ---------------------------------------------------------------------------------------------*/

// 포커스이동
var next_go = true;
var cur_val = null;
function moveNext(id_from,id_to,maxSize) {

	var cur = document.getElementById(id_from).value;
	curSize = cur.length;

	if (curSize == maxSize) {
		if(next_go || cur_val != cur)
		{
			cur_val = cur;
			next_go = false;
			document.getElementById(id_to).focus();
		}
		return true;
	}
	next_go = true;
}




/*---------------------------------------------------------------------------------------------
@ 함수 이름: checkAgree()
@ 함수 설명: 변경된 개인정보취급방침 적용을 위한 동의 체크여부를 확인한다.
 - 이용약관에 동의
 - 수집하는 개인정보 항목에 동의
 - 개인정보의 수집 및 이용목적에 동의
 - 개인정보의 보유 및 이용기간에 동의
@ 작성자: 박예진
@ 작성일 : 2008-05-20
  ---------------------------------------------------------------------------------------------*/
function checkAgree() {
	var form = document.memberAgree;

	if( document.getElementById("check1").checked && document.getElementById("check2").checked) {
		form.submit();
	} else {
		alert("이용약관과 개인정보 수집 및 이용에 대한 안내에 모두 동의해 주세요.");
		return;
	}
}




/*
* 컴폴더 등 개인정보취급동의
* 작성자 : 박예진 (2008-10-29)
*/
function checkAgreeSingle() {
	var form = document.agreeCheck;
	form.submit();

	/*
	if( document.getElementById("agreeCheck").checked ) {
		form.submit();
	}
	else
	{
		alert("개인정보보호를 위한 이용자 동의사항을 읽고 동의해 주세요.");
		return;
	}
	*/
}




// 약관 동의 검사
function checkMotion() {
	var form = document.memberRegInfo;

	if( form.motion.checked == true ) {
		form.submit();
	} else {
		alert("이용약관 및 개인정보취급방침에 동의 하셔야 회원에 가입 하실수 있습니다.");
		return;
	}
}


// 주민등록번호로 중복 가입 검사
function memberCheck() {
	var form = document.memberRegInfo;
	var flag = true;

	var user_name = form.user_name.value;
	var jcode1 = form.jcode1.value;
	var jcode2 = form.jcode2.value;

	if( !user_name || !jcode1 || !jcode2 ) {
		alert( '정보를 바르게 입력해 주세요.' );
		flag = false;
		return;
	}

	if( flag ) {
		window.open( '/member/memberCheck.html?user_name=' + user_name + '&jcode1=' + jcode1 + '&jcode2=' + jcode2, 'memberCheck', 'width=310, height=168, scrollbars=no' );
	}
}



// 이메일로 중복 가입 검사
function CheckMember() {
	var form = document.memberRegInfo;
	var flag = true;

	var user_name = form.user_name.value;
	var email = form.email.value;

	if( !user_name || !email ) {
		alert( "정보를 바르게 입력해 주세요." );
		flag = false;
		return;
	}

	if( flag ) {
		window.open( "/member/memberCheck.html?user_name=" + user_name + "&email=" + email, "memberCheck", "width=310, height=168, scrollbars=no" );
	}
}



// ID 중복 검사
function findId() {
	var form = document.memberRegForm;
	var flag = 0;

	var user_id = form.user_id.value;

	if(!user_id) {
		alert('정보를 바르게 입력해 주세요.');
		flag=1;
		return;
	}

	if(flag == 0) {
		window.open('/member/findId.html?user_id='+user_id, 'findid', 'width=310,height=168,scrollbars=no');
	}
}


// 필명 중복 검사
function findNickname() {
	var form = document.memberRegForm;
	var flag = 0;

	var nickname = form.nickname.value;

	if(!nickname) {
		alert('정보를 바르게 입력해 주세요.');
		flag=1;
		return;
	}

	if(flag == 0) {
		window.open('/member/findNickname.html?nickname='+nickname, 'findNickname', 'width=310,height=168,scrollbars=no');
	}
}


// 주소 검색
function findAddress() {
	window.open('/member/findAddress.html', 'findAddress', 'width=467,height=300,scrollbars=yes');
}


// 회원가입 항목 검사
function memberSubmit() {
	var form = document.memberRegForm;
	var flag = 0;



	if(!form.user_name.value) {
		alert("성명을 바르게 입력하세요.");
        form.user_name.focus();
        flag=1;
		return;
	} else if(!form.user_id.value) {
		alert("아이디를 바르게 입력하세요.");
		form.user_id.focus();
    	flag=1;
		return;
	}else if(!form.checkMember.checked) {
    	alert("아이디 중복확인을 해주세요");
        form.user_id.focus();
        flag=1;
		return;
	} else if(!form.passwd1.value) {
    	alert("비밀번호를 바르게 입력하세요.");
        form.passwd1.focus();
        flag=1;
		return;
	} else if(!form.passwd2.value) {
       	alert("비밀번호를 바르게 입력하세요.");
      	form.passwd2.focus();
       	flag=1;
		return;
	} else if(form.passwd1.value != form.passwd2.value) {
     	alert("비밀번호가 일치하지 않습니다.");
      	form.passwd1.focus();
       	flag=1;
		return;
  	/*} else if(form.passwd_hint.value == "NOTSET") {
     	alert("질문을 선택해 주세요.");
       	form.passwd_hint.focus();
      	flag=1;
		return;
  	} else if(!form.passwd_response.value) {
     	alert("질문의 답을 바르게 입력하세요.");
      	form.passwd_response.focus();
      	flag=1;
		return;*/
 	} else if(!form.email.value) {
        alert("이메일을 바르게 입력하세요.");
    	form.email.focus();
      	flag=1;
		return;
	/*
	} else if(!form.addcode1.value) {
      	alert("우편번호를 바르게 입력하세요.");
      	form.addcode1.focus();
      	flag=1;
		return;
	} else if(!form.addcode2.value) {
      	alert("우편번호를 바르게 입력하세요.");
       	form.addcode2.focus();
       	flag=1;
		return;
	} else if(!form.address1.value) {
      	alert("주소를 바르게 입력하세요.");
    	form.address1.focus();
    	flag=1;
		return;
	} else if(!form.address2.value) {
     	alert("나머지 주소를 바르게 입력하세요.");
       	form.address2.focus();
       	flag=1;
		return;
 	} else if(!form.tel2.value) {
     	alert("연락처를 바르게 입력하세요.");
       	form.tel2.focus();
       	flag=1;
		return;
	} else if(!form.tel3.value) {
       	alert("연락처를 바르게 입력하세요.");
       	form.tel3.focus();
      	flag=1;
		return;
	*/
	} else if(hex_md5(form.writekey.value) != md5_norobot_key) {
       	alert("자동등록방지용 글자를 바르게 입력하세요.");
      	form.writekey.focus();
       	flag=1;
		return;
	}

	if(flag == 0) {
    	form.submit();
	}

  	return;
}


// 14세 회원가입 항목 검사
function memberSubmit14() {
	var form = document.memberRegForm;
	var flag = 0;

	//var jj1 = form.parent_regno1.value;
	//var jj2 = form.parent_regno2.value;

	if(!form.user_name.value) {
		alert("성명을 바르게 입력하세요.");
        form.user_name.focus();
        flag=1;
		return;
	} else if(!form.user_id.value) {
		alert("아이디를 바르게 입력하세요.");
		form.user_id.focus();
    	flag=1;
		return;
	}else if(!form.checkMember.checked) {
    	alert("아이디 중복확인을 해주세요");
        form.user_id.focus();
        flag=1;
		return;
	/*
	} else if(!form.nickname.value) {
    	alert("필명을 바르게 입력하세요.");
        form.nickname.focus();
        flag=1;
		return;
	*/
	} else if(!form.passwd1.value) {
    	alert("비밀번호를 바르게 입력하세요.");
        form.passwd1.focus();
        flag=1;
		return;
	} else if(!form.passwd2.value) {
       	alert("비밀번호를 바르게 입력하세요.");
      	form.passwd2.focus();
       	flag=1;
		return;
	} else if(form.passwd1.value != form.passwd2.value) {
     	alert("비밀번호가 일치하지 않습니다.");
      	form.passwd1.focus();
       	flag=1;
		return;
  	/*} else if(form.passwd_hint.value == "NOTSET") {
     	alert("질문을 선택해 주세요.");
       	form.passwd_hint.focus();
      	flag=1;
		return;
  	} else if(!form.passwd_response.value) {
     	alert("질문의 답을 바르게 입력하세요.");
      	form.passwd_response.focus();
      	flag=1;
		return;*/
 	} else if(!form.email.value) {
        alert("이메일을 바르게 입력하세요.");
    	form.email.focus();
      	flag=1;
		return;
	}
	/*
	else if(!form.addcode1.value) {
      	alert("우편번호를 바르게 입력하세요.");
      	form.addcode1.focus();
      	flag=1;
		return;
	} else if(!form.addcode2.value) {
      	alert("우편번호를 바르게 입력하세요.");
       	form.addcode2.focus();
       	flag=1;
		return;
	} else if(!form.address1.value) {
      	alert("주소를 바르게 입력하세요.");
    	form.address1.focus();
    	flag=1;
		return;
	} else if(!form.address2.value) {
     	alert("나머지 주소를 바르게 입력하세요.");
       	form.address2.focus();
       	flag=1;
		return;
 	} else if(!form.tel2.value) {
     	alert("연락처를 바르게 입력하세요.");
       	form.tel2.focus();
       	flag=1;
		return;
	} else if(!form.tel3.value) {
       	alert("연락처를 바르게 입력하세요.");
       	form.tel3.focus();
      	flag=1;
		return;
	}
	*/

	if(!form.parent_name.value) {
		alert("부모님 성함을 바르게 입력하세요.");
        form.parent_name.focus();
        flag=1;
		return;
	}

	/*
	if(!form.parent_regno1.value) {
		alert('부모님 주민등록번호를 바르게 입력해 주세요.');
		form.parent_regno1.focus();
		flag=1;
		return;
	} else if(!form.parent_regno2.value) {
		alert('부모님 주민등록번호를 바르게 입력해 주세요.');
		form.parent_regno2.focus();
		flag=1;
		return;
	} else {
		isNum1 = checkNum(jj1);
		isNum2 = checkNum(jj2);

		if(!isNum1 || !isNum2) {
			alert('주민등록번호는 숫자만 가능합니다.');
			form.parent_regno1.focus();
			flag=1;
			return;
		} else {
			if(jj1.length != 6) {
				alert('주민등록번호의 자리수가 틀립니다.');
				form.parent_regno1.focus();
				flag=1;
				return;
			} else if(jj2.length != 7) {
				alert('주민등록번호의 자리수가 틀립니다.');
				form.parent_regno2.focus();
				flag=1;
				return;
			}
		}

	   	var a1=jj1.substring(0,1)
	   	var a2=jj1.substring(1,2)
	   	var a3=jj1.substring(2,3)
	   	var a4=jj1.substring(3,4)
	   	var a5=jj1.substring(4,5)
	   	var a6=jj1.substring(5,6)

		var check_digit=a1*2+a2*3+a3*4+a4*5+a5*6+a6*7

	   	var b1=jj2.substring(0,1)
	   	var b2=jj2.substring(1,2)
	   	var b3=jj2.substring(2,3)
	   	var b4=jj2.substring(3,4)
	   	var b5=jj2.substring(4,5)
	   	var b6=jj2.substring(5,6)
	   	var b7=jj2.substring(6,7)

	   	var check_digit=check_digit+b1*8+b2*9+b3*2+b4*3+b5*4+b6*5

	   	check_digit = check_digit%11
	   	check_digit = 11 - check_digit
	   	check_digit = check_digit%10

	   	if (check_digit != b7) {
			alert('주민등록번호를 바르게 입력해 주세요.');
			form.parent_regno1.focus();
			flag=1;
			return;
	   	}
	}
	*/

	if(form.parent_email.value=="") {
		alert("부모님 이메일을 입력하세요");
		form.parent_email.focus();
		flag=1;
		return;
	}

	if(hex_md5(form.writekey.value) != md5_norobot_key) {
       	alert("자동등록방지용 글자를 바르게 입력하세요.");
      	form.writekey.focus();
       	flag=1;
		return;
	}

	if(flag == 0) {
    	form.submit();
	}

  	return;
}


// 주민등록 번호 검사
function checkNum(tocheck) {
	var isnum = true;
    if (( tocheck ==null ) || ( tocheck == "" )) {
		isnum = false;
        return isnum;
    }

    for (var j= 0 ; j< tocheck.length; j++ ) {
        if ( ( tocheck.substring(j,j+1) != "0" ) &&
             ( tocheck.substring(j,j+1) != "1" ) &&
             ( tocheck.substring(j,j+1) != "2" ) &&
             ( tocheck.substring(j,j+1) != "3" ) &&
             ( tocheck.substring(j,j+1) != "4" ) &&
             ( tocheck.substring(j,j+1) != "5" ) &&
             ( tocheck.substring(j,j+1) != "6" ) &&
             ( tocheck.substring(j,j+1) != "7" ) &&
             ( tocheck.substring(j,j+1) != "8" ) &&
             ( tocheck.substring(j,j+1) != "9" ) ) {
             isnum = false;
        }
    }
    return isnum;
}


// 회원 정보수정 항목 검사
function memberModSubmit() {
	var form = document.memberRegForm;
	var flag = 0;

	/*
	if(!form.nickname.value) {
    	alert("필명을 바르게 입력하세요.");
        form.nickname.focus();
        flag=1;
		return;
	} else
	*/
	/*
	if(!form.passwd1.value) {
    	alert("비밀번호를 바르게 입력하세요.");
        form.passwd1.focus();
        flag=1;
		return;
	} else if(!form.passwd2.value) {
       	alert("비밀번호를 바르게 입력하세요.");
      	form.passwd2.focus();
       	flag=1;
		return;
	} else if(form.passwd1.value != form.passwd2.value) {
     	alert("비밀번호가 일치하지 않습니다.");
      	form.passwd1.focus();
       	flag=1;
		return;
  	} else
	*/
	/*if(form.passwd_hint.value == "NOTSET") {
     	alert("질문을 선택해 주세요.");
       	form.passwd_hint.focus();
      	flag=1;
		return;
  	} else if(!form.passwd_response.value) {
     	alert("질문의 답을 바르게 입력하세요.");
      	form.passwd_response.focus();
      	flag=1;
		return;
 	} else */
	if(!form.email.value) {
        alert("이메일을 바르게 입력하세요.");
    	form.email.focus();
      	flag=1;
		return;
	}
	/*
	else if(!form.addcode1.value) {
      	alert("우편번호를 바르게 입력하세요.");
      	form.addcode1.focus();
      	flag=1;
		return;
	} else if(!form.addcode2.value) {
      	alert("우편번호를 바르게 입력하세요.");
       	form.addcode2.focus();
       	flag=1;
		return;
	} else if(!form.address1.value) {
      	alert("주소를 바르게 입력하세요.");
    	form.address1.focus();
    	flag=1;
		return;
	} else if(!form.address2.value) {
     	alert("나머지 주소를 바르게 입력하세요.");
       	form.address2.focus();
       	flag=1;
		return;
 	} else if(!form.tel2.value) {
     	alert("연락처를 바르게 입력하세요.");
       	form.tel2.focus();
       	flag=1;
		return;
	} else if(!form.tel3.value) {
       	alert("연락처를 바르게 입력하세요.");
       	form.tel3.focus();
      	flag=1;
		return;
	}
	*/

	if(flag == 0) {
    	form.submit();
	}

  	return;
}


// 게시물 등록 검사
function bbsWriteSubmit( form )
{
	var flag = 0;

	if( !form.name.value ) {
      	alert("닉네임을 바르게 입력해 주세요.");
      	form.name.focus();
      	flag=1;
		return;
	} else if( !form.password.value ) {
      	alert("비밀번호를 바르게 입력해 주세요.");
      	form.password.focus();
      	flag=1;
		return;
	} else if( !form.title.value ) {
      	alert("제목을 바르게 입력해 주세요.");
      	form.title.focus();
      	flag=1;
		return;
	} else if( !form.content.value ) {
      	alert("내용을 바르게 입력해 주세요.");
      	form.content.focus();
      	flag=1;
		return;
	}

	if(flag == 0) {
    	form.submit();
	}

  	return;
}

// 게시물 자동등록방지 추가용 등록 검사
function bbsWriteSubmit2( form )
{
	var flag = 0;

	if( !form.name.value ) {
      	alert("닉네임을 바르게 입력해 주세요.");
      	form.name.focus();
      	flag=1;
		return;
	} else if( !form.password.value ) {
      	alert("비밀번호를 바르게 입력해 주세요.");
      	form.password.focus();
      	flag=1;
		return;
	} else if( !form.title.value ) {
      	alert("제목을 바르게 입력해 주세요.");
      	form.title.focus();
      	flag=1;
		return;
	} else if( !form.content.value ) {
      	alert("내용을 바르게 입력해 주세요.");
      	form.content.focus();
      	flag=1;
		return;
	} else if(!form.writekey.value) {
       	alert("자동등록방지용 글자를 입력하세요.");
      	form.writekey.focus();
       	flag=1;
		return;
	} else if(hex_md5(form.writekey.value) != md5_norobot_key) {
       	alert("자동등록방지용 글자를 바르게 입력하세요.");
      	form.writekey.focus();
       	flag=1;
		return;
	}

	if(flag == 0) {
    	form.submit();
	}

  	return;
}


// 앨범 등록 검사
function bbsAlbumWriteSubmit( form )
{
	var flag = 0;

	if( !form.name.value ) {
      	alert("닉네임을 바르게 입력해 주세요.");
      	form.name.focus();
      	flag=1;
		return;
	} else if( !form.password.value ) {
      	alert("비밀번호를 바르게 입력해 주세요.");
      	form.password.focus();
      	flag=1;
		return;
	} else if( !form.title.value ) {
      	alert("제목을 바르게 입력해 주세요.");
      	form.title.focus();
      	flag=1;
		return;
	} else if( !form.content.value ) {
      	alert("내용을 바르게 입력해 주세요.");
      	form.content.focus();
      	flag=1;
		return;
  	} else if( !form.uploadFile1.value && form.mode.value != "modify") {
		alert("등록할 파일을 선택하세요.");
   		form.uploadFile1.focus();
      	flag=1;
      	return;
	}

	if(flag == 0) {
    	form.submit();
	}

  	return;
}


// 앨범 등록 검사
function bbsAlbumWriteSubmit2( form )
{
	var flag = 0;

	if( !form.name.value ) {
      	alert("닉네임을 바르게 입력해 주세요.");
      	form.name.focus();
      	flag=1;
		return;
	} else if( !form.password.value ) {
      	alert("비밀번호를 바르게 입력해 주세요.");
      	form.password.focus();
      	flag=1;
		return;
	} else if( !form.title.value ) {
      	alert("제목을 바르게 입력해 주세요.");
      	form.title.focus();
      	flag=1;
		return;
	} else if( !form.content.value ) {
      	alert("내용을 바르게 입력해 주세요.");
      	form.content.focus();
      	flag=1;
		return;
  	} else if( !form.uploadFile1.value && form.mode.value != "modify") {
		alert("등록할 파일을 선택하세요.");
   		form.uploadFile1.focus();
      	flag=1;
      	return;
	} else if(!form.writekey.value) {
       	alert("자동등록방지용 글자를 입력하세요.");
      	form.writekey.focus();
       	flag=1;
		return;
	} else if(hex_md5(form.writekey.value) != md5_norobot_key) {
       	alert("자동등록방지용 글자를 바르게 입력하세요.");
      	form.writekey.focus();
       	flag=1;
		return;
	}

	if(flag == 0) {
    	form.submit();
	}

  	return;
}


// 기사 댓글 등록폼 검사
function articleReplySubmit(form)
{
	var flag = 0;

    if(!form.content.value) {
       	alert("내용을 바르게 입력하세요.");
      	form.content.focus();
       	flag=1;
		return;
	} else if(!form.name.value) {
		alert("이름을 바르게 입력하세요.");
		form.name.focus();
    	flag=1;
		return;
	} else if(!form.password.value) {
    	alert("비밀번호를 바르게 입력하세요.");
        form.password.focus();
        flag=1;
		return;
	}

	if(flag == 0) {
    	form.submit();
	}

  	return;
}

// 기사 댓글 비회원 등록폼 검사
function articleReplySubmit2(form)
{
	var flag = 0;

    if(!form.name.value) {
		alert("이름을 바르게 입력하세요.");
		form.name.focus();
    	flag=1;
		return;
	} else if(!form.password.value) {
    	alert("비밀번호를 바르게 입력하세요.");
        form.password.focus();
        flag=1;
		return;
	} else if(!form.writekey.value) {
       	alert("자동등록방지용 글자를 입력하세요.");
      	form.writekey.focus();
       	flag=1;
		return;
	} else if(hex_md5(form.writekey.value) != md5_norobot_key) {
       	alert("자동등록방지용 글자를 바르게 입력하세요.");
      	form.writekey.focus();
       	flag=1;
		return;
	} else if(!form.content.value) {
       	alert("내용을 바르게 입력하세요.");
      	form.content.focus();
       	flag=1;
		return;
	}

	if(flag == 0) {
    	form.submit();
	}

  	return;
}



/*
*	인쇄창 오픈
*/
function articlePrint( idxno )
{
	window.open('/news/articlePrint.html?idxno='+idxno, 'articlePrint', 'width=660,height=500,scrollbars=yes');
}


/*
*	메일보내기창 오픈
*/
function articleMail( idxno )
{
	window.open('/news/articleMail.html?idxno='+idxno, 'articleMail', 'width=660,height=500,scrollbars=yes');
}


/*
*	오류신고창 오픈
*/
function articleErr( idxno )
{
	window.open('/news/articleErr.html?idxno='+idxno, 'articleErr', 'width=660,height=500,scrollbars=yes');
}


/*
*	댓글신고창 오픈
*/
function articleSingo( idxno )
{
	window.open('/news/articleSingo.html?idxno='+idxno, 'articleSingo', 'width=660,height=500,scrollbars=yes');
}



/*
* 기사등록 검사
*/
function newsWriteFormSubmit( form )
{
	var flag = 0;


	if( !form.serial_number.value ) {
      	alert("호수를 바르게 입력하세요.");
      	form.serial_number.focus();
      	flag=1;
		return;
	} else if( !form.page.value ) {
      	alert("면정보를 바르게 입력하세요.");
      	form.page.focus();
      	flag=1;
		return;
	} else if( !form.sectionCode.value ) {
      	alert("섹션을 바르게 입력하세요.");
      	form.sectionCode.focus();
      	flag=1;
		return;
	} else if( !form.user_name.value ) {
      	alert("필자를 바르게 입력하세요.");
      	form.user_name.focus();
      	flag=1;
		return;
	} else if( !form.user_email.value ) {
      	alert("이메일을 바르게 입력하세요.");
      	form.user_email.focus();
      	flag=1;
		return;
	} else if( !form.title.value ) {
      	alert("제목을 바르게 입력하세요.");
      	form.title.focus();
      	flag=1;
		return;
	}

	if(flag == 0) {
		replaceSpanCss();
    	form.submit();
	}

  	return;
}

/* 백스페이스시 line-height 등 contents.css에 있는 style 삽입 버그처리 위해 */
function replaceSpanCss(){
	var _ckeditor=CKEDITOR.instances.FCKeditor1
		,data = _ckeditor.getData()
		,regexp = new RegExp("<span style=.*line\-height.*>(.*)<\/span>","i");
	if(data.match(regexp)) _ckeditor.setData(data.replace(regexp,"$1"));
}


// 사진등록 검사
function photoWriteFormSubmit( form )
{
	var flag = 0;


	if( form.mode.value != "modify" && !form.uploadFile1.value ) {
      	alert("이미지를 바르게 입력하세요.");
      	form.uploadFile1.focus();
      	flag=1;
		return;
	}

	if(flag == 0) {
    	form.submit();
	}

  	return;
}


var Init, OptValue = 100, GrayScaleValue = 0, InverseValue = 0, ComValue;

/*
// 편집기에 사진 삽입
function autoInsertImg(img, content, tbwidth, imgalign, imgname, idxno)
{
	var inHtml = "<table width=\""+tbwidth+"\" cellpadding=\"0\" cellspacing=\"0\" align=\""+imgalign+"\" border=\"0\"><tr><td width=\"10\">&nbsp;</td><td align=\"center\"><img src=\"/news/"+img+"\" border=\"1\"></td><td width=\"10\">&nbsp;</td></tr><tr><td colspan=\"3\" style='padding: 10px 10px 10px 10px'><font color=\"#000000\">"+content+"</font></td></tr></table>";
	parent.InsertHTML( inHtml );	// 편집창에 삽입

	invert(imgname);				// 썸네일 사진 역상 처리

	if(document.all) {
		parent.document.photoinvert.form.idxno.value = idxno;
		parent.document.photoinvert.form.submit();
	} else {
		var iframeObject =  parent.document.getElementById("photoinvert");
  		iframeObject.contentDocument.form.idxno.value = idxno;
	  	iframeObject.contentDocument.form.submit();
	}
}
*/

/*
// 편집기에 사진 삽입
function autoInsertImg(img, content, tbwidth, imgalign, imgname, idxno)
{
	var inHtml = "<table cellpadding=\"0\" cellspacing=\"0\" align=\""+imgalign+"\" border=\"0\"><tr><td width=\"10\">&nbsp;</td><td align=\"center\"><img src=\"/news/"+img+"\" border=\"1\"></td><td width=\"10\">&nbsp;</td></tr><tr><td colspan=\"3\" id=\"font_imgdown_"+idxno+"\" class=\"view_r_caption\">"+content+"</td></tr></table>";
	parent.InsertHTML( inHtml );	// 편집창에 삽입

	invert(imgname);				// 썸네일 사진 역상 처리

	if(document.all) {
		parent.document.photoinvert.form.idxno.value = idxno;
		parent.document.photoinvert.form.submit();
	} else {
		var iframeObject =  parent.document.getElementById("photoinvert");
  		iframeObject.contentDocument.form.idxno.value = idxno;
	  	iframeObject.contentDocument.form.submit();
	}
}
*/



// 편집기에 사진 삽입_New
function autoInsertImg(img, content, tbwidth, imgalign, imgname, idxno, rtn)
{
	if(imgalign == "left") var tbmargin = "margin-right:20px; ";
	else if(imgalign == "right") var tbmargin = "margin-left:20px; ";
	else tbmargin = "";


	var inHtml = "<table id=\"photo_"+idxno+"\" cellpadding=\"0\" cellspacing=\"0\" align=\""+imgalign+"\" border=\"0\" style=\""+tbmargin+"margin-bottom:20px;\"><tr><td align=\""+imgalign+"\"><img src=\"/news/"+img+"\" style=\"display:block;\" border=\"0\"></td></tr>";

	// 사진 설명이 있을 때만 필드 추가
	if(content) inHtml = inHtml + "<tr><td id=\"font_imgdown_"+idxno+"\" class=\"view_r_caption\">"+content+"</td></tr>";

	inHtml = inHtml + "</table>\r\n";

	if(rtn===true) return inHtml; 	// html 리턴형일때 태그 리턴하고 끝냄

	parent.InsertHTML( inHtml );	// 편집창에 삽입

	invert(imgname);				// 썸네일 사진 역상 처리

	if(document.all) {
		parent.document.photoinvert.form.idxno.value = idxno;
		parent.document.photoinvert.form.submit();
	} else {
		var iframeObject =  parent.document.getElementById("photoinvert");
  		iframeObject.contentDocument.form.idxno.value = idxno;
	  	iframeObject.contentDocument.form.submit();
	}
}


// 본문에 삽입한 경우 필터효과 처리
function invert( img )
{
	var temp_img = document.getElementById(img);

	if(document.all) {
		temp_img.style.filter = action();
		//temp_img.style.borderColor = "red";
	} else {
		temp_img.style.borderColor = "red";
	}
}


// 역상
function action()
{
	ComValue = 'alpha(opacity=100, style=3, finishopacity=' + OptValue +') '	;
	ComValue += ('Invert');
	return ComValue;
}


// rolling("div태그 id", 배너1개높이, 딜레이, 1칸이동속도, 0);
function rolling(div_id, banner_height, banner_delay, banner_speed, this_height) {
    var div_tag = document.getElementById(div_id);
    var a_tag, i;

    this_height ++;
    if(this_height < banner_height) {
        div_tag.style.top = -this_height;
        setTimeout("rolling('" + div_id + "', " + banner_height + ", " + banner_delay + ", " + banner_speed + ", " + this_height + ");", banner_speed);
    } else {
        a_tag = div_tag.getElementsByTagName("A");
        div_tag.appendChild(a_tag[0]);
        div_tag.style.top = 0;
        setTimeout("rolling('" + div_id + "', " + banner_height + ", " + banner_delay + ", " + banner_speed + ", 0);", banner_delay);
    }

    return true;
}


function findMyInfoId()
{
	var form = document.findId;
	var flag = 0;

	var user_name = form.user_name.value;
	var email = form.email.value;

	if(!user_name) {
		alert('정보를 바르게 입력해 주세요.');
		form.user_name.focus();
		flag=1;
		return;
	} else if(!email) {
		alert('정보를 바르게 입력해 주세요.');
		form.email.focus();
		flag=1;
		return;
	}

	if(flag == 0) {
		window.open('/member/findMyInfoId.html?user_name='+user_name+'&email='+email, 'findMyInfoId', 'width=370,height=140,scrollbars=no');
	}
}



function findMyInfoPw()
{
	var form = document.findPw;
	var flag = 0;

	if(!form.user_id.value) {
		alert('정보를 바르게 입력해 주세요.');
		form.user_id.focus();
		flag=1;
		return;
	} else if(!form.user_name.value) {
		alert('정보를 바르게 입력해 주세요.');
		form.user_name.focus();
		flag=1;
		return;
	} else if(!form.email.value) {
		alert('정보를 바르게 입력해 주세요.');
		form.email.focus();
		flag=1;
		return;
	}

	if(flag == 0) {
    	form.submit();
	}

  	return;
}



function findMyInfoPwHint()
{
	var form = document.findPw;
	var flag = 0;

	var user_id = form.user_id.value;
	var user_name = form.user_name.value;
	var email = form.email.value;
	//var passwd_response = form.passwd_response.value;

	if(!form.user_id.value) {
		alert('아이디를 바르게 입력해 주세요.');
		form.user_id.focus();
		flag=1;
		return;
	} else if(!form.user_name.value) {
		alert('이름을 바르게 입력해 주세요.');
		form.user_name.focus();
		flag=1;
		return;
	} else if(!form.email.value) {
		alert('이메일 주소를 바르게 입력해 주세요.');
		form.email.focus();
		flag=1;
		return;
	}

	if(flag == 0) {
		window.open('/member/findMyInfoPwHint.html?user_id='+user_id+'&user_name='+user_name+'&email='+email, 'findMyInfoPwHint', 'width=370,height=140,scrollbars=no');
	}

	return;
}


function reply_submit_check1() {

	var form = document.replyForm;
	var flag = 0;


	if(!form.name.value) {
		alert('작성자를 바르게 입력해 주세요.');
		flag=1;
		return false;
	} else if(!form.password.value) {
		alert('비밀번호를 바르게 입력해 주세요.');
		flag=1;
		return false;
	} else if(!form.writekey.value) {
       	alert("자동등록방지용 글자를 입력하세요.");
      	form.writekey.focus();
       	flag=1;
		return false;
	} else if(hex_md5(form.writekey.value) != md5_norobot_key) {
       	alert("자동등록방지용 글자를 바르게 입력하세요.");
      	form.writekey.focus();
       	flag=1;
		return false;
	} else if(!form.sub_comment.value) {
		alert('내용을 바르게 입력해 주세요.');
		flag=1;
		return false;
	}

	return true;

}

function reply_submit_check2() {

	var form = document.replyForm;
	var flag = 0;


	if(!form.name.value) {
		alert('작성자를 바르게 입력해 주세요.');
		flag=1;
		return false;
	} else if(!form.password.value) {
		alert('비밀번호를 바르게 입력해 주세요.');
		flag=1;
		return false;
	} else if(!form.sub_comment.value) {
		alert('내용을 바르게 입력해 주세요.');
		flag=1;
		return false;
	}

	return true;

}


var articleHeader = {

	// 헤더 네비게이션 생성
	setScroll:function(){		
		jQuery(window).scroll(function() {
			if (jQuery(this).scrollTop() > 300) {
				jQuery('#article-header-title').slideDown(300);
			} else {
				jQuery('#article-header-title').slideUp(300);
			}
		});			
	},
	

	// 기사이동
	move:function(mod, order_type, order_value, section_code, sub_section_code, serial_code){
		jQuery.post( "ajaxGetForwardIdxno.php", { mod: mod, order_type:order_type, order_value: order_value, section_code: section_code, sub_section_code: sub_section_code, serial_code: serial_code }, function( f_idxno ) {
			
			if(f_idxno){
				location.href = '/news/articleView.html?idxno='+f_idxno				
			}else{
				alert('기사가 존재하지 않습니다');
			}
			
		});
	}
	
}