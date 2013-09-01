(function() {
    'use strict';

    var simulate = false;
    var request_throttle = 150;     // POST requests to Google API every n msec

    module.exports = function (fromFile, toFile, prettifyJson) {
        var yaml = require('js-yaml');
        var fs = require('fs');
        var md5 = require('MD5');
        var path = require('path');
        var http = require('http');
        var async = require('async');

        fromFile = path.resolve(fromFile);
        toFile = path.resolve(toFile);

        var yamlString = fs.readFileSync(fromFile, 'utf8');

        var people = yaml.load(yamlString, {
            filename: fromFile
        });

        var applyGravatarHash = function(item) {

            // Hash email with md5
            // http://en.gravatar.com/site/implement/hash/
            // http://en.gravatar.com/site/implement/images/

            var email = item.Email;
            if(email) {
                item.GravatarHash = md5(email.trim().toLowerCase());
            }
        };

        var concatPlaceName = function(item) {
            if (item.State === null || item.State === '') {
                item._placename = item.City + ', ' + item.Country;
            } else {
                item._placename = item.City + ', ' + item.State + ' ' + item.Country;
            }
        };

        var gpsLookup = function(p, callback) {
            var url = "http://maps.googleapis.com/maps/api/geocode/json?sensor=true&address=" + encodeURI(p._placename);
            var body = '';

            if (simulate)  {
                p._location = {
                    lat:   37.87,
                    lng: -122.27
                };

                console.log(url);                
                callback();
                return;
            }


            http.get(url, function(res) {
                res.on('data', function(chunk) {
                    body += chunk;
                });

                res.on('end', function() {
                    var googlemaps = JSON.parse(body);
                    if (googlemaps.status === 'OVER_QUERY_LIMIT')
                    {
                        console.log('OVER_QUERY_LIMIT');
                    }

                    if (googlemaps.status === 'ZERO_RESULTS')
                    {
                        console.log('\tno results (' + p._placename + '): ' + url);
                    }

                    if (googlemaps.results.length) {
                        p._location = googlemaps.results[0].geometry.location;
                    }
                    callback();
                });
            }).on('error', function(e) {
                console.log('Got error' + e.message);
            });
        };

        var exec = require('child_process').exec;
        function execute(command, callback) {
            exec(command, function(error, stdout, stderr) {
                callback(stdout); 
            });
        };

        var makeFullName = function(p, callback) {
            var fullname = p.First + ' ' + p.Last;

            // Preserves UTF-8 diacriticals
            p._fullname = fullname.toLowerCase().split(' ').join('_');

            // Converts to ASCII but can't get it to work
            // execute('./firstlast.sh ' + p.First + ' ' + p.Last, 
            //         function(n) { console.log(n); p._fullname = n });
            // callback();
        };

        var counter = 0;
        var doSteps = function(item, callback) {
            console.log(counter + ':' + item.First + ' ' + item.Last);
            applyGravatarHash(item);
            concatPlaceName(item);
            makeFullName(item);

            setTimeout(function() {
                gpsLookup(item, callback);
            }, request_throttle);

            counter++;
        }

        if (simulate) {
            console.log('WARNING: In simulation mode. lat/long coordinates are hard-coded.');
            request_throttle = 0;
        }

        async.eachSeries(people, doSteps, function(err) {
            if (err)  {
                console.log("ERROR: ");
                console.log(err);
            }
            console.log('Processed ' + counter);
            fs.writeFileSync(toFile, JSON.stringify(people, null, prettifyJson ? "\t" : ""));
        });
    };
})();



