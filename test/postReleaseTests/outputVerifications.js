var fs = require('fs');
var walk = require('walk');
var path = require('path');
var expect = require('chai').expect;

describe("when looking at the release folder", function(){

    var releaseFolderFiles = [];

    function filesWithExtension(ext) {
        return releaseFolderFiles.filter(function(file){
            return path.extname(file).toLowerCase() == ext;
        });
    }

 
    before(function(done){

        var walker = walk.walk('./release', { followLinks:false });

        walker.on('file', function(root, stat, next) {
            releaseFolderFiles.push(root + '/' + stat.name);
            next();
        });

        walker.on('end', function() {
            done();
        });
    
    });

    describe("all the html files", function(){

        var htmlFiles = [];

        before(function(){
            htmlFiles = filesWithExtension('.html');
        });

        it('should have generated some html files', function(){

            expect(htmlFiles.length).to.be.above(0);
        });

        it('should have @@currentGitHubCommit* vars replaced with actual values', function(done){

            htmlFiles.forEach(function(fileName){
                var data = new String(fs.readFileSync(fileName));
                if(data.indexOf("@@currentGitHubCommit") >= 0) {
                    throw "should not have found @@currentGitHubCommit in file: " + fileName;
                }
            });

            done();
        });
 
    });

});
