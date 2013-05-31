"use strict";

module.exports = function(fromFile, toFile, prettifyJson) {
    var yaml = require('js-yaml');
    var fs = require('fs');
    var md5 = require('MD5');
    var path = require("path");

    var i, j, rdlistCount, recordProcessorsCount;

    fromFile = path.resolve(fromFile);
    toFile = path.resolve(toFile);
    var yamlString = fs.readFileSync(fromFile, {
        encoding:'utf8'
    });
    var rdlist = yaml.load(yamlString, {
        filename:fromFile
    });

    var applyGravitarHash = function(item) {

        // Hash email with md5
        // http://en.gravatar.com/site/implement/hash/
        // http://en.gravatar.com/site/implement/images/

        var email = item.Email;
        if(email) {
            item.GravitarHash = md5(email.trim().toLowerCase());
        }
        return item;
    }

    var recordProcessors = [
        applyGravitarHash
    ];

    for(i=0, rdlistCount=rdlist.length; i < rdlistCount; i++) {
        var item = rdlist[i];

        for(j=0, recordProcessorsCount=recordProcessors.length; j < recordProcessorsCount; j++) {
            recordProcessors[j](item);
        }

    }

    fs.writeFileSync(toFile, JSON.stringify(rdlist, null, prettifyJson ? "\t" : ""), {flags:'w'});
}

