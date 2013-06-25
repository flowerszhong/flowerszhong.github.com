$(function() {
    var data = window.mockdata;
    var averageData = data.average,
        buysellData = data.buysell;
   var margin = {top: 20, right: 20, bottom: 30, left: 50},
       width = 960 - margin.left - margin.right,
       height = 500 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%d-%b-%y").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line1 = d3.svg.line().x(function(d) {
        return x(d.date);
    }).y(function(d) {
        return y(d.a1);
    });

    var line2 = d3.svg.line().x(function(d) {
        return x(d.date);
    }).y(function(d) {
        return y(d.a2);
    });

    var svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y_extent = d3.extent(buysellData, function(d) {
        return d.value;
    });
    console.log(y_extent);

    // x.domain(d3.extent(averageData, function(d) {
    //     return d.date;
    // }));
    var x_extent = d3.extent(averageData,function (d) {
        return d.date;
    });

    console.log(x_extent);
    x.domain([x_extent[0]-20000000000,x_extent[1]+20000000000]);

    // y.domain(d3.extent(buysellData, function(d) {
    //     return d.value;
    // }));
    
    y.domain([0,500]);


    var topAndBottom = svg.append("g")
        .attr("class","tops-bottoms")
        .selectAll("polyline")
        .data(buysellData);

    topAndBottom.enter().append("polyline")
        .attr("points",function (d) {
            var top = y(d.top),
                bottom = y(d.bottom);

            var diff = bottom - top;
            var v = x(d.date);
            
            var x_diff = 6;

            var point1 = (v - x_diff) + "," + top,
                point2 = (v + x_diff) + "," + top,
                point3 = v + "," + top,
                point4 = v + "," + (top + diff),
                point5 = (v - x_diff) + "," + (top + diff),
                point6 = (v + x_diff) + "," + (top + diff);
            var arr = [point1,point2,point3,point4,point5,point6];
            var points = arr.join(" ");
            return points;
        })
        .attr("class",function (d) {
            var type = "top-bottom-" + d.name;
            return type;
        })
        .style("fill","none")
        .style("stroke","green")
        .style("stroke-width",1);

    var circle = svg.append("g")
        // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class","circles")
        .selectAll("circle")
        .data(buysellData);

    circle.enter().append("circle")
        .attr("r", function (d) {
            return d.weight;
        })
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.value); })
        .attr("class",function (d) {
            var type = "circle-" + d.type;
            var name = d.name;
            return type + " " + name;
        })
        .attr("z-index",function (d) {
            return 9999 - d.weight;
        })
        .style("position" ,"relative")
        .style("opacity",0.5);


        
        
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("path")
        .datum(averageData)
        .attr("class", "line line1")
        .attr("d", line1)
        .attr("stroke-dasharray", "3,3");

    svg.append("path")
        .datum(averageData)
        .attr("class", "line line2")
        .attr("d", line2);


    var tooltip = d3.select("#tool-tip");

    var iso = d3.time.format.utc("%Y-%m-%d");

    svg.selectAll("circle").on("mouseover", function(d) {
        var name = d.name;
        svg.selectAll("." + name)
            .style("stroke-width","3px")
            .style("opacity",1);
        tooltip.style("visibility", "visible");

        svg.selectAll(".top-bottom-" + name).style("display","block");

        var date = iso(new Date(d.date)),
            top = d.top,
            bottom = d.bottom;

        var s = "Holding Name : " + name  + "<br>"
                + " workday : " + date + "<br>"
                + " Top : " + top + "<br>"
                + " Bottom : " + bottom;  

        var content = tooltip.select(".tool-tip-content");
            content.html(s);
    }).on("mouseout",function (d) {
        tooltip.style("visibility", "hidden")
        var name = d.name;
        svg.selectAll("." + name)
            .style("stroke-width","1px")
            .style("opacity",0.5);
         svg.selectAll(".top-bottom-" + name).style("display","none");
    }).on("mousemove", function() {
        return tooltip.style("top", (event.pageY) + "px").style("left", (event.pageX + 10) + "px");
    });
});