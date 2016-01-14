var nationMap = function(){
	var tooltip = d3.select("#nation-map").append("div")
	    .attr("id", "tooltip")
	    .style("display", "none")
	    .style("position", "absolute")
	    .html("<label><span id=\"tt_county\"></span></label>");

	var rateById = d3.map();

	var width = $("#nation-map").width();
	var height = $("#nation-map").height();

	var scale = (width<height?width:height) + 50;

	console.log("width:"+width+"height:"+height+"scale"+scale);
	
	var svg = d3.select("#nation-map").append("svg")
	    .attr("width", width)
	    .attr("height", height);

	queue()
	    .defer(d3.json, "data/china_cities.json")
	    .defer(d3.json, "data/china_provinces.json")
	    .defer(d3.csv, "data/china_cities.csv", function(d) {rateById.set(d.id, +d.value);})
	    .await(makeMap);

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
	        .on("mouseover", function(d) {
	           	d3.select(this).classed("focus-highlight",true);
	            var m = d3.mouse(d3.select("#nation-map").node());
	            tooltip.style("display", null)
	                .style("left", m[0] + 10 + "px")
	                .style("top", m[1] - 10 + "px");
	            $("#tt_county").text(d.properties.name);
	            console.log("country",d);
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