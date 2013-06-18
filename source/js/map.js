(function() {
    "use strict";

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
              var marker;
              for (i = 0, peopleCount = people.length; i < peopleCount; i++) {
                  var person = people[i];
                  var last = person.Last;
                  var first = person.First;
                  var city = person.City;
                  var state = person.State;
                  var country = person.Country;
                  var icon = person.Icon;

                  var latLngStr = person.Location.split(", ");
                  var latLng = new latLongFunc(latLngStr[0], latLngStr[1]);

                  if(person.GravatarHash) {
                    marker = new RichMarker({
                        'position': latLng,
                        'content': person.GravatarHash ? '<div class="circularIcon"><img style="border-radius: 50%;-moz-border-radius: 50%;-webkit-border-radius: 50%;" src="http://www.gravatar.com/avatar/' + person.GravatarHash + '"/></div>' : null,
                        'anchor': RichMarkerPosition.MIDDLE,
                        'flat':true
                    });
                  } else {
                    marker = new markerFunc({
                        'position': latLng,
                    });
                 }
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
