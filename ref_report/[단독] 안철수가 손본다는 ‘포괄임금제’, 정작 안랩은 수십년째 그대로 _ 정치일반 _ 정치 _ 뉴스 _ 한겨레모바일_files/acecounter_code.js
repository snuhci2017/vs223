var NU_rl = 'http://'+'gather.ihani.co.kr:9003'; var PCHKIMG = new Image(); var NL_bn=navigator.appName;
if( NL_bn.indexOf("Netscape") > -1 || NL_bn=="Mozilla"){
setTimeout("PCHKIMG.src = NU_rl+'/?cookie';",1); } else{ PCHKIMG.src = NU_rl+'/?cookie'; };

document.write("<script>");
document.write("var NL_ag='"+cookieVal("DT602AG")+"'\n");
document.write("var NL_id='"+cookieVal("NL_id")+"'\n");
document.write("var NL_mr='"+cookieVal("NL_mr")+"'\n");
document.write("var NL_gd='"+cookieVal("NL_gd")+"'\n");
document.write("var_NL_inc='"+cookieVal("NL_inc")+"'\n");
document.write("var NL_loc='"+cookieVal("NL_loc")+"'\n");
document.write("var NL_qut='"+cookieVal("DT602R")+"'\n");
document.write("var NL_iul='"+cookieVal("NL_site")+"'\n");

document.write("</script>");
 
function cookieVal(cookieName){ 
 thisCookie = document.cookie.split("; "); 
 for(i=0; i<thisCookie.length; i++){ 
  if(cookieName == thisCookie[i].split("=")[0]) { 
  return thisCookie[i].split("=")[1]; 
  } 
 } 
  if (cookieName == "DT602AG") return 0; 
  else if (cookieName == "NL_id") return ""; 
  else if (cookieName == "NL_mr") return "unknown"; 
  else if (cookieName == "NL_gd") return "unknown"; 
  else if (cookieName == "NL_inc") return 0; 
  else if (cookieName == "NL_loc") return ""; 
  else if (cookieName == "DT602R") return 0; 
  else if (cookieName == "NL_site") return ""; 
  else return "";  
} 

 

document.write("<script language='javascript' src='http://www.hani.co.kr/section-homepage/las/ebizcode_1.js'></script>");
document.write("<script language='javascript1.1' id='_PL_hdc'> PL_sv=11 ; </script>");
document.write("<script language='javascript1.1' src='http://www.hani.co.kr/section-homepage/las/ebizcode_2.js'></script>");
document.write("<script language='javascript' src='http://www.hani.co.kr/section-homepage/las/ebizcode_3.js'></script>");

