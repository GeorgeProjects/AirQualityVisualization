var provinceMap = function(){
	var provinceMapView = new Object();
	ObserverManager.addListener(provinceMapView);

	var tooltip = d3.select("#province-map").append("div")
	    .attr("id", "tooltip")
	    .style("display", "none")
	    .style("position", "absolute")
	    .html("<label><span id=\"tt_province\"></span></label>");

	var rateById = d3.map();

	var margin_province = {top: 0, right: 5, bottom: 5, left: 5},
    	width_province = width - margin_province.left - margin_province.right,
    	height_province = height - margin_province.top - margin_province.bottom;

	var width = $("#province-map").width();
	var height = $("#province-map").height();

	var scale = (width<height?width:height) + 80;

	var svg = d3.select("#province-map").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .append("g")
	    .attr("transform", "translate(" + margin_province.left + "," + margin_province.top + ")");

	//--------------------------------------------------
	provinceMapView.OMListen = function(message,data){
		if(message == "focus-province"){
			drawProvince(data);
		}
		if(message == "clock"){
			encodeHis(data);
		}
	}
	//---------------------------------------------------
	drawProvince("shandong");

	function drawProvince(province){
		mapScale = dict[province];
		var path = "data/city_json/" + province + ".json";
		queue()
			.defer(d3.json, path)
			.defer(d3.json, path)
			.defer(d3.csv, path, function(d) {rateById.set(d.id, +d.value);})
			.await(makeMap);
	}
	function encodeHis(dayNum){
		var folderPath = "data/data_day_csv/";
		var fileName = pad(dayNum,5);
		var filePath = folderPath + fileName + ".csv";
		d3.csv(filePath,function(data){
			for(var i = 0;i < data.length;i++){
				var cityName = data[i].index;
				var pollution = +data[i].date;
				svg.select("#" + cityName)
					.attr("fill",function(d){
						//return compute(colorLinear(pollution))
						return colorEncoded(pollution);
					});
				var name = svg.select("#" + cityName);
				/*.append("rect")
					.attr("id","hhhhh")
					.attr("width",5)
					.attr("height",10)
					.attr("fill","blue")*/
			}
		})
	}
	function pad(num, size) {
	    var s = num+"";
	    while (s.length < size) s = "0" + s;
	    return s;
	}
	function makeMap(error, counties, states) {
		var center = d3.geo.centroid(states)
		var proj = d3.geo.mercator().center(center).scale(mapScale).translate([width/2, height/2]);
		var path = d3.geo.path().projection(proj);

		svg.selectAll("*").remove();

		svg.append("g")
		    .attr("class", "states")
		    .selectAll("path")
		    .data(states.features)
		    .enter()
		    .append("g")
			.attr("class",function(d){return "city "+ "q" + rateById.get(d.id);})
			.attr("id",function(d){
				var cityName = d.properties.name;
				cityName = cityName.replace("市","");
				return cityName;
			})
			.on("mouseover", function(d) {
	           	d3.select(this).classed("focus-highlight",true);
		        var m = d3.mouse(d3.select("#province-map").node());
		        tooltip.style("display", null)
		            .style("left", m[0] + 10 + "px")
		            .style("top", m[1] - 10 + "px");
		        $("#tt_province").text(d.properties.name);
		    })
		    .on("mouseout", function() {
		         tooltip.style("display", "none");
	           	 d3.select(this).classed("focus-highlight",false);
		    })
		    .on("click",function(d){
		    	var cityName = d3.select(this).attr("id");
		    })
		    .append("path")
		    .attr("class", function(d) { return "q" + rateById.get(d.id); })
		    .attr("d", path);

		 	encodeHis(2);
		}
}