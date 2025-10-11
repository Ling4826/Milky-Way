(async () => {
  const svg = d3.select('svg');
  const width = +svg.attr('width');
  const height = +svg.attr('height');

  // --- Projection ---
  const projection = d3.geoAzimuthalEquidistant()
    .scale(110)
    .translate([width / 2, height / 2])
    .clipAngle(90 + 1e-3);

  const pathGenerator = d3.geoPath(projection);

  // --- Graticule ---
  const graticule = d3.geoGraticule()
    .step([90, 10])       // major step
    .stepMinor([15, 10]); // minor step

  // --- Draw border ---
  const side = Math.min(width, height);
  svg.insert('rect', ':first-child')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', side)
    .attr('height', side)
    .attr('fill', 'none')
    .attr('stroke', '#fff')
    .attr('stroke-width', 2);

  // --- Map group ---
  const maps = svg.append('g');
const zoom = d3.zoom()
  .scaleExtent([0.000278, 50])
  .on('zoom', (event) => {
    maps.attr('transform', event.transform); // zoom/scale maps เท่านั้น
    // yellowGroup ไม่เปลี่ยน
  })
svg.call(zoom);


  const map = maps.append('g').attr('id', 'map_combined');

  // --- Draw graticule ---
  map.append('path')
    .datum(graticule())
    .attr('class', 'graticule')
    .attr('d', pathGenerator)
    .attr('fill', 'none')
    .attr('stroke', '#888')
    .attr('stroke-width', 0.5);

  // --- Hour labels ---
  const radius = side / 2 - 60;
  for (let h = 0; h < 24; h++) {
    const angle = (h / 24) * 2 * Math.PI - Math.PI / 2;
    const lx = width / 2 + Math.cos(angle) * radius;
    const ly = height / 2 + Math.sin(angle) * radius + 4;
    map.append('text')
      .attr('class', h % 6 === 0 ? 'axis-label' : 'tick-label')
      .attr('x', lx)
      .attr('y', ly)
      .text(h === 0 ? '0h' : `${h}h`);
  }

  // --- Degree circles/labels ---
  map.append('text')
    .attr('class', 'axis-label')
    .attr('x', width / 2)
    .attr('y', height / 2)
    .text('90°');

  for (let deg = 80; deg >= 10; deg -= 10) {
    const r = ((90 - deg) / 90) * radius;
    map.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', r)
      .attr('fill', 'none')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.7)
      .attr('opacity', 0.5);

    map.append('text')
      .attr('class', 'tick-label')
      .attr('x', width / 2)
      .attr('y', height / 2 - r - 6)
      .text(`${deg}°`);
  }

  // --- Yellow circle/line for mouse ---
  const yellowGroup = svg.append('g').attr('id', 'yellow-group');
  const yellowCircle = yellowGroup.append('circle')
    .attr('stroke', '#ffff66')
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .attr('cx', width / 2)
    .attr('cy', height / 2)
    .attr('r', 10);
  const yellowLine = yellowGroup.append('line')
    .attr('stroke', '#ffff66')
    .attr('stroke-width', 2)
    .attr('x1', width / 2)
    .attr('y1', height / 2)
    .attr('x2', width / 2)
    .attr('y2', height / 2 - 60);

  // --- Fetch data ---
  const [starData, planetData, moonData, cometData, nebulaData] = await Promise.all([
    d3.json('stars_api.php'),
    d3.json('planet_api.php'),
    d3.json('moon_api.php'),
    d3.json('comet_api.php'),
    d3.json('nebula_api.php')
  ]);

  const allPositions = [];
  const cx = width / 2, cy = height / 2;

  const convertCoords = d => {
    const lat = +d.dec_deg + (+d.dec_min || 0)/60 + (+d.dec_sec || 0)/3600;
    const lon = (+d.RA_hour + (+d.RA_minute||0)/60 + (+d.RA_second||0)/3600) * 15;
    return projection([lon, lat]);
  }

  // --- Draw stars ---
  starData.forEach(d => {
    const coords = convertCoords(d);
    if (!coords) return;
    allPositions.push({ x: coords[0], y: coords[1], type: 'star', id: d.id });
    map.append('circle')
      .attr('cx', coords[0])
      .attr('cy', coords[1])
      .attr('r', 3)
      .attr('fill', 'gold')
      .on('click', () => alert(`Clicked star ID: ${d.id}`));
  });

  // --- Draw planets ---
  planetData.forEach(d => {
    const coords = convertCoords(d);
    if (!coords) return;
    allPositions.push({ x: coords[0], y: coords[1], type: 'planet', id: d.id });
    map.append('circle')
      .attr('cx', coords[0])
      .attr('cy', coords[1])
      .attr('r', 8)
      .attr('fill', '#ff0000ff')
      .attr('stroke', '#44f')
      .attr('stroke-width', 2);
  });

  // --- Draw moons ---
  moonData.forEach(d => {
    const coords = convertCoords(d);
    if (!coords) return;
    allPositions.push({ x: coords[0], y: coords[1], type: 'moon', id: d.id });
    map.append('circle')
      .attr('cx', coords[0])
      .attr('cy', coords[1])
      .attr('r', 4)
      .attr('fill', '#ffff00')
      .attr('stroke', '#448')
      .attr('stroke-width', 1);
  });

  // --- Draw comets ---
  cometData.forEach(d => {
    const coords = convertCoords(d);
    if (!coords) return;
    allPositions.push({ x: coords[0], y: coords[1], type: 'comet', id: d.id });
    map.append('circle')
      .attr('cx', coords[0])
      .attr('cy', coords[1])
      .attr('r', 6)
      .attr('fill', '#00ffff')
      .attr('stroke', '#088')
      .attr('stroke-width', 2);
  });

  // --- Draw nebulae ---
  nebulaData.forEach(d => {
    const coords = convertCoords(d);
    
    if (!coords) return;
    allPositions.push({ x: coords[0], y: coords[1], type: 'nebula', id: d.id });
    map.append('circle')
      .attr('cx', coords[0])
      .attr('cy', coords[1])
      .attr('r', 16)
      .attr('fill', '#00ffff')
      .attr('stroke', '#088')
      .attr('stroke-width', 2)
      .style('filter', 'url(#glow)');
  });

  // --- Mouse interaction ---
  svg.on('mousemove', (event) => {
    const [mx, my] = d3.pointer(event);
    let minDist = Infinity, nearest = null;
    allPositions.forEach(p => {
      const dx = p.x - mx, dy = p.y - my;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < minDist) { minDist = d; nearest = p; }
    });

    const dx = mx - cx, dy = my - cy;
    const distToCenter = Math.sqrt(dx*dx + dy*dy);
    const minRadius = 2;
    const circleRadius = Math.max(minRadius, distToCenter);
    const snapThreshold = 8;

    if (nearest && minDist <= snapThreshold) {
      yellowLine
        .attr('x1', cx)
        .attr('y1', cy)
        .attr('x2', nearest.x)
        .attr('y2', nearest.y);
      yellowCircle.attr('r', Math.max(minRadius, Math.sqrt((nearest.x-cx)**2 + (nearest.y-cy)**2)));
    } else {
      yellowCircle.attr('r', circleRadius);
      const scale = Math.max(width, height) * 2 / (distToCenter || 1);
      yellowLine
        .attr('x1', cx)
        .attr('y1', cy)
        .attr('x2', cx + dx*scale)
        .attr('y2', cy + dy*scale);
    }
  });

})();
