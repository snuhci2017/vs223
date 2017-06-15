//png ie6

var domain = 'mt.co.kr';

function setPng24(obj) {
    obj.width=obj.height=1;
    obj.className=obj.className.replace(/\bpng24\b/i,'');
    obj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+ obj.src +"',sizingMethod='image');"
    obj.src='';
    return '';
}


//��� MT ����Ʈ ������
var siteSlideFlag = false;
function mtSiteSlide(){
	if(siteSlideFlag){
		siteSlideFlag = false;
		document.getElementById("mtsite").style.display = 'none';
	}else{
		siteSlideFlag = true;
		document.getElementById("mtsite").style.display = 'block';
	}

}

//��� MT ���� ������
var serviceSlideFlag = false;
function serviceSlide(){
	if(serviceSlideFlag){
		serviceSlideFlag = false;
		document.getElementById("mtservice").style.display = 'none';
	}else{
		serviceSlideFlag = true;
		document.getElementById("mtservice").style.display = 'block';
	}
}

//��� �������� ������
var lifeSiteSlideFlag = false;
function lifeSiteSlide(){
	if(lifeSiteSlideFlag){
		lifeSiteSlideFlag = false;
		document.getElementById("lifeservice").style.display = 'none';
	}else{
		lifeSiteSlideFlag = true;
		document.getElementById("lifeservice").style.display = 'block';
	}

}

function dispObj( str ) 
{
	document.write( str );
}

function RollSet(str)
{
	var gSetChk        = true;
	var gSetObj        = null;
	var gRollSetObj    = null;
	var gRollChk       = false;

	var gArrDat        = new Array();
	if(str)
		var gArrCnt        = str;
	else
		var gArrCnt        = -1;
	var gArrCntBool    = false;
	var gArrTotCnt     = 0;
	var gMoveSpeed     = 1000;
	var gPauseTime     = 1000;
	var gPauseChk      = false;
	var gCurPos        = 15;
	var gEndPos        = 0;
	var gChkCnt        = 0;
	var gWordheight    = 15;
	var gOwordHeight   = 15;
	var gRwordHeight   = -1;
	var gWordSet       = false;
	var gRollType      = new Array('up','shine');
	var gRollSelect    = 'shine';

	var gTid1          = 0;
	var gTid2          = 0;

	this.Init = function ( setObj, data, moveSpeed, pauseTime, wrdHeight, RollObj, type, rWrdheight )
	{
		gSetObj     = setObj;
		gRollSetObj = RollObj;
		gArrDat     = data;
		gArrTotCnt  = gArrDat.length;

		if( gSetObj == null || gSetObj == '' || gSetObj == 'undefined' )                { gSetChk = false; return; }
		if( gRollSetObj == null || gRollSetObj == '' || gRollSetObj == 'undefined' )    { gSetChk = false; return; }
		if( gArrDat[0] == null || gArrDat[0] == '' || gArrDat[0] == 'undefined' )       { gSetChk = false; return; }

		if( moveSpeed != null && moveSpeed > 0 ) {
			gMoveSpeed = moveSpeed;
		}

		if( pauseTime != null && pauseTime > 0 ) {
			gPauseTime = pauseTime;
		}

		if( wrdHeight != null && wrdHeight > 0 ) {
			gWordheight  = wrdHeight;
			gOwordHeight = wrdHeight;
			gCurPos = wrdHeight;
		}

		if( rWrdheight != '' )
		{
			var gBw = rWrdheight.split(',');

			if( gBw[0] && gBw[1] )
			{
				if( navigator.appVersion.indexOf("MSIE") != -1 )
					gRwordHeight = gBw[0];
				else
					gRwordHeight = gBw[1];
			}
			else
			{
				gSetChk = false;
			}
		} else {
			gSetChk = false;
		}

		if( type != null && type != '' )
		{
			for(var i=0;i<gRollType.length;i++)
			{
				if( type == gRollType[i] )
				{
					gRollSelect = type;
					gSetChk = true;
					break;
				}
				else
				{
					gSetChk = false;
					continue;
				}
			}
		}

		return;
	}

	this.Play = function ()
	{
		if( gSetChk == false) return;

		gRollChk = true;

		RollStart();
		return;
	}

	this.OnMouse = function ()
	{
		if( gSetChk == false) return;

		gPauseChk = true;
		clearInterval( gTid1 );
		clearTimeout( gTid2 );
		return;
	}

	this.OutMouse = function ()
	{
		if( gSetChk == false) return;

		gPauseChk = false;
		this.Play();
		return;
	}

	this.PrevDat = function ()
	{
		if( gSetChk == false) return;
		if( gRollChk==false && gArrCnt==-1 ) gArrCnt = 0;

		clearInterval( gTid1 );
		clearTimeout( gTid2 );

		gCurPos = gEndPos;

		gArrCnt--;
		if( gArrCnt < 0 ) 
			gArrCnt = gArrTotCnt-2;

		if( gArrCnt == 0 )
		{
			gWordheight = gOwordHeight;
		}
		else
		{
			gWordheight = gRwordHeight;
		}

		gCurPos           = 0;
		gChkCnt           = 0;
		gSetObj.style.top = gCurPos + 'px';
		gSetObj.innerHTML = gArrDat[gArrCnt];
		gWordSet          = false;

		if( gRollChk == true )
			gTid2 = setTimeout( gRollSetObj.Play, gPauseTime );
		return;
	}

	this.NextDat = function ()
	{
		if( gSetChk == false) return;
		if( gRollChk==false && gArrCnt==-1 ) gArrCnt = 0;

		clearInterval( gTid1 );
		clearTimeout( gTid2 );

		gArrCnt++;
		if( gArrCnt == (gArrTotCnt-1) )
		{
			gWordheight = gOwordHeight;
			gArrCnt = 0;
		}
		else
		{
			gWordheight = gRwordHeight;
		}

		gCurPos           = 0;
		gChkCnt           = 0;
		gSetObj.style.top = gCurPos + 'px';
		gSetObj.innerHTML = gArrDat[gArrCnt];
		gWordSet          = false;

		if( gRollChk == true )
			gTid2 = setTimeout( gRollSetObj.Play, gPauseTime );

		return;
	}

	function RollStart()
	{
		if( gRollSelect == 'up' )           gTid1 = setInterval( RollUp , gMoveSpeed );
		else if( gRollSelect == 'shine' )   gTid1 = setInterval( RollShine , gPauseTime );
		else                                gSetObj.innerHTML = '�������� �ʴ� ����Դϴ�.';

		return;
	}

	function RollUp()
	{
		if( gWordSet == false )
		{
			var gTxt = '';
			var gPrevCnt;

			gPrevCnt = gArrCnt;

			gArrCnt++;
			if( gArrCnt == (gArrTotCnt-1) )
			{
				gArrCnt = 0;
			}

			if( gPrevCnt != -1 )
			{
				gTxt = gArrDat[gPrevCnt];
				gCurPos = 0;
			}

			gTxt += gArrDat[gArrCnt];

			gSetObj.innerHTML = gTxt;
			gWordSet = true;

		}

		gCurPos--;
		gSetObj.style.top = gCurPos + 'px';

		gChkCnt++;
		if( gChkCnt == gWordheight )
		{
			clearInterval( gTid1 );

			gWordSet = false;
			gChkCnt  = 0;

			if( gArrCnt >= gArrTotCnt-1 )
			{
				gWordheight       = gOwordHeight;
				gCurPos           = gOwordHeight;
				gArrCnt           = -1;
				gSetObj.style.top = gCurPos + 'px';
				gSetObj.innerHTML = '';
			}
			else
			{
				gWordheight = gRwordHeight;
			}

//			parent.document.title ='���� ���̴� ����Ÿ�� ���� \'�Ӵ�������\'';
			gTid2 = setTimeout( gRollSetObj.Play, gPauseTime );
			return;
		}
//		parent.document.title ='���� ���̴� ����Ÿ�� ���� \'�Ӵ�������\'';

	}

	function RollShine()
	{
		if( (gArrCnt == -1) || (gArrCnt == gArrTotCnt))
			gArrCnt = 0;

		gSetObj.style.top = gEndPos;
		gSetObj.innerHTML = gArrDat[gArrCnt++];
//		parent.document.title ='���� ���̴� ����Ÿ�� ���� \'�Ӵ�������\'';
		return;
	}
}


/********************************************************
   mtcms.js
   ���� JavaScript ���̺귯��
*********************************************************/
var    _intValue   = '0123456789';
var    _upperValue = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var    _lowerValue = 'abcdefghijklmnopqrstuvwxyz';
var    _etcValue   = '~`!@#$%%^&*()-_=+\|[{]};:\'\",<.>/?';
var    dayOfMonth  = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
var    _intEng     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
var    _intLowEng  = 'abcdefghijklmnopqrstuvwxyz0123456789'
//-------------------------------------------------------------------
// E-MAIL �ּҰ� �ùٸ��� �ԷµǾ����� check�ϴ� �Լ�
//-------------------------------------------------------------------
function IsEmailValid(email) {
	if (
		email.indexOf('@') >= 1 
		&& email.indexOf('@') == email.lastIndexOf('@') 
		&& email.indexOf('.') > 1 
		&& email.indexOf('.') != (email.indexOf('@')+1) 
		&& email.lastIndexOf('.') != (email.length-1) 
		&& email.indexOf(',') == -1 
		&& email.indexOf(' ' ) == -1 
		&& email.indexOf('\t') == -1 
		&& email.indexOf('\n') == -1 
		&& email.indexOf('\r') == -1 
	) 
		return true;
	else return false;
}
//-------------------------------------------------------------------
// ���ڳ� .������ üũ�ϴ� �Լ�
//-------------------------------------------------------------------
function IsIpaddress(value) {
    var   i;
    for(i=0;i<_intValue.length;i++)
        if(value == _intValue.charAt(i) || value == '.') 
            return true;

	return false;
}
//-------------------------------------------------------------------
// �����̳����������� üũ�ϴ� �Լ�
//-------------------------------------------------------------------
function IsInteng(value) {
    var   i;
    for(i=0;i<_intEng.length;i++)
        if(value == _intEng.charAt(i)) {
            return true;
        }
    return false;
}
//-------------------------------------------------------------------
// �����ҹ��ڳ����������� üũ�ϴ� �Լ�
//-------------------------------------------------------------------
function IsIntLow(value) {
    var   i;
    for(i=0;i<_intLowEng.length;i++)
        if(value == _intLowEng.charAt(i)) {
            return true;
        }
    return false;
}

//-------------------------------------------------------------------
// ���� �빮�������� üũ�ϴ� �Լ�
//-------------------------------------------------------------------
function IsUpper(value) {
    var   i;
    for(i=0;i<_upperValue.length;i++)
        if(value == _upperValue.charAt(i)) {
            return true;
        }
    return false;
}
//-------------------------------------------------------------------
// ���� �ҹ��������� üũ�ϴ� �Լ�
//-------------------------------------------------------------------
function IsLower(value) {
    var   i;
    for(i=0;i<_lowerValue.length;i++)
        if(value == _lowerValue.charAt(i)) {
            return true;
        }
    return false;
}
//-------------------------------------------------------------------
// Ư������������ üũ�ϴ� �Լ�(�����̳� �ѱ��� �ƴ�)
//-------------------------------------------------------------------
function IsEtc(value) {
    var   j;
    for(j=0;j<_etcValue.length;j++)
        if(value == _etcValue.charAt(j)) {
            return true;
        }
    return false;
}
//-------------------------------------------------------------------
// ���� �빮�ڷ� ��ȯ�ϴ� �Լ�
//-------------------------------------------------------------------
function ToUpper(comp) {
    var strNew, str = comp.value;
    for( i=0 ; i<str.length; i++ )
    {   if(i != 0)
        {
            if( str.charAt(i) >= 'a' && str.charAt(i) <= 'z' )
                strNew = strNew + str.charAt(i).toUpperCase() ;
            else
                strNew = strNew + str.charAt(i);
        }
        else
        {
            if( str.charAt(i) >= 'a' && str.charAt(i) <= 'z' )
                strNew = str.charAt(i).toUpperCase() ;
            else
                strNew = str.charAt(i);
       
        } 
    }
    //comp.value = strNew;
    if(strNew == 'GUEST')
        return true;
    else return false;
}
//-------------------------------------------------------------------
// �����ΰ��� üũ�ϴ� �Լ�
//-------------------------------------------------------------------
function IsInt(value) {
    var   j;
    for(j=0;j<_intValue.length;j++)
        if(value == _intValue.charAt(j)) {
            return true;
        }
    return false;
}
//-------------------------------------------------------------------
// ��ȭ��ȣ�� ������ ���� �����ΰ��� üũ�ϴ� �Լ�
//-------------------------------------------------------------------
function IsTelChar(value) {  // ��ȭ��ȣ�� ������ ���� �����ΰ�?
    var   j;
    for(j=0;j<_intValue.length;j++)
        if(value == _intValue.charAt(j) || value == '-')
            return true;
    return false;
}

function IsIntDot(value) {
    var   i;
    for(i=0;i<_intValue.length;i++)
        if(value == _intValue.charAt(i) || value == '.') 
            return true;

	return false;
}

function IsJisu(jisu) {
    var    i;
    for(i=0;i<jisu.length;i++)
        if(!IsIntDot(jisu.charAt(i)))
            return false;
    return true;
}
//-------------------------------------------------------------------
// �������� ������ üũ�ϴ� �κ�
//-------------------------------------------------------------------
    var IEYES = 0;
    var menufacture = navigator.appName;
    var version = navigator.appVersion;
    if((menufacture.indexOf('����ũ�μ���Ʈ') >= 0
        || menufacture.indexOf('Microsoft') >= 0)
        && version.indexOf('4.0') >= 0 )
    {
        IEYES = 1;
    }
//-------------------------------------------------------------------
// ������ ��ü�� ���ڿ��� ���̸� ����ϴ� �κ�
//-------------------------------------------------------------------
function CheckByte(str)
{
    var i;
    var strLen;
    var strByte;
    strLen = str.length;
    // IE4.0 �̻�
    if(IEYES == 1)
    {
        for(i=0, strByte=0;i<strLen;i++)
        {
            if(str.charAt(i) >= ' ' && str.charAt(i) <= '~' )
                strByte++;
            else
                strByte += 2;
        }
        return strByte;
    }
    // Netscape�� ���
    else
    {
        return strLen;
    }
}
//-------------------------------------------------------------------
// ���ڿ� ������ ���� ���� ó�� �Լ�
//-------------------------------------------------------------------
function ltrim(para)
{
    while(para.substring(0,1) == ' ')
        para = para.substring(1, para.length);
    return para;
}
//-------------------------------------------------------------------
// ���ڿ� �߰��� ���� ���� ó�� �Լ�
//-------------------------------------------------------------------
function mtrim(para)
{
    for ( i=0; i < para.length;)
        if (para.substring(i,i+1) == ' ' )
                para = para.substring(0,i) + para.substring(i+1,para.length);
        else
                i++;
        return para;
}
//-------------------------------------------------------------------
// ���ڿ� ������ ���� ���� ó�� �Լ�
//-------------------------------------------------------------------
function rtrim(para)
{
    while(para.substring(para.length-1,para.length) == ' ')
        para = para.substring(0, para.length-1);
    return para;
}

function fnTrim(chStr) {
	var nStrCheck; 
	nStrCheck = chStr.indexOf(" ");
	while (nStrCheck != -1)
	{
		chStr = chStr.replace(" ", "");
		nStrCheck  = chStr.indexOf(" ");
	}
	return chStr;
}


//-------------------------------------------------------------------
// ���ڿ��� ���̿� ���� ó�� �Լ�
//-------------------------------------------------------------------
function check_length(comp, str, len)
{
    comp.value = ltrim(comp.value);
    complen = CheckByte(comp.value);
    if ( complen > len)
    {
        alert(str + len + '�ڸ� �ʰ��Ҽ� �����ϴ�. ���� ' + complen + '�����Դϴ�.');
        comp.focus();
        return false;
    }
    return true;
}
//-------------------------------------------------------------------
// ���ڷ� ������ ���ڿ��ΰ��� üũ�ϴ� �Լ�
//-------------------------------------------------------------------
function check_digit(comp)
{
    var    i;
    var    str =  new String(comp.value);
    for(i=0;i<str.length;i++)
        if(!IsInt(str.charAt(i)))
            return false;
    return true;
}
//-------------------------------------------------------------------
// ���ڿ� �ҹ��ڷ� ������ ���ڿ��ΰ��� üũ�ϴ� �Լ�
//-------------------------------------------------------------------
function check_intsmall(comp)
{
    var    i;
    var    str =  new String(comp.value);
    for(i=0;i<str.length;i++)
        if(!IsIntLow(str.charAt(i)))
            return false;
    return true;
}
//-------------------------------------------------------------------
// IP�ּҸ� üũ�ϴ� �Լ�
//-------------------------------------------------------------------
function check_ipadress(comp)
{
    var    i, ip;
    var    str =  new String(comp.value);
    
	if ((str == '')||(str.length == 0))
        return true;

	for(i=0;i<str.length;i++)
        if(!IsIpaddress(str.charAt(i)))
            return false;

	splitIP = str.split(".");

	// ���� ���̿� ���� �ִ����� üũ
	if (splitIP.length == 1)		
		return false;
	// ���� ���̿� ���� 3���� �ִ��� üũ
	else if (splitIP.length != 4)	
		return false;
	// IP �� ��Ʈ�� ���� üũ
	else if ( (splitIP[0].length == 0) | (splitIP[1].length == 0) | (splitIP[2].length == 0) | (splitIP[3].length == 0) )
		return false;
	// IP �� ��Ʈ�� ���̰� 3�ڸ� �̻����� üũ
	else if ( (splitIP[0].length > 3) | (splitIP[1].length > 3) | (splitIP[2].length > 3) | (splitIP[3].length > 3) )
		return false;
	// IP�� �� ��Ʈ�� 255�� �ʰ��ϴ��� üũ
	else if ( (splitIP[0] > 255) | (splitIP[1] > 255) | (splitIP[2] > 255) | (splitIP[3] > 255) )
		return false;
	// ù ��° ��Ʈ�� ���� 0�� ���� ������ üũ
	else if (splitIP[0] == 0)
		return false;
	// ��� ��Ʈ�� ���� 0���� üũ
	else if ( (splitIP[0] == 0) & (splitIP[1] == 0) & (splitIP[2] == 0) & (splitIP[3] == 0) )
		return false;
	// ��� ��Ʈ�� ���� 255���� üũ
	else if ( (splitIP[0] == 255) & (splitIP[1] == 255) & (splitIP[2] == 255) & (splitIP[3] == 255) )
		return false;
	// ���� ��� ��쿡 �ɸ��� ������ �´� IP
	else
		return true
}
//-------------------------------------------------------------------
// ���ڳ� ����� ������ ���ڿ��ΰ��� üũ�ϴ� �Լ�
//-------------------------------------------------------------------
function check_inteng(comp)
{
    var    i;
    var    str =  new String(comp.value);
    for(i=0;i<str.length;i++)
        if(!IsInteng(str.charAt(i)))
            return false;
    return true;
}
//-------------------------------------------------------------------
// �Էµ� ���ڰ� �Ǽ��ΰ��� üũ�ϴ� �Լ�
//-------------------------------------------------------------------
function check_Num(comp)
{
    var i,j;
    var str = new String(comp.value);

    if ((str == '')||(str.length == 0))
        return true;

    for(i=0;i<str.length;i++)
    {
        if(!IsInt(str.charAt(i)))
			if(str.charAt(i)!='.' &&
               str.charAt(i)!='-')
            return false;
    }
    return true;
}
//-------------------------------------------------------------------
//  ��ȭ��ȣ������ üũ�ϴ� �Լ�
//-------------------------------------------------------------------
function IsTel(tel) {
    var    i;
    for(i=0;i<tel.length;i++)
        if(!IsTelChar(tel.charAt(i)))
            return false;
    return true;
}
//-------------------------------------------------------------------
// Input�� ������ ������  true�� return��.
//-------------------------------------------------------------------
function isNotNull(comp, str, gbn)
{
    comp.value = ltrim(comp.value);
    if (comp.value == '')
    {
		if(gbn == 1)
		    alert( str + ' �����Ͻʽÿ�.');
		else
            alert( str + ' �Է��Ͻʽÿ�.');
        comp.focus();
        return false;
    }else
        return true;
}
//-------------------------------------------------------------------
// �ش� ����� ������ ��¥ ���ϴ� �Լ�
//-------------------------------------------------------------------
function lastday(calyear,calmonth)
{
    if (((calyear %4 == 0) && (calyear % 100 != 0))||(calyear % 400 == 0))
        dayOfMonth[1] = 29;
    var nDays = dayOfMonth[calmonth-1];
    return nDays;
}
//-------------------------------------------------------------------
// ��¥�� ��Ȯ�� �˻�
//-------------------------------------------------------------------
function isValidDate(comp,gubn)
{
    var t_date = new String(comp.value);
    var t_year  = parseInt(t_date.substring(0,4),10);
    var t_month = parseInt(t_date.substring(4,6),10);
    var t_day   = parseInt(t_date.substring(6,8),10);
    if(comp.value.length == 0){
        alert('��¥�� �Է��Ͻʽÿ�.');
		if(gubn != '1')		comp.focus();
        return false;
    }
    if (check_digit(comp) == false){
        alert('��¥�� ���ڸ� �����մϴ�.');
        comp.value='';
        return false;
    }
    if (comp.value.length != 8){
        alert('��¥�� �Է��� Ʋ�Ƚ��ϴ�.');
		if(gubn != '1')		comp.focus();
        return false;
    }
    if (t_year < 1900 || t_year >2100){
        alert('��¥�� Ʋ�Ƚ��ϴ�. �⵵�� 1900�⿡�� 2100����� �Դϴ�.');
		if(gubn != '1')		comp.focus();
        return false;
    }
    if (t_month <1 || t_month > 12){
        alert('��¥�� Ʋ�Ƚ��ϴ�. ���� 1������ 12������ �Դϴ�.');
		if(gubn != '1')		comp.focus();
        return false;
    }
    if (t_day <1 || t_day > lastday(t_year, t_month)){
        alert('��¥�� Ʋ�Ƚ��ϴ�.'+t_month+'������ '+t_day+'���� �����ϴ�.');
		if(gubn != '1')		comp.focus();
        return false;
    }
    return true;
}
//-------------------------------------------------------------------
// ��¥(����Ͻú���)�� ��Ȯ�� �˻�
//-------------------------------------------------------------------
function isFullDate(comp)
{
    var t_date = new String(comp.value);
    var t_year  = parseInt(t_date.substring(0,4),10);
    var t_month = parseInt(t_date.substring(4,6),10);
    var t_day   = parseInt(t_date.substring(6,8),10);
    var t_hour  = parseInt(t_date.substring(8,10),10);
    var t_min   = parseInt(t_date.substring(10,12),10);
    var t_sec   = parseInt(t_date.substring(12,14),10);

	if(comp.value.length == 0){
        alert('��¥�� �Է��Ͻʽÿ�.');
		comp.focus();
        return false;
    }
    if (check_digit(comp) == false){
        alert('��¥�� ���ڸ� �����մϴ�.');
		comp.focus();
        return false;
    }
    if (comp.value.length != 14){
        alert('��¥�� �Է��� Ʋ�Ƚ��ϴ�.(����Ͻú��� 14�ڸ� ex - 20040101123028)');
		comp.focus();
        return false;
    }
    if (t_year < 1900 || t_year >2100){
        alert('��¥�� Ʋ�Ƚ��ϴ�. �⵵�� 1900�⿡�� 2100����� �Դϴ�.');
		comp.focus();
        return false;
    }
    if (t_month <1 || t_month > 12){
        alert('��¥�� Ʋ�Ƚ��ϴ�. ���� 1������ 12������ �Դϴ�.');
		comp.focus();
        return false;
    }
    if (t_day <1 || t_day > lastday(t_year, t_month)){
        alert('��¥�� Ʋ�Ƚ��ϴ�.'+t_month+'������ '+t_day+'���� �����ϴ�.');
		comp.focus();
        return false;
    }
    if (t_hour < 0 || t_hour > 23 ){
        alert('�ð��� Ʋ�Ƚ��ϴ�. �ð��� 0�ú��� 23�ñ��� �Դϴ�.');
		comp.focus();
        return false;
    }
    if (t_min < 0 || t_min > 59 ){
        alert('���� Ʋ�Ƚ��ϴ�. ���� 0�к��� 59�б��� �Դϴ�.');
		comp.focus();
        return false;
    }
    if (t_sec < 0 || t_sec > 59 ){
        alert('�ʰ� Ʋ�Ƚ��ϴ�. �ʴ� 0�ʺ��� 59�ʱ��� �Դϴ�.');
		comp.focus();
        return false;
    }
    return true;
}
//-------------------------------------------------------------------
// �� ��¥ ������ ����� �ùٸ��� �����Ǿ� �ִ°� ?
// ��¥�� ������ Text�θ� �̷���� �ִ� ���
//-------------------------------------------------------------------
function isValidDateWith(s_date, e_date)
{
    var t_s_date = parseInt(parseFloat(s_date.value, 10), 10);
    var t_e_date = parseFloat(parseFloat(e_date.value, 10), 10);

    if (isValidDate(s_date) == false)
    {
        s_date.focus();
        return false;
    }
    if (isValidDate(e_date) == false)
    {
        e_date.focus();
        return false;
    }
    if (t_s_date > t_e_date)
    {
        alert('�������� �����Ϻ��� Ů�ϴ�.');
        return false;
    }
    return true;
}
//-------------------------------------------------------------------
// radio button�� ���õǾ��°� ?
//-------------------------------------------------------------------
function check_db(comp, cnt, str)
{
    var result = false;
    if (cnt == 1)
    {
        if (comp.checked == true)
            return true;
        else
        {
            alert( str + '�����Ͻʽÿ�.');
            return false;
        }
    }
    else
    {
        for (i = 0; i < cnt; i++)
        {
            if (comp[i].checked == true)
                result = true;
        }
        if (result != true)
        {
            alert( str + '�����Ͻʽÿ�.');
            return false;
        }
    }
    return true;
}
//-------------------------------------------------------------------
// ���ó�¥�� yyyymmdd���·� �����ϴ� �Լ�
//-------------------------------------------------------------------
function toDay() {

    var now = new Date();
    var yr = now.getYear();
    var mName = now.getMonth() + 1;
    var dName = now.getDate();

    if (yr < 100)
        year=("19"+yr).toString();
    else
        year=yr.toString();

    if (mName <10)
        month=("0"+mName).toString();
    else
        month=mName.toString();

    if (dName <10)
        day=("0"+dName).toString();
    else
        day=dName.toString();

    return year+month+day;

}
//-------------------------------------------------------------------
// ���ó�¥�� yyyymmdd24hhmm���·� �����ϴ� �Լ�
//-------------------------------------------------------------------
function toCurrentTime() {

    var now = new Date();
    var yr = now.getYear();
    var mName = now.getMonth() + 1;
    var dName = now.getDate();
    var hName = now.getHours(); 
    var bName = now.getMinutes();
	
	if (yr < 100)
        year=("19"+yr).toString();
    else
        year=yr.toString();

    if (mName <10)
        month=("0"+mName).toString();
    else
        month=mName.toString();

    if (dName <10)
        day=("0"+dName).toString();
    else
        day=dName.toString();

    if (hName <10)
        hour=("0"+hName).toString();
    else
        hour=hName.toString();

    if (bName <10)
        minute=("0"+bName).toString();
    else
        minute=bName.toString();

    return year+month+day+hour+minute;
}


//tab����
function showSubMenu(obj1, obj2, obj3, tot) { //obj1:tab������, obj2:���õǴ�tab, obj3:arrow����
	for(i=1;i<=(eval(tot));i++){
		if(eval(obj2) == i){
			document.getElementById(obj1+i).style.display="block";
			document.getElementById(obj1+"on"+i).className = 'on';
			if(obj3 != 3){
				if(obj3 == 2){
					var sHtml = "<img src=\"http://menu.mt.co.kr/bil/bl_arrow2.gif\">";
				}else{
					var sHtml = "<img src=\"http://menu.mt.co.kr/bil/bl_arrow1.gif\">";
				}
				document.getElementById(obj1+"arw"+i).innerHTML = sHtml;
			}
		}else{
			document.getElementById(obj1+i).style.display="none";
			document.getElementById(obj1+"on"+i).className = '';
			if(obj3 != 3){
				var sHtml = "";
				document.getElementById(obj1+"arw"+i).innerHTML = sHtml;
			}
		}
	}
}

function showSubMenuTab(obj1, obj2, obj3, tot) { //obj1:tab������, obj2:���õǴ�tab, obj3:arrow����
	for(i=1;i<=(eval(tot));i++){
		if(eval(obj2) == i){
			document.getElementById(obj1+i).style.display="block";
			document.getElementById(obj1+"on"+i).className = 'tab'+eval(obj2)+' on';
			if(obj3 == 2){
				var sHtml = "<img src=\"http://menu.mt.co.kr/bil/bl_arrow2.gif\">";
			}else{
				var sHtml = "<img src=\"http://menu.mt.co.kr/bil/bl_arrow1.gif\">";
			}
			document.getElementById(obj1+"arw"+i).innerHTML = sHtml;

		}else{
			document.getElementById(obj1+i).style.display="none";
			document.getElementById(obj1+"on"+i).className = 'tab'+eval(i);
			var sHtml = "";
			document.getElementById(obj1+"arw"+i).innerHTML = sHtml;
		}
	}
}

//arrow���� tab
function showHideTab(obj1, obj2, tot) { //obj1:tab������, obj2:���õǴ�tab
	for(i=1;i<=(eval(tot));i++){
		if(eval(obj2) == i){
			document.getElementById(obj1+i).style.display="table";
			document.getElementById(obj1+"on"+i).className = 'on';
		}
		else{
			document.getElementById(obj1+i).style.display="none";
			document.getElementById(obj1+"on"+i).className = '';
		}
	}
}

function getCookie( cookieName )
{
	var search = cookieName + "=";
	var cookie = document.cookie;

	if( cookie.length > 0 )
	{
		startIndex = cookie.indexOf( cookieName );
		if( startIndex != -1 )
		{
			startIndex += cookieName.length;
			endIndex = cookie.indexOf( ";", startIndex );
			if( endIndex == -1) endIndex = cookie.length;
			return unescape( cookie.substring( startIndex + 1, endIndex ) );
		}
		else
		{
			return false;
		}
	}
	else
	{
		return false;
	}
}

function setCookie( cookieName, cookieValue, expireDate )
{
	var today = new Date();
	today.setDate( today.getDate() + parseInt( expireDate ) );
	document.cookie = cookieName + "=" + escape( cookieValue ) + "; path=/; expires=" + today.toGMTString() + ";domain=mt.co.kr" + ";"
}

function SetAllPopup( currMod )
{
	var adTimeS = new Date();
	var now = new Date();
	var i, j, z, mod, hCount, pNumber;
	var str='', pStr = '';
	if(!currMod || currMod == '')
		currMod = '000';
	var aryCode = new Array();

	for(i = 0; i < gMTPopStr.length; i++)
	{
		var aryStr1 = new Array();
		var aryStr2 = new Array();
		aryStr1 = gMTPopStr[i].split('|');
		if( aryStr1[0] == currMod )
		{
			if( aryStr1.length < 2 )
				continue;
			if((aryStr1.length - 2) > 0)
			{
				popbtIdx = adTimeS.getSeconds() % (aryStr1.length - 1);
				j = 1 + popbtIdx;
			}
			else
				j = 1;

			aryStr2 = aryStr1[j].split(',');
			pNumber = getCookie(aryStr2[5]);

			if( pNumber < aryStr2[6])
			{
				window.open(aryStr2[0],currMod+i,'width='+ aryStr2[1] +',height=' + aryStr2[2] + ',scrollbars=no,top=' + aryStr2[3] + ',left=' + aryStr2[4] + '');
				if( aryStr2[5].indexOf( 'setad_') != -1 )
				{
					pNumber++;
					now.setTime(now.getTime() + aryStr2[7]*86400000);
					setCookie( aryStr2[5], pNumber, now );
				}
				//break;
			}
			else
			{
				for( z = 1; z < aryStr1.length; z++ )
				{
					aryStr2 = aryStr1[z].split(',');
					pNumber = getCookie(aryStr2[5]);
					if( pNumber < aryStr2[6] )
					{
						pop_open_win(aryStr2[0], currMod, aryStr2[1], aryStr2[2], aryStr2[3], aryStr2[4]);
						if( aryStr2[5].indexOf( 'setad_') != -1 )
						{
							pNumber++;
							now.setTime(now.getTime() + aryStr2[7]*86400000);
							setCookie( aryStr2[5], pNumber, now );
						}
						//break;
					}
				}
			}
			//break;
		}
	}
}

function Keycode(e){
	var result;
	if(window.event)
		result = window.event.keyCode;
	else if(e)
		result = e.which;
	return result;
}

function uniTostr(str){
	return decodeURIComponent(str);
}

function strTouni(str){
	return encodeURIComponent(str);
}

//�˾�â 
function WinCenterOpen(strUrl, strWinName,intWidth,intHeight,strOption){

	if (screen.width <= 800){
		intTop=0;
		intLeft=0;
	} 
	else {
		intTop = (screen.height)?(screen.height-intHeight)/2:100;
		intLeft = (screen.width)?(screen.width-intWidth)/2:100;
	}
	if(strOption.length > 0) strOption = "," + strOption;
	window.open(strUrl, strWinName, "top="+intTop+", left="+intLeft+", width="+intWidth+", height="+intHeight + strOption);
}



/*---------------------------------------------------------------------------------------------------------*/
//# Copy2Clipboard (Only work for IE)
/*---------------------------------------------------------------------------------------------------------*/

function copy_clip(maintext) {
	if (window.clipboardData)
	{
	// the IE-way
	window.clipboardData.setData("Text", maintext);
	// Probabely not the best way to detect netscape/mozilla.
	// I am unsure from what version this is supported
	}
	else if (window.netscape)
	{ 
	// This is importent but it's not noted anywhere
	netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
	// create interface to the clipboard
	var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
	if (!clip) return;
	// create a transferable
	var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
	if (!trans) return;
	// specify the data we wish to handle. Plaintext in this case.
	trans.addDataFlavor('text/unicode');
	// To get the data from the transferable we need two new objects
	var str = new Object();
	var len = new Object();
	var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
	var copytext=maintext;
	str.data=copytext;
	trans.setTransferData("text/unicode",str,copytext.length*2);
	var clipid=Components.interfaces.nsIClipboard;
	if (!clip) return false;
	clip.setData(trans,null,clipid.kGlobalClipboard);
	}
	alert("��� ���� �ּҰ� ����Ǿ����ϴ�.\n\n" + maintext);
	return false;
}


/*---------------------------------------------------------------------------------------------------------*/
//# Smoothly Page Scroller Effect for Internal Links
/*---------------------------------------------------------------------------------------------------------*/

var ScrollLinks = {
	currentHash: false,
	start: function(){
		this.scroll = new fx.Scroll({duration: 1500, transition: fx.sineOut, onComplete: function(){this.end();}.bind(this)});
		this.allinks = $c(document.getElementsByTagName('a'));
		this.allinks.each(function(lnk){
			if ((lnk.href && lnk.href.indexOf('#skip') != -1) && ( (lnk.pathname == location.pathname) 
				|| ('/'+lnk.pathname == location.pathname) ) && (lnk.search == location.search)) {
				lnk.onclick = function(){
					ScrollLinks.scroll.clearTimer();
					this.initialHref = this.href;
					this.initialHash = this.hash;
					this.href = "javascript:void(0)";
					setTimeout(function(){this.href = this.initialHref;}.bind(this), 200);
					ScrollLinks.go(this);
				}
			}
		});
	},

	go: function(link){
		this.currentHash = link.initialHash.slice(1);
		if (this.currentHash) {
			this.allinks.each(function(lnk){
				if (lnk.id == ScrollLinks.currentHash){
					if (window.opera) lnk =  [lnk].find('parentNode');
					ScrollLinks.scroll.scrollTo(lnk);
					return;
				}
			});
		}
	},

	end: function(){
		if (!/Konqueror|Safari|KHTML/.test(navigator.userAgent)) window.location.hash = "#"+this.currentHash;
		this.currentHash = false;
	}
}

// �ۼ��� �˻�
function check_byte(content, target)
{
	var i = 0;
	var cnt = 0;
	var ch = '';
	var cont = document.getElementById(content).value;

	for (i=0; i<cont.length; i++) {
		ch = cont.charAt(i);
		if (escape(ch).length > 4) {
			cnt += 2;
		} else {
			cnt += 1;
		}
	}
	// ���ڸ� ���
	document.getElementById(target).innerHTML = cnt;

	return cnt;
}


function isValidURL(url) {
	var urlRegxp = /^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.|www.){1}([\w]+)(.[\w]+){1,2}$/;
	if (urlRegxp.test(url) != true) {
		return false;
	} else {
		return true;
	}
}

/*---------------------------------------------------------------------------------------------------------*/
//# ��ü���Ӻ�â ����
/*---------------------------------------------------------------------------------------------------------*/
function sokboPopup(sec)
{
	//window.open( "http://news.mt.co.kr/newsflash/newsflash.html?sec="+sec,"sokbo",'width=1073,height=785,top=0,left=0,resizable=1,scrollbars=yes,toolbar=yes');
	window.open( "http://news.mt.co.kr/newsflash/newsflash.html","sokbo",'width=1073,height=785,top=0,left=0,resizable=1,scrollbars=yes,toolbar=yes');
}

/*---------------------------------------------------------------------------------------------------------*/
//# �˾� ����
/*---------------------------------------------------------------------------------------------------------*/
var newWin = null;
function closeWin()
{
	if (newWin != null)
	{
		if(!newWin.closed)
			newWin.close();
	}
}

function popUp(strURL,strType,strWidth,strHeight) {
	closeWin();
	var strOptions = '';
	if (strType=="standard")  strOptions = "width="+strWidth+",resizable,height="+strHeight+",scrollbars=yes,toobars=no";
	if (strType=="console")   strOptions = "width="+strWidth+",resizable,height="+strHeight;
	if (strType=="fixed")     strOptions = "width="+strWidth+",status,height="+strHeight;
	if (strType=="elastic")   strOptions = "toolbar,menubar,scrollbars,resizable,location,width="+strWidth+",height="+strHeight;
	if (strType=="kse")       strOptions = "width="+strWidth+",scrollbars=no,status,height="+strHeight;

	newWin = window.open(strURL, 'newWin', strOptions);
	newWin.focus();
}


var num_i = 1;
function ChangeObjNext(total,obj,numObj){
	num_i++;
	if(num_i > total){
		num_i = 1;
	}

	ChangeObj(num_i,total,obj,numObj);
}

function ChangeObjPre(total,obj,numObj){

	num_i--;
	if(num_i < 1){
		num_i = total;
	}

	ChangeObj(num_i,total,obj,numObj);
}


function ChangeObj(num_i,total,obj,numObj){
	
	for(var i=1;i<=total;i++){
	
		if(num_i==i){
			$("#"+obj+i).show();
			$("#"+numObj).html('<b>'+num_i+'</b>');
		}else{
			$("#"+obj+i).hide();
		}

	}
	
}

//-------------------------------------------------------------------
// ajax����Լ�
//-------------------------------------------------------------------
function ajaxObjSet()
{
	var xmlhttp = null;

	if( window.XMLHttpRequest )
		xmlhttp = new XMLHttpRequest();
	else
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

	return xmlhttp;
}	