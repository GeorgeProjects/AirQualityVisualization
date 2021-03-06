var globalTime = 1;
var timeControl;
var barchart = function(){
  var barChartView = new Object();
  var width = $("#nation-year-his").width();
  var height = $("#nation-year-his").height();
  var legendText1 = ["重度污染","中重度污染","中度污染","轻度污染","轻微污染","良","优"];
  var legendText2 = ["其他","二氧化氮","二氧化硫","可吸入颗粒物"];

  var margin_bar = {top: 10, right: 110, bottom: 35, left: 60},
    width_bar = width - margin_bar.left - margin_bar.right,
    height_bar = height - margin_bar.top - margin_bar.bottom;

  var svg_b = d3.select("#nation-year-his").append("svg")
      .attr("width", width_bar + margin_bar.left + margin_bar.right)
      .attr("height", height_bar + margin_bar.top + margin_bar.bottom)
      .append("g")
      .attr("transform", "translate(" + margin_bar.left + "," + margin_bar.top + ")");

  var x_bar = d3.scale.ordinal()
      .rangePoints([0, width_bar]);

  var y_bar = d3.scale.linear()
      .rangeRound([height_bar, 0]);

  var xAxis_bar = d3.svg.axis()
      .scale(x_bar)
      .orient("bottom");

  var yAxis_bar = d3.svg.axis()
      .scale(y_bar)
      .orient("left")
      .tickFormat(d3.format(".0%"))
      .ticks(5);

  var color1 = d3.scale.ordinal()
      .domain(["优", "良", "轻微污染","轻度污染","中度污染","中重度污染","重度污染"])
      .range(["#1a9850", "#91cf60" , "#d9ef8b","#ffffbf","#fee08b","#fc8d59","#d73027"]);
  var color2 = d3.scale.ordinal()
      .domain(["可吸入颗粒物","二氧化硫","二氧化氮","其他"])    
      .range(["#fc8d62","#beaed4","#fdc086","#8dd3c7"]);

  var bar_choice = "data/polluteQuaStat.csv";
  var legendNum = 7;
  var color = color1;
  var legendText = legendText1;

  d3.select('#nation-signal').on('click', function(){
    bar_choice = "data/polluteQuaStat.csv";
    legendNum = 7;
    color = color1;
    legendText = legendText1;
    draw_bar(bar_choice,legendNum,color,legendText);
  });

  d3.select('#nation-pollute').on('click', function(){
    bar_choice = "data/polluteObj.csv";
    legendNum = 4;
    draw_bar(bar_choice,legendNum);
    color = color2;
    legendText = legendText2;
    draw_bar(bar_choice,legendNum,color,legendText);
  });

  d3.select('#nation-refresh').on('click',function(){
    draw_bar(bar_choice,legendNum,color,legendText);
  });


  //--------------------------------------------
  barChartView.OMListen = function(message,data){

  }
  //--------------------------------------------

  $("#map-play").on("click", function(){
    var state = $("#map-play-image").attr("class");
    if(state == "glyphicon glyphicon-play"){
      timeControl = self.setInterval("clock()",200);
      $("#map-play-image").attr("class","glyphicon glyphicon-pause");
    }else{
      timeControl = window.clearInterval(timeControl);
      $("#map-play-image").attr("class","glyphicon glyphicon-play");
    }
  })

  draw_bar(bar_choice,legendNum,color,legendText);

  function draw_bar(bar_choice,legendNum,color,legendText)
  {
    svg_b.selectAll("*").remove();

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-50, 0]) .html(function(d) {
        return "<strong>Date:</strong> <span style='color:red'>" + d.Time + "</span>";
      });

    svg_b.call(tip);

    var filter;

    d3.csv(bar_choice, function(error, data) {
      if (error) throw error;

      color.domain(d3.keys(data[0]).filter(function(key) { return (key !== "Date" && key !== "Time"); }));
      data.forEach(function(d) {
        var y0 = 0;
        d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
        d.ages.forEach(function(d) { d.y0 /= y0; d.y1 /= y0; });
      });
      var count1 = 0;
      x_bar.domain(data.map(function(d) { count1++ ;return d.Time; }));

      xAxis_bar.tickValues(x_bar.domain().filter(function(d, i) { return !(i % 25); }));

      svg_b.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height_bar + ")")
          .call(xAxis_bar)
          .append("text")
          .attr("x", width_bar)
          .attr("y", 30)
          .style("text-anchor", "end")
          .text("Date");

      svg_b.append("g")
          .attr("class", "y axis")
          .call(yAxis_bar);

      var Date = svg_b.selectAll(".Date")
          .data(data)
          .enter().append("g")
          .attr("id", function(d,i){
            return "Date" + d.Date;
          })
          .attr("class","Date")
          .attr("transform", function(d) { return "translate(" + x_bar(d.Time) + ",0)"; })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)
          .on('click',function(d) { 
              globalTime = + d.Date;
              drawHighlightRect(globalTime);
              ObserverManager.post("clock",globalTime);
          });

      d3.select("#Date1").classed("focus-highlight",true);

      Date.selectAll("rect")
          .data(function(d) { return d.ages; })
          .enter()
          .append("rect")
          .attr("width", width_bar/count1)
          .attr("y", function(d) { return y_bar(d.y1); })
          .attr("height", function(d) { return y_bar(d.y0) - y_bar(d.y1); })
          .style("fill", function(d) { return color(d.name); });

      var height = Math.round(height_bar/legendNum);
      var moveLength = height + 1;
      console.log("moveLength",moveLength);

      var legend = svg_b.selectAll(".legend")
          .data(color.domain().slice().reverse())
          .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * moveLength + ")"; });

      legend.append("rect")
          .attr("x", width_bar + 10)
          .attr("width", height)
          .attr("height", height)
          .style("fill", color)
          .attr("cursor","pointer")
          .on('click',function(d) { filter = d; filtering();});

      legend.append("text")
          .attr("x", width_bar + 28)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "start")
          .text(function(d,i) { return legendText[i]; })
          .attr("cursor","pointer")
          .on('click',function(d) { filter = d; disfiltering();});

      function filtering()
      {
          Date.selectAll("rect")
          .style("fill-opacity", function(d) { 
              if(filter == d.name)
                return 1; 
              else
                return .1;
            });
      }
      function disfiltering()
      {
        Date.selectAll("rect")
          .style("fill-opacity", function(d) { 
              if(filter == d.name)
                return .1;
              else
                return 1;
         });
      }
      function clear()
      {
        Date.selectAll("rect")
          .style("fill-opacity", function(d) { 
                return 1;
         });
      }

    });
  }
}

function clock(){
  //回调函数
  globalTime = (globalTime + 1)%365;
  if(globalTime == 0){
    globalTime = 1;
  }
  ObserverManager.post("clock",globalTime);
  drawHighlightRect(globalTime);
}
function drawHighlightRect(time){
  d3.selectAll(".Date").classed("focus-highlight",false);
  d3.select("#Date" + time).classed("focus-highlight",true)
}
 