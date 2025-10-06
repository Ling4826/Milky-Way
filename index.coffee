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
    .precision(.1)
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
    
d3.csv 'stars.csv', (data) ->
    map_boreal.selectAll('.star')
        .data(data.filter((d) -> +d.dec_deg > 0))
      .enter().append('circle')
        .attr('class', 'star')
        .attr('r', (d) -> magnitude(+d.magnitude)/2)
        .attr 'transform', (d) ->
            lat = +d.dec_deg + +d.dec_min/60 + +d.dec_sec/3600
            lon = (+d.RA_hour + +d.RA_min/60 + +d.RA_sec/3600)*(360/24)
            [x, y] = projection_boreal([-lon, lat])
            return "translate(#{x},#{y})"
            
    map_austral.selectAll('.star')
        .data(data.filter((d) -> +d.dec_deg <= 0))
      .enter().append('circle')
        .attr('class', 'star')
        .attr('r', (d) -> magnitude(+d.magnitude)/2)
        .attr 'transform', (d) ->
            lat = +d.dec_deg + +d.dec_min/60 + +d.dec_sec/3600
            lon = (+d.RA_hour + +d.RA_min/60 + +d.RA_sec/3600)*(360/24)
            [x, y] = projection_austral([-lon, lat])
            return "translate(#{x},#{y})"
            