(function() {
  var graticule, height, magnitude, map, maps, path_generator, projection, svg, width, zoom;

  svg = d3.select('svg');

  width = svg[0][0].getBoundingClientRect().width;
  height = svg[0][0].getBoundingClientRect().height;

  // Single azimuthal equidistant projection centered at origin
  // Center the projection in the middle of the SVG
    projection = d3.geo.azimuthalEquidistant()
      .scale(110) // even smaller scale for a smaller circle
      .rotate([0, 0, 0])
      .center([0, 0])
      .translate([width / 2, height / 2])
      .precision(.1)
      .clipAngle(90 + 1e-3);

  graticule = d3.geo.graticule().minorStep([15, 10]).majorStep([90, 10]);
  path_generator = d3.geo.path().projection(projection);

  // Add a white rectangle border to the SVG
  var side = Math.min(width, height);
  svg.insert('rect', ':first-child')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', side)
    .attr('height', side)
    .attr('fill', 'none')
    .attr('stroke', '#fff')
    .attr('stroke-width', 2);

  // Create a single map group
  maps = svg.append('g');
  map = maps.append('g').attr('id', 'map_combined');

  // Draw the graticule
  map.append('path')
    .datum(graticule)
    .attr('class', 'graticule')
    .attr('d', path_generator);

  // Add hour (RA) labels in a circle inside the main star map
  var radius = Math.min(width, height) / 2 - 60;
  var hourLabelRadius = radius ;
  for (var h = 0; h < 24; h++) {
    var angle = (h / 24) * 2 * Math.PI - Math.PI / 2;
    var lx = width / 2 + Math.cos(angle) * hourLabelRadius;
    var ly = height / 2 + Math.sin(angle) * hourLabelRadius + 4; // +4 for vertical centering
    map.append('text')
      .attr('class', h % 6 === 0 ? 'axis-label' : 'tick-label')
      .attr('x', lx)
      .attr('y', ly)
      .text(h === 0 ? '0h' : h + 'h');
  }

  // Add 90° label at center, then circles/labels for 80, 70, ..., 10 (with correct radius)
  map.append('text')
    .attr('class', 'axis-label')
    .attr('x', width / 2)
    .attr('y', height / 2)
    .text('90°');
  for (var deg = 80; deg >= 10; deg -= 10) {
    var r = ((90 - deg) / 90) * radius;
    map.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', r)
      .attr('fill', 'none')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.7)
      .attr('opacity', 0.5);
    // Degree label
    map.append('text')
      .attr('class', 'tick-label')
      .attr('x', width / 2)
      .attr('y', height / 2 - r - 6)
      .text(deg + '°');
  }

  // --- Yellow visuals: circle radius follows mouse distance, line extends through mouse (no limits) ---
  // Move yellow group to the very top for visibility
  var yellowGroup = svg.append('g').attr('id', 'yellow-group');
  var yellowCircle = yellowGroup.append('circle')
    .attr('stroke', '#ffff66')
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .attr('opacity', 1)
    .attr('cx', width / 2)
    .attr('cy', height / 2)
    .attr('r', 10);
  var yellowLine = yellowGroup.append('line')
    .attr('stroke', '#ffff66')
    .attr('stroke-width', 2)
    .attr('opacity', 1)
    .attr('x1', width / 2)
    .attr('y1', height / 2)
    .attr('x2', width / 2)
    .attr('y2', height / 2 - 60);

  // Store star positions for fast lookup (kept for potential future use)
  var starPositions = [];
  d3.csv('stars.csv', function(data) {
    data.forEach(function(d) {
      var lat = +d.dec_deg + +d.dec_min / 60 + +d.dec_sec / 3600;
      var lon = (+d.RA_hour + +d.RA_min / 60 + +d.RA_sec / 3600) * (360 / 24);
      var coords = projection([lon, lat]);
      if (coords) starPositions.push({x: coords[0], y: coords[1]});
    });
    // Set up mousemove handler after stars are loaded
    svg.on('mousemove', function() {
      var mouse = d3.mouse(this);
      var cx = width / 2, cy = height / 2;
      // Calculate distance from mouse to center
      var dx = mouse[0] - cx, dy = mouse[1] - cy;
      var distToCenter = Math.sqrt(dx * dx + dy * dy);
      // No upper limit for circle radius: let it grow relative to distance from center
      var minRadius = 2;
      var circleRadius = Math.max(minRadius, distToCenter);
      yellowCircle
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', circleRadius);
      // Make the yellow line extend from center through the mouse position to the edge of the SVG (no limit)
      // Compute a far point along the same vector beyond the SVG bounds
      if (distToCenter === 0) {
        // mouse at center: draw a tiny line upwards
        yellowLine
          .attr('x1', cx)
          .attr('y1', cy)
          .attr('x2', cx)
          .attr('y2', cy - 1);
      } else {
        var scale = Math.max(width, height) * 2 / distToCenter; // large enough to go off-canvas
        var farX = cx + dx * scale;
        var farY = cy + dy * scale;
        yellowLine
          .attr('x1', cx)
          .attr('y1', cy)
          .attr('x2', farX)
          .attr('y2', farY);
      }
    });
  });

  // Store star positions for fast lookup
  var starPositions = [];
  d3.csv('stars.csv', function(data) {
    data.forEach(function(d) {
      var lat = +d.dec_deg + +d.dec_min / 60 + +d.dec_sec / 3600;
      var lon = (+d.RA_hour + +d.RA_min / 60 + +d.RA_sec / 3600) * (360 / 24);
      var coords = projection([lon, lat]);
      if (coords) starPositions.push({x: coords[0], y: coords[1]});
    });
  });

  // (mousemove handler moved inside d3.csv callback)

    // (Zoom and pan removed)

  // Define a scale for magnitude
  magnitude = d3.scale.quantize().domain([-1, 5]).range([7, 6, 5, 4, 3, 2, 1]);

  // Draw all stars (both hemispheres) on the same projection
  d3.csv('stars.csv', function(data) {
    map.selectAll('.star')
      .data(data)
      .enter().append('circle')
      .attr('class', 'star')
      .attr('r', function(d) {
        return magnitude(+d.magnitude) / 2;
      })
      .attr('transform', function(d) {
        var lat, lon, coords;
        lat = +d.dec_deg + +d.dec_min / 60 + +d.dec_sec / 3600;
        lon = (+d.RA_hour + +d.RA_min / 60 + +d.RA_sec / 3600) * (360 / 24);
        coords = projection([lon, lat]);
        return coords ? "translate(" + coords[0] + "," + coords[1] + ")" : null;
      });
  });

}).call(this);
