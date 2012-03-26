/**
 * Redistricting map 2012
 */

var map;
var interaction;
var geocoder = new google.maps.Geocoder();
var marker;

// Namespace jQuery
(function($) {

/**
 * Document ready event.
 */
$(document).ready(function() {
  wax.tilejson('http://data.minnpost.s3.amazonaws.com/maps/leg_districts/leg_redistricting.json',
    function(tilejson) {
      map = new L.Map('map-div')
        .addLayer(new wax.leaf.connector(tilejson))
        .setView(new L.LatLng(46.3, -94.2), 7);
        //.setMaxBounds(new L.LatLngBounds(new L.LatLng(-97.7124, 43.125), new L.LatLng(-89.165, 49.5466)));
        
      // Add wax interaction with UTFGrid data.
      interaction = wax.leaf.interaction(map, tilejson);
    }
  );
    
  // Handle looking up address form.
  $("#redist_search").submit(function() {
    geocode($('#redist_query').val());
    return false;
  });
  
  // DataTable
  $('#incumbents-running').dataTable({
    'aaSorting': [[ 1, 'desc' ]]
  });
  $('#open-seats').dataTable({
    'aaSorting': [[ 1, 'desc' ]]
  });
});

/**
 * Geocode address from form.
 */
function geocode(query) {
  // Check for minnesota or MN, and if not, add it.
  var gr = { 'location': query };
  if (typeof(query) == 'string') {
    var pattr = /\smn\s|\sminnesota\s/gi;
    var match = query.match(pattr);
    if (!match) {
      query = query + ' MN';
    }
    gr = { 'address': query };
  }
  
  // Geocode and fire callback.
  geocoder.geocode(gr, handle_geocode);
}

/**
 * Geocode callback.
 */
function handle_geocode(results, status) {
  var lat = results[0].geometry.location.lat();
  var lng = results[0].geometry.location.lng();
  var normalized_address = results[0].formatted_address;
  
  // Update form value with nice address.
  $('#redist_query').val(normalized_address)

  // Add marker and center
	var point = new L.LatLng(lat, lng);
	marker = new L.Marker(point);
	map.addLayer(marker);
	map.setView(point, 12);
}

})(jQuery);
