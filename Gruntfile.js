"use strict";

var c, lrSnippet, mountFolder;

lrSnippet = require("grunt-contrib-livereload/lib/utils").livereloadSnippet;

mountFolder = function(connect, dir) {
    return connect["static"](require("path").resolve(dir));
};

c = {
    source: "source",
    release: "release",
    tmp: "tmp"
};

module.exports = function (grunt) {
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        watch: {
            javascript: { 
                files: [c.source + "/scripts/{,*/}*.js"],
                tasks: ["copy:debug"]
            },
            coffee: {
                files: [c.source + "/scripts/{,*/}*.coffee"],
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
            livereload: {
                files: [c.tmp + "/**/*.*", "tmp/scripts/{,*/}*.js",
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
                        return [lrSnippet, mountFolder(connect, c.tmp), mountFolder(connect, c.source)];
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
            all: ["Gruntfile.js", c.source + "/scripts/{,*/}*.js", "!" + c.source + "/scripts/vendor/*", "test/spec/{,*/}*.js"]
        },
        coffee: {
            release: {
                files: [
                    {
                        expand: true,
                        cwd: c.source + "/scripts",
                        src: "*.coffee",
                        dest: c.tmp + "/scripts",
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
        less: {
            release: {
                src:  [ c.source + '/**/*.less'],
                dest: c.tmp + '/styles/less.css'
            },
            debug: {
                src:  [ c.source + '/**/*.less'],
                dest: c.tmp + '/styles/less.css'
            },
        },
        stylus: {
            release: {
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
                src: [c.source + "/scripts/*.js", c.tmp + "/scripts/*.js"],
                dest: c.release + "/scripts/main.js"
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
                        src: ["components/**/*.*", "scripts/*.js", "logo/*.*", "*.{ico,txt}", "**/*.{,svg,png,jpg}", ".htaccess"]        // don't copy CSS for release; usemin does it
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: c.source,
                        dest: c.tmp,
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
                    src: ["logo/*.*", "*.{ico,txt}", "**/*.{,svg,png,jpg}", ".htaccess", "styles/*.css"]
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
    });

    grunt.renameTask("regarde", "watch");
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
    grunt.registerTask("release", [
        "clean:release",
        "mkdir",
        "jade:release",
        "stylus:release",
        "less:release",
        "m2j:release",
        "copy:release",
        "useminPrepare",
        "concat",
        "cssmin",
        "rev",
        "usemin"
    ]);
    grunt.registerTask("debug", ["clean:debug", "coffee", "jade:debug", 
            "less:debug", "stylus:debug", "m2j:debug"]);

    grunt.registerTask("default", ["debug-run"]);

    grunt.registerTask("debug-run", ["clean:debug", "coffee", "jade:debug", 
            "less:debug", "stylus:debug", "m2j:debug", "connect:livereload", 
            "open", "livereload-start", "watch"]);
};

