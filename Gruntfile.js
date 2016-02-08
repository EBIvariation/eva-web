/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        hub: {
            genomeViewer: {
                src: ['lib/jsorolla/Gruntfile-genome-viewer.js'],
                tasks: ['default']
            }
        },
        // Metadata.
        meta: {
            version: {
                eva: '1.0.0'
            }
        },

        bannereva: '/*! EVA - v<%= meta.version.eva %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>\n' +
            '* http://https://github.com/EBIvariation/eva.git/\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
            ' ' +
            'Licensed GPLv2 */\n',
        // Task configuration.

        concat: {
            options: {
                banner: '<%= bannereva %>',
                stripBanners: true
            },

            eva: {
                src: [
                    /** eva app js **/
                    'src/js/eva-manager.js',
                    'src/js/eva-config.js',
                    'src/js/eva-menu.js',
                    'src/js/eva-adapter.js',
                    'src/js/variant-widget/eva-variant-widget-panel.js',
                    'src/js/variant-widget/eva-variant-widget.js',
                    'src/js/variant-widget/eva-variant-browser-grid.js',
                    'src/js/variant-widget/eva-variant-stats-panel.js',
                    'src/js/variant-widget/eva-variant-genotype-grid-panel.js',
                    'src/js/variant-widget/eva-variant-population-stats-panel.js',
                    'src/js/variant-widget/eva-genome-viewer-panel.js',
                    'src/js/variant-widget/filters/eva-form-panel.js',
                    'src/js/variant-widget/filters/eva-species-filter-form-panel.js',
                    'src/js/variant-widget/filters/eva-study-filter-form-panel.js',
                    'src/js/variant-widget/filters/eva-position-filter-form-panel.js',
                    'src/js/variant-widget/filters/eva-population-frequency-filter-form-panel.js',
                    'src/js/variant-widget/filters/eva-protein-substitutions-score-filter-form-panel.js',
                    'src/js/variant-widget/filters/eva-consequence-type-filter-form-panel.js',
                    'src/js/variant-widget/filters/eva-conservation-score-filter-form-panel.js',
                    'src/js/study-browser/eva-study-browser-widget-panel.js',
                    'src/js/study-browser/eva-study-browser-filter-form-panel.js',
                    'src/js/study-browser/eva-study-browser-type-filter-form-panel.js',
                    'src/js/study-browser/eva-study-browser-text-search-form-panel.js',
                    'src/js/study-browser/eva-study-browser-grid.js',
                    'src/js/views/eva-study-view.js',
                    'src/js/views/eva-variant-view.js',
                    'src/js/views/eva-gene-view.js',
                    'src/js/views/eva-iobio-view.js',
                    'src/js/statistics/eva-statistics.js',
                    'src/js/statistics/dgva-statistics.js',
                    'src/js/beacon-form/eva-beacon-panel.js',
                    'src/js/beacon-form/eva-beacon-form.js',
                    'src/js/beacon-form/eva-variant-search-form.js',
                    'src/js/clinvar/eva-clinical-widget-panel.js',
                    'src/js/clinvar/eva-clinvar-widget.js',
                    'src/js/clinvar/eva-clinvar-browser-grid.js',
                    'src/js/clinvar/eva-clinvar-assertion-panel.js',
                    'src/js/clinvar/eva-clinvar-summary-panel.js',
                    'src/js/clinvar/eva-clinvar-links-panel.js',
                    'src/js/clinvar/eva-clinvar-annotation-panel.js',
                    'src/js/clinvar/filters/eva-clinvar-position-filter-form-panel.js',
                    'src/js/clinvar/filters/eva-clinvar-trait-filter-form-panel.js',
                    'src/js/clinvar/filters/eva-clinvar-filter-form-panel.js',
                    'src/js/eva-submission-form.js',
                    'src/js/eva.js'
                ],
                dest: 'build/<%= meta.version.eva %>/js/eva-<%= meta.version.eva %>.js'
            },
            ebi_web_guidelines_js: {
                src:[
                    'src/js/ebi-web-guidelines/modernizr.custom.49274.js',
                    'src/js/ebi-web-guidelines/google-analytics.js',
                    'src/js/ebi-web-guidelines/cookiebanner.js',
                    'src/js/ebi-web-guidelines/foot.js'
                ],
                dest: 'build/<%= meta.version.eva %>/js/ebi-web-guidelines.js'
            }
        },
        uglify: {

            eva: {
                src: '<%= concat.eva.dest %>',
                dest: 'build/<%= meta.version.eva %>/js/eva-<%= meta.version.eva %>.min.js'
            },
            vkbeautify: {
                src: 'vendor/vkbeautify/vkbeautify.0.99.00.beta.js',
                dest: 'build/<%= meta.version.eva %>/vendor/vkbeautify/vkbeautify.min.js'
            },
            browser_detect: {
                src: 'src/js/browser-detect.js',
                dest: 'build/<%= meta.version.eva %>/js/browser-detect.min.js'
            },
            gv_config:{
                src: 'lib/jsorolla/build/1.1.9/genome-viewer/gv-config.js',
                dest: 'lib/jsorolla/build/1.1.9/genome-viewer/gv-config.min.js'
            }
        },

        copy: {

            eva: {
                files: [
                    {   expand: true, src: ['src/files/*'], dest: 'build/<%= meta.version.eva %>/files', flatten: true},
                    {   expand: true, src: ['src/fonts/*'], dest: 'build/<%= meta.version.eva %>/fonts', flatten: true},
                    {   expand: true, src: ['src/css/*'], dest: 'build/<%= meta.version.eva %>/css', flatten: true},
                    {   expand: true, src: ['src/css/ebi-complaince/*'], dest: 'build/<%= meta.version.eva %>/css/ebi-complaince/', flatten: true},
//                    {   expand: true, src: ['src/img/*'], dest: 'build/<%= meta.version.eva %>/img', flatten: true},
                    {   expand: true, src: ['src/img/'], dest: 'build/<%= meta.version.eva %>/', flatten: true},
//                    {   expand: true, src: ['src/web-components/*'], dest: 'build/<%= meta.version.eva %>/web-components', flatten: true},
                    {   expand: true, src: ['src/*.html'], dest: 'build/<%= meta.version.eva %>/', flatten: true, filter: 'isFile'},
                    {   expand: true, src: ['lib/jsorolla/build/1.1.9/genome-viewer/*.js'], dest: 'build/<%= meta.version.eva %>',flatten: false},
                    {   expand: true, src: ['lib/jsorolla/vendor/**'], dest: 'build/<%= meta.version.eva %>',flatten: false},
                    {   expand: true, src: ['lib/jsorolla/styles/**'], dest: 'build/<%= meta.version.eva %>',flatten: false},
                    {   expand: true, src: ['vendor/bootstrap-*/**'], dest: 'build/<%= meta.version.eva %>'},
                    {   expand: true, src: ['vendor/ext-*/**'], dest: 'build/<%= meta.version.eva %>'},
                    {   expand: true, src: ['vendor/highcharts-4.0.3/**'], dest: 'build/<%= meta.version.eva %>'},
                    {   expand: true, src: ['vendor/platform-0.4.1/**'], dest: 'build/<%= meta.version.eva %>'},
                    {   expand: true, src: ['vendor/vkbeautify/**'], dest: 'build/<%= meta.version.eva %>'},
                    {   expand: true, src: ['vendor/linqJS/**'], dest: 'build/<%= meta.version.eva %>'},
                    {   expand: true, src: ['src/js/browser-detect.js'], dest: 'build/<%= meta.version.eva %>/js',flatten: true},
//                    {   expand: true, src: ['src/js/ebi-web-guidelines/ebi-web-guidelines*'], dest: 'build/<%= meta.version.eva %>/js/ebi-web-guidelines',flatten: true}
                ]
            }

        },

        cssmin: {
            eva: {
                files: [{
                    expand: true,
                    cwd: 'build/<%= meta.version.eva %>/css',
                    src: ['*.css'],
                    dest: 'build/<%= meta.version.eva %>/css',
                    ext: '.min.css'
                }]
            },
            ebi: {
                files: [{
                    expand: true,
                    cwd: 'build/<%= meta.version.eva %>/css/ebi-complaince',
                    src: ['*.css'],
                    dest: 'build/<%= meta.version.eva %>/css/ebi-complaince',
                    ext: '.min.css'
                }]
            },
            jsorolla: {
                files: [{
                    expand: true,
                    cwd: 'build/<%= meta.version.eva %>/lib/jsorolla/styles/css',
                    src: ['*.css'],
                    dest: 'build/<%= meta.version.eva %>/lib/jsorolla/styles/css',
                    ext: '.min.css'
                }]
            }
        },

        clean: {
            eva: ['build/<%= meta.version.eva %>/']
        },

        htmlbuild: {
            eva: {
                src: 'src/index.html',
                dest: 'build/<%= meta.version.eva %>/',
                options: {
                    beautify: false,
                    scripts: {
                        'eva-js': '<%= uglify.eva.dest %>',
                        'lib': [
                                'build/<%= meta.version.eva %>/lib/jsorolla/build/*/genome-viewer/genome-viewer.min.js',
                                'build/<%= meta.version.eva %>/lib/jsorolla/build/*/genome-viewer/gv-config.min.js'
//                                'build/<%= meta.version.eva %>/lib/jsorolla/build/*/lib.min.js'
                        ],
                        'vendor': [
//                            'build/<%= meta.version.eva %>/vendor/ext-5.0.1/js/ext-all.js',
                            'build/<%= meta.version.eva %>/vendor/ext-5.1.0/js/ext-all.js',
                            'build/<%= meta.version.eva %>/lib/jsorolla/vendor/underscore-min.js',
                            'build/<%= meta.version.eva %>/lib/jsorolla/vendor/backbone-min.js',
                            'build/<%= meta.version.eva %>/lib/jsorolla/vendor/jquery.min.js',
                            'build/<%= meta.version.eva %>/vendor/bootstrap-*/js/bootstrap.min.js',
//                            'build/<%= meta.version.eva %>/lib/jsorolla/vendor/jquery.cookie.js',
//                            'build/<%= meta.version.eva %>/lib/jsorolla/vendor/jquery.sha1.js',
//                            'build/<%= meta.version.eva %>/lib/jsorolla/vendor/purl.min.js',
//                            'build/<%= meta.version.eva %>/lib/jsorolla/vendor/jquery.qtip.min.js',
                            'build/<%= meta.version.eva %>/vendor/highcharts-4.0.3/js/highcharts.js',
                            'build/<%= meta.version.eva %>/vendor/linqJS/linq.min.js'
                        ],
                        'vkbeautify': [
                        'build/<%= meta.version.eva %>/vendor/vkbeautify/vkbeautify.min.js'
                        ],
//                        'platform': [
//                            'build/<%= meta.version.eva %>/vendor/platform-0.4.1/js/platform.js'
//                        ],
                        'browser-detect':[
                            'build/<%= meta.version.eva %>/js/browser-detect.min.js'
                        ],
                        'ebi-web-guidelines-js':[
                            'build/<%= meta.version.eva %>/js/ebi-web-guidelines.js'
                        ],

//                        'internal-dependencies': [
//                            'build/<%= meta.version.eva %>/gv-config.js'
//                        ]
                    },
                    styles: {
                        'css': [
                            'build/<%= meta.version.eva %>/lib/jsorolla/styles/css/style.min.css',
                            'build/<%= meta.version.eva %>/css/eva.min.css'
                        ],
                        'vendor': [
                            'build/<%= meta.version.eva %>/vendor/ext-5.1.0/theme/theme-ebi-embl-all.css',
//                            'build/<%= meta.version.eva %>/lib/jsorolla/vendor/jquery.qtip.min.css',
                            'build/<%= meta.version.eva %>/vendor/bootstrap-3.2.0/css/bootstrap.min.css',
//                            'build/<%= meta.version.eva %>/lib/jsorolla/vendor/font-awesome/css/font-awesome.min.css'
                            'build/<%= meta.version.eva %>/css/ebi-complaince/ebi-fluid-embl.min.css'
                        ]
                    }
                }
            }
        },
        minifyHtml: {
            options: {
                cdata: true
            },
            dist: {
                files: {
                    'build/<%= meta.version.eva %>/index.html': 'build/<%= meta.version.eva %>/index.html'
                }
            }
        },
        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 3,
                    svgoPlugins: [{ removeViewBox: false }]
                },
                files: [{
                    expand: true,
                    cwd: 'src/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'build/<%= meta.version.eva %>/img/'
                }]
            }
        },

        watch: {
            src: {
                tasks: ['default'],
                options: {spawn: false}
            }

        },
        mochaTest: {
            test: {
                options: {
                    quiet: false,
                    clearRequireCache: false,
                    timeout:1500000
                },
                src: ['tests/mocha/*.js']
            }
        },
        exec: {
            firefox: {
                 cmd: 'env BROWSER=firefox  grunt test  --force --colors'
            },
            chrome: {
                cmd: 'env BROWSER=chrome  grunt test  --force --colors'
            }
        }


    });


    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
//    grunt.loadNpmTasks('grunt-contrib-qunit');
//    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-html-build');
    grunt.loadNpmTasks('grunt-curl');
    grunt.loadNpmTasks('grunt-hub');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-minify-html');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-uncss');
    grunt.registerTask('vendor', ['curl-dir']);
    //selenium with mocha
    grunt.registerTask('test',['mochaTest']);

    // Default task.
    grunt.registerTask('default', ['hub:genomeViewer','clean:eva','concat','uglify', 'copy:eva','cssmin', 'htmlbuild:eva', 'minifyHtml',  'imagemin'])



};
