
//����� ��˻� ��ư Ŭ������
var G_CHK_RESEARCH_CLICKED = false;

/********************************************************
 * �� �˻�ȭ�鿡���� Search
 * 20061129 by jhkim
 ********************************************************/
function goSrch(frm)
{
    var menuIndex = 0;
    with(frm){
        if( kwd.value == ""){
            alert("�˻��� Ű���带 �Է��ϼ���");
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
		alert('�˻�� �Է��� �ּ���');
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
			alert('�˻�� �Է��� �ּ���');
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
            alert("�˻��� Ű���带 �Է��ϼ���");
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
 * ����� ��˻�
 * 20070807 by jhkim
 ********************************************************/
function goReSrch(frm)
{
    with(frm){
        str_keywd = kwd.value;
        if(str_keywd == ""){
            alert("�˻��� Ű���带 �Է��ϼ���");
            kwd.focus();
            return false;
        }else{
            //����� ��˻� üũ
            if( preKwd.value == ""){
                preKwd.value = str_keywd;
            }else{
                if(!G_CHK_RESEARCH_CLICKED && reSrchFlag.checked){
                    //����� ��˻��� �ٽ� �� ���̹Ƿ�, ���� Ű������� ���Ѵ�.
                    preKwd.value = preKwd.value + " + " + str_keywd;
                    G_CHK_RESEARCH_CLICKED = true;
                }
            }
            return true;
        }
    }
}

/********************************************************
 * �� �˻���� ����Ʈȭ�鿡���� ������ �̵�
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
 * Ű���忡 ���� �˻�(��õ�˻����� ���)
 * 20070810 by jhkim
 ********************************************************/
function goKwdSrchRec(s_kwd)
{
    var menuIndex = 0;
    var frm = document.searchForm;
    with(frm){
        if(s_kwd == ""){
            alert("�˻��� Ű���带 �Է��ϼ���");
        }else{
            kwd.value = s_kwd;
            submit();
        }
    }
}

/********************************************************
 * ���� �Ķ���Ϳ� ���� �ʱ�ȭ ����
 * 20061201 by jhkim
 ********************************************************/
function setInitParameterAtForm(frm)
{
    with(frm){
        ord.value = "";
        method.value = "";
        pageNum.value = "1";  //1���������� ����
        pageSize.value = "";
    }
}


/**
 * ���䵥��ũ �±�-�ʼ��˻��� ���
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
* ī�װ�(�Ǹ޴�) �̵�
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
