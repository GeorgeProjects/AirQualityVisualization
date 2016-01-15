function colorEncoded(aqi){
	if((aqi>=0)&&(aqi<=50)){
		return d3.rgb(0,228,0);
	}
	else if((aqi>=51)&&(aqi<=100)){
		return d3.rgb(255,255,0);
	}
	else if((aqi>=101)&&(aqi<=150)){
		return d3.rgb(255,126,0);
	}
	else if((aqi>=151)&&(aqi<=200)){
		return d3.rgb(255,0,0);
	}
	else if((aqi>=201)&&(aqi<=299)){
		return d3.rgb(153,0,76);
	}
	else if((aqi>=300)){
		return d3.rgb(126,0,35);
	}
}