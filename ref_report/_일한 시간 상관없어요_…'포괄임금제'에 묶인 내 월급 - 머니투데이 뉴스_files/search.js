
//결과내 재검색 버튼 클릭여부
var G_CHK_RESEARCH_CLICKED = false;

/********************************************************
 * 각 검색화면에서의 Search
 * 20061129 by jhkim
 ********************************************************/
function goSrch(frm)
{
    var menuIndex = 0;
    with(frm){
        if( kwd.value == ""){
            alert("검색할 키워드를 입력하세요");
            kwd.focus();
            return false;
        }else{
            
			if(category.value!='TOTAL'){
				action = 'search.html';
			}else{
				action = '/';
			}
			return true;
        }
    }
}


function showSearchOption(){
	if($("s_layer").style.display== 'none'){			
		$("s_layer").show();
		$("s_lable").addClassName("on");
	}else{
		$("s_layer").hide();
		$("s_lable").removeClassName("on");
		
	}
}

 function slayer_close(val,str){
	$("s_layer").style.display== 'none';
	$("s_lable").innerHTML = str;
	$("search_type").value = val;
	
}

function srchFocus()
{
	document.GNBsearchForm.kwd.style.backgroundImage = 'url()';
	frm = document.GNBsearchForm;
	frm.action = frm.baseAction.value; 
	frm.target = '_self'; 
}

function goSrchMain(frm){
	
if(frm.action == frm.baseAction.value){
	if(!frm.kwd.value){
		alert('검색어를 입력해 주세요');
		return false;
	}
}
	var search_type = frm.search_type.value;

	if(search_type =='m'){
		location.replace = 'http://search.mt.co.kr/?kwd='+frm.kwd.value+'&search_type='+search_type;
	}else if(search_type =='s'){
		location.replace = 'http://search.mt.co.kr/index_star.html?kwd='+frm.kwd.value+'&search_type='+search_type;
	}else{
		window.open('http://car.mt.co.kr/search/searchresult.html?seName='+frm.kwd.value);
		return false;
	}
	return true;
}


function goSrchMainStar(frm)
{
	if(frm.action == frm.baseAction.value){
		if(!frm.kwd.value){
			alert('검색어를 입력해 주세요');
			return false;
		}
	}
	var search_type = frm.search_type.value;

	var searchUrl = frm.baseAction.value;

	location.replace = searchUrl+'?kwd='+frm.kwd.value+'&search_type='+search_type;

	return true;
}


function goSrch2(frm)
{
    var menuIndex = 0;
    with(frm){
        if( kwd.value == ""){
            alert("검색할 키워드를 입력하세요");
            kwd.focus();
            return false;
        }else{
            
			if(category.value!='TOTAL'){
				action = 'search.html';
			}else{
				action = '/';
			}
			return true;
        }



    }
}

/********************************************************
 * 결과내 재검색
 * 20070807 by jhkim
 ********************************************************/
function goReSrch(frm)
{
    with(frm){
        str_keywd = kwd.value;
        if(str_keywd == ""){
            alert("검색할 키워드를 입력하세요");
            kwd.focus();
            return false;
        }else{
            //결과내 재검색 체크
            if( preKwd.value == ""){
                preKwd.value = str_keywd;
            }else{
                if(!G_CHK_RESEARCH_CLICKED && reSrchFlag.checked){
                    //결과내 재검색을 다시 한 것이므로, 이전 키워드들은 더한다.
                    preKwd.value = preKwd.value + " + " + str_keywd;
                    G_CHK_RESEARCH_CLICKED = true;
                }
            }
            return true;
        }
    }
}

/********************************************************
 * 각 검색결과 리스트화면에서의 페이지 이동
 * 20061129 by jhkim
 ********************************************************/
function gotoPage(num)
{
    with(document.searchForm){
        pageNum.value = num;
        submit();
    }
}

function showDetail(rowid)
{
    document.f2.rowId.value = rowid;
    document.f2.submit();
}

/********************************************************
 * 키워드에 의한 검색(추천검색에서 사용)
 * 20070810 by jhkim
 ********************************************************/
function goKwdSrchRec(s_kwd)
{
    var menuIndex = 0;
    var frm = document.searchForm;
    with(frm){
        if(s_kwd == ""){
            alert("검색할 키워드를 입력하세요");
        }else{
            kwd.value = s_kwd;
            submit();
        }
    }
}

/********************************************************
 * 폼의 파라미터에 대한 초기화 수행
 * 20061201 by jhkim
 ********************************************************/
function setInitParameterAtForm(frm)
{
    with(frm){
        ord.value = "";
        method.value = "";
        pageNum.value = "1";  //1페이지에서 시작
        pageSize.value = "";
    }
}


/**
 * 포토데스크 태그-초성검색시 사용
 * */
function searchInitial( str) {
	var f = document.forms["searchForm"];
	with(f) {
		f.srchFd.value = "I";
		f.kwd.value = str;
		f.pageNum.value = 1;
		f.submit();
	}
}

/**
* 카테고리(탭메뉴) 이동
* @param str
*/
function goCategory( str ) {
	var f = document.forms["searchForm"];
	f.category.value = str;
	f.pageNum.value = 1;
	f.submit();
}


function setDetailSrch( ) {
	if ( document.getElementById('detailSrch').style.display == "" ) {
		document.getElementById('detailSrch').style.display = "none";
	} else {
		document.getElementById('detailSrch').style.display = "";
	}
}

function showInputBox( val ) {
	if ( val == "IN" ) {
		document.getElementById('inputBox').style.display = "" ;
	} else {
		document.getElementById('inputBox').style.display = "none" ;
	}
}
//EOF.
