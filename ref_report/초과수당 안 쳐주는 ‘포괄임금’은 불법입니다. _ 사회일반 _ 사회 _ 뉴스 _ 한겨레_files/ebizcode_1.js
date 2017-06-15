function get_ace_Value(str,name,div){
        str = str + div ;
	while(str.indexOf(div)>0){
		tmpstr = str.substring(0,str.indexOf(div));
		str = str.substring(str.indexOf(div)+1,str.length);
		if( tmpstr.indexOf(name+'=') == 0 ){
			return tmpstr.substring(name.length+1,tmpstr.length);
		}
	}
	return '';
}

var NL_CODE='102',NL_sec=0,NL_kisa='',NL_top='',NL_PID=0,NL_TID=0;
var NL_dim='',NL_tz=20,NL_ja='Unknown' ,NL_bn='Unknown',NL_bv='Unknown',NL_sc='Unknown',NL_sv=10,NL_ref='',NL_arg='',NL_av='',NL_je='n',NL_ul='Unknown',NL_ua='Unknown',NL_UA='Unknown',NL_rl='',NL_os='Unknown',NL_version='Unknown',NL_ad_key='',NL_xrl='',NL_cd='',NL_cpu='',NL_bz='',NL_ref_dm='',NL_url_dm='',NL_pref_dm='',NL_tref_dm='';

if( typeof NU_rl == 'undefined' ) var NU_rl = '' ;
if( typeof NL_CODE == 'undefined' ) var NL_CODE = '' ;
NL_tz = Math.floor((new Date()).getTimezoneOffset()/60) + 29 ;
if( NL_tz > 24 ) NL_tz = NL_tz - 24 ;
if( typeof NL_ag == 'undefined' ) var NL_ag = 0 ;
if( typeof NL_id == 'undefined' ) var NL_id = '' ;
if( typeof NL_mr == 'undefined' ) var NL_mr = 'unknown';
if( typeof NL_gd == 'undefined' ) var NL_gd = 'unknown';
if( typeof NL_skey == 'undefined' ) var NL_skey = '';
if( typeof NL_jn == 'undefined' ) var NL_jn = '';
if( typeof NL_inc == 'undefined' ) var NL_inc = 0;
if( typeof NL_loc == 'undefined' ) var NL_loc = '';
if( typeof NL_qut == 'undefined' ) var NL_qut = 0;
if( typeof NL_iul == 'undefined' ) var NL_iul = '';

if( NL_inc == '' ){ NL_inc = 0 ; }
else{ NL_inc = parseInt(NL_inc); }
if( NL_inc < 0 ){ NL_inc = 0; }

// 메뉴 수동셋팅
if( typeof NL_menu == 'undefined' ) var NL_menu = '' ;
// 타이틀 수동셋팅 또는 title 셋팅
if( typeof NL_name == 'undefined' ) var NL_name = document.title.substring(0,127) ;

if( NL_ag != '' ){ NL_ag = parseInt(NL_ag); 2012-07-16}
else{ NL_ag = 0; }
if( NL_ag < 0 || NL_ag > 12 ){ NL_ag = 12; }
if( NL_gd != 'man' && NL_gd != 'woman' ){ NL_gd ='unknown';}
if( NL_mr != 'married' && NL_mr != 'single' ){ NL_mr ='unknown';}
if( NL_jn != 'join' && NL_jn != 'withdraw' ){ NL_jn ='';}

NL_je = (navigator.javaEnabled()==true)?'1':'0';
NL_bn=navigator.appName;
if(NL_bn.substring(0,9)=="Microsoft") NL_bn="MSIE";

NL_cpu=navigator.cpuClass;  NL_bz=navigator.appName;  NL_pf=navigator.platform;  NL_av=navigator.appVersion;  NL_bv=parseFloat(NL_av) ;
if((NL_bn=="MSIE")&&(parseInt(NL_bv)==2)) NL_bv=3.01;
NL_ref=document.referrer;
var NL_pre_rl = '' ;
var NL_tailrl = '' ;
if( typeof("parent.document") != "unknown" ){
        eval("try{ NL_pre_rl = parent.document.URL ;}catch(_e){ NL_pre_rl='';}");
        if( NL_pre_rl.indexOf('#') > 8 ){
                NL_tailrl = "#" + NL_pre_rl.substring(NL_pre_rl.indexOf('#')+1,NL_pre_rl.length);
                NL_pre_rl = NL_pre_rl.substring(0,NL_pre_rl.indexOf('#')) ;
        }
        if( document.URL.indexOf('?') > 0 ){
                NL_ad_key = document.URL.substring(document.URL.indexOf('?')+1,document.URL.length);
        }
        if( NL_pre_rl != document.URL && NL_pre_rl.indexOf('?') > 0 ){
                NL_ad_key = NL_pre_rl.substring(NL_pre_rl.indexOf('?')+1,NL_pre_rl.length);
        }
}
if( document.referrer == NL_pre_rl ){   eval("try{ NL_ref = parent.document.referrer ;}catch(_e){ NL_ref = '';}");}
else{   NL_ref = document.referrer ; }

NL_rl=document.URL;

if( NL_rl.indexOf('#') < 5 ){ NL_rl += NL_tailrl ;}
if(NL_rl.indexOf('#')>0) NL_rl=NL_rl.substring(0,NL_rl.indexOf('#'));

if(NL_rl.charAt(NL_rl.length)=='/') NL_rl=NL_rl.substring(0,NL_rl.length-1);
if(NL_rl.indexOf('://')>0) NL_rl=NL_rl.substring(NL_rl.indexOf('://')+3,NL_rl.length);
if(NL_ref.charAt(NL_ref.length)=='/') NL_ref=NL_ref.substring(0,NL_ref.length-1);
if(NL_ref.indexOf('://')>0) NL_ref=NL_ref.substring(NL_ref.indexOf('://')+3,NL_ref.length);
if( (NL_ref=='undefined')||( NL_ref == '' )) NL_ref = 'bookmark' ;


NL_url_dm = NL_rl + '/';
NL_url_dm = NL_url_dm.substring(0,NL_url_dm.indexOf('/'));

var NL_first_dir = '';
if( NL_rl.indexOf('/') >= NL_url_dm.length ){
  NL_t_idx = NL_rl.indexOf('/');
  NL_first_dir = NL_rl.substring(NL_t_idx+1,NL_rl.length);
}

if(NL_url_dm == 'hani.co.kr' ) NL_url_dm = 'www.hani.co.kr' ;
if(NL_url_dm == 'hani.com' ) NL_url_dm = 'www.hani.com' ;

var NL_dir = '';
if( NL_rl.indexOf('/') > 0 ){
	NL_dir = NL_url_dm + NL_rl.substring(NL_rl.indexOf('/'),NL_rl.length);
}
NL_rl_t = NL_rl;

// 코드 할당


var LCODELIST = Array('102','102','103','103','104','104','105','106','106','108',
'109','110','110','111','112','112','112','112','113','114', // 10 ~
'115','116','116','117','118','132','133','134','139','140',
'141','142','143','144','145','146','147','149','149','517', 
'518','104','104','105','106','106','108','109','110','111', // 40 ~
'112','112','112','112','113','114','115','116','116','117',
'118','132','133','134','139','140','141','142','143','144',
'145','146','147','149','149','517','518','118','118','519',
'519','520','520','532','535','537','535','535','538','538', // 80 ~ 
'538','539','540','557','124','124','561','563','124','124',
'576','576','578','600','601','604','616','620','116','665', // 100 ~
'692','702','702','823','830','831','832','832','844','840',
'841','561','853','848','849','850','851','852','863','864',
'865','867');

var VCODELIST = Array(0);
VCODELIST[0] = 'www.hani.co.kr';
VCODELIST[1] = 'www.hani.com';
VCODELIST[2] = 'bridge.hani.co.kr';
VCODELIST[3] = 'bridge.hani.com';
VCODELIST[4] = 'humor.hani.co.kr';
VCODELIST[5] = 'puzzle.hani.co.kr';
VCODELIST[6] = 'h21.hani.co.kr';
VCODELIST[7] = 'search.hani.co.kr';
VCODELIST[8] = 'find.hani.co.kr';
VCODELIST[9] = 'korean.hani.co.kr';
VCODELIST[10] = 'tvstar.hani.co.kr';
VCODELIST[11] = 'books.hani.co.kr';
VCODELIST[12] = 'book.hani.co.kr';
VCODELIST[13] = 'hantoma.hani.co.kr';
VCODELIST[14] = 'bbs.hani.co.kr';
VCODELIST[15] = 'bbs1.hani.co.kr';
VCODELIST[16] = 'bbs2.hani.co.kr';
VCODELIST[17] = 'bbs3.hani.co.kr';
VCODELIST[18] = 'ichina21.hani.co.kr';
VCODELIST[19] = 'newsmail.hani.co.kr';
VCODELIST[20] = 'newsletter.hani.co.kr';
VCODELIST[21] = 'olympic.hani.co.kr';
VCODELIST[22] = 'olympic2.hani.co.kr';
VCODELIST[23] = 'hanireporter.hani.co.kr';
VCODELIST[24] = 'mylinker.hani.co.kr';
VCODELIST[25] = 'drapt.hani.co.kr';
VCODELIST[26] = 'movie1.hani.co.kr';
VCODELIST[27] = 'pr.hani.co.kr';
VCODELIST[28] = 'graphic1.hani.co.kr';
VCODELIST[29] = 'newsrank.hani.co.kr';
VCODELIST[30] = 'toon.hani.co.kr';
VCODELIST[31] = 'event.hani.co.kr';
VCODELIST[32] = 'poll.hani.co.kr';
VCODELIST[33] = 'gallery.hani.co.kr';
VCODELIST[34] = 'quake.hani.co.kr';
VCODELIST[35] = 'gallog.hani.co.kr';
VCODELIST[36] = 'pictorial.hani.co.kr';
VCODELIST[37] = 'happyvil.hani.co.kr';
VCODELIST[38] = 'happyvil2.hani.co.kr';
VCODELIST[39] = 'multihani.hani.co.kr';
VCODELIST[40] = 'education.hani.co.kr';

VCODELIST[41] = 'humor.hani.com';
VCODELIST[42] = 'puzzle.hani.com';
VCODELIST[43] = 'h21.hani.com';
VCODELIST[44] = 'search.hani.com';
VCODELIST[45] = 'find.hani.com';
VCODELIST[46] = 'korean.hani.com';
VCODELIST[47] = 'tvstar.hani.com';
VCODELIST[48] = 'book.hani.com';
VCODELIST[49] = 'hantoma.hani.com';
VCODELIST[50] = 'bbs.hani.com';
VCODELIST[51] = 'bbs1.hani.com';
VCODELIST[52] = 'bbs2.hani.com';
VCODELIST[53] = 'bbs3.hani.com';
VCODELIST[54] = 'ichina21.hani.com';
VCODELIST[55] = 'newsmail.hani.com';
VCODELIST[56] = 'newsletter.hani.com';
VCODELIST[57] = 'olympic.hani.com';
VCODELIST[58] = 'olympic2.hani.com';
VCODELIST[59] = 'hanireporter.hani.com';
VCODELIST[60] = 'mylinker.hani.com';
VCODELIST[61] = 'drapt.hani.com';
VCODELIST[62] = 'movie1.hani.com';
VCODELIST[63] = 'pr.hani.com';
VCODELIST[64] = 'graphic1.hani.com';
VCODELIST[65] = 'newsrank.hani.com';
VCODELIST[66] = 'toon.hani.com';
VCODELIST[67] = 'event.hani.com';
VCODELIST[68] = 'poll.hani.com';
VCODELIST[69] = 'gallery.hani.com';
VCODELIST[70] = 'quake.hani.com';
VCODELIST[71] = 'gallog.hani.com';
VCODELIST[72] = 'pictorial.hani.com';
VCODELIST[73] = 'happyvil.hani.com';
VCODELIST[74] = 'happyvil2.hani.com';
VCODELIST[75] = 'multihani.hani.com';
VCODELIST[76] = 'education.hani.com';
VCODELIST[77] = 'www.hani.co.kr/mylinker/';
VCODELIST[78] = 'www.hani.com/mylinker/';
VCODELIST[79] = 'top.hani.co.kr';
VCODELIST[80] = 'top.hani.com';
VCODELIST[81] = 'daily.hani.co.kr';
VCODELIST[82] = 'daily.hani.com';
VCODELIST[83] = 'opinion1.hani.co.kr';
VCODELIST[84] = 'i-soccer.hani.co.kr';
VCODELIST[85] = 'rich.hani.co.kr';
VCODELIST[86] = 'i-soccer2.hani.co.kr';
VCODELIST[87] = 'www.hani.co.kr/arti/sports/soccer/worldcup2006';
VCODELIST[88] = 'www.hani.co.kr/arti/SECTION/';
VCODELIST[89] = 'www.hani.co.kr/kisa/section-service/';
VCODELIST[90] = 'themen.hani.co.kr';
VCODELIST[91] = 'english.hani.co.kr';
VCODELIST[92] = '4040.hani.co.kr';
VCODELIST[93] = 'pdf.hani.co.kr';
VCODELIST[94] = 'assetbe.hani.co.kr';
VCODELIST[95] = 'assetbe2.hani.co.kr';

VCODELIST[96] = 'mobile.hani.co.kr';
VCODELIST[97] = 'incruit.hani.co.kr';
VCODELIST[98] = 'asset.hani.co.kr';
VCODELIST[99] = 'asset2.hani.co.kr';

VCODELIST[100] = 'www.hani.co.kr/kisa/section-moving/';
VCODELIST[101] = 'www.hani.co.kr/arti/MOVING/';
VCODELIST[102] = '2007.hani.co.kr';
VCODELIST[103] = 'www.hani.co.kr/section-popup';
VCODELIST[104] = 'www.hani.co.kr/kisa/section-issue';

VCODELIST[105] = 'community.hani.co.kr/';
VCODELIST[106] = 'community.hani.co.kr/community/map.html';
VCODELIST[107] = 'foodntrip.hani.co.kr/';

VCODELIST[108] = 'www.hani.co.kr/kisa/section-issue/39/';
VCODELIST[109] = 'ecotopia.hani.co.kr/';
VCODELIST[110] = '2010olympic.hani.co.kr/';
VCODELIST[111] = 'www.cleanvote.co.kr';
VCODELIST[112] = 'cleanvote.hani.co.kr';
VCODELIST[113] = '2012olympic.hani.co.kr';
VCODELIST[114] = 'japan.hani.co.kr';
VCODELIST[115] = '2012.hani.co.kr';
VCODELIST[116] = 'na-dle.hani.co.kr';
VCODELIST[117] = 'www.na-dle.co.kr';
VCODELIST[118] = 'c.hani.co.kr';
VCODELIST[119] = 'part.blog.hani.co.kr';
VCODELIST[120] = 'part.team.hani.co.kr';
VCODELIST[121] = 'm.hani.co.kr/';
VCODELIST[122] = 'se.hani.co.kr/';
VCODELIST[123] = 'se.hani.co.kr/arti/news';
VCODELIST[124] = 'se.hani.co.kr/arti/column';
VCODELIST[125] = 'se.hani.co.kr/arti/people';
VCODELIST[126] = 'se.hani.co.kr/arti/review';
VCODELIST[127] = 'se.hani.co.kr/arti/SERIES/';
VCODELIST[128] = 'worldcup2014.hani.co.kr/';
VCODELIST[129] = 'm.h21.hani.co.kr/';
VCODELIST[130] = '0416.hani.co.kr/';
VCODELIST[131] = 'china.hani.co.kr/';

NL_TID = 1;
NL_PID = 0;

NL_ref_dm = NL_ref + '/';
NL_ref_dm = NL_ref_dm.substring(0,NL_ref_dm.indexOf('/'));
if(NL_ref_dm == 'hani.co.kr' ) NL_ref_dm = 'www.hani.co.kr' ;
if(NL_ref_dm == 'hani.com' ) NL_ref_dm = 'www.hani.com' ;
NL_tref_dm = NL_ref_dm.substring(NL_ref_dm.indexOf('.')+1,NL_ref_dm.length);
if(NL_tref_dm == 'hani.co.kr' ) NL_tref_dm = 'INSIDE';
if(NL_tref_dm == 'hani.com' ) NL_tref_dm = 'INSIDE';

var NL_param_rl = '';
if( NL_rl.indexOf('?') > 0 ){
	NL_param_rl = NL_rl.substring(NL_rl.indexOf('?')+1,NL_rl.length);
}
var NL_NID = '';
var NL_rl_tmp = NL_rl.split('/');
if( NL_rl_tmp.length > 2 ){
	if(NL_rl_tmp[2] == 'SERIES') NL_NID = NL_rl_tmp[3];
}
var CIDLST = Array(0);

CIDLST['cm_together1'] = '603';
CIDLST['cm_together2'] = '605';
CIDLST['cm_together3'] = '606';
CIDLST['cm_review1'] = '607';
CIDLST['cm_talk1'] = '608';
CIDLST['153'] = '609';
CIDLST['191'] = '610';
CIDLST['cm_talk3'] = '611';
CIDLST['cm_health1'] = '613';
CIDLST['cm_health2'] = '614';
CIDLST['cm_health3'] = '615';
CIDLST['cm_info1'] = '617';
CIDLST['cm_mail1'] = '618';

CIDLST['fnt_trip1'] = '621';
CIDLST['fnt_trip2'] = '622';
CIDLST['fnt_trip3'] = '623';
CIDLST['fnt_trip4'] = '624';
CIDLST['fnt_info1'] = '625';
CIDLST['fnt_info2'] = '626';
CIDLST['fnt_info3'] = '627';
CIDLST['fnt_food1'] = '628';
CIDLST['fnt_food2'] = '629';
CIDLST['fnt_photo'] = '630';
CIDLST['fnt_food3'] = '631';

CIDLST['fnt_div1'] = '632';
CIDLST['fnt_div2'] = '633';
CIDLST['fnt_div3'] = '634';

CIDLST['ep_report1'] = '666';
CIDLST['ep_report2'] = '667';
CIDLST['ep_report3'] = '668';
CIDLST['ep_gallery'] = '669';
CIDLST['ep_nature1'] = '670';
CIDLST['ep_nature2'] = '671';
CIDLST['ep_nature3'] = '672';
CIDLST['ep_blue1'] = '673';
CIDLST['ep_blue2'] = '674';
CIDLST['pv_test'] = '675';
CIDLST['ep_board1'] = '675';
CIDLST['ep_board2'] = '676';
CIDLST['ep_board3'] = '677';

if( NL_param_rl.length > 0 ){
	if( NL_rl.indexOf('/community/news.html?') > 0 ){ NL_NID = get_ace_Value(NL_param_rl,'ssn','&');};
	if( NL_rl.indexOf('/board/list.html?') > 0 ){ NL_NID = get_ace_Value(NL_param_rl,'board_id','&');};
	if( NL_rl.indexOf('/board/view.html?') > 0 ){ NL_kisa='K';NL_NID = get_ace_Value(NL_param_rl,'board_id','&');};
	if( NL_rl.indexOf('/board/write.html?') > 0 ){ NL_NID = get_ace_Value(NL_param_rl,'board_id','&');};
}

// 도메인 매칭 코드 할당


for( i = 0 ; i < VCODELIST.length ; i ++){
	if( NL_dir.indexOf(VCODELIST[i]) == 0 ){
		NL_CODE = LCODELIST[i];
	} 
}
if( NL_NID.length > 0 ){
if( typeof CIDLST[NL_NID] != 'undefined') NL_CODE = CIDLST[NL_NID] ;
}

if( NL_rl.indexOf('www.hani.co.kr/h21') == 0 || NL_rl.indexOf('www.hani.co.kr/section-02') == 0){
	NL_CODE = "105";
}
if( NL_rl.indexOf('www.hani.com/h21') == 0 || NL_rl.indexOf('www.hani.com/section-02') == 0){
	NL_CODE = "105";
}

if( NL_CODE == '102' || NL_CODE == '112'){
  NL_PID = 120;
}
if( NL_CODE == '104' ){
  NL_PID = 210;
}

if( NL_CODE == '102' || NL_CODE == '110' || NL_CODE=='133' || NL_CODE == '115' || NL_CODE == '116' || NL_CODE == '139' || NL_CODE == '140'|| NL_CODE == '142' || NL_CODE == '143' || NL_CODE == '144' || NL_CODE == '145' || NL_CODE == '147' || NL_CODE == '149' || NL_CODE == '517' || NL_CODE == '518' || NL_CODE == '519' || NL_CODE == '520' || NL_CODE == '532' || NL_CODE == '535' || NL_CODE=='538' || NL_CODE=='539' || NL_CODE=='540'|| NL_CODE=='557' || NL_CODE=='124' || NL_CODE =='576' || NL_CODE=='577' || NL_CODE =='578' || NL_CODE == '600' || NL_CODE == '601' || NL_CODE == '863' || NL_CODE == '867' ){
  NL_PID = 100;
  if( NL_ref_dm == 'www.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'books.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'newsletter.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'olympic.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'olympic2.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'graphic1.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'event.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'poll.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'gallery.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'quake.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'pictorial.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'happyvil.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'happyvil2.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'multihani.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'education.hani.co.kr' ) NL_pref_dm = 'INSIDE';

  if( NL_ref_dm == 'www.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'book.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'newsletter.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'olympic.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'olympic2.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'graphic1.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'event.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'poll.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'gallery.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'quake.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'pictorial.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'happyvil.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'multihani.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'education.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'china.hani.co.kr' ) NL_pref_dm = 'INSIDE';
}
if( NL_CODE == '109' || NL_CODE == '118' || NL_CODE == '132' || NL_CODE == '134' || NL_CODE == '141' || NL_CODE == '146' ||NL_CODE=='537'){
  NL_PID = 150;
  if( NL_ref_dm == 'rich.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'tvstar.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'mylinker.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'drapt.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'pr.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'toon.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'gallog.hani.co.kr' ) NL_pref_dm = 'INSIDE';

  if( NL_ref_dm == 'tvstar.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'mylinker.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'drapt.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'pr.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'toon.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'gallog.hani.com' ) NL_pref_dm = 'INSIDE';
}

if( ( NL_CODE == '149' || NL_CODE == '518' || NL_CODE == '110' || NL_CODE=='539' || NL_CODE=='535' || NL_CODE=='578' || NL_CODE=='116' || NL_CODE=='692' || NL_CODE=='867') && ( NL_first_dir.indexOf('kisa/section-') == 0 || NL_first_dir.indexOf('arti/') == 0) ){
  var NL_main_section = '';
  if( NL_first_dir.indexOf('arti/') == 0 ){
	var NL_l_dir = NL_first_dir.split('/');
 	if( NL_l_dir.length > 2 ){
		if(NL_l_dir[NL_l_dir.length-1].indexOf('index')< 0 ) NL_kisa='K';
		NL_main_section = NL_l_dir[0] + '/' + NL_l_dir[1] ;
               	NL_menu = 'main/'+NL_main_section ;
              	NL_top = NL_main_section;
	}
  }
  if( NL_first_dir.indexOf('kisa/section-') == 0 && NL_first_dir.indexOf('/home') <= 0 && NL_first_dir.indexOf('/colu') <= 0){
      NL_kisa = 'K';
  }
  if( NL_menu == '' ){
        if( NL_first_dir.indexOf('kisa/section-0') == 0 ){
	        NL_main_section = NL_first_dir.substring(0,16);
        	NL_menu = 'main/'+NL_main_section ;
        	NL_top = NL_main_section;
        }

  }
}
if( NL_CODE == '102' && ( NL_first_dir.indexOf('section-0') == 0 || NL_first_dir.indexOf('kisa/section-0') == 0 || NL_first_dir.indexOf('arti/') == 0) ){
  var NL_main_section = '';
  var NL_section_var = Array(0);

  NL_section_var['section-001'] = 1 ;
  NL_section_var['section-002'] = 2 ;
  NL_section_var['section-003'] = 3 ;
  NL_section_var['section-004'] = 4 ;
  NL_section_var['section-005'] = 5 ;
  NL_section_var['section-006'] = 6 ;
  NL_section_var['section-007'] = 7 ;
  NL_section_var['section-008'] = 8 ;
  NL_section_var['section-009'] = 9 ;
  NL_section_var['section-010'] = 10 ;
  NL_section_var['section-011'] = 11 ;
  NL_section_var['section-014'] = -3 ;

  NL_section_var['kisa/section-008'] = 1 ;
  NL_section_var['kisa/section-001'] = 3 ;
  NL_section_var['kisa/section-003'] = 4 ;
  NL_section_var['kisa/section-002'] = 5 ;
  NL_section_var['kisa/section-006'] = 6 ;
  NL_section_var['kisa/section-004'] = 7 ;
  NL_section_var['kisa/section-005'] = 9 ;
  NL_section_var['kisa/section-007'] = 10 ;
  NL_section_var['kisa/section-009'] = 11 ;

  NL_section_var['kisa/section-010'] = 29 ;
  NL_section_var['kisa/section-013'] = 398 ;

  NL_section_var['kisa/section-014'] = 419 ; 
  NL_section_var['kisa/section-015'] = 457 ; 

  NL_section_var['arti/politics']= 3 ;
  NL_section_var['arti/society']= 5;
  NL_section_var['arti/economy']= 4;
  NL_section_var['arti/international']=7 ;
  NL_section_var['arti/culture']= 9;
  NL_section_var['arti/sports']= 6;
  NL_section_var['arti/science']= 10;
  NL_section_var['arti/opinion']= 1;
  NL_section_var['arti/cartoon']= 11;
  NL_section_var['arti/happyvil']= 29;
  NL_section_var['arti/education']= 398;

  NL_section_var['arti/english_edition']= 419;
  NL_section_var['arti/specialsection']= 457;
  
  NL_section_var['arti/ISSUE']= -4;

  if( NL_first_dir.indexOf('section-0') == 0 ) NL_main_section = NL_first_dir.substring(0,11);
  if( NL_first_dir.indexOf('kisa/section-0') == 0 ) NL_main_section = NL_first_dir.substring(0,16);

  if( NL_first_dir.indexOf('arti/') == 0 ){
     var NL_l_dir = NL_first_dir.split('/');
     if( NL_l_dir.length > 2 ){
	NL_main_section = NL_l_dir[0] + '/' + NL_l_dir[1] ;
	if(NL_l_dir[NL_l_dir.length-1].indexOf('index')< 0 ) NL_kisa='K';

     }
  }
  if( typeof NL_section_var[NL_main_section] == 'undefined' ){
	NL_sec = 0 ;
  }
  else{
	NL_sec = NL_section_var[NL_main_section];
  }
  if(  (NL_first_dir.indexOf('section-0') == 0  ||  NL_first_dir.indexOf('kisa/section-0') == 0) && ( NL_first_dir.indexOf('/home') <= 0 && NL_first_dir.indexOf('/colu') <= 0)){
      NL_kisa = 'K';
  }
  if( NL_menu == '' ){
	NL_menu = 'main/'+NL_main_section ;
	NL_top = NL_main_section;
  }
}

if( NL_first_dir.indexOf('kisa/section-paperspcl/book/') == 0 ){
	NL_kisa='K';
	NL_CODE='110';
}
if( NL_CODE == '102' && NL_sec != 0 ){
  NL_CODE = parseInt(NL_CODE)+NL_sec+18;
}

// 2012.08.07 hheo 
if( NL_rl_tmp.length == 6 && NL_rl_tmp[5].replace(/[0-9]/g,"") == '.html') {
	if( NL_rl_tmp[0] == 'www.hani.co.kr' && NL_rl_tmp[1] == 'arti'){
		if( NL_rl_tmp[2] == 'society') {
			if( NL_rl_tmp[3] == 'religious' && NL_rl_tmp[4] == 'well') {
				NL_CODE = '824';
			} else if (NL_rl_tmp[3] == 'environment' && NL_rl_tmp[4] == 'ecotopia') {
				NL_CODE = '825';
			} else if (NL_rl_tmp[3] == 'society_general') {
				if (NL_rl_tmp[4] == 'photovil') {
					NL_CODE = '826';
				} else if (NL_rl_tmp[4] == 'babytree') {
					NL_CODE = '828';
				}
			}
		} else if (NL_rl_tmp[2] == 'science' && NL_rl_tmp[3] == 'science_general' && NL_rl_tmp[4] == 'scienceon') {
				NL_CODE = '827';
		} else if (NL_rl_tmp[2] == 'politics' && NL_rl_tmp[3] == 'defense' && NL_rl_tmp[4] == 'defence21') {
				NL_CODE = '829';
		}
	}
}

// 2012.12.26 hheo 커뮤니티 개편 추가
if( typeof log_category != 'undefined' ) {
	switch(log_category) {
		case 'hantoma' :
			NL_CODE = '845';
			break;
		case 'issue' :
			NL_CODE = '834';
			break;
		case 'facebook' :
			NL_CODE = '835';
			break;
		case 'story' :
			NL_CODE = '836';
			break;
		case 'blog' :
			NL_CODE = '837';
			break;
		case 'blog_reporter' :
			NL_CODE = '838';
			break;
		case 'blog_recommend' :
			NL_CODE = '839';
			break;
		case 'today' :
			NL_CODE = '842';
			break;
		case 'sns' :
			NL_CODE = '843';
			break;
		default :
			NL_CODE = '844';
			break;
	}
	NL_PID = 833;
}

// 2013.01.03 hheo - 개인 블로그 추가
if( NL_rl.indexOf('blog.hani.co.kr/') == 0 && NL_rl_tmp.length == 3){
	NL_CODE = '846';
	if( NL_rl_tmp[2]!= ''&&NL_rl_tmp[2].replace(/[0-9]/g,"")==''){
		NL_kisa = 'K';
	}
}

if( NL_CODE == '840' || NL_CODE == '841' || NL_CODE == '844' || NL_CODE == '846' ) {
	NL_PID = 833;
}

if( typeof log_document != 'undefined' && log_document != '') {
	NL_kisa='K';
}

// 2012.10.09 hheo - japan.hani.co.kr 추가
if( NL_CODE == '830' && NL_rl_tmp[1] == 'arti') {
	if( NL_rl_tmp[2] == 'politics' || NL_rl_tmp[2] == 'economy' || NL_rl_tmp[2] == 'internationl' || NL_rl_tmp[2] == 'culture' || NL_rl_tmp[2] == 'opinion' || NL_rl_tmp[2] == 'h21') {
		if( NL_rl_tmp[3].replace(/[0-9]/g,"") == '.html') {
			NL_menu = 'arti/'+NL_rl_tmp[2];
			NL_top = 'arti/'+NL_rl_tmp[2];
			NL_kisa='K';
		}
	} else if( NL_rl_tmp[2] == 'SERIES') {
		if( NL_rl_tmp[3].replace(/[0-9]/g,"") == '' && NL_rl_tmp[4].replace(/[0-9]/g,"") == '.html') {
			NL_menu = 'arti/SERIES';
			NL_top = 'arti/SERIES';
			NL_kisa='K';
		}
	}
}

// 2012.12.28 hheo - na-dle.hani.co.kr 추가 (http://na-dle.hani.co.kr/arti/photo/61.html)
if( NL_CODE == '832' && NL_rl_tmp[1] == 'arti') {
	if( NL_rl_tmp[2] == 'issue' || NL_rl_tmp[2] == 'column' || NL_rl_tmp[2] == 'trend' || NL_rl_tmp[2] == 'economy' || NL_rl_tmp[2] == 'culture' || NL_rl_tmp[2] == 'photo') {
		if( NL_rl_tmp[3].replace(/[0-9]/g,"") == '.html') {
			NL_menu = 'arti/'+NL_rl_tmp[2];
			NL_top = 'arti/'+NL_rl_tmp[2];
			NL_kisa='K';
		}
	}
}

// 2013.02.04 hheo - m.hani.co.kr 기사 추가 (http://m.hani.co.kr/arti/economy/car/572604.html)
if(NL_CODE=='561'){
	if( NL_first_dir.indexOf('arti/') == 0 ){
		var NL_l_dir = NL_first_dir.split('/');
		if( NL_l_dir.length > 2 ){
			NL_main_section = NL_l_dir[0] + '/' + NL_l_dir[1] ;
			if(NL_l_dir[NL_l_dir.length-1].indexOf('index')< 0 ) {
				NL_kisa='K';
				NL_menu = 'main/'+NL_main_section ;
				NL_top = NL_main_section;
			}
		}
	}
}

// 2013.07.02 hheo - se.hani.co.kr 추가
if( parseInt(NL_CODE) >= 848 && parseInt(NL_CODE) <= 853) {
	if( NL_rl_tmp[NL_rl_tmp.length-1].replace(/[0-9]/g,"") == '.html') {
		NL_menu = 'arti/'+NL_rl_tmp[2];
		NL_top = 'arti/'+NL_rl_tmp[2];
		NL_kisa='K';
	} 
}

// 2014.07.16 hheo - 0406.hani.co.kr 모든 페이지 기사
if( parseInt(NL_CODE) >= 865 ) {
		NL_menu = 'arti/0416';
		NL_top = 'arti/0416';
		NL_kisa='K';
}

if( NL_CODE == '105' ){
  NL_PID = 120 ;
  if( NL_ref_dm == 'h21.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref.indexOf('www.hani.co.kr/h21') == 0 ) NL_pref_dm = 'INSIDE';
  if( NL_rl.indexOf('www.hani.co.kr/section-02') == 0 ) NL_pref_dm = 'INSIDE';

  if( NL_ref_dm == 'h21.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref.indexOf('www.hani.com/h21') == 0 ) NL_pref_dm = 'INSIDE';
  if( NL_rl.indexOf('www.hani.com/section-02') == 0 ) NL_pref_dm = 'INSIDE';
}
if( NL_CODE == '105' && NL_first_dir.indexOf('section-0') == 0 ){
  var NL_section_var = Array(0);
  var NL_main_section = '';
  NL_section_var['section-021201000'] = 1 ;
  NL_section_var['section-021003000'] = 1 ;

  NL_section_var['section-021202000'] = 2 ;
  NL_section_var['section-021005000'] = 2 ;
  NL_section_var['section-021007000'] = 2 ;
  NL_section_var['section-021037000'] = 2 ;
  NL_section_var['section-021046000'] = 2 ;
  NL_section_var['section-021078000'] = 2 ;
  NL_section_var['section-021106000'] = 2 ;
  NL_section_var['section-021107000'] = 2 ;

  NL_section_var['section-021203000'] = 3 ;
  NL_section_var['section-021067000'] = 3 ;
  NL_section_var['section-021068000'] = 3 ;

  NL_section_var['section-021204000'] = 4 ;
  NL_section_var['section-021011000'] = 4 ;
  NL_section_var['section-021090000'] = 4 ;
  NL_section_var['section-021095000'] = 4 ;

  NL_section_var['section-021205000'] = 5 ;
  NL_section_var['section-021014000'] = 5 ;
  NL_section_var['section-021045000'] = 5 ;
  NL_section_var['section-021062000'] = 5 ;
  NL_section_var['section-021063000'] = 5 ;
  NL_section_var['section-021064000'] = 5 ;
  NL_section_var['section-021065000'] = 5 ;
  NL_section_var['section-021073000'] = 5 ;
  NL_section_var['section-021076000'] = 5 ;
  NL_section_var['section-021082000'] = 5 ;
  NL_section_var['section-021101000'] = 5 ;
  NL_section_var['section-021108000'] = 5 ;
  NL_section_var['section-021113000'] = 5 ;

  NL_section_var['section-021206000'] = 6 ;
  NL_section_var['section-021019000'] = 6 ;
  NL_section_var['section-021069000'] = 6 ;
  NL_section_var['section-021072000'] = 6 ;

  NL_section_var['section-021207000'] = 7 ;
  NL_section_var['section-021015000'] = 7 ;
  NL_section_var['section-021021000'] = 7 ;
  NL_section_var['section-021071000'] = 7 ;
  NL_section_var['section-021085000'] = 7 ;
  NL_section_var['section-021092000'] = 7 ;

  NL_section_var['section-021208000'] = 8 ;
  NL_section_var['section-021013000'] = 8 ;
  NL_section_var['section-021074000'] = 8 ;
  NL_section_var['section-021077000'] = 8 ;

  NL_section_var['section-021209000'] = 9 ;
  NL_section_var['section-021017000'] = 9 ;
  NL_section_var['section-021084000'] = 9 ;
  NL_section_var['section-021086000'] = 9 ;

  NL_section_var['section-021210000'] = 10 ;
  NL_section_var['section-021014001'] = 10 ;
  NL_section_var['section-021014003'] = 10 ;
  NL_section_var['section-021023000'] = 10 ;
  NL_section_var['section-021066000'] = 10 ;
  NL_section_var['section-021070000'] = 10 ;
  NL_section_var['section-021080000'] = 10 ;
  NL_section_var['section-021081000'] = 10 ;
  NL_section_var['section-021083000'] = 10 ;
  NL_section_var['section-021087000'] = 10 ;
  NL_section_var['section-021088000'] = 10 ;
  NL_section_var['section-021089000'] = 10 ;
  NL_section_var['section-021091000'] = 10 ;
  NL_section_var['section-021093000'] = 10 ;
  NL_section_var['section-021094000'] = 10 ;
  NL_section_var['section-021096000'] = 10 ;
  NL_section_var['section-021097000'] = 10 ;
  NL_section_var['section-021098000'] = 10 ;
  NL_section_var['section-021099000'] = 10 ;
  NL_section_var['section-021100000'] = 10 ;
  NL_section_var['section-021101000'] = 10 ;
  NL_section_var['section-021102000'] = 10 ;
  NL_section_var['section-021103000'] = 10 ;
  NL_section_var['section-021105000'] = 10 ;
  NL_section_var['section-021109000'] = 10 ;
  NL_section_var['section-021110000'] = 10 ;
  NL_section_var['section-021111000'] = 10 ;
  NL_section_var['section-021112000'] = 10 ;

  NL_section_var['section-021211000'] = 11 ;
  NL_section_var['section-021027000'] = 11 ;
  NL_section_var['section-021035000'] = 11 ;
  NL_section_var['section-021043000'] = 11 ;
  NL_section_var['section-021047000'] = 11 ;
  NL_section_var['section-021104000'] = 11 ;

  NL_section_var['section-021212000'] = 12 ;
  NL_section_var['section-021024000'] = 12 ;
  NL_section_var['section-021025000'] = 12 ;
  NL_section_var['section-021029000'] = 12 ;
  NL_section_var['section-021031000'] = 12 ;
  NL_section_var['section-021038000'] = 12 ;
  NL_section_var['section-021061000'] = 12 ;

  NL_main_section = NL_first_dir.substring(0,17);

  if( typeof NL_section_var[NL_main_section] == 'undefined' ){
	NL_sec = 0 ;
  }
  else{
	NL_sec = NL_section_var[NL_main_section];
  }

  if( NL_first_dir.indexOf('/home') <= 0 && NL_first_dir.indexOf('/colu') <= 0 ){
      NL_kisa = 'K';
  }
  if( NL_menu == '' ){
	NL_menu = 'hani21/'+NL_main_section ;
	NL_top=NL_first_dir.substring(43,47);
  }
}
if( NL_CODE == '105' && NL_sec > 0 ){
	NL_CODE = parseInt(NL_CODE)+NL_sec+45;
}
if( NL_CODE == '117' || NL_CODE=='561'){
  NL_PID = 0;
}
if( NL_CODE.length == 3 ){
	if( parseInt(NL_CODE) > 602 && parseInt(NL_CODE) <= 618 ) NL_PID = 602 ;
	if( parseInt(NL_CODE) > 619 && parseInt(NL_CODE) <= 634 ) NL_PID = 619 ;
	if( parseInt(NL_CODE) > 664 && parseInt(NL_CODE) <= 677 ) NL_PID = 664 ;
	if( parseInt(NL_CODE) >= 848 && parseInt(NL_CODE) <= 853 ) NL_PID = 847 ;
}

// 2014.07.02 기사 분석 기준 변경
if( NL_first_dir.indexOf('arti/') == 0 ){
	var NL_l_dir = NL_first_dir.split('/');
	if( NL_l_dir.length > 2 ){
		var NL_main_section = NL_l_dir[0] + '/' + NL_l_dir[1] ;
		if(NL_l_dir[NL_l_dir.length-1].indexOf('.html')> 0 ) {
			NL_kisa='K';
			NL_menu = 'main/'+NL_main_section ;
			NL_top = NL_main_section;
		}
	}
}

// 2016.08.12 카드뉴스 추가
if( NL_CODE == '147' && (NL_rl.indexOf('hani.co.kr/?')>0 && get_ace_Value(NL_param_rl,'sec','&')=='098') || (NL_rl.indexOf('hani.co.kr/slide.hani?')>0 && get_ace_Value(NL_param_rl,'sec1','&')=='098') || (NL_rl.indexOf('hani.co.kr/slide_frame.hani?')>0 && get_ace_Value(NL_param_rl,'sec1','&')=='098') ){
	NL_CODE = '878';
	NL_PID = '819';
}

NL_cd=(NL_bn=="MSIE")?screen.colorDepth:screen.pixelDepth;
NL_UA = navigator.userAgent;
NL_ua = navigator.userAgent.toLowerCase();
if (navigator.language) {  NL_ul = navigator.language.toLowerCase();
} else if (navigator.userLanguage) {  NL_ul = navigator.userLanguage.toLowerCase();}
NL_start = NL_UA.indexOf('(') + 1;
NL_end = NL_UA.indexOf(')');
NL_str = NL_UA.substring(NL_start, NL_end);
NL_info = NL_str.split('; ');
NL_Component = 'UNKNOWN' ;
if (NL_ua.indexOf('msie') != -1) {
  NL_Component = navigator.appName;
  NL_str = NL_info[1].substring(5, NL_info[1].length);
  NL_version = parseFloat(NL_str);
} else if ( NL_ua.indexOf('opera') != -1 ){
  NL_Component = "Opera" ;
} else if ((NL_st = NL_ua.indexOf('firefox')) >0 ){
  NL_Component = "Firefox" ;
  NL_version = NL_ua.substring(NL_st+8, NL_ua.indexOf('.',NL_st+8));   
} else if ((NL_st = NL_ua.indexOf('chrome')) > 0){ 
  NL_Cmp = 'Chrome'; 
  NL_version = parseFloat(NL_ua.substring(NL_st+7,NL_ua.indexOf(' ',NL_st+7))); 
} else if ((NL_st = NL_ua.indexOf('safari')) > 0){ 
  NL_Cmp = "Safari";  
  NL_version = parseFloat(NL_ua.substring(NL_st+7, NL_ua.indexOf(' ',NL_st+7))); 
} else if ((NL_start = NL_ua.indexOf("netscape6")) > 0) {
  NL_Component = "Netscape";
  NL_version = NL_ua.substring(NL_start+10, NL_ua.length);
  if ((NL_start = NL_version.indexOf("b")) > 0 ) {
    NL_str = NL_version.substring(0,NL_version.indexOf("b"));
    NL_version = NL_str ;
  }
} else if ((NL_start = NL_ua.indexOf("netscape/7")) > 0) {
  NL_Component = "Netscape";
  NL_version = NL_ua.substring(NL_start+9, NL_ua.length);
  if ((NL_start = NL_version.indexOf("b")) > 0 ) {
    NL_str = NL_version.substring(0,NL_version.indexOf("b"));
    NL_version = NL_str ;
  }
} else {
  if (NL_ua.indexOf("gecko") > 0) {
    NL_Component = "Mozilla";
  } else if (NL_ua.indexOf("nav") > 0) {
    NL_Component = "Netscape Navigator";
  } else {
    NL_Component = navigator.appName ;;
  }
}
if (parseInt(NL_version) == parseFloat(NL_version)) {  NL_version = NL_version + ".0"; }
NL_bz = NL_Component ;

if( NL_pf.indexOf('undefined') >= 0 || NL_pf ==  '' ){ NL_os = 'UNKNOWN' ;}
else{ NL_os = NL_pf ; }

if( NL_os.indexOf('Win32') >= 0 ){
if( NL_av.indexOf('98')>=0){ NL_os = 'Windows 98' ; }
else if( NL_av.indexOf('95')>=0 ){ NL_os = 'Windows 95' ; }
else if( NL_av.indexOf('Me')>=0 ){ NL_os = 'Windows Me' ; }
else if( NL_av.indexOf('NT')>=0 ){ NL_os = 'Windows NT' ; }
else{ NL_os = 'Windows' ; }
if( NL_av.indexOf('NT 5.0')>=0){ NL_os = 'Windows 2000' ; }
if( NL_av.indexOf('NT 5.1')>=0){ NL_os = 'Windows XP' ; }
if( NL_av.indexOf('NT 5.2')>=0){ NL_os = 'Windows Server 2003' ; }
if( NL_av.indexOf('NT 6.0')>=0){ NL_os = 'Windows Vista' ; }
if( NL_av.indexOf('NT 6.1')>=0){ NL_os = 'Windows 7' ; }
}
NL_pf_substr = NL_pf.substring(0,4);

if( NL_pf_substr == 'Wind'){
if( NL_pf_substr == 'Win1'){ NL_os = 'Windows 3.1'; }
else if( NL_pf_substr == 'Mac6' ){ NL_os = 'Mac' ; }
else if( NL_pf_substr == 'MacO' ){ NL_os = 'Mac' ; }
else if( NL_pf_substr == 'MacP' ){ NL_os = 'Mac' ; }
else if(  NL_pf_substr == 'Linu' ){ NL_os = 'Linux' ; }
else if(  NL_pf_substr == 'WebT' ){ NL_os = 'WebTV' ; }
else if(  NL_pf_substr =='OSF1' ){ NL_os = 'Compaq Open VMS' ; }
else if(  NL_pf_substr == 'HP-U' ){ NL_os = 'HP Unix' ;}
else if(  NL_pf_substr == 'OS/2' ){ NL_os = 'OS/2' ;}
else if( NL_pf_substr == 'AIX4' ){ NL_os = 'AIX';}
else if( NL_pf_substr == 'Free' ){ NL_os = 'FreeBSD';}
else if( NL_pf_substr == 'SunO' ){ NL_os = 'SunO';}
else if( NL_pf_substr == 'Drea' ){ NL_os = 'Drea'; }
else if( NL_pf_substr == 'Plan' ){ NL_os = 'Plan'; }
else{ NL_os = 'UNKNOWN'; }
}
if( NL_cpu == 'x86' ){ NL_cpu = 'Intel x86';}
else if( NL_cpu == 'PPC' ){ NL_cpu = 'Power PC';}
else if( NL_cpu == '68k' ){ NL_cpu = 'Motorola 680x';}
else if( NL_cpu == 'Alpha' ){ NL_cpu = 'Compaq Alpa';}
else if( NL_cpu == 'Arm' ){ NL_cpu = 'ARM';}
else{ NL_cpu = 'UNKNOWN';}
if( NL_dim == '' || NL_dim == 'undefined'){ NL_dim = '0*0';}

