"use strict"

var c, lrSnippet, mountFolder;

mountFolder = function(connect, dir) {
    return connect["static"](require("path").resolve(dir));
};

c = {
    source: "source",
    release: "release",
    tmp: "tmp",
    gitVersion: '',
    gitVersionPretty: ''
};

module.exports = function (grunt) {

    // automatically load grunt plugins
    require("matchdep").filterAll('grunt-*', require('./package.json')).forEach(grunt.loadNpmTasks);

    grunt.c = c;

    grunt.registerTask('setupGitVersion', function(){
        var done = this.async();

        function executeGit(args, callback) {
            grunt.util.spawn({
                cmd: "git",
                args: args,
            }, function(err, result, code){
                if(err) {
                    grunt.log.error(err, result);
                    done();
                }
                var version = new String(result);
                callback(version);
            });
        }

        var tasks = [
            function(next){
                executeGit(["rev-parse", "HEAD"], function(version) {
                    c.gitVersion = version;
                    grunt.log.writeln("*** git version: " + version);
                    next();
                });
            },
            function(next){
                executeGit(["describe", "--tags", "--always", "--long", "--dirty"], function(version) {
                    c.gitVersionPretty = version;
                    grunt.log.writeln("*** git pretty version: " + version);
                    next();
                });
            },
        ];

        grunt.util.async.forEachSeries(tasks, function(task, next) {
            task(next);
        }, function() {
            done();
        });

    });

    grunt.initConfig({
        watch: {
            // markdown: {
            //     files: [c.source + "contents/*.md"],
            //     tasks: ['markdown:debug']
            // },
            javascript: {
                files: [c.source + "/js/{,*/}*.js"],
                tasks: ["copy:debug"]
            },
            coffee: {
                files: [c.source + "/js/{,*/}*.coffee"],
                tasks: ["coffee:debug"]
            },
            coffeeTest: {
                files: ["test/spec/{,*/}*.coffee"],
                tasks: ["coffee:test"]
            },
            jade: {
                files: [c.source + "/*.jade"],
                tasks: ["jade:debug"]
            },
            stylus: {
                files: [c.source + "/**/*.styl"],
                tasks: ["stylus:debug"]
            },
            less: {
                files: [c.source + "/**/*.less"],
                tasks: ["less:debug"]
            },
            m2j: {
                files: [c.source + "/contents/*.md"],
                tasks: ["m2j:debug"]
            },
            livereload: {
                files: [c.tmp + "/**/*.*", "tmp/js/{,*/}*.js",
                        c.source + "/images/{,*/}*.{png,svg,jpg,jpeg,webp}"],
                tasks: ["livereload"]
            }
        },
        connect: {
            options: {
                port: 9000,
                hostname: "localhost"
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [require("grunt-contrib-livereload/lib/utils").livereloadSnippet, mountFolder(connect, c.tmp), mountFolder(connect, c.source)];
                    }
                }
            }
        },
        open: {
            server: {
                path: "http://localhost:<%= connect.options.port %>"
            }
        },
        clean: {
            release: [c.tmp, c.release],
            debug: c.tmp
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            all: ["Gruntfile.js", c.source + "/js/{,*/}*.js", "!" + c.source + "/js/vendor/*", "test/spec/{,*/}*.js"]
        },
        wintersmith_compile: {
            release: {
                options: {
                    config: c.source + "/config.json",
                    output: c.release + "/articles"
                }
            },
            debug: {
                options: {
                    config: c.source + "/config.json",
                    output: c.tmp + "/articles"
                }
            }
        },
        coffee: {
            release: {
                files: [
                    {
                        expand: true,
                        cwd: c.source + "/js",
                        src: "*.coffee",
                        dest: c.release + "/js",
                        ext: ".js"
                    }
                ]
            },
        },
        jade: {
            release: {
                files: grunt.file.expandMapping(["*.jade"], c.release + "/", {
                    cwd: c.source,
                    rename: function (base, path) {
                        return base + path.replace(/\.jade$/, ".html");
                    }
                }),
                options: {
                    client: false,
                    pretty: true,
                    data: {
                        title: "gruntfile release"
                    }
                }
            },
            debug: {
                files: grunt.file.expandMapping(["*.jade"], c.tmp + "/", {
                    cwd: c.source,
                    rename: function (base, path) {
                        return base + path.replace(/\.jade$/, ".html");
                    }
                }),
                options: {
                    client: false,
                    pretty: true,
                    data: {
                        title: "gruntfile debug"
                    }
                }
            }
        },

        // markdown: {
        //     options: {
        //         gfm: true,
        //         highlight: 'manual'
        //     },
        //     release: {
        //         files: [ c.source + '/contents/*.md'],
        //         dest:  c.release + '/articles'
        //     },
        //     debug: {
        //         files: [ c.source + '/contents/*.md'],
        //         dest:  c.tmp + '/articles'
        //     },
        // },
        less: {
            release: {
                src:  [ c.source + '/**/*.less'],
                dest: c.release + '/styles/less.css'
            },
            debug: {
                src: [c.source + "/**/*.less"],
                dest: c.tmp + "/styles/less.css"
            },
        },
        stylus: {
            release: {
                files: grunt.file.expandMapping(["styles/*.styl"], c.release + "/", {
                    cwd: c.source,
                    rename: function (base, path) {
                        return base + path.replace(/\.styl$/, ".css");
                    }
                }),
                options: {
                    compress: false,
                    paths: ["node_modules/grunt-contrib-stylus/node_modules"]
                }
            },
            debug: {
                files: grunt.file.expandMapping(["styles/*.styl"], c.tmp + "/", {
                    cwd: c.source,
                    rename: function (base, path) {
                        return base + path.replace(/\.styl$/, ".css");
                    }
                }),
                options: {
                    compress: false,
                    paths: ["node_modules/grunt-contrib-stylus/node_modules"]
                }
            }
        },
        useminPrepare: {
            html: c.release + "/*.html",
            options: {
                dest: c.release
            }
        },
        usemin: {
            html: [c.release + '/*.html'],
            css: [c.release + '/*.css'],
            options: {
                dirs: [c.release, c.tmp]
            }
        },
        cssmin: {
            options: { keepBreaks: true, removeEmpty: true },
        },
        concat: {
            options: {
                banner: '/*! Minification on <%= grunt.template.today("yyyy-mm-dd") %> */ \n '
            }
        },
        uglify: {
            release: {
                src: [c.source + "/js/*.js", c.release + "/js/*.js"],
                dest: c.release + "/js/main.js"
            }
        },
        rev: {
            release: {
                files: {
                    src: [c.release + "**/*.{js,css,png,jpg,gif}", "release/js/msrd.js"]
                }
            }
        },
        imagemin: {
            release: {
                files: [
                    {
                        expand: true,
                        cwd: c.source + "/images",
                        src: "{,*/}*.{png,jpg,jpeg}",
                        dest: c.release + "/images"
                    }
                ]
            }
        },
        copy: {
            release: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: c.source,
                        dest: c.release,
                        src: ["components/**/*.*", "js/*.js", "images/{,*/}*.*", "*.{ico,txt}", "**/*.{,svg,png,jpg}", ".htaccess", "web.config"]        // don't copy CSS for release; usemin does it
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: c.source,
                        dest: c.release,
                        src: ["styles/*.css"]
                    },
                    { src: 'source/rdlist.json', dest: 'release/rdlist.json' }
                ]
            },
            debug: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: c.source,
                        dest: c.tmp,
                        src: ["images/{,*/}*.*", "*.{ico,txt}", "**/*.{,svg,png,jpg}", ".htaccess", "styles/*.css", "web.config"]
                    },
                    { src: 'source/rdlist.json', dest: '.tmp/rdlist.json' }
                ]
            }
        },

        mkdir: [c.tmp],

        m2j: {
            release: {
                options: { minify: false, width: 180 },
                src: [c.source + "/contents/*.md"],
                dest: c.release + "/articles.json"
            },
            debug: {
                options: { minify: false, width: 180 },
                src: [c.source + "/contents/*.md"],
                dest: c.tmp + "/articles.json"
            },
        },

        simplemocha: {
            options: {
                globals: ["should"],
                timeout: 3000,
                ignoreLeaks: false,
                /*grep: '*.js',*/
                ui: "bdd",
                reporter: "tap"
            },

            all: { src: ['test/server/**/*.js'] },
            releaseBuildVerificationTests: { src: ['test/postReleaseTests/**/*.js'] }
        },
        exec: {
            testemCITests: {
                // only launch Firefox on Travis (PhantomJS hangs due to node versons? and chrome is hanging on travis) 
                cmd: "testem ci"
            }
        },

        replace: {
            dist: {
                options: {
                    variables:{
                        'currentGitHubCommit': '<%= grunt.c.gitVersion %>',
                        'currentGitHubCommitPretty': '<%= grunt.c.gitVersionPretty %>'
                    },
                    prefix: '@@'
                },
                files:[
                    {expand: true, flatten: true, src:[c.release + '/**/*.html'], dest: c.release},
                    {expand: true, flatten: true, src:[c.tmp + '/**/*.html'], dest: c.tmp}
                ]
            }
        }
    });


    grunt.registerTask("mj", ["m2j"]);
    grunt.registerTask("compliment", "Treat yo\' self", function () {
        var compliments, index, mydefaults;
        mydefaults = ['No one cares'];
        compliments = grunt.config('compliment') || mydefaults;
        index = Math.floor(Math.random() * compliments.length);
        return grunt.log.writeln(compliments[index]);
    });
    grunt.registerTask("mkdir", "Make a new directory", function () {
        var dirs;
        dirs = grunt.config("mkdir");
        return dirs.forEach(function (name) {
            grunt.file.mkdir(name);
            return grunt.log.writeln("Created folder: " + name);
        });
    });

    grunt.registerTask("releaseAzure", [
        //"mkdir",
        "jade:release",
        "stylus:release",
        // "less:release",
        //"markdown:release",
        "m2j:release",
        "wintersmith_compile:release",
        "copy:release",
        "setupGitVersion",
        // "replace",
        "useminPrepare",
        "concat",
        "cssmin",
        "rev",
        "usemin",
        // "simplemocha:releaseBuildVerificationTests"
    ]);


    grunt.registerTask("release", [
        "clean:release",
        "releaseAzure"
    ]);

    grunt.registerTask("ci", [
        "release",
        "test"
    ]);

    grunt.registerTask("test", [
        "simplemocha:all",
        "exec:testemCITests"
    ]);

    grunt.registerTask("debug", [
        "clean:debug",
        "coffee",
        "jade:debug",
        "stylus:debug",
        "m2j:debug",
        "wintersmith_compile:debug"
    ]);

    grunt.registerTask("default", ["debug-run"]);

    grunt.registerTask("debug-run", [
        "debug",
        "connect:livereload",
        "open",
        "livereload-start",
        "watch"
    ]);
};

