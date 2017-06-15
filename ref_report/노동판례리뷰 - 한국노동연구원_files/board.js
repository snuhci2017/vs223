jQuery(function(){
	//faq
	$('#board .faq a.tit').click(function(event){
		var $target=$(event.target);
		if($target.is('.open')){
			$(this).removeClass('open').next('.cont').slideUp('fast');
		}else{
			$(this).addClass('open').next('.cont').show();
		};
		return false;
	});

	$('#board.precedent li.titA').css('display','none');
	$('#board.precedent li.titA#SJ').css('display','block');//제목
	$('#board.precedent li.titA#ADITFIELD1').css('display','block');//사건번호
	$('#board.precedent li.titA#CN').css('display','block');//판결요지
	$('#board.precedent .precedent_ctl .close').css('display','none');

	
});

function precedent_view(stu){
	if(stu == "open"){
		$('#board.precedent li.titA').css('display','block');
		$('#board.precedent .precedent_ctl .close').css('display','inline-block');
		$('#board.precedent .precedent_ctl .open').css('display','none');
	}else{
		$('#board.precedent li.titA').css('display','none');
		$('#board.precedent li.titA#SJ').css('display','block');//제목
		$('#board.precedent li.titA#ADITFIELD1').css('display','block');//사건번호
		$('#board.precedent li.titA#CN').css('display','block');//판결요지
		$('#board.precedent li.titA#CN').css('display','block');//판결요지
		$('#board.precedent .precedent_ctl .close').css('display','none');
		$('#board.precedent .precedent_ctl .open').css('display','inline-block');
	}
}