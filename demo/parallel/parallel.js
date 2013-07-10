// Code adapted and extended from:
// Parallel Coordinates
// Copyright (c) 2012, Kai Chang
// Released under the BSD License: http://opensource.org/licenses/BSD-3-Clause

initCitymenuPC(); // this is not the d3 way
$(function() {
    $("#d_preset-hoods").buttonset();
  $("#hoods-list").disableSelection();
});

function initCitymenuPC() {
  var cityMenu = document.getElementById('citySelectPC');
  console.log('in initCitymenuPC() and cityMenu exists: ' + cityMenu);
  for (var key in CITYLIST_PC) {
    //console.log(key);
    o = document.createElement('option');
    //o.setAttribute('value', CITYLIST[key]);
    o.setAttribute('value', key);
    o.innerHTML = key;
    cityMenu.appendChild(o);
  }
}
// extend js array
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}
// a myhoods collection
myHoods = [];
function myHoodsAdd (h) {
  console.log(myHoods.contains(h));
  if (myHoods.contains(h)) { return 0; } else {
    myHoods.push(h);
  }
}
// show myHoods
function showMyHoods() {
  highlighted.clearRect(0,0,w,h);
  inHood=null; // clear last double-clicked
  d3.select("#foreground").style("opacity", null); // reset opacity
  paths(myHoods, foreground, brush_count, currentDim, true); // render myHoods
}
function clearMyHoods() {
  myhoods = [];
  $("#s_myhoods").hide();
  resetAll();
}
currentDim = 'group'; // start with group
var afoo=[], efoo=[];
var width = document.body.clientWidth,
    height = d3.max([document.body.clientHeight-540, 240]);
var inHood = false;
var seenCount = 0;
var m = [60, 0, 10, 0],
    w = width - m[1] - m[3],
    h = height - m[0] - m[2],
    xscale = d3.scale.ordinal().rangePoints([0, w], 1),
    yscale = {},
    dragging = {},
    line = d3.svg.line(),
    axis = d3.svg.axis().orient("left").ticks(1+height/50),
    data, foreground, background, highlighted, dimensions, legend,
    render_speed = 50,
    brush_count = 0,
    excluded_groups = [];
    included_groups = ['Pacific','Mountain','WS Central','EN Central',
      'ES Central','South Atlantic','Mid Atlantic','New England'];
// hsl, hex
var colors = {
  "Pacific": [0,65,55], // d74242
  "Mountain": [50,65,55], // D7BE42
  "WS Central": [90,65,55], // 8CD742
  //"NW Central": [10,28,67], // no data
  "EN Central": [160,65,55], // 42D7A5
  "ES Central": [200,65,55], // 42A5D7
  "South Atlantic": [265,65,55], // 8042D7
  "Mid Atlantic": [300,65,55], // D742D7
  "New England": [35,95,52] // F99810
};

// Scale chart and canvas height
d3.select("#chart")
    .style("height", (h + m[0] + m[2]) + "px");

d3.selectAll("canvas")
    .attr("width", w)
    .attr("height", h)
    .style("padding", m.join("px ") + "px");


// Foreground canvas for primary view
foreground = document.getElementById('foreground').getContext('2d');
foreground.globalCompositeOperation = "destination-over";
foreground.strokeStyle = "rgba(0,100,160,0.1)";
foreground.lineWidth = 1.7;
foreground.fillText("Loading...",w/2,h/2);

// Highlight canvas for temporary interactions
highlighted = document.getElementById('highlight').getContext('2d');
highlighted.strokeStyle = "rgba(0,100,160,1)";
highlighted.lineWidth = 4;

// Background canvas
background = document.getElementById('background').getContext('2d');
background.strokeStyle = "rgba(0,100,160,0.1)";
background.lineWidth = 1.7;

// SVG for ticks, labels, and interactions
var svg = d3.select("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
  .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

function makeRamp(d) {
    var pmax = d3.max(data, function(p) { return p[d]; });
    var pmin = d3.min(data, function(p) { return p[d]; });
    var pq1 = (pmax * 0.25) + (pmin * 0.75);
    var pq2 = (pmax * 0.5) + (pmin * 0.5);
    var pq3 = (pmax * 0.75) + (pmin * 0.25);
  console.log('in titleClick(), dim stats: '+pmax,pmin,pq1,pq2,pq3);
    pathRamp=d3.scale.linear().domain([pmin,pq1,pq2,pq3,pmax]).range(["blue","lightblue","grey","pink","red"]);
}

// Load the data and visualization
d3.csv("../data/hoods2661_pcfull8.csv", function(raw_data) {
  // Convert quantitative scales to floats
  data = raw_data.map(function(d) {
    for (var k in d) {
      if (!_.isNaN(raw_data[0][k] - 0) && k != 'id') {
        d[k] = parseFloat(d[k]) || 0;
      }
    }
    return d;
  });

  // 
  makeRamp(currentDim);
  
  // Extract the list of numerical dimensions and create a scale for each.
  xscale.domain(dimensions = d3.keys(data[0]).filter(function(k) {
    return (_.isNumber(data[0][k])) && (yscale[k] = d3.scale.linear()
      .domain(d3.extent(data, function(d) { return +d[k]; }))
      .range([h, 0]));
  })//.sort() don't sort the axes!
  );

  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
    .data(dimensions)
    .enter().append("svg:g")
    .attr("class", "dimension")
    .attr("transform", function(d) { return "translate(" + xscale(d) + ")"; });

  // Add an axis and title.
  g.append("svg:g")
    .attr("class", "axis")
    .attr("transform", "translate(0,0)")
    .each(function(d) { d3.select(this).call(axis.scale(yscale[d])); })
    .append("svg:text")
    .attr("text-anchor", "middle")
    .attr("y", function(d,i) { return i%2 === 0 ? -16 : -30; } )
    .attr("x", 0)
    .attr("class", "label")
        .on("click", function(e) {
        if(e.shiftKey) { console.log('you held shift');} else {
          invert_axis(e); update_ticks();brush();}
      })
    .text(String)
      .append("title")
        .text("Click to invert axis.")
   ;

  // Add and store a brush for each axis.
  g.append("svg:g")
    .attr("class", "brush")
    .each(function(d) { d3.select(this).call(yscale[d].brush = d3.svg.brush().y(yscale[d]).on("brush", brush)); })
    .selectAll("rect")
    .style("visibility", null)
    .attr("x", -23)
    .attr("width", 36)
    .append("title")
    .text("Drag up or down along axis to select; tap axis to de-select")
  //;
// putting drag behavior on the brush region only, not parents: dimension or axis
    .call(d3.behavior.drag()
      .on("dragstart", function(d) {
        dragging[d] = this.__origin__ = xscale(d);
        this.__dragged__ = false;
        d3.select("#foreground").style("opacity", "0.35");
      })
      .on("drag", function(d) {
        dragging[d] = Math.min(w, Math.max(0, this.__origin__ += d3.event.dx));
        dimensions.sort(function(a, b) { return position(a) - position(b); });
        xscale.domain(dimensions);
        g.attr("transform", function(d) { return "translate(" + position(d) + ")"; });
        brush_count++;
        this.__dragged__ = true;
  
        // Feedback for axis deletion if dropped
        if (dragging[d] < 12 || dragging[d] > w-12) {
          d3.select(this).select(".background").style("fill", "#b00");
        } else {
          d3.select(this).select(".background").style("fill", null);
        }
      })
      .on("dragend", function(d) {
        if (!this.__dragged__) {
          // no movement, invert axis <- NASTY TRICK, alt to click event!@*&(^@$^)
          var extent = invert_axis(d);
  
        } else {
          // reorder axes
          d3.select(this).transition().attr("transform", "translate(" + xscale(d) + ")");
  
          extent = yscale[d].brush.extent();
        }
  
        // remove axis if dragged all the way left
        if (dragging[d] < 12 || dragging[d] > w-12) {
          remove_axis(d,g);
        }
  
        // TODO required to avoid a bug
        xscale.domain(dimensions);
        update_ticks(d, extent);
  
        // rerender
        d3.select("#foreground").style("opacity", null);
        brush();
        delete this.__dragged__;
        delete this.__origin__;
        delete dragging[d];
      }))
 ;
  g.selectAll(".extent")
    .append("title")
    .text("Drag or resize this filter");

  // add a link to colorize
  g.append("svg:g")
    .data(dimensions)
    .append("svg:text")
    .on("click", titleClick)
    .attr("text-anchor", "middle")
    .attr("class", "colorizeSel")
    .text('[color]')
    .attr("y", -4 )
    .attr("x", 0)
    .append("title")
    .text("Colorize on this dimension")
    ;
  legend = create_legend(colors,brush);

  // Render full foreground
  brush();
});
// 'legend' is census division list
function create_legend(colors,brush) {
  // create legend
  legend_data = d3.select("#legend")
    .html("")
    .selectAll(".row")
    //.data( _.keys(colors).sort() )
    .data( _.keys(colors) );

  // filter by group
   legend = legend_data
    .enter().append("div")
      .attr("title", "This division only")
      .on("click", function(d) { 
        // put everything but selected in excluded_group[]
        excluded_groups = _.difference(included_groups,[d]);
        brush();
                $('#s_restore-divs').show();
        _gaq.push(['_trackEvent', 'nh_explore', 'filter census div']);
    }); 

  legend
    .append("span")
    .style("background", function(d,i) { return color(d,0.85);})
    .attr("class", "color-bar");

  legend
    .append("span")
    .attr("class", "tally")
    .text(function(d,i) { return 0; });  

  legend
    .append("span")
    .text(function(d,i) { return " " + d;});  

  return legend;
}
   
// list of hoods
function data_table(s) {
  // sort by first column
  var sample = s.sort(function(a,b) {
    var col = d3.keys(a)[0];
    //col = d3.keys(a)[0] + ', ' + d3.keys(a)[1];
    return a[col] < b[col] ? -1 : 1;
  });

  var table = d3.select("#hoods-list")
        .html("") // empty it - kinda important, fool
    .selectAll(".row")
      .data(sample)
    .enter().append("div")
      .on("mouseover", highlight)
      .on("mouseout", unhighlight)
        .on("dblclick", function(d) { //.on("click", function(d) {
            if (inHood) {d3.selectAll("#hoods-list div").classed('hilite',false);}
            inHood = d;
      myHoodsAdd (d);
            highlight(d);
            inHoodName=d.name + ', ' + d.city;
            codeHood(inHoodName);
            $(this).addClass('hilite');
            greenLayer.setMap(null);
      pc_map.setOptions(mapOptions);
            seenCount ++;
      $("#s_myhoods").show(); $("#s_myhoodcount").html(myHoods.length); 
            $("#l_reset-all").show();
            _gaq.push(['_trackEvent', 'nh_explore', 'street view']);
    })
        .on("click", function(d) {
            $(this).removeClass('hilite');
            unhighlight('foof');
            foof = true;
        /*  d3.select("#foreground").style("opacity", null);
            d3.selectAll(".row").style("opacity", null);
            highlighted.clearRect(0,0,w,h);
            $(this).removeClass('hilite');
            $("#clearico").hide();*/
        }); 

  table
    .append("span")
      .attr("class", "color-block")
      .style("background", function(d) { return color(d.group,0.85) })
  table
    .append("span")
      .attr("class", "hoodname")
            /*.html(function(d) {return '<span id="clearico" style="display:none;">'+ 
                '<a href="#" title="click to reset">' +
                d.name + ', ' + d.city+' <img src="images/ico_clear.png" /></a></span>'})*/
      .text(function(d) { return ' '+d.name + ', ' + d.city; })
            .style("cursor", "pointer")
}
// Highlight single polyline
function highlight(d) {
    //console.log(d);
  d3.select("#foreground").style("opacity", "0.25");
  d3.selectAll(".row").style("opacity", function(p) { return (d.group == p) ? null : "0.3" });
  path(d, highlighted, color(d.group,1));
}

// Remove highlight
function unhighlight(z) {
    if (!inHood || z == 'foof') {
        d3.select("#foreground").style("opacity", null);
        d3.selectAll(".row").style("opacity", null);
        highlighted.clearRect(0,0,w,h);
    } else  {
        d3.select("#foreground").style("opacity", null);
        d3.selectAll(".row").style("opacity", null);
        highlighted.clearRect(0,0,w,h);
        highlight(inHood);
    //if (seenCount === 0) {highlight(inHood);}
    }
}
function makeCity(pn,g,p,i,h){
  big=[]; var v,w,x,y,z;
    console.log(pn,g,p,i,h);
  v=QUANTILES['park_need='+pn]; 
  w=QUANTILES['greenness='+g]; x=QUANTILES['pavedness='+p];
    y=QUANTILES['h_inc='+i]; z=QUANTILES['home_val='+h];
  big.push(v); big.push(w);  big.push(x);
    big.push(y);  big.push(z);
    //if (!i === (null || '')) {big.push(y); }
    //if (!h === (null || '')) {big.push(z); }
  console.log('big: '+big);
  brushCustom(big);
  $("#b_reset-pc").show();$("#b_reset-pc-franken").show();
  _gaq.push(['_trackEvent', 'nh_explore', 'preset franken']);
}
/*
function makeCity2(){
  big=[];
    // read from a form
  s=$('#frankenForm').serialize().split('&');console.log(s);
  g=QUANTILES[s[0]]; p=QUANTILES[s[1]]; ppk=QUANTILES[s[2]];
  big.push(QUANTILES[s[0]]);
  big.push(QUANTILES[s[1]]);
  big.push(QUANTILES[s[2]]);
  //console.log('g,p,ppk: '+ g,p,ppk);
  console.log('big: '+big);
  brushCustom(big);
  $("#bRestore").show();
}

function makeCity3(grn,pav,pct){
  big=[];
  //s=$('#frankenForm').serialize().split('&');console.log(s);
  g=QUANTILES['green='+grn];
  p=QUANTILES['paved='+pav];
  ppk=QUANTILES['pctpark='+pct];
  big.push(g);
  big.push(p);
  big.push(ppk);
  //console.log('g,p,ppk: '+ g,p,ppk);
  //console.log('big: '+big);
  brushCustom(big);
  $("#bRestore").show();
}
//name,city,state,group,greenness,pavedness,pct_park,park_need,
//popdens,diversity,h_inc,home_val,pct_own,nonwhite,lng,lat
*/
function brushCustom(z) {
  brush_count++;
  afoo = ["park_need","greenness","pavedness","h_inc","home_val"];
    efoo = z;
    afoogood=afoo.slice(0,efoo.length);

  // hack to hide ticks beyond extent
  var b = d3.selectAll('.dimension')[0]
    .forEach(function(element, i) {
      var dimension = d3.select(element).data()[0];
      if (_.include(afoogood, dimension)) {
        var extent = efoo[afoogood.indexOf(dimension)];
        d3.select(element)
          .selectAll('text')
          .style('font-weight', 'bold')
          .style('font-size', '13px')
          .style('display', function() { 
            var value = d3.select(this).data();
            return extent[0] <= value && value <= extent[1] ? null : "none";
          });
      } else {
        d3.select(element)
        .selectAll('text')
          .style('font-size', null)
          .style('font-weight', null)
          .style('display', null);
      }
      d3.select(element)
        .selectAll('.label')
        .style('display', null);
    })
    ;
 
  // bold dimensions with label
  d3.selectAll('.label')
    .style("font-weight", function(dimension) {
      if (_.include(afoogood, dimension)) return "bold";
      return null;
    });

  // Get lines within efoo
  selected = [];
  data
    .filter(function(d) {
      // return _.contains(included_groups, d.group);
      return !_.contains(excluded_groups, d.group);
    })
    .map(function(d) {
      return afoogood.every(function(p, dimension) {
        return efoo[dimension][0] <= d[p] && d[p] <= efoo[dimension][1];
      }) ? selected.push(d) : null;
    });

  // free text search
  var query = d3.select("#search")[0][0].value;
  if (query.length > 0) {
    selected = search(selected, query);
  }

    // try adding dropdown test
  dropSel = d3.select("#citySelectPC")[0][0].value;
  if (dropSel !== "null") {
    selected = searchCity(selected, dropSel);
  }
  
  if (selected.length < data.length && selected.length > 0) {
    d3.select("#keep-data").attr("disabled", null);
    d3.select("#exclude-data").attr("disabled", null);
  } else {
    d3.select("#keep-data").attr("disabled", "disabled");
    d3.select("#exclude-data").attr("disabled", "disabled");
  }

  // total by census division (called group in the data)
  var tallies = _(selected)
    .groupBy(function(d) { return d.group; });

  // include empty groups
  _(colors).each(function(v,k) { tallies[k] = tallies[k] || []; });

  legend
    .style("text-decoration", function(d) { return _.contains(excluded_groups,d) ? "line-through" : null; })
    .attr("class", function(d) {
      return (tallies[d].length > 0) ? "row" : "row off";
    });

  legend.selectAll(".color-bar")
    .style("width", function(d) {
      return Math.ceil(600*tallies[d].length/data.length ) + "px";
    });

  legend.selectAll(".tally")
    .text(function(d,i) { return tallies[d].length; });  

  // Render selected lines
  paths(selected, foreground, brush_count, currentDim, true);
} //end brushCustom()
// Handles a brush event, toggling the display of foreground lines.
// TODO refactor
function brush() {
    brush_count++;
    if (brush_count > 1 ) { $("#b_reset-pc").show(); }
    var actives = dimensions.filter(function(p) { return !yscale[p].brush.empty(); }),
            extents = actives.map(function(p) { return yscale[p].brush.extent(); });
  // hack to hide ticks beyond extent
  var b = d3.selectAll('.dimension')[0]
    .forEach(function(element, i) {
      var dimension = d3.select(element).data()[0];
      if (_.include(actives, dimension)) {
        extent = extents[actives.indexOf(dimension)];
        d3.select(element)
          .selectAll('text')
          .style('font-weight', 'bold')
          .style('font-size', '13px')
          .style('display', function() { 
            var value = d3.select(this).data();
            return extent[0] <= value && value <= extent[1] ? null : "none";
          });
      } else {
        d3.select(element)
        .selectAll('text')
          .style('font-size', null)
          .style('font-weight', null)
          .style('display', null);
      }
      d3.select(element)
        .selectAll('.label')
        .style('display', null);
    })
    ;
 
  // bold dimensions with label
  d3.selectAll('.label')
    .style("font-weight", function(dimension) {
      if (_.include(actives, dimension)) return "bold";
      return null;
    });

  // Get lines within extents
  selected = [];
  data
    .filter(function(d) {
      // return _.contains(included_groups, d.group);
      return !_.contains(excluded_groups, d.group);
    })
    .map(function(d) {
      return actives.every(function(p, dimension) {
        return extents[dimension][0] <= d[p] && d[p] <= extents[dimension][1];
      }) ? selected.push(d) : null;
    });

  // free text search
  var query = d3.select("#search")[0][0].value;
  if (query.length > 0) {
    selected = search(selected, query);
  }

    // try adding dropdown test
  dropSel = d3.select("#citySelectPC")[0][0].value;
  if (dropSel !== "null") {
    selected = searchCity(selected, dropSel);
  }
  
  if (selected.length < data.length && selected.length > 0) {
    d3.select("#keep-data").attr("disabled", null);
    d3.select("#exclude-data").attr("disabled", null);
  } else {
    d3.select("#keep-data").attr("disabled", "disabled");
    d3.select("#exclude-data").attr("disabled", "disabled");
  };

  // total by census division (called group in the data)
  var tallies = _(selected)
    .groupBy(function(d) { return d.group; })

  // include empty groups
  _(colors).each(function(v,k) { tallies[k] = tallies[k] || []; });

  legend
    .style("text-decoration", function(d) { return _.contains(excluded_groups,d) ? "line-through" : null; })
    .attr("class", function(d) {
      return (tallies[d].length > 0) ? "row" : "row off";
    });

  legend.selectAll(".color-bar")
    .style("width", function(d) {
      return Math.ceil(600*tallies[d].length/data.length ) + "px";
    });

  legend.selectAll(".tally")
    .text(function(d,i) { return tallies[d].length; });  

  // Render selected lines
  paths(selected, foreground, brush_count, currentDim, true);
    // modify hood list title
    if (selected.length > 25) {hoodSample('list-25');
    } else { hoodSample('few'); }
} //end brush()

function hoodSample(q) {
  //console.log('hoodSample(q): '+q);
  if (q == 'all') {
    data_table(shuffled_data.slice(0,25));
      $("#sampleLead").text('Sampled 25 of ');
            $("#sampleAll").show();$("#sample25").hide();
  } else if (q == 'list-all'){
    data_table(shuffled_data.slice(0,2661));
        $("#sampleLead").text('All ');
        $("#sampleAll").hide();$("#sample25").show();
  }  else if (q == 'list-25'){
    data_table(shuffled_data.slice(0,25));
        $("#sampleLead").text('Sampled 25 of ');
        $("#sampleAll").show();$("#sample25").hide();
  } else if (q == 'few'){
        if (shuffled_data.length < 25) {
            $("#sampleLead").text('Your selected ');
            $("#sampleAll").hide();
        } else {
            $("#sampleLead").text('Sampled 25 of ');
            $("#sample25").show();
        }
}
    /*if (shuffled_data.length < 25) {
        $("#sampleLead").text('Your selected ');
    } else {
    $("#sampleLead").text('Sampled 25 of ');
    } */
    //$("#sampleAll").toggle();$("#sample25").toggle();
}
// render a set of polylines on a canvas
function paths(selected, ctx, count, dim) {
  var n = selected.length,
      i = 0,
      opacity = d3.min([2/Math.pow(n,0.3),1]),
      timer = (new Date()).getTime();

  selection_stats(opacity, n, data.length);

  shuffled_data = _.shuffle(selected);

  data_table(shuffled_data.slice(0,25));

  ctx.clearRect(0,0,w+1,h+1);

  // render all lines until finished or a new brush event
  function animloop(){
    if (i >= n || count < brush_count) return true;
    var max = d3.min([i+render_speed, n]);
    render_dim(shuffled_data, i, max, opacity, dim);
    //render_range(shuffled_data, i, max, opacity);
    render_stats(max,n,render_speed);
    i = max;
    timer = optimize(timer);  // adjusts render_speed
  };

  d3.timer(animloop);
}

// render polylines with color range
function render_dim(selection, i, max, opacity, dim) {
  //console.log('parameters: ' +i, max, opacity, dim)
  if (dim == 'group') {
    selection.slice(i,max).forEach(function(d) { 
    path(d, foreground, color(d.group,opacity));
    });
  } else {
    selection.slice(i,max).forEach(function(d) {
    //console.log(d[currentDim]);
    path(d, foreground, pathRamp(d[currentDim]));
    });
      
  };
};

// render polylines i to i+render_speed 
function render_range(selection, i, max, opacity) {
  selection.slice(i,max).forEach(function(d) {
    path(d, foreground, color(d.group,opacity));
  });
};
var DIMSCALES = {
  "greenness": [0,0.655,0.855,0.921,0.964,1],
  "pavedness": [0,0.578,0.742,0.854,0.936,1],
  "pct_park": [0,0.046,0.139,0.28,0.546,1],
  "park_need": [0,0.071,0.188,0.317,0.458,1],
  "popdens": [55,7127,16631,38365,81055,145623],
  "diversity": [3.2,26.6,43.8,59.3,74.3,93.6],
  "h_inc": [16547,51683,73475,104479,150670,260133],
  "home_val": [26640,152000,259000,412000,647000,1103000],
  "pct_own": [0.01,0.262,0.422,0.564,0.702,0.93],
  "nonwhite": [0.03,0.23,0.39,0.58,0.79,0.996],
    "parkspeak": [0.018,.051,0.07,0.087,0.235] //0.051 0.07 0.087

}

function titleClick(d) {
  pathRamp=d3.scale.linear().domain(DIMSCALES[d]).range(["blue","lightblue","grey","pink","red"]);
  currentDim = d;
  if (myHoods.length > 0 ) {
    paths(myHoods, foreground, brush_count, currentDim, true);
  } else {
    paths(selected, foreground, brush_count, currentDim, true);
  }
    $("#b_reset-pc-color").show();
  _gaq.push(['_trackEvent', 'nh_explore', 'colorize axis']);
}
  
function path(d, ctx, color) {
  //console.log(d, ctx, color);
  if (color) ctx.strokeStyle = color;
  ctx.beginPath();
  var x0 = xscale(0)-15,
      y0 = yscale[dimensions[0]](d[dimensions[0]]);   // left edge
  ctx.moveTo(x0,y0);
  dimensions.map(function(p,i) {
    var x = xscale(p),
        y = yscale[p](d[p]);
    var cp1x = x - 0.88*(x-x0);
    var cp1y = y0;
    var cp2x = x - 0.12*(x-x0);
    var cp2y = y;
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    x0 = x;
    y0 = y;
  });
  ctx.lineTo(x0+15, y0);                               // right edge
  ctx.stroke();
};

function color(d,a) {
  var c = colors[d];
  return ["hsla(",c[0],",",c[1],"%,",c[2],"%,",a,")"].join("");
}

// copy one canvas to another, grayscale
function gray_copy(source, target) {
  var pixels = source.getImageData(0,0,w,h);
  target.putImageData(grayscale(pixels),0,0);
}

// http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
function grayscale(pixels, args) {
  var d = pixels.data;
  for (var i=0; i<d.length; i+=4) {
    var r = d[i];
    var g = d[i+1];
    var b = d[i+2];
    // CIE luminance for the RGB
    // The human eye is bad at seeing red and blue, so we de-emphasize them.
    var v = 0.2126*r + 0.7152*g + 0.0722*b;
    d[i] = d[i+1] = d[i+2] = v
  }
  return pixels;
};

function position(d) {
  var v = dragging[d];
  return v == null ? xscale(d) : v;
}

// transition ticks for reordering, rescaling and inverting
function update_ticks(d, extent) {
  // update brushes
  if (d) {
    var brush_el = d3.selectAll(".brush")
        .filter(function(key) { return key == d; });
    // single tick
    if (extent) {
      // restore previous extent
      brush_el.call(yscale[d].brush = d3.svg.brush().y(yscale[d]).extent(extent).on("brush", brush));
    } else {
      brush_el.call(yscale[d].brush = d3.svg.brush().y(yscale[d]).on("brush", brush));
    }
  } else {
    // all ticks
    d3.selectAll(".brush")
      .each(function(d) { d3.select(this).call(yscale[d].brush = d3.svg.brush().y(yscale[d]).on("brush", brush)); })
  }

  brush_count++;

  show_ticks();

  // update axes
  d3.selectAll(".axis")
    .each(function(d,i) {
      // hide lines for better performance
      d3.select(this).selectAll('line').style("display", "none");

      // transition axis numbers
      d3.select(this)
        .transition()
        .duration(720)
        .call(axis.scale(yscale[d]));

      // bring lines back
      d3.select(this).selectAll('line').transition().delay(800).style("display", null);

      d3.select(this)
        .selectAll('text')
        .style('font-weight', null)
        .style('font-size', null)
        .style('display', null);
    });
}

// Rescale to new dataset domain
function rescale() {
  // reset yscales, preserving inverted state
  dimensions.forEach(function(d,i) {
    if (yscale[d].inverted) {
      yscale[d] = d3.scale.linear()
          .domain(d3.extent(data, function(p) { return +p[d]; }))
          .range([0, h]);
      yscale[d].inverted = true;
    } else {
      yscale[d] = d3.scale.linear()
          .domain(d3.extent(data, function(p) { return +p[d]; }))
          .range([h, 0]);
    }
  });

  update_ticks();

  // Render selected data
  paths(data, foreground, brush_count);
}

// Get polylines within extents
function actives() {
  var actives = dimensions.filter(function(p) { return !yscale[p].brush.empty(); }),
      extents = actives.map(function(p) { return yscale[p].brush.extent(); });

  // filter extents and excluded groups
  var selected = [];
  data
    .filter(function(d) {
      return !_.contains(excluded_groups, d.group);
    })
    .map(function(d) {
    return actives.every(function(p, i) {
      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    }) ? selected.push(d) : null;
  });

  // free text search
  var query = d3.select("#search")[0][0].value;
  if (query > 0) {
    selected = search(selected, query);
  }
  
  return selected;
}

function dropCity() {
  dropSel = d3.select('#citySelectPC')[0][0].value;
  console.log(dropSel);
  if (dropSel === "") {
      init_gpc(); $("#pc_pano").hide(); $("#intro").show();
      actives(); brush();
    } else {
      censusLayer.setMap(null);greenLayer.setMap(pc_map);
      pc_map.setOptions(mapOptions);
      actives();
      brush();
      codeHood(dropSel);
  }
  _gaq.push(['_trackEvent', 'nh_explore', 'city dropdown']);
}

// Adjusts rendering speed 
function optimize(timer) {
  var delta = (new Date()).getTime() - timer;
  render_speed = Math.max(Math.ceil(render_speed * 30 / delta), 8);
  render_speed = Math.min(render_speed, 300);
  return (new Date()).getTime();
}

// Feedback on rendering progress
function render_stats(i,n,render_speed) {
  d3.select("#rendered-count").text(i);
  d3.select("#rendered-bar")
    .style("width", (100*i/n) + "%");
  d3.select("#render-speed").text(render_speed);
}

// Feedback on selection
function selection_stats(opacity, n, total) {
  d3.select("#data-count").text(total);
  d3.select("#selected-count").text(n);
  d3.select("#cnt").text(n);d3.select("#cnt2").text(n);
  d3.select("#selected-bar").style("width", (100*n/total) + "%");
  d3.select("#opacity").text((""+(opacity*100)).slice(0,4) + "%");
}

function invert_axis(d) {
  // save extent before inverting
  if (!yscale[d].brush.empty()) {
    var extent = yscale[d].brush.extent();
  }
  if (yscale[d].inverted == true) {
    yscale[d].range([h, 0]);
    d3.selectAll('.label')
      .filter(function(p) { return p == d; })
      .style("text-decoration", null);
    yscale[d].inverted = false;
  } else {
    yscale[d].range([0, h]);
    d3.selectAll('.label')
      .filter(function(p) { return p == d; })
      .style("text-decoration", "underline");
    yscale[d].inverted = true;
  }
  _gaq.push(['_trackEvent', 'nh_explore', 'invert axis']);
  return extent;
}

helpWin = function(msg, t) {
  //console.log('in parallel2 helpWin(msg,t)');
    $('#helpContent').load('../content/help_'+msg+'.html').dialog({
        hide: {
        effect: "explode",
        duration: 500
      },
        title: t,
    width: 400,
    position: [($(window).width()/2) - 200,$(window).height()/4],
        //position: [100,110], 
    dialogClass: 'help-dialog',
    modal: false
    });
};
alertWin = function(msg,t) {
    console.log('../content/helptext.html#'+msg);
    $('#helpContent').load('../content/helptext.html #'+msg).dialog({
        hide: {
        effect: "explode",
        duration: 500
      },
        title: t,
    width: $(window).width()/2,
    position: {my: "top", at: "top", of:"#chart"},
        //position: [$(window).width()/2,$(window).height()/2],
    modal:true
    })
};
// Export data
function export_csv() {
  var keys = d3.keys(data[0]);
  var rows = ( (myHoods.length > 0) ? myHoods :
              (selected.length < 2661 ) ? selected :
              actives()).map(function(row) {
    return keys.map(function(k) { return row[k]; });
  });
  var csv = d3.csv.format([keys].concat(rows)).replace(/\n/g,"<br/>\n");
  var styles = "<style>body { font-family: courier; font-size: 12px; }</style>";
  window.open("text/csv").document.write(styles + csv);
  _gaq.push(['_trackEvent', 'nh_explore', 'export csv']);
  }//}

// scale to window size
window.onresize = function() {
  width = document.body.clientWidth,
  height = d3.max([document.body.clientHeight-500, 220]);

  w = width - m[1] - m[3],
  h = height - m[0] - m[2];

  d3.select("#chart")
      .style("height", (h + m[0] + m[2]) + "px")

  d3.selectAll("canvas")
      .attr("width", w)
      .attr("height", h)
      .style("padding", m.join("px ") + "px");

  d3.select("svg")
      .attr("width", w + m[1] + m[3])
      .attr("height", h + m[0] + m[2])
    .select("g")
      .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
  
  xscale = d3.scale.ordinal().rangePoints([0, w], 1).domain(dimensions);
  dimensions.forEach(function(d) {
    yscale[d].range([h, 0]);
  });

  d3.selectAll(".dimension")
    .attr("transform", function(d) { return "translate(" + xscale(d) + ")"; })
    .on("click", titleClick);
  // update brush placement
  d3.selectAll(".brush")
    .each(function(d) { d3.select(this).call(yscale[d].brush = d3.svg.brush().y(yscale[d]).on("brush", brush)); });
  brush_count++;

  // update axis placement
  axis = axis.ticks(1+height/50),
  d3.selectAll(".axis")
    .each(function(d) { d3.select(this).call(axis.scale(yscale[d])); });

  // render data
  brush();
};

function resetAll() {
    location.reload(true);
    $("#l_reset-all").hide();
  _gaq.push(['_trackEvent', 'nh_explore', 'reset all']);
}
function resetColor() {
    currentDim='group'; actives(); brush();
    $("#b_reset-pc-color").hide();
  _gaq.push(['_trackEvent', 'nh_explore', 'reset color']);
}
d3.select("#keep-data").on("click", keep_data);
d3.select("#exclude-data").on("click", exclude_data);
d3.select("#export-data").on("click", export_csv);
d3.select("#search").on("keyup", brush);
d3.select("#b_reset-pc").on("click", resetAll);
d3.select("#b_reset-pc-franken").on("click", resetAll);
d3.select("#b_reset-pc-color").on("click", resetColor);

// Appearance toggles
d3.select("#hide-ticks").on("click", hide_ticks);
d3.select("#show-ticks").on("click", show_ticks);
d3.select("#dark-theme").on("click", dark_theme);
d3.select("#light-theme").on("click", light_theme);

function hide_ticks() {
  d3.selectAll(".axis g").style("display", "none");
  //d3.selectAll(".axis path").style("display", "none");
  d3.selectAll(".background").style("visibility", "hidden");
  d3.selectAll("#hide-ticks").attr("disabled", "disabled");
  d3.selectAll("#show-ticks").attr("disabled", null);
};

function show_ticks() {
  d3.selectAll(".axis g").style("display", null);
  //d3.selectAll(".axis path").style("display", null);
  d3.selectAll(".background").style("visibility", null);
  d3.selectAll("#show-ticks").attr("disabled", "disabled");
  d3.selectAll("#hide-ticks").attr("disabled", null);
};

function dark_theme() {
  d3.select("body").attr("class", "dark");
  d3.selectAll("#dark-theme").attr("disabled", "disabled");
  d3.selectAll("#light-theme").attr("disabled", null);
}

function light_theme() {
  d3.select("body").attr("class", null);
  d3.selectAll("#light-theme").attr("disabled", "disabled");
  d3.selectAll("#dark-theme").attr("disabled", null);
}

function search(selection,str) {
  pattern = new RegExp(str,"i");
  _gaq.push(['_trackEvent', 'nh_explore', 'free search']);
  return _(selection).filter(function(d) { return pattern.exec(d.name); });
}

function searchCity(selection,str) {
  pattern = new RegExp(str,"i");
  return _(selection).filter(function(d) { return pattern.exec(d.city); });
}

function restoreAll() { excluded_groups = []; actives(); brush();
  //document.getElementById('bAllDivs').style.display='none';
    document.getElementById('s_restore-divs').style.display='none';
  //document.getElementById('bAllCities').style.display='none';
}
// Remove all but selected from the dataset
function keep_data() {
  new_data = actives();
  if (new_data.length == 0) {
    alert("I don't mean to be rude, but I can't let you remove all the data.\n\nTry removing some brushes to get your data back. Then click 'Keep' when you've selected data you want to look closer at.");
    return false;
  }
  data = new_data;
  rescale();
}

// Exclude selected from the dataset
function exclude_data() {
  new_data = _.difference(data, actives());
  if (new_data.length == 0) {
    alert("I don't mean to be rude, but I can't let you remove all the data.\n\nTry selecting just a few data points then clicking 'Exclude'.");
    return false;
  }
  data = new_data;
  rescale();
}

function remove_axis(d,g) {
  dimensions = _.difference(dimensions, [d]);
  xscale.domain(dimensions);
  g.attr("transform", function(p) { return "translate(" + position(p) + ")"; });
  g.filter(function(p) { return p == d; }).remove(); 
  update_ticks();
}