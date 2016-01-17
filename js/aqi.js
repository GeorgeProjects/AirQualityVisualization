  var aqi = function(){
    var aqiView = new Object();
    var width_h = $("#city-his").width();
    var height_h = $("#city-his").height();
    
    var margin_aqi = {top: 5, right: 70, bottom: 30, left: 65},
    width_aqi = width_h - margin_aqi.left - margin_aqi.right,
    height_aqi = height_h - margin_aqi.top - margin_aqi.bottom;
    
    //------------------------------------------
    aqiView.OMListen = function(message,data){
      
    }
    //------------------------------------------
    var legendNum1 = 7,legendNum2 = 4;
    var legendText1 = ["重度污染","中重度污染","中度污染","轻度污染","轻微污染","良","优"];
    var legendText2 = ["其他","二氧化氮","二氧化硫","可吸入颗粒物"];
    var color1 = d3.scale.ordinal()
      .domain(["优", "良", "轻微污染","轻度污染","中度污染","中重度污染","重度污染"])
      .range(["#1a9850", "#91cf60" , "#d9ef8b","#ffffbf","#fee08b","#fc8d59","#d73027"]);
    var color2 = d3.scale.ordinal()
      .domain(["可吸入颗粒物","二氧化硫","二氧化氮","--"])    
      .range(["#fc8d62","#beaed4","#fdc086","#8dd3c7"]);

    var svg_aqi = d3.select("#city-his").append("svg")
        .attr("width", width_aqi + margin_aqi.left + margin_aqi.right)
        .attr("height", height_aqi + margin_aqi.top + margin_aqi.bottom)
      .append("g")
        .attr("transform", "translate(" + margin_aqi.left + "," + margin_aqi.top + ")");

    svg_aqi.append("defs").append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", width_aqi)
        .attr("height", height_aqi);

    var parseDate = d3.time.format("%Y-%m-%d").parse;
    var legendText = legendText1;
    var color_aqi = color1;
    var legendNum = legendNum1;
    var data_choice = 0;

    var filter_aqi;

    var x_aqi = d3.time.scale().range([0,width_aqi]);

    var y_aqi = d3.scale.linear().range([height_aqi, 0]);

    

    var xAxis_aqi = d3.svg.axis()
        .scale(x_aqi)
        .orient("bottom")
        .tickFormat(d3.time.format('%m-%d'));

    var yAxis_aqi = d3.svg.axis()
        .scale(y_aqi)
        .orient("left")
        .ticks(5);

    var tip_aqi = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-3, 0]) .html(function(d) {
        return "<strong>AQI:</strong> <span style='color:red'>" + d.aqi + "</span>";
      });

    svg_aqi.call(tip_aqi);
//*************************************************************
d3.csv("data/city_id_csv/1301.csv", type, function(error, data) {
  if (error) throw error;

  x_aqi.domain(d3.extent(data, function(d) { return d.date; }));
  y_aqi.domain(d3.extent(data, function(d) { return d.aqi; }));

  var brush_aqi = d3.svg.brush()
        .x(x_aqi)
        .on("brushstart",brushstart)
        .on("brush",brushmove)
        .on("brushend", brushend);

  svg_aqi.append("g")
      .attr("class", "x axis")
      .attr("clip-path", "url(#clip)")
      .attr("transform", "translate(0," + height_aqi + ")")
      .call(xAxis_aqi)
    .append("text")
      .attr("x", width_aqi)
      .attr("y", 30)
      .style("text-anchor", "end")
      .text("Date");

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

  var bar_aqi = svg_aqi.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("clip-path", "url(#clip)")
      .attr("x", function(d) { return x_aqi(d.date); })
      .attr("width", width_aqi/365)
      .attr("y", function(d) { return y_aqi(d.aqi); })
      .attr("height", function(d) { return height_aqi - y_aqi(d.aqi); })
      .attr("fill", function(d) {return color_aqi(d.cond.trim()); })
      .on('mouseover', tip_aqi.show)
      .on('mouseout', tip_aqi.hide);

      console.log(color_aqi.domain())

  svg_aqi.append("g")
      .attr("class", "brush")
      .call(brush_aqi)
    .selectAll("rect")
      .attr("y",height_aqi)
      .attr("height", 20);

  var brush_count = 0;

  function brushstart()
  {
    bar_aqi.classed("selecting", true);
  }

  function brushmove()
  {
    brush_count = 0;
    var s =d3.event.target.extent();
    bar_aqi.classed("selected", function(d) {
      if(s[0] <= d.date && d.date <= s[1])
      {
        brush_count++;
        return d;
      }
    });
  }

  function brushend() 
  {
      bar_aqi.classed("selecting", !d3.event.target.empty());
      var extent = brush_aqi.extent();

      get_button = d3.select(".clear-button");

      if(get_button.empty() === true) {
        clear_button = svg_aqi.append('text')
          .attr("y", 10)
          .attr("x", 1300)
          .attr("class", "clear-button")
          .text("Clear");
      }

      x_aqi.domain(extent);
      y_aqi.domain(d3.extent(data, function(d) { 
        if(extent[0] <= d.date && d.date <= extent[1])
          return d.aqi; 
      }));
      transition_data();
      reset_axis();

      svg_aqi.select(".brush").call(brush_aqi.clear());
      
      clear_button.on('click', function(){
        x_aqi.domain(d3.extent(data, function(d) { return d.date; }));
        y_aqi.domain(d3.extent(data, function(d) { return d.aqi; }));
        brush_count = 365;
        transition_data();
        reset_axis();
        bar_aqi.classed("selecting", false);
        clear_button.remove();
      });
  }

function transition_data() {
  svg_aqi.selectAll(".bar")
    .data(data)
  .transition()
    .duration(500)
    .attr("x", function(d) { return x_aqi(d.date); })
    .attr("y", function(d) { return y_aqi(d.aqi); })
    .attr("width",width_aqi/brush_count)
    .attr("height", function(d) { return height_aqi - y_aqi(d.aqi); });
}

function reset_axis() {
  svg_aqi.transition().duration(500)
   .select(".x.axis")
   .call(xAxis_aqi);

   svg_aqi.transition().duration(500)
   .select(".y.axis")
   .call(yAxis_aqi);
}

showlegend_aqi(data_choice,color_aqi,legendNum,legendText);

});
//*************************************************************
d3.select('#city-trash').on('click', function(){
      data_choice = 0;
      legendNum = legendNum1;
      color_aqi = color1;
      legendText = legendText1;
      showlegend_aqi(data_choice,color_aqi,legendNum,legendText);
  });

  d3.select('#city-pollute').on('click', function(){
      data_choice = 1;
      legendNum = legendNum2;
      color_aqi = color2;
      legendText = legendText2;
      showlegend_aqi(data_choice,color_aqi,legendNum,legendText);
  });

  d3.select('#city-refresh').on('click',function(){
      clear_aqi();
  });

function showlegend_aqi(data_choice,color_aqi,legendNum,legendText)
{
    svg_aqi.selectAll(".legend").remove();

    svg_aqi.selectAll(".bar")
        .attr("fill", function(d) { 
          if(data_choice == 0)
            return color_aqi(d.cond.trim()); 
          else
            return color_aqi(d.pollution.trim());
        });

    console.log(color_aqi.domain() );

    var height = Math.round(height_aqi/legendNum);
      var moveLength = height + 1;
      console.log("moveLength",moveLength);

    var legend_aqi = svg_aqi.selectAll(".legend")
          .data(color_aqi.domain().slice().reverse())
          .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * moveLength + ")"; });

      legend_aqi.append("rect")
          .attr("x", width_aqi + 10)
          .attr("width", height)
          .attr("height", height)
          .style("fill", color_aqi)
          .attr("cursor","pointer")
          .on('click',function(d) { filter_aqi = d; filtering_aqi();});

      legend_aqi.append("text")
          .attr("x", width_aqi + 30)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "start")
          .text(function(d,i) { return legendText[i]; })
          .attr("cursor","pointer")
          .on('click',function(d) { filter_aqi = d; disfiltering_aqi();});

}

function filtering_aqi()
{
    svg_aqi.selectAll(".bar")
    .style("fill-opacity", function(d) { 
        if(filter_aqi == d.cond.trim())
          return 1; 
        else
          return .1;
      });
}
function disfiltering_aqi()
{
    svg_aqi.selectAll(".bar")
      .style("fill-opacity", function(d) { 
          if(filter_aqi == d.cond.trim())
            return .1; 
          else
            return 1;
        });
}

function clear_aqi()
{
    svg_aqi.selectAll(".bar")
      .style("fill-opacity", function(d) { 
            return 1;
        });
}

function type(d) {
  d.aqi = +d.aqi;
  d.date = parseDate(d.date);
  return d;
  }
}