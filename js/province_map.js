var provinceMap = function(){
	var tooltip = d3.select("#province-map").append("div")
	    .attr("id", "tooltip")
	    .style("display", "none")
	    .style("position", "absolute")
	    .html("<label><span id=\"tt_province\"></span></label>");

	var rateById = d3.map();

	var width = $("#province-map").width();
	var height = $("#province-map").height();

	var scale = (width<height?width:height) + 80;

	console.log("width:"+width+"height:"+height+"scale"+scale);

	var svg = d3.select("#province-map").append("svg")
	    .attr("width", width)
	    .attr("height", height);

	drawProvince("liaoning");

	function drawProvince(province){
		var path = "data/city_json/" + province + ".json";
		queue()
		.defer(d3.json, path)
		.defer(d3.json, path)
		.defer(d3.csv, path, function(d) {rateById.set(d.id, +d.value);})
		.await(makeMap);
	}
	function makeMap(error, counties, states) {
		var center = d3.geo.centroid(states)
		var proj = d3.geo.mercator().center(center).scale(3000).translate([width/2, height/2]);
		var path = d3.geo.path().projection(proj);

		svg.append("g")
		    .attr("class", "states")
		    .selectAll("path")
		    .data(states.features)
		    .enter()
		    .append("g")
			.attr("class",function(d){return "q" + rateById.get(d.id);})
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
		    .append("path")
		    .attr("class", function(d) { return "q" + rateById.get(d.id); })
		    .attr("d", path);
		}
}