"use strict"

var c, lrSnippet, mountFolder;

mountFolder = function(connect, dir) {
    return connect["static"](require("path").resolve(dir));
};

c = {
    source: "source",
    release: "release",
    tmp: "tmp"
};

module.exports = function (grunt) {

    // automatically load grunt plugins
    require("matchdep").filterAll('grunt-*', require('./package.json')).forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        watch: {
            markdown: {
                files: ['articles/*.md'],
                tasks: ['markdown:debug']
            },
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
                files: [c.source + "/articles/*.md"],
                tasks: ["m2j:debug"]
            },
            rdList: {
                files: [c.source + "/rdlist.yaml"],
                tasks: ["compileRdListDebug"]
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
        markdown: {
            options: {
                gfm: true,
                highlight: 'manual'
            },
            release: {
                files: [ c.source + '/articles/*.md'],
                dest:  c.release + '/articles'
            },
            debug: {
                files: [ c.source + '/articles/*.md'],
                dest:  c.tmp + '/articles'
            },
        },
        less: {
            release: {
                src:  [ c.source + '/**/*.less'],
                dest: c.release + '/styles/less.css'
            },
            debug: {
                src:  [ c.source + '/**/*.less'],
                dest: c.tmp + '/styles/less.css'
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
                files: grunt.file.expandMapping(["styles/*styl"], c.tmp + "/", {
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
                banner: '/*! Minification on <%= grunt.template.today("yyyy-mm-dd") %> */'
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
                    src: [c.release + '**/*.{js,css,png,jpg,gif}']
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
                        src: ["components/**/*.*", "js/*.js", "logo/*.*", "*.{ico,txt}", "**/*.{,svg,png,jpg}", ".htaccess", "web.config"]        // don't copy CSS for release; usemin does it
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: c.source,
                        dest: c.release,
                        src: ["styles/*.css"]
                    }
                ]
            },
            debug: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: c.source,
                    dest: c.tmp,
                    src: ["logo/*.*", "*.{ico,txt}", "**/*.{,svg,png,jpg}", ".htaccess", "styles/*.css", "web.config"]
                }]
            }
        },
        compliment: ['You are so awesome', 'You are handsome', 'You are witty'],
        mkdir: [c.tmp],
        m2j: {
            release: {
                options: { minify: false, width: 80 },
                src: [c.source + "/articles/*.md"],
                dest: c.release + "/articles.json"
            },
            debug: {
                src: [c.source + "/articles/*.md"],
                dest: c.tmp + "/articles.json"
            }
        },
        simplemocha: {
            options: {
                globals: ['should'],
                timeout: 3000,
                ignoreLeaks: false,
                /*grep: '*.js',*/
                ui: 'bdd',
                reporter: 'tap'
            },

            all: { src: ['test/server/**/*.js'] }
        },
        exec: {
            testemCITests: {
                // only launch Firefox on Travis (PhantomJS hangs due to node versons? and chrome is hanging on travis) 
                cmd: 'testem ci'
            }
        }
    });


    function compileRdList(outputDir, prettifyJson) {
        require("./tools/rdListProcessor.js")("./source/rdlist.yaml", outputDir + "/rdlist.json", prettifyJson);
        grunt.log.writeln("recompiled rdlist");
    }

    grunt.registerTask("compileRdListRelease", "", function() {
        compileRdList("./release", false);
    });

    grunt.registerTask("compileRdListDebug", "", function() {
        compileRdList("./tmp", true);
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
        dirs = grunt.config('mkdir');
        return dirs.forEach(function (name) {
            grunt.file.mkdir(name);
            return grunt.log.writeln("Created folder: " + name);
        });
    });

    grunt.registerTask("releaseAzure", [
        //"clean:release", // azure is failing on this task (not sure why)
        "mkdir",
        "jade:release",
        "stylus:release",
        "markdown:release",
        "m2j:release",
        "compileRdListRelease",
        "copy:release",
        "useminPrepare",
        "concat",
        "cssmin",
        "rev",
        "usemin"
    ]);


    grunt.registerTask("release", [
        "clean:release",
        "mkdir",
        "jade:release",
        "stylus:release",
        "markdown:release",
        "m2j:release",
        "compileRdListRelease",
        "copy:release",
        "useminPrepare",
        "concat",
        "cssmin",
        "rev",
        "usemin"
    ]);

    grunt.registerTask("ci", [
        "release",
        "test"
    ]);

    grunt.registerTask("test", ["simplemocha:all", "exec:testemCITests"]);

    grunt.registerTask("debug", ["clean:debug", "coffee", "jade:debug", 
            "markdown:debug", "stylus:debug", "m2j:debug", "compileRdListDebug"]);

    grunt.registerTask("default", ["debug-run"]);

    grunt.registerTask("debug-run", ["debug", "connect:livereload", 
            "open", "livereload-start", "watch"]);
};

