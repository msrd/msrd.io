"use strict";

module.exports = function (fromFile, toFile, prettifyJson) {
    var yaml = require('js-yaml');
    var fs = require('fs');
    var md5 = require('MD5');
    var path = require("path");

    var i, j, rdlistCount, recordProcessorsCount;

    fromFile = path.resolve(fromFile);
    toFile = path.resolve(toFile);

    var yamlString = fs.readFileSync(fromFile, "utf8");

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
    }

    var recordProcessors = [
        applyGravatarHash
    ];

    rdlist.forEach(function (item) {
        recordProcessors.forEach(function (processor) {
            processor(item);
        });
    });

    fs.writeFileSync(toFile, JSON.stringify(rdlist, null, prettifyJson ? "\t" : ""));
}

