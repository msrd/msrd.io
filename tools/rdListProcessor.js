(function() {
    'use strict';

    module.exports = function (fromFile, toFile, prettifyJson) {
        var yaml = require('js-yaml');
        var fs = require('fs');
        var md5 = require('MD5');
        var path = require('path');

        var rdlistCount, recordProcessorsCount;

        fromFile = path.resolve(fromFile);
        toFile = path.resolve(toFile);

        var yamlString = fs.readFileSync(fromFile, 'utf8');

        var rdlist = yaml.load(yamlString, {
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
            return item;
        };

        var concatPlaceName = function(item) {
            if (item.State === null || item.State === '') {
                item._placename = item.City + ', ' + item.Country;
            } else {
                item._placename = item.City + ', ' + item.State + ' ' + item.Country;
            }

            return item;
        };

        var gpsLookup = function(item) {
            // hardcoded for now
            item.Location = "41.355, -72.099";
            return item;
        };

        var recordProcessors = [
            applyGravatarHash, 
            concatPlaceName,
            gpsLookup
        ];

        rdlist.forEach(function (item) {
            recordProcessors.forEach(function (processor) {
                processor(item);
            });
        });

        fs.writeFileSync(toFile, JSON.stringify(rdlist, null, prettifyJson ? "\t" : ""));
    }
})();

