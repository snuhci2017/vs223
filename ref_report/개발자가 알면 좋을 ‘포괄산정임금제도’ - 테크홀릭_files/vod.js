// 초기화
function VodReset() {
	document.vodWriteForm.reset();
}
  
// 동영상등록
function VodSubmit() {
	var flag=0;
	
	if(document.vodWriteForm.title.value=="") {
		alert("제목을 바르게 입력하세요.");
		document.vodWriteForm.title.focus();
		flag=1;
	} else if(document.vodWriteForm.url.value=="") {
		alert("링크를 바르게 입력하세요.");
		document.vodWriteForm.url.focus();
		flag=1;
	}
	
	if(flag==0) {
		document.vodWriteForm.submit();
	}
	return;
}

// 동영상 수정
function VodModSubmit() {
	var flag=0;
	
	if(document.vodWriteForm.title.value=="") {
		alert("제목을 바르게 입력하세요.");
		document.vodWriteForm.title.focus();
		flag=1;
	}else if(document.vodWriteForm.url.value=="") {
		alert("링크를 바르게 입력하세요.");
		document.vodWriteForm.url.focus();
		flag=1;
	}
	
	if(flag==0) {
		document.vodWriteForm.submit();
	}
	return;
}

// 동영상보기 - 테두리 안나오게
function vodView(url, width, height, autostart, showcontrols, showstatusbar) {
    var width_val = 320;
    var height_val = 240;
    if(width) width_val = width;
    if(height) height_val = height;

	str="<embed animationatstart=\"0\" autostart=\""+autostart+"\" displaybackcolor=\"black\" showcontrols=\""+showcontrols+"\" showstatusbar=\""+showstatusbar+"\" showtracker=\"1\" showpositioncontrols=\"0\" pluginspage=\"http://www.microsoft.com/korea/windows/windowsmedia/\" src=\""+url+"\" type=\"video/x-ms-asf-plugin\" height="+height_val+" width="+width_val+"></embed>";
	document.write(str);
}

// URL 복사
function CopyUrl(url) {
	window.clipboardData.setData('Text', url);
	alert("현재 URL이 복사되었습니다.\n\n게시판이나 메신저에서 Ctrl+v로 붙여넣을 수 있습니다.");
}

// 태그복사
function CopyTag(url) {
	tag="<embed src=\""+url+"\" type=\"video/x-ms-asf-plugin\"></embed>";
	window.clipboardData.setData('Text', tag);
	alert("현재 동영상 삽입태그가 복사되었습니다.\n\n게시판이나 메신저에서 Ctrl+v로 붙여넣을 수 있습니다.");
}

// 새창열기
function VodOpen(idxno, backUrl) {
	var url = '/vod/check.php?idxno=' + idxno+"&backUrl="+backUrl;
	window.open(url,'vod','width=720,height=515,scrollbars=yes');
}