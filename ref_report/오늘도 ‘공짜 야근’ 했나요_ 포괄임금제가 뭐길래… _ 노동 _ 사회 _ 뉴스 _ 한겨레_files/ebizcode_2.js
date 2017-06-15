var _lxit=new Object();
var _NL_hdki = new Image() ;
var _NL_hdki_xit = new Image() ;
var _lwd=window.document;
//if(k.indexOf('://')>0) k=k.substring(k.indexOf('://')+3,k.length);

if( window.screen ){
NL_sv=12;
NL_dim=window.screen.width+'*'+window.screen.height;
}
if(NL_bn=="MSIE"){
        if(NL_bv>=4){ NL_sv=12;}
        if( NL_bv >= 5){ NL_sv = 13;}
}
if(NL_bn.indexOf("Netscape") > -1 ||NL_bn=="Mozilla"||NL_bn=="Opera"){
if(NL_bv>=3){ NL_sv = 11 ;}
if(NL_bv>=4){ NL_sv = 12 ;}
if(NL_bv>=4.06){ NL_sv=13 ; }
if(NL_dim=='undefined'){ NL_dim='UNKNOWN'; }
}

function _lxit_at(k,w,i){
if( typeof k =='undefined') return ;
NL_ref_dm = k + '/';
if(NL_ref_dm.indexOf('://')>0) NL_ref_dm=NL_ref_dm.substring(NL_ref_dm.indexOf('://')+3,NL_ref_dm.length);
NL_ref_dm = NL_ref_dm.substring(0,NL_ref_dm.indexOf('/'));
if(NL_ref_dm == 'hani.co.kr' ) NL_ref_dm = 'www.hani.co.kr' ;
if(NL_PID == 100 ){
  if( NL_ref_dm == 'www.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'books.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'movie1.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'newsletter.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'olympic.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'olympic2.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'graphic1.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'newsrank.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'event.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'poll.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'gallery.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'quake.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'pictorial.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'happyvil.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'happyvil2.hani.co.kr' ) NL_pref_dm = 'INSIDE';

  if( NL_ref_dm == 'www.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'books.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'movie1.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'newsletter.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'olympic.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'olympic2.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'graphic1.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'newsrank.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'event.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'poll.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'gallery.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'quake.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'pictorial.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'happyvil.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'happyvil2.hani.com' ) NL_pref_dm = 'INSIDE';
}
if(NL_PID == 150 ){
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
if(NL_PID == 120 ){
  if( NL_ref_dm == 'h21.hani.co.kr' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'bbs.hani.co.kr' ) NL_pref_dm = 'INSIDE';

  if( NL_ref_dm == 'h21.hani.com' ) NL_pref_dm = 'INSIDE';
  if( NL_ref_dm == 'bbs.hani.com' ) NL_pref_dm = 'INSIDE';

}

var t='';
if(typeof link_idx != 'undefined' ) try{eval("t = link_idx[i]") ;}catch(_e){t=''};
if( t !='' && t != undefined && t >= 5000 ) i = t ;

_NL_hdki_xit.src=NU_rl+'/?xuid='+NL_CODE+'&pid='+NL_PID+'&pref='+NL_pref_dm+'&url='+escape(NL_rl)+"&xlnk="+escape(k)+"&xidx="+i+"&";

return (w.lnk[i]&&w.lnk[i].oc)?w.lnk[i].oc():1;
}

function _NL_exit(){
_lxit.lnk=new Array(_lwd.links.length);
for(var i=0;i<_lwd.links.length;i++){
if(_lwd.links[i].onclick){
_lxit.lnk[i]=document.links[i];
_lxit.lnk[i].oc=document.links[i].onclick;
}
eval("document.links[i].onclick=function(){return _lxit_at(this,_lxit,"+i+");}");
}
}

NL_arg = NU_rl + "/?uid=" + NL_CODE + '&tid='+NL_TID+'&pid='+NL_PID ;
NL_arg += "&cpu="+NL_cpu+"&bz="+NL_bz+"&bv="+NL_version+"&os="+NL_os+'&pref='+NL_pref_dm+'&tref='+NL_tref_dm;
NL_arg += "&dim="+NL_dim+"&cd="+NL_cd+"&je="+NL_je+"&ref="+escape(NL_ref)+"&url="+escape(NL_rl)+'&menu='+escape(NL_menu)+'&title='+escape(NL_name)+'&';
NL_arg += "&jv="+NL_sv+"&tz="+NL_tz+"&ul="+NL_ul+"&ad_key="+escape(NL_ad_key)+"&skey="+escape(NL_skey)+"&tp="+NL_top+"&qut="+NL_qut+"&iul="+NL_iul ;
NL_arg += "&ks="+NL_kisa+"&age="+NL_ag+"&gender="+NL_gd+"&marry="+NL_mr+"&join="+NL_jn+"&member_key="+NL_id+"&inc="+NL_inc+"&loc="+escape(NL_loc)+"&";
if( NL_bn.indexOf("Netscape") > -1 ||NL_bn=="Mozilla"){ setTimeout("_NL_hdki.src = NL_arg;",1);}
else{   _NL_hdki.src = NL_arg;}
if( NL_sv>11 ){
        if( window.onload ){
        _NL_wo=window.onload;
        window.onload=new Function("_NL_wo();_NL_exit()");
        }
        else{
        window.onload=new Function("_NL_exit()");
        }
}


