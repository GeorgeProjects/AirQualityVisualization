var allHis = function(){
	allHisView = new Object();
	ObserverManager.addListener(allHisView);

	var width = $("#all-his-draw").width();
	var height = $("#all-his-draw").height();

	var margin = {top: 10, right: 0, bottom: 0, left: 0},
    	width = width - margin.left - margin.right,
    	height = height - margin.top - margin.bottom;

    var brush = d3.svg.brush();
    var hisHeight = 0;
    var sumHisHeight = 0;

    var svg = d3.select("#all-his-draw").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("id","all-his-svg")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var nowData, nowSortData;

    allHisView.OMListen = function(message,data){
  		d3.selectAll(".his").classed("his-highlight",false);
		if(message == "focus-province"){
			svg.selectAll("." + data).classed("his-highlight",true);
		}
		if(message == "clock"){
			drawDayHis(data);
		}
	}
	drawDayHis(2);

    $("#his-refresh").on("click",function(){
    	draw(nowData);
    });
    $("#his-sort").on("click",function(){
    	nowSortData = nowSortData.sort(function(a,b){
    		var dateA = parseInt(a.date);
    		var dateB = parseInt(b.date);
    		return dateA - dateB;
    	})
    	console.log("sort_data",nowSortData);
    	draw(nowSortData);
    });
	function drawDayHis(dayNum){
		var fileName = pad(dayNum,5) + ".csv";
		var filePath = "data/data_day_csv/";
		var file = filePath + fileName;
		d3.csv(file,function(data){
			draw(data);
			nowData = data;
		})
		d3.csv(file,function(sort_data){
			nowSortData = sort_data.sort(function(a,b){
				var dateA = parseInt(a.date);
				var dateB = parseInt(b.date);
				return dateA - dateB;
			});
		})
	}
	function draw(data){
		svg.selectAll("*").remove();
		var cityName = new Array();
		for(var index = 0;index < data.length; index++){
			cityName.push(data[index].index);
		}
		var axisHeight = height - 25;
		var left = 30;
		var right = 2;
			var axisWidth = width - left - right; 
			sumHisHeight = ((axisHeight - 5)/data.length);
			hisHeight = sumHisHeight - 0.5;
			var extent = d3.extent(data, function(d){
				return +d.date;
			});
			extent[0] = 0;
			var xScale = d3.scale.linear()
	      		.range([0, axisWidth])
	      		.domain(extent);

			var yScale = d3.scale.ordinal()
				.domain(cityName)
				.rangeRoundPoints([0,axisHeight]);

			var xAxis = d3.svg.axis()
	      		.scale(xScale)
	      		.orient("bottom");

	      	var maxValue = d3.max(data,function(d){
	      		return +d.date;
	      	});
	      	var value = 0;
	      	var xAxisTicks = new Array();
	      	while(value < maxValue){
	      		xAxisTicks.push(value);
	      		value = value + 50;
	      	}

	      	var yAxis = d3.svg.axis()
	      		.scale(yScale)
	      		.orient("left");

	      	brush.y(yScale)
	      		.on("brushend",brushed);

	      	var yAxisTicks = ["北京","本溪","温州","泰安","韶关","南充","银川"];

	      	xAxis.tickValues(xAxisTicks);
	      	yAxis.tickValues(yAxisTicks);

	      	svg.append("g")
	          .attr("class", "x axis")
	          .attr("transform", "translate(" + left +"," + axisHeight + ")")
	          .call(xAxis);

	        svg.append("g")
	          .attr("class", "y axis")
	          .attr("transform", "translate("+ left +"," + 0 + ")")
	          .call(yAxis);

	        console.log("data",data);

	        svg.selectAll(".his")
	        	.data(data)
	        	.enter()
	        	.append("rect")
	        	.attr("id",function(d){
	        		return d.index;
	        	})
	        	.attr("class",function(d,i){
	        		var name = cityDict[d.index];
	        		return  name + " his his" + i;
	        	})
	        	.attr("x",(left + 1))
	        	.attr("y",function(d){
	        		return yScale(d.index) - hisHeight;
	        	})
	        	.attr("height",hisHeight)
	        	.attr("width",function(d){
	        		var date = +d.date;
	        		return xScale(date);
	        	})
	        	.attr("fill",function(d){
	        		var date = +d.date;
	        		return colorEncoded(date);
	        	});
	        svg.append("g")
	        	.attr("class","x brush")
	        	.call(brush)
	        	.selectAll("rect")
	        	.attr("x",left)
	        	.attr("width",axisWidth);
		}
	function pad(num, size) {
		var s = num+"";
		while (s.length < size) s = "0" + s;
		return s;
	}
	function brushed(){
		var begin_end = brush.extent();
		var begin = begin_end[0];
		var end = begin_end[1];
		beginIndex = Math.round(begin/sumHisHeight);
		endIndex = Math.round(end/sumHisHeight)>120?120:Math.round(end/sumHisHeight);
		svg.selectAll(".his").classed("highlight",false);
		var selectArray = new Array();
		for(var i = beginIndex;i < endIndex;i++){
			svg.select(".his" + i).classed("highlight",true);
			var id = svg.select(".his" + i).attr("id")
			selectArray.push(id);
		}
        ObserverManager.post("select-array",selectArray);
	}
}
