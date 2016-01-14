  var aqi = function(){
    var width = $("#city").width();
    var height = $("#city").height();

    var margin_aqi = {top: 2, right: 80, bottom: 60, left: 50},
    width_aqi = width - margin_aqi.left - margin_aqi.right,
    height_aqi = height - margin_aqi.top - margin_aqi.bottom;

    var svg_aqi = d3.select("#city").append("svg")
      .attr("width", width_aqi + margin_aqi.left + margin_aqi.right)
      .attr("height", height_aqi + margin_aqi.top + margin_aqi.bottom)
      .append("g")
      .attr("transform", "translate(" + margin_aqi.left + "," + margin_aqi.top + ")");

    var x_aqi = d3.scale.ordinal()
      .rangePoints([0, width_aqi]);

    var y_aqi = d3.scale.linear()
      .range([height_aqi, 0]);

    var xAxis_aqi = d3.svg.axis()
      .scale(x_aqi)
      .orient("bottom");

    var yAxis_aqi = d3.svg.axis()
      .scale(y_aqi)
      .orient("left")
      .ticks(3);

    var color_aqi = d3.scale.category20();
    var filter_aqi;

    var tip_aqi = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-3, 0]) .html(function(d) {
        return "<strong>AQI:</strong> <span style='color:red'>" + d.AQI + "</span>";
      });

    svg_aqi.call(tip_aqi);

    d3.tsv("data/bj.tsv", type, function(error, data) {
        if (error) throw error;
        d3.select('#level_aqi').on('click', showlevel_aqi);
        d3.select('#first_aqi').on('click', showfirst_aqi);
        var count2 = 0;
        x_aqi.domain(data.map(function(d) { count2++ ;return d.Date; }));
        y_aqi.domain(d3.extent(data, function(d) { return d.AQI; }));

        xAxis_aqi.tickValues(x_aqi.domain().filter(function(d, i) { return !(i % 25); }));
        svg_aqi.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height_aqi + ")")
          .call(xAxis_aqi);

        svg_aqi.append("g")
          .attr("class", "y axis")
          .call(yAxis_aqi)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("x",-20)
          .attr("y", -47)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("AQI");

        svg_aqi.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x_aqi(d.Date); })
          .attr("width", width_aqi/count2)
          .attr("y", function(d) { return y_aqi(d.AQI); })
          .attr("height", function(d) { return height_aqi - y_aqi(d.AQI); })
          .attr("fill", function(d) { return color_aqi(d.airquality); })
          .on('mouseover', tip_aqi.show)
          .on('mouseout', tip_aqi.hide);
        showlevel_aqi();
    });
    function showlevel_aqi()
    {
      svg_aqi.selectAll(".legend").remove();
      color_aqi = d3.scale.category20();
      svg_aqi.selectAll(".bar")
          .attr("fill", function(d) { return color_aqi(d.airquality); });

      var legend_aqi = svg_aqi.selectAll(".legend")
        .data(color_aqi.domain().slice().reverse())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 12 + ")"; });

      legend_aqi.append("rect")
        .attr("x", width_aqi + 20)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", color_aqi)
        .on("mouseover",function(d) { filter_aqi = d; filtering_aqi();})
        .on("mouseout",clear_aqi);
    }
    function showfirst_aqi()
    {
      svg_aqi.selectAll(".legend").remove();
      color_aqi = d3.scale.category10();
      svg_aqi.selectAll(".bar")
          .attr("fill", function(d) { return color_aqi(d.mainpollution); });
      var legend_aqi = svg_aqi.selectAll(".legend")
        .data(color_aqi.domain().slice().reverse())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 10 + ")"; });

      legend_aqi.append("rect")
          .attr("x", width_aqi + 20)
          .attr("width", 8)
          .attr("height", 8)
          .style("fill", color_aqi)
          .on("mouseover",function(d) { filter_aqi = d; filtering_aqi();})
          .on("mouseout",clear_aqi);
    }
  }


  function filtering_aqi()
  {
    svg_aqi.selectAll(".bar")
      .style("fill-opacity", function(d) { 
        if(filter_aqi == d.mainpollution)
          return 1; 
        else
          return .1;
    });
  }
  function clear_aqi()
  {
    svg_aqi.selectAll("rect")
      .style("fill-opacity", function(d) {return 1;});
  }
  function clear_aqi()
  {
    svg_aqi.selectAll("rect")
    .style("fill-opacity", function(d) {return 1;});
  }
  function filtering_aqi()
  {
    svg_aqi.selectAll(".bar")
      .style("fill-opacity", function(d) { 
        if(filter_aqi == d.airquality)
          return 1; 
        else
          return .1;
    });
  }
  function type(d) {
    d.AQI = +d.AQI;
    return d;
  }

