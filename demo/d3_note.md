D3 is a Javascript library for attaching data to DOM objects and then manipulating them

Basic SVG is pretty simple, and can be debugged like any ther part of the DOM, and styled with CSS


/* extent of our data */
  var xs = d3.extent(d, date);   // returns array of [minimum, maximum] 
  var ys = d3.extent(d, val);

  /* scales */
  var x = d3.time.scale().domain(xs).range([0, xmax]);
  /* y starts at the top and goes down in SVG */
  var y = d3.scale.linear().domain(ys).range([ymax, 0]).nice();

  /* scales applied to data */
  function xx(e) { return x(date(e)); };
  function yy(e) { return y(val(e)); };


  SVG works with CSS just like HTML, but there are some different properties such as stroke and fill which most SVG elements use for the outline and centre of shapes.

=============================
  Now let us dynamically add new data, as we would with real time updates.

  First add new data and update all our scaling functions, nothing new here.

  d.push(newitem);
  var xs = d3.extent(d, date);
  var ys = d3.extent(d, val);
  var x = d3.time.scale().domain(xs).range([0, xmax]);
  var y = d3.scale.linear().domain(ys).range([ymax, 0]).nice();
  function xx(e) { return x(date(e)); };
  function yy(e) { return y(val(e)); };
  Select the existing circles and transition to new position

  var update = g.selectAll("g.points")
      .selectAll("circle")
      .data(d);

  update.transition().duration(1000)
      .attr("cx", xx)
      .attr("cy", yy)
      .attr("r", 5);

================================================


That is the basics
Make DOM objects, attach data to them, use CSS.
The data can affect any attribute, shape, colour, size, position, opacity, text, ...
All the attributes can have transitions applied.
Also you can add and remove objects to dynamically update your visualization.

===================================================


http://lws.node3.org/#questions-title