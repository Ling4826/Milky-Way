svg = d3.select('svg')

width = svg[0][0].getBoundingClientRect().width
height = svg[0][0].getBoundingClientRect().height

# projection = d3.geo.mercator()
    # .scale(2800)
    # .translate([50, 2620])
    # .precision(0.1)
    
# projection = d3.geo.albers()
    # .center([14, 34])
    # .rotate([-14, 0])
    # .parallels([38, 61])
    # .scale(2100)
    
projection_boreal = d3.geo.azimuthalEquidistant()
    .scale(150)
    .rotate([180,-90,0])
    .center([0, 0])
    .translate([width / 4 + 4.35, height / 2])
    .precision(.1)ห
    .clipAngle(90 + 1e-3)
    
projection_austral = d3.geo.azimuthalEquidistant()
    .scale(150)
    .rotate([0,90,0])
    .center([0, 0])
    .translate([3*width / 4 - 4.35, height / 2])
    .precision(.1)
    .clipAngle(90 + 1e-3)
    
# sky_projection = (lambda, phi) ->
    # [x, y] = geo_projection(lambda, phi)
    # return [x, -y]

graticule = d3.geo.graticule()
    .minorStep([15,10])
    .majorStep([90,10])

path_generator_boreal = d3.geo.path()
    .projection(projection_boreal)
    
path_generator_austral = d3.geo.path()
    .projection(projection_austral)
    
### create maps groups ###
maps = svg.append('g')

map_boreal = maps.append('g')
    .attr('id', 'map_boreal')
    
map_austral = maps.append('g')
    .attr('id', 'map_austral')
    
### draw the graticules ###
map_boreal.append('path')
    .datum(graticule)
    .attr('class', 'graticule')
    .attr('d', path_generator_boreal)
    
map_austral.append('path')
    .datum(graticule)
    .attr('class', 'graticule')
    .attr('d', path_generator_austral)
    
### define a zoom behavior ###
zoom = d3.behavior.zoom()
    .scaleExtent([1,20]) # min-max zoom
    .on 'zoom', () ->
      # whenever the user zooms,
      # modify translation and scale of the zoom group accordingly
      maps.attr('transform', "translate(#{zoom.translate()})scale(#{zoom.scale()})")
      
### bind the zoom behavior to the main SVG ###
svg.call(zoom)


### define a scale for magnitude ###
magnitude = d3.scale.quantize()
    .domain([-1,5])
    .range([7,6,5,4,3,2,1])
d3.json('stars_api.php', function(error, data) {
  if (error) throw error;
  map_boreal.selectAll('.star')
    .data(data.filter(function(d){ return +d.dec_deg > 0; }))
    .enter().append('circle')
    .attr('class', 'star')
    .attr('r', function(d) { return magnitude(+d.magnitude)/2; })
    .attr('transform', function(d) {
      var lat = +d.dec_deg + +d.dec_min/60 + +d.dec_sec/3600;
      var lon = (+d.RA_hour + +d.RA_min/60 + +d.RA_sec/3600)*(360/24);
      var coords = projection_boreal([lon, lat]);
      console.log('vega-coords', coords); 
      return coords ? "translate(" + coords[0] + "," + coords[1] + ")" : null;
    });
  map_austral.selectAll('.star')
    .data(data.filter(function(d){ return +d.dec_deg <= 0; }))
    .enter().append('circle')
    .attr('class', 'star')
    .attr('r', function(d) { return magnitude(+d.magnitude)/2; })
    .attr('transform', function(d) {
      var lat = +d.dec_deg + +d.dec_min/60 + +d.dec_sec/3600;
      var lon = (+d.RA_hour + +d.RA_min/60 + +d.RA_sec/3600)*(360/24);
      var coords = projection_austral([lon, lat]);
      return coords ? "translate(" + coords[0] + "," + coords[1] + ")" : null;
    });
    con
});

d3.json('planet_api.php', function(error, planetdata) {
  if (error) throw error;
  // เหนือ (boreal)
  map_boreal.selectAll('.planet-group')
    .data(planetdata.filter(function(d){ return +d.dec_deg > 0; }))
    .enter().append('g')
    .attr('class', 'planet-group')
    .attr('transform', function(d) {
      var lat = +d.dec_deg + +d.dec_min/60 + +d.dec_sec/3600;
      var lon = (+d.RA_hour + +d.RA_min/60 + +d.RA_sec/3600)*(360/24);
      var coords = projection_boreal([lon, lat]);
      return coords ? "translate(" + coords[0] + "," + coords[1] + ")" : null;
    })
    
  map_austral.selectAll('.planet-group')
    .data(planetdata.filter(function(d){ return +d.dec_deg <= 0; }))
    .enter().append('g')
    .attr('class', 'planet-group')
    .attr('transform', function(d) {
      var lat = +d.dec_deg + +d.dec_min/60 + +d.dec_sec/3600;
      var lon = (+d.RA_hour + +d.RA_min/60 + +d.RA_sec/3600)*(360/24);
      var coords = projection_austral([lon, lat]);
      return coords ? "translate(" + coords[0] + "," + coords[1] + ")" : null;
    })
   
});
//ไอจอด

            