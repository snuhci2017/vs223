// 멀티 flow layer 처리
// 멀티 bounce layer 처리 
// 개발팀 김태오 

// flow layer : s

var initTopArr = Array();
var layerIDArr = Array();
var adposTopArr = Array();

var layer = Array();
var currentTop = Array();
var baseTop = Array();
var nextTop = Array();
var distance = Array();

function FlowLayer( id, initTop ) {
	
	var layer = document.getElementById(id);
	layer.style.top = initTop;
	
	

	layerIDArr[cnt] = id;	
	adposTopArr[cnt] = initTop;		
	initTopArr[cnt] = initTop;

	
	_FlowBannerAd ( cnt );

	cnt++;	
	

}

function _FlowBannerAd(idx) {		
	layer[idx] = document.getElementById(layerIDArr[idx]);	
	currentTop[idx] = parseInt( layer[idx].style.top );
	baseTop[idx] = parseInt( document.body.scrollTop );
	nextTop[idx] = baseTop[idx] + initTopArr[idx];
	distance[idx] = ( nextTop[idx] - currentTop[idx] ) / 5;	
	
	
	if(baseTop[idx] > adposTopArr[idx]) initTopArr[idx] = 10;
	else 	initTopArr[idx] = adposTopArr[idx];

	if ( distance[idx] > 50 )
		distance[idx] = 50;
	else if ( distance[idx] < -50 )
		distance[idx] = -50;
	

	layer[idx].style.top = currentTop[idx] + distance[idx];
	setTimeout( "_FlowBannerAd("+idx+")", 3 );
}
// flow layer : e

// bounce layer : s
var ie=document.all
var dom=document.getElementById
var ns4=document.layers
var calunits=document.layers? "" : "px"

				
var direction="up"
var crossobj = Array();
var bouncestart = Array();
var dropstart = Array();
var bouncelimit = Array();
var objTop = Array();
var cnt = 0;

function openDropinPopup(obj, top){
										
	crossobj[cnt]=(dom)?document.getElementById(obj).style : ie? document.all.dropin : document.dropin
					
	scroll_top=(ie)? truebody().scrollTop : window.pageYOffset
	crossobj[cnt].top=0+calunits
	crossobj[cnt].visibility=(dom||ie)? "visible" : "show"
	objTop[cnt] = top
	dropstart[cnt]=setInterval("dropin("+cnt+")",50)
					
	cnt++;	 						
}

function dropin(idx){	

	scroll_top=(ie)? truebody().scrollTop : window.pageYOffset
						
	if (parseInt(crossobj[idx].top)<objTop[idx])				
		crossobj[idx].top=parseInt(crossobj[idx].top)+objTop[idx]+calunits
	else{
		bouncelimit[idx]=32 //(must be divisible by 8)
		clearInterval(dropstart[idx])
		bouncestart[idx]=setInterval("bouncein("+idx+")",50)					
	}
}

function bouncein(idx){
	crossobj[idx].top=parseInt(crossobj[idx].top)-bouncelimit[idx]+calunits
	if (bouncelimit[idx]<0)
		bouncelimit[idx]+=8
		bouncelimit[idx]=bouncelimit[idx]*-1
	if (bouncelimit[idx]==0){
		clearInterval(bouncestart[idx])					
	}
}				

function truebody(){
	return (document.compatMode && document.compatMode!="BackCompat")? document.documentElement : document.body
}
// bounce layer : e