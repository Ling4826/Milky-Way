(function () {
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
  var hourLabelRadius = radius;
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

  // Store star positions for fast lookup and compute distance from center
  var allPositions = [];
  d3.json('stars_api.php', function (error, starData) {
    if (error) throw error;

    var cx = width / 2, cy = height / 2;
    starData.forEach(function (d) {
      var lat = +d.dec_deg + +d.dec_min / 60 + +d.dec_sec / 3600;
      var lon = (+d.RA_hour + +d.RA_minute / 60 + +d.RA_second / 3600) * (360 / 24);
      var coords = projection([lon, lat]);
      console.log(lat, lon, coords);
      if (coords) {
        var dx = coords[0] - cx, dy = coords[1] - cy;
        var distFromCenter = Math.sqrt(dx * dx + dy * dy);
        allPositions.push({ x: coords[0], y: coords[1], dist: distFromCenter });
      }
    });



    d3.json('planet_api.php', function (error, planetData) {
      if (error) throw error;
      var cx = width / 2, cy = height / 2;
      planetData.forEach(function (d) {
        var lat = +d.dec_deg + +d.dec_min / 60 + +d.dec_sec / 3600;
        var lon = (+d.RA_hour + +d.RA_minute / 60 + +d.RA_second / 3600) * (360 / 24);
        var coords = projection([lon, lat]);
        console.log(lat, lon, coords);
        if (coords) {
          var dx = coords[0] - cx, dy = coords[1] - cy;
          var distFromCenter = Math.sqrt(dx * dx + dy * dy);
          allPositions.push({ x: coords[0], y: coords[1], dist: distFromCenter });

          map.append('circle')
            .attr('cx', coords[0])
            .attr('cy', coords[1])
            .attr('r', 8)
            .attr('fill', '#ff0000ff')
            .attr('stroke', '#44f')
            .attr('stroke-width', 2);

          map.append('circle')
            .attr('cx', coords[0])
            .attr('cy', coords[1])
            .attr('r', 13)
            .attr('fill', 'none')
            .attr('stroke', '#44f')
            .attr('stroke-width', 1);

        }
      });

    });

    d3.json('moon_api.php', function (error, moonData) {
      if (error) throw error;
      var cx = width / 2, cy = height / 2;
      moonData.forEach(function (d) {
        var lat = +d.dec_deg + +d.dec_min / 60 + +d.dec_sec / 3600;
        var lon = (+d.RA_hour + +d.RA_minute / 60 + +d.RA_second / 3600) * (360 / 24);

        var coords = projection([lon, lat]);
        console.log("moon : ", lat, lon, coords);
        if (coords) {
          var dx = coords[0] - cx, dy = coords[1] - cy;
          var distFromCenter = Math.sqrt(dx * dx + dy * dy);

          allPositions.push({ x: coords[0], y: coords[1], dist: distFromCenter });

          map.append('circle')
            .attr('cx', coords[0])
            .attr('cy', coords[1])
            .attr('r', 4)
            .attr('fill', '#ffff00')
            .attr('stroke', '#448')
            .attr('stroke-width', 1);
        }
      });
    });





    // (no circle gap helper — circle and line will draw over each other)

    // Set up mousemove handler after stars are loaded
    svg.on('mousemove', function () {
      var mouse = d3.mouse(this);

      var cx = width / 2, cy = height / 2;
      // Find nearest star to mouse
      var minDist = Infinity, nearest = null;
      for (var i = 0; i < allPositions.length; i++) {
        var p = allPositions[i];
        var dmx = p.x - mouse[0], dmy = p.y - mouse[1];
        var dmouse = Math.sqrt(dmx * dmx + dmy * dmy);
        if (dmouse < minDist) {
          minDist = dmouse;
          nearest = p;
        }
      }

      // Calculate distance from mouse to center
      var dx = mouse[0] - cx, dy = mouse[1] - cy;
      var distToCenter = Math.sqrt(dx * dx + dy * dy);
      // No upper limit for circle radius by default: let it grow relative to distance from center
      var minRadius = 2;
      var circleRadius = Math.max(minRadius, distToCenter);
      // Snap threshold (pixels). If the mouse is within this many pixels of a star, snap to it.
      var snapThreshold = 8;
      if (nearest && minDist <= snapThreshold) {
        console.log('Type:', nearest.type);

        // Snap: set line end to star and circle radius to star's distance from center
        yellowLine
          .attr('x1', cx)
          .attr('y1', cy)
          .attr('x2', nearest.x)
          .attr('y2', nearest.y);
        var rstar = Math.max(minRadius, nearest.dist);
        yellowCircle
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', rstar)
          .attr('stroke-dasharray', null)
          .attr('stroke-dashoffset', null);
      } else {
        // Not snapping: unlimited/ray behavior
        yellowCircle
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', circleRadius);
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
          yellowCircle.attr('stroke-dasharray', null).attr('stroke-dashoffset', null);
        }
      }
    });
  });

  // (starPositions already populated above)

  // (mousemove handler moved inside d3.csv callback)

  // (Zoom and pan removed)

  // Define a scale for magnitude
  magnitude = d3.scale.quantize().domain([-1, 5]).range([7, 6, 5, 4, 3, 2, 1]);

  // Draw all stars (both hemispheres) on the same projection
  d3.json('stars_api.php', function (error1, starData) {
    if (error1) throw error1;
    d3.json('planet_api.php', function (error2, planetData) {
      if (error2) throw error2;
      d3.json('moon_api.php', function (error3, moonData) {
        if (error3) throw error3;

        var allPositions = [];
        var cx = width / 2, cy = height / 2;

        // --- วาดและเก็บตำแหน่งดาวฤกษ์ ---
        map.selectAll('.star')
          .data(starData)
          .enter().append('circle')
          .attr('class', 'star')
          .attr('r', 3)
          .attr('fill', 'gold')
          .attr('transform', function (d) {
            var lat = +d.dec_deg + +d.dec_min / 60 + +d.dec_sec / 3600;
            var lon = (+d.RA_hour + +d.RA_minute / 60 + +d.RA_second / 3600) * (360 / 24);
            var coords = projection([lon, lat]);
            if (coords) {
              allPositions.push({
                x: coords[0],
                y: coords[1],
                type: 'star',
                id: d.id
              });
              return 'translate(' + coords[0] + ',' + coords[1] + ')';
            }
            return null;
          });

        // --- วาด planet group ---
        var planetGroup = map.selectAll('.planet-group')
          .data(planetData)
          .enter().append('g')
          .attr('class', 'planet-group')
          .attr('transform', function (d) {
            var lat = +d.dec_deg + +d.dec_min / 60 + +d.dec_sec / 3600;
            var lon = (+d.RA_hour + +d.RA_minute / 60 + +d.RA_second / 3600) * (360 / 24);
            var coords = projection([lon, lat]);
            if (coords) {
              allPositions.push({
                x: coords[0],
                y: coords[1],
                type: 'planet',
                id: d.id
              });
              return 'translate(' + coords[0] + ',' + coords[1] + ')';
            }
            return null;
          });

        planetGroup.append('circle')
          .attr('r', 8)
          .attr('fill', '#ff0000ff')
          .attr('stroke', '#44f')
          .attr('stroke-width', 2);

        planetGroup.append('circle')
          .attr('r', 13)
          .attr('fill', 'none')
          .attr('stroke', '#44f')
          .attr('stroke-width', 1);

        // --- วาด moon orbit รอบ planet + เก็บ absolute ---
        planetGroup.each(function (planet) {
          var moons = moonData.filter(function (m) {
            return m.planet_id == planet.id;
          });
          var lat = +planet.dec_deg + +planet.dec_min / 60 + +planet.dec_sec / 3600;
          var lon = (+planet.RA_hour + +planet.RA_minute / 60 + +planet.RA_second / 3600) * (360 / 24);
          var coords = projection([lon, lat]); // planet center absolute
          moons.forEach(function (moon, k) {
            var angle = k * (2 * Math.PI / moons.length);
            var moonRadius = 20;
            var mx = Math.cos(angle) * moonRadius;
            var my = Math.sin(angle) * moonRadius;
            d3.select(this)
              .append('circle')
              .attr('cx', mx)
              .attr('cy', my)
              .attr('r', 4)
              .attr('fill', '#fff')
              .attr('stroke', '#888')
              .attr('stroke-width', 1);
            if (coords) {
              allPositions.push({
                x: coords[0] + mx,
                y: coords[1] + my,
                type: 'moon',
                planet_id: planet.id,
                moon_id: moon.id
              });
            }
          }, this);
        });

      });
    });
  });



}).call(this);