(function() {

      function initialize() {

          var center = new google.maps.LatLng(26.130, 14.111)
          var options = {
              'zoom': 2,
              'center': center,
              'mapTypeId': google.maps.MapTypeId.ROADMAP
          };
          var map = new google.maps.Map(document.getElementById('map_canvas'), options);
          var mcOptions = {
              gridSize: 100,
              maxZoom: 7
          };

          function parseLocation(people) {
              var i, peopleCount;
              var markers = [];
              var infoWindow = new google.maps.InfoWindow();
              var latLongFunc = google.maps.LatLng;
              var markerFunc = google.maps.Marker;
              for (i = 0, peopleCount = people.length; i < peopleCount; i++) {
                  var person = people[i];
                  last = person.Last;
                  first = person.First;
                  city = person.City;
                  state = person.State;
                  country = person.Country;
                  icon = person.Icon;
                  // push marker to markers array
                  var latLngStr = person.Location.split(", ");
                  var latLng = new latLongFunc(latLngStr[0], latLngStr[1]);
                  var marker = new markerFunc({
                          'position': latLng,
                          'icon': icon
                      });
                  markers.push(marker);
                  var content = '<div class="info-window"><span class="director-name">' + first + ' ' + last + '</span><span class="director-location">' + city + ', ' + state + ' ' + country + '</span></div>';
                  bindInfoWindow(marker, map, infoWindow, content);
              }
              var mc = new MarkerClusterer(map, markers, mcOptions);
          };

          $.getJSON("/rdlist.json", parseLocation);

          function bindInfoWindow(marker, map, infoWindow, content) {
              google.maps.event.addListener(marker, 'click', function () {
                      infoWindow.setContent(content);
                      infoWindow.open(map, marker);
                  });
          }
      }
      google.maps.event.addDomListener(window, 'load', initialize);
})();
