(function () {
    "use strict";

    var gmap = null;
    var pins = [];
    var InfoBoxes = [];
    var LastpinInfobox = null;

    function initialize() {
        var map = new Microsoft.Maps.Map(document.getElementById("map_canvas"),
            {
                credentials: "Av44fMg4QsqyF21CcE8lL9ygerMqenWrwEAPRDzAEgPHtRUPqTmf6u1C2HZ6iKPT",
                center: new Microsoft.Maps.Location(30, 0),
                mapTypeId: Microsoft.Maps.MapTypeId.road,
                zoom: 2
            });
        gmap = map;
    }
    function parseLocation(people) {
        var i, peopleCount;
        var markers = [];

        var marker;

        for (i = 0, peopleCount = people.length; i < peopleCount; i++) {
            var person = people[i];

            // If there's no location, can't map: move to next person
            if (!person.hasOwnProperty('_location'))
                continue;

            var last = person.Last;
            var first = person.First;
            var city = person.City;
            var state = person.State;
            var country = person.Country;
            var icon = person.Icon;

            markers.push(marker);

            var marcus = '';
            if (state === null) {
                marcus = city + ' ' + country;
            } else {
                marcus = city + ', ' + state + ' ' + country;
            }


            // Retrieve the latitude and longitude values- normalize the longitude value
            var latVal = person._location.lat;
            var longVal = Microsoft.Maps.Location.normalizeLongitude(person._location.lng);

            var latlong = new Microsoft.Maps.Location(latVal, longVal);
            // Add a pin to the center of the map
            var pin = new Microsoft.Maps.Pushpin(latlong, { text: '' });

            // Create the infobox for the pushpin
            var pinInfobox = new Microsoft.Maps.Infobox(pin.getLocation(),
                { title: '<div class="info-window"><span class="director-name">' + first + ' ' + last + '</span></div>' ,
                    description: '<div class="info-window"><span class="director-location">' + marcus + '</span> <div class="circularIcon"><img style="border-radius: 50%;-moz-border-radius: 50%;-webkit-border-radius: 50%;" src="http://www.gravatar.com/avatar/' + person.GravatarHash + '"/></div>	</div>',
                    visible: false,
                    offset: new Microsoft.Maps.Point(0, 15)
                });

            // Add handler for the pushpin click event.
            Microsoft.Maps.Events.addHandler(pin, 'click', displayInfobox);

            // Hide the infobox when the map is moved.
            Microsoft.Maps.Events.addHandler(gmap, 'viewchange', hideInfobox);


            // Add the pushpin and infobox to the map
            gmap.entities.push(pin);
            gmap.entities.push(pinInfobox);

            pins.push(pin);
            InfoBoxes.push(pinInfobox)
        }
    };

    function displayInfobox(e) {

         if (LastpinInfobox != null) {
            LastpinInfobox.setOptions({ visible: false });
        }
        var idx = pins.indexOf(e.target);
        var pinInfobox = InfoBoxes[idx];
        pinInfobox.setOptions({ visible: true });
        LastpinInfobox = pinInfobox
    }

    function hideInfobox(e) {
        if (LastpinInfobox != null) {
            LastpinInfobox.setOptions({ visible: false });
        }
    }

    $.getJSON("/rdlist.json", parseLocation);
    $(function () { initialize(); });


})();
