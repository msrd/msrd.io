// modules
var fs = require("fs"),
  geocoder = require('geocoder');

// Customize delimiter and name of address column here
delimiter = ";";
addressColumn = "address";

chunk = '';
process.stdin.resume();

process.stdin.on('data', function(data) {
  chunk += data;
});

// read csv file and write to json file
process.stdin.on('end', function() {
  data = chunk;
  
  // convert csv to arrays
  markerArr = csv2array(data);
  labelArr = markerArr[0];
  markerArr.splice(0, 1);
  
  // convert arrays to objects
  markerObjArr = array2obj(labelArr, markerArr);

  // add lat and lng to each object and write to output file
  markerObjArr.forEach(function(markerObj) {
    addLocation(markerObj, markerObjArr.length);
  })
});

// functions
function csv2array(data) {
  // inputs csv data and returns an array (length equal to number of lines) of marker arrays
  lines = data.toString().split('\n');
  // populate markers array
  markerArr = [];
  lines.forEach(function (line) {
    if (line.length!=0) {
      fields = line.split(delimiter);
      for (i=0; i<fields.length; i++) {
        fields[i] =  fields[i].trim();
      }
      markerArr.push(fields);
    }
  })
  return markerArr;
}

function array2obj(labels, markers) {
  // inputs markers array and returns an array of marker objects
  markerObjArr = [];
  markers.forEach(function(marker) {
    markerObj = {};
    for (j=0; j<labels.length; j++) {
      markerObj[labels[j]] = marker[j];
    }
    markerObjArr.push(markerObj);
  });
  return markerObjArr;
}

function addLocation(markerObj, n) {
  // inputs markerObj and length of markerObjArr
  // append lat, lng to marker object and writes to output file
  markersObjArr = []; // instantiate new markers object array
  geocoder.geocode(markerObj[addressColumn], function(err, data) {
    if (err) {
      console.log('Geocoding failed for marker ' + markerObj['name']);
      lat = lng = '';
    } else {
      location = data.results[0].geometry.location;
      lat = location.lat;
      lng = location.lng;
    }
    // set lat, lng from query as keys in markerObj, then push to array
    markerObj['lat'] = lat;
    markerObj['lng'] = lng;
    markersObjArr.push(markerObj);
    if (markersObjArr.length==n) { 
      // last marker has been added, write to output file
      process.stdout.write( JSON.stringify(markerObjArr,undefined,2));
    }
  });
}
