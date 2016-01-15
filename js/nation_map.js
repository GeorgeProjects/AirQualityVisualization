var nationMap = function(){
	var nationMapView = new Object();
	ObserverManager.addListener(nationMapView);

	var tooltip = d3.select("#nation-map").append("div")
	    .attr("id", "tooltip")
	    .style("display", "none")
	    .style("position", "absolute")
	    .html("<label><span id=\"tt_county\"></span></label>");

	var rateById = d3.map();

	var margin_nation = {top: 20, right: 5, bottom: 5, left: 5},
    	width_nation = width - margin_nation.left - margin_nation.right,
    	height_nation = height - margin_nation.top - margin_nation.bottom;

	var width = $("#nation-map").width();
	var height = $("#nation-map").height();

	var scale = (width<height?width:height) + 80;

	
	var svg = d3.select("#nation-map").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .append("g")
      	.attr("transform", "translate(" + margin_nation.left + "," + margin_nation.top + ")");

    //-------------------------------------------------------
    nationMapView.OMListen = function(message,data){
    	if(message == "clock"){
    		encodeColor(data);
    	}
	}
	//--------------------------------------------------------
	queue()
	    .defer(d3.json, "data/china_cities.json")
	    .defer(d3.json, "data/china_provinces.json")
	    .defer(d3.csv, "data/china_cities.csv", function(d) {rateById.set(d.id, +d.value);})
	    .await(makeMap);


	function encodeColor(dayNum){
		fileName = pad(dayNum,5);
		filePath = "data/data_pro_csv/" + fileName + ".csv";
		d3.csv(filePath,function(data){
			/*colorLinear.domain(d3.extent(data,function(d){
				var avg = +d.average;
				return avg;}));*/
			for(var i = 0;i < data.length;i++){
				svg.select("#" + data[i].province)
					.attr("fill",function(d){
						var avg = +data[i].average;
						//return compute(colorLinear(avg));
						return colorEncoded(avg);
					})
			}
		});
	}
	function pad(num, size) {
	    var s = num+"";
	    while (s.length < size) s = "0" + s;
	    return s;
	}
	function makeMap(error, counties, states) {
		var center = d3.geo.centroid(states)
		var proj = d3.geo.mercator().center(center).scale(scale).translate([width/2, height/2]);
		var path = d3.geo.path().projection(proj);

	    svg.append("g")
	        .attr("class", "states")
	        .selectAll("path")
	        .data(states.features)
	        .enter()
	        .append("g")
	        .attr("class",function(d){return "q" + rateById.get(d.id);})
	        .attr("id",function(d){
	        	var proName = d.id;
	        	if(proName == "shan_xi_1"){
	        		proName = "shan3xi";
	        	}
	        	if(proName == "shan_xi_2"){
	        		proName = "shan1xi";
	        	}
	        	if(proName == "hei_long_jiang"){
	        		proName = "haerbin";
	        	}
	        	var proName = proName.replace("_","");
	        	var proName = proName.replace("_","");
	        	return proName;
	        })
	        .on("mouseover", function(d) {
	           	d3.select(this).classed("focus-highlight",true);
	            var m = d3.mouse(d3.select("#nation-map").node());
	            tooltip.style("display", null)
	                .style("left", m[0] + 10 + "px")
	                .style("top", m[1] - 10 + "px");
	            $("#tt_county").text(d.properties.name);
	        })
	        .on("mouseout", function() {
	            tooltip.style("display", "none");
	           	d3.select(this).classed("focus-highlight",false);
	        })
	        .on("click",function(d,i){
	        	var proName = (d.id).replace("_","");
	        	proName = proName.replace("_","");
	        	if(d.id == "shan_xi_1"){
	        		proName = "shan3xi";
	        	}
	        	if(d.id == "shan_xi_2"){
	        		proName = "shan1xi";
	        	}
	        	if(d.id == "ao_men"){
	        		proName = "macau";
	        	}
	        	if((d.id != "xiang_gang") && (d.id != "ao_men")){
	        		ObserverManager.post("focus-province",proName);
	        	}
	        })
	        .append("path")
	        .attr("class", function(d) { return "q" + rateById.get(d.id); })
	        .attr("d", path);

	   	encodeColor(1);
	}
}