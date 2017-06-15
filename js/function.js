$(function(){
	$("#star_btn").click(function(){
		var input1, input2, input3;
		var output1, output2, output3, output4;
		$("#cal_output").show();

		input1=$("#input1").val()*1;
		input2=$("#input2").val()*1;
		input3=$("#input3").val()*1;

		if(input1 < 0)
			input1= 0;
		if(input2 < 0)
			input2= 0;
		if(input3 < 0)
			input3= 0;
		if(input3 > 7)
			input3= 7;


		output1 = input1;
		output3 = 0;
		if(input3 != 0){
			var avg_time = input2/input3;
			//time per day
			var pay = input1/12/209;
			//pay per time
			var days = input3 / 7 * 365;
			if(avg_time > 3){
				output3 = pay*(3*1.5 + (avg_time - 3)*2) * days;
			}
			else{
				output3 = pay*avg_time*1.5 * days;
			}
		}
		output2 = output3 + output1;
		output4 = 0;
		if(output1 > 0) 
			output4 = (output3/output1 * 100);

		$("#output1").text(output1.toFixed(2) + " won");
		$("#output2").text(output2.toFixed(2) + " won");
		$("#output3").text(output3.toFixed(2) + " won");
		$("#output4").text(output4.toFixed(2) + " %");

	});
	$("#cal_output").hide();
	
});