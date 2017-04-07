module.exports = function(grunt) {

    /**
     * Properties used by tasks.
     */
    var config = {
        /**
         * Directory containing CSS.
         */
        styles: './Styles',

        /**
         * Directory containing JavaScript.
         */
        js: './Scripts',

        /**
         * Directory containing Razor views.
         */
        views: './Views',

        /**
         * Theme artifacts from the build process will be placed in this directory.
         */
        dist: './dist',

        /**
         * Unique randomly generated string used to bust caching of CSS &
         * JavaScript assets.
         */
        hash: ((new Date()).valueOf().toString()) + (Math.floor((Math.random()*1000000)+1).toString()),

        /**
         * Parameters used to upload asstes to blob storage and convert the theme
         * to utilise the CDN assets.
         */
        cdn: {
            url: grunt.option('cdnUrl'),
            container: grunt.option('container'),
            accountName: grunt.option('accountName'),
            accountKey: grunt.option('accountKey'),
            cache: 'public, max-age=31530000'
        }
    };

    /**
     * Loads all grunt tasks.
     */
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        /**
         * ------
         * Configuration properties.
         * ------
         */

        /**
         * Configuration values used to drive the build.
         */
        config: config,

        /**
         * ------
         * Build tasks.
         * ------
         */

        /**
         * Uploads theme assets (images, styles & scripts) to the CDN.
         */
        'azure-cdn-deploy': {
            theme: {
                options: {
                    containerName: '<%= config.cdn.container %>',
                    serviceOptions: ['<%= config.cdn.accountName %>', '<%= config.cdn.accountKey %>'],
                    deleteExistingBlobs: false,
                    metadata: {
                        cacheControl: '<%= config.cdn.cache %>',
                        cacheControlHeader: '<%= config.cdn.cache %>'
                    }
                },
                src: [
                    '**/Content/*.{png,jpg,jpeg,ico,svg}',
                    '**/Styles/*.css',
                    '**/Scripts/**/*.js'
                ],
                cwd: '<%= config.dist %>'
            }
        },

        /**
         * Deletes previous build arefacts
         */
        clean: {
            dist: ['<%= config.dist %>']
        },

        /**
         * Tidies things up by removing empty directories from the distributable
         * directory.
         */
        cleanempty: {
            options: { files: false },
            src: ['<%= config.dist %>/**/*']
        },

        /**
         * Copies files.
         */
        copy: {

            /**
             * Copies files appropriate for a release version into the
             * distributable directory.
             */
            dist: {
                files: [{
                    expand: true,
                    src: [
                        './Placement.info',
                        './Theme.png',
                        './Theme.txt',
                        './Scripts/Web.config',
                        './Scripts/vendor/modernizr.min.js',
                        './Scripts/vendor/picturefill.min.js',
                        './Scripts/vendor/prism.js',
                        './Styles/Web.config',
                        './Views/**/*',
                        './Content/**/*',
                        './Styleguide/**/*'
                    ],
                    dest: '<%= config.dist %>' }
                ]
            }
        },


        /**
         * Compiles JS modules into a single file using browserify.
         * http://browserify.org/
         * https://github.com/jmreidy/grunt-browserify
         */
        browserify: {
            options: {
                browserifyOptions: {
                    paths: [
                        './Scripts/src',
                        './Scripts/tests/src'
                    ]
                },
                alias: {
                    'shoestring': './node_modules/shoestring/dist/shoestring.js'
                }
            },

            /**
             * Compiles top level app & test modules into single file.
             */
            dev: {
                files: [
                    { '<%= config.js %>/bundle.js': ['<%= config.js %>/index.js'] },
                    { '<%= config.js %>/tests/tests.js': ['<%= config.js %>/tests/suite.js'] }
                ]
            }
        },

        /**
         * Analyses JavaScript files using JSHint for errors or potential problems.
         * You can customise the parameters by modifying the .jshintrc file.
         * http://jshint.com/
         */
        jshint: {
            all: [
                'gruntfile.js',
                '<%= config.js %>/**/*.js',
                '!<%= config.js %>/bundle.js',
                '!<%= config.js %>/enhance.js',
                '!<%= config.js %>/tests/tests.js',
                '!<%= config.js %>/vendor/**/*.js'
            ],
            options: {
                jshintrc: true
            }
        },

        /**
         * Runs the JavaScript test suite using mocha.
         * https://mochajs.org/
         * https://github.com/kmiyashiro/grunt-mocha
         */
        mocha: {
            all: {
                src: ['<%= config.js %>/tests/*.html'],
                options: {
                    run: true
                }
            }
        },

        /**
         * Compresses JavaScript to reduce the file size.
         * https://github.com/mishoo/UglifyJS
         * https://github.com/gruntjs/grunt-contrib-uglify
         */
        uglify: {
            dist: {
                files: {
                    '<%= config.dist %>/Scripts/bundle-<%= config.hash %>.js': ['<%= config.js %>/bundle.js'],
                    '<%= config.dist %>/Scripts/enhance.js': ['<%= config.js %>/enhance.js']
                }
            }
        },

        /**
         * Performs tasks (e.g. optimisation) to CSS file compiled by CSS.
         * https://github.com/postcss/postcss
         */
        postcss: {
            options: {
                processors: [require('autoprefixer')({browsers: 'last 2 versions'})]
            },
            dev: { src: '<%= config.styles %>/*.css' },
            dist: { src: '<%= config.dist %>/Styles/*.css' }
        },

        /**
         * Handles compiling Sass to CSS.
         * http://sass-lang.com/
         * https://github.com/sindresorhus/grunt-sass
         */
        sass: {
            options: {
                sourceMap: false
            },

            /**
             * Development version will be uncompressed.
             */
            dev: {
                files: {
                    '<%= config.styles %>/Critical.css': '<%= config.styles %>/Critical.scss',
                    '<%= config.styles %>/Site.css': '<%= config.styles %>/Site.scss'
                }
            },

            /**
             * Distributable version will be compressed.
             */
            dist: {
                options: { outputStyle: 'compressed' },
                files: {
                    '<%= config.dist %>/Styles/Critical.css': '<%= config.styles %>/Critical.scss',
                    '<%= config.dist %>/Styles/Site-<%= config.hash %>.css': '<%= config.styles %>/Site.scss'
                }
            }
        },

        /**
         * Uses CSSO to further optimise the CSS file.
         * https://github.com/css/csso
         */
        csso: {
            dev: {
                options: {
                    report: 'min'
                },
                files: {
                    '<%= config.styles %>/Critical.css': ['<%= config.styles %>/Critical.css'],
                    '<%= config.styles %>/Site.css': ['<%= config.styles %>/Site.css']
                }
            },
            dist: {
                options: {
                    report: 'min'
                },
                files: {
                    '<%= config.dist %>/Styles/Critical.css': ['<%= config.dist %>/Styles/Critical.css'],
                    '<%= config.dist %>/Styles/Site-<%= config.hash %>.css': ['<%= config.dist %>/Styles/Site-<%= config.hash %>.css']
                }
            }
        },

        /**
         * Updates file contents.
         */
        'string-replace': {
            /**
             * Updates the theme files to point to assets that have been uploaded to
             * a CDN.
             */
            cdn: {
                files: {
                    '<%= config.dist %>/Views/Document.cshtml': '<%= config.dist %>/Views/Document.cshtml',
                    '<%= config.dist %>/Styles/Critical-<%= config.hash %>.css': '<%= config.dist %>/Styles/Critical-<%= config.hash %>.css',
                    '<%= config.dist %>/Styles/Site-<%= config.hash %>.css': '<%= config.dist %>/Styles/Site-<%= config.hash %>.css'
                },
                options: {
                    replacements: [{
                        pattern: 'string themePath = WorkContext.CurrentTheme.Location + "/" + WorkContext.CurrentTheme.Id;',
                        replacement: 'string themePath = "<%= config.cdn.url %>/<%= config.cdn.container %>";'
                    },{
                        pattern: '../Content/',
                        replacement: '<%= config.cdn.url %>/<%=config.cdn.container %>/Content/'
                    }]
                }
            },

            /**
             * Updates the main document HTML to...
             * - Use cache busted assets
             * - Switch to CDN for assets
             * - Inline async asset load & critical CSS
             * - Update cookie name
             */
            document: {
                files: {
                    '<%= config.dist %>/': '<%= config.views %>/Document.cshtml',
                    '<%= config.dist %>/Styleguide/index.html': '<%= config.styleguide %>/index.html'
                },
                options: {
                    replacements: [{
                        pattern: /Site.css/g,
                        replacement: 'Site-<%= config.hash %>.css'
                    }, {
                        pattern: /bundle.js/g,
                        replacement: 'bundle-<%= config.hash %>.js'
                    },{
                        pattern: '<script src="@Url.Content(themePath + "/Scripts/enhance.js")"></script>',
                        replacement: '<script><%= grunt.file.read("./dist/Scripts/enhance.js") %></script>'
                    },{
                        pattern: '<link rel="stylesheet" type="text/css" href="@Url.Content(themePath + "/Styles/Critical.css")" />',
                        replacement: '<style><%= grunt.file.read("./dist/Styles/Critical.css").replace(/@/g, "@@") %></style>'
                    },{
                        pattern: 'string cookieName = "CachedAssets";',
                        replacement: 'string cookieName = "CachedAssets<%= config.hash %>";'
                    }]
                }
            }
        },

        /**
         * Watches for changes to source files that should trigger build tasks to
         * be executed.
         */
        watch: {
            /**
             * Any changes to Sass files should trigger compilation of Sass to CSS.
             */
            styles: {
                files: ['<%= config.styles %>/**/*.scss'],
                tasks: ['styles']
            },

            /**
             * Any changes to JS files should trigger compilation of JS.
             */
            js: {
                files: ['<%= config.js %>/index.js','<%= config.js %>/*/**/*.js'],
                tasks: ['js']
            }
        }
    });


    /**
     * ------
     * Multiple tasks registered into a single task. These tasks should be run
     * via the `grunt` command.
     * ------
     */

    /**
     * Uploads theme assets (CSS, JavaScript & Images) to Azure blob storage.
     */
    grunt.registerTask('upload-to-cdn', function () {
        /**
         * Task requires various options to assist with uploading assets to
         * blob storage and updating theme files to point at assets stored
         * in the CDN.
         */
        if (!grunt.option('cdnUrl') || !grunt.option('container') || !grunt.option('accountName') || !grunt.option('accountKey')) {
            return;
        }

        // upload assets to blob storage.
        grunt.task.run('azure-cdn-deploy');

        // update theme files to point to CDN assets.
        grunt.task.run('string-replace:cdn');
    });

    /**
     * Handles JavaScript related build tasks such as concatenation, compression
     * and linting.
     * `grunt js`
     */
    grunt.registerTask('js', ['browserify', 'jshint', 'mocha']);
    grunt.registerTask('js:dist', ['browserify', 'jshint', 'mocha', 'uglify']);

    /**
     * Compiles Sass to CSS and then uses postcss to optimise and add vendor
     * prefixes.
     * `grunt styles`
     */
    grunt.registerTask('styles', ['sass:dev', 'postcss:dev', 'csso:dev']);
    grunt.registerTask('styles:dist', ['sass:dist', 'postcss:dist', 'csso:dist']);

    /**
     * Creates a distributable version of the theme, placing artefacts in the
     * configured distributable directory.
     */
    grunt.registerTask('dist', ['clean:dist', 'copy:dist', 'styles:dist', 'js:dist', 'string-replace:document', 'cleanempty', 'upload-to-cdn']);

    /**
     * Default task should be run while developing on the theme.
     */
    grunt.registerTask('default', ['styles', 'js', 'watch']);
};
