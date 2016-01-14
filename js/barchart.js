var barchart = function(){
  var width = $("#nation-year").width();
  var height = $("#nation-year").height();

  var margin_bar = {top: 20, right: 200, bottom: 60, left: 50},
    width_bar = width - margin_bar.left - margin_bar.right,
    height_bar = height - margin_bar.top - margin_bar.bottom;

  var svg_b = d3.select("#nation-year").append("svg")
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

  d3.select('#level').on('click', function(){
    bar_choice = "data/polluteQuaStat.csv";
    color = d3.scale.category20();
    draw_bar();
  });
  d3.select('#first').on('click', function(){
    bar_choice = "data/polluteQuaStat.csv";
    color = d3.scale.category20();
    draw_bar();
  });

  var bar_choice = "data/polluteQuaStat.csv";
  var color = d3.scale.category20();
  draw_bar();

  function draw_bar()
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
          .call(xAxis_bar);

      svg_b.append("g")
          .attr("class", "y axis")
          .call(yAxis_bar);

      var Date = svg_b.selectAll(".Date")
          .data(data)
        .enter().append("g")
          .attr("class", "Date")
          .attr("transform", function(d) { return "translate(" + x_bar(d.Time) + ",0)"; })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)
          .on('click',function(d) { console.log(d.Date);});

      Date.selectAll("rect")
          .data(function(d) { return d.ages; })
        .enter().append("rect")
          .attr("width", width_bar/count1)
          .attr("y", function(d) { return y_bar(d.y1); })
          .attr("height", function(d) { return y_bar(d.y0) - y_bar(d.y1); })
          .style("fill", function(d) { return color(d.name); });

      var legend = svg_b.selectAll(".legend")
          .data(color.domain().slice().reverse())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
          .attr("x", width_bar + 110)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color)
          .on("mouseover",function(d) { filter = d; filtering();})
          .on("mouseout",clear);

      legend.append("text")
          .attr("x", width_bar + 105)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d; });

      function filtering()
      {
          console.log("hhhhhhhhhhhh");
          Date.selectAll("rect")
          .style("fill-opacity", function(d) { 
              if(filter == d.name)
                return 1; 
              else
                return .1;
            });
      }
      function clear()
      {
        Date.selectAll("rect")
          .style("fill-opacity", function(d) {return 1;});
      }

    });
  }
}

function showfirst()
{
	bar_choice = "data/polluteObj.csv";
	color = d3.scale.category10();
	draw_bar();
}

 