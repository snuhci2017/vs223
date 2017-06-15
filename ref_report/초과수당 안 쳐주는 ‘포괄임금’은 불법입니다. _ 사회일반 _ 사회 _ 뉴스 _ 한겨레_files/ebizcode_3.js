if( NL_sv==10){
if( (NL_ref=='undefined')||( NL_ref == '' )) NL_ref = 'bookmark' ;
NL_arg = "<img src='" + NU_rl + "/?uid=" + NL_CODE+'&tid='+NL_TID+'&pid='+NL_PID ;
NL_arg += "&cpu="+NL_cpu+"&bz="+NL_bz+"&bv=4.0&os="+NL_os+'&pref='+NL_pref_dm+'&tref='+NL_tref_dm;
NL_arg += "&dim=640*480&cd=8&je=0&ck=0&ref="+escape(NL_ref)+"&url="+escape(NL_rl)+'&menu='+escape(NL_menu)+'&title='+escape(NL_name)+'&';
NL_arg += "&jv=10&tz="+NL_tz+"&ul="+NL_ul+"&ad_key="+escape(NL_ad_key)+"&skey="+escape(NL_skey)+"&tp="+NL_top;
NL_arg += "&ks="+NL_kisa+"&age="+NL_ag+"&gender="+NL_gd+"&marry="+NL_mr+"&join="+NL_jn+"&member_key="+NL_id+"&inc="+NL_inc+"&loc="+escape(NL_loc)+"&";
NL_arg += "&' border=0>" ;
document.write(NL_arg);}
