/*global module:false*/
module.exports = function (grunt) {
    var date = '<%= grunt.template.today("yyyymmddHH") %>';
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
                eva: '2.1.2'
            }
        },

        bannereva: '/*! EVA - v<%= meta.version.eva %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>\n' +
            '* https://github.com/EBIvariation/eva-web.git\n' +
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
                src: [
                    'src/js/ebi-web-guidelines/modernizr.custom.49274.js',
                    'src/js/ebi-web-guidelines/cookiebanner.js',
                    'src/js/ebi-web-guidelines/foot.js'
                ],
                dest: 'build/<%= meta.version.eva %>/js/ebi-web-guidelines.js'
            },
            vendors: {
                src: [
                    './bower_components/jquery/dist/jquery.js',
                    './bower_components/bootstrap/dist/js/bootstrap.js',
                    './bower_components/underscore/underscore.js',
                    './bower_components/backbone/backbone.js',
                    './bower_components/highcharts-release/highcharts.js',
                    './bower_components/linqjs/linq.js',
                    './bower_components/vkbeautify/vkbeautify.js',
                    './bower_components/autotrack/autotrack.js'
                ],
                dest: 'build/<%= meta.version.eva %>/vendor/vendors.js'
            }
        },
        uglify: {

            eva: {
                src: '<%= concat.eva.dest %>',
                dest: 'build/<%= meta.version.eva %>/js/eva-<%= meta.version.eva %>-'+date+'.min.js'
            },
            browser_detect: {
                src: 'src/js/browser-detect.js',
                dest: 'build/<%= meta.version.eva %>/js/browser-detect.min.js'
            },
            gv_config: {
                src: 'lib/jsorolla/build/1.1.9/genome-viewer/gv-config.js',
                dest: 'lib/jsorolla/build/1.1.9/genome-viewer/gv-config.min.js'
            },
            vendors: {
                src: '<%= concat.vendors.dest %>',
                dest: 'build/<%= meta.version.eva %>/vendor/vendors-'+date+'.min.js'
            }
        },

        copy: {
            eva: {
                files: [
                    {   expand: true, src: ['src/files/*'], dest: 'build/<%= meta.version.eva %>/files', flatten: true},
                    {   expand: true, src: ['src/fonts/*'], dest: 'build/<%= meta.version.eva %>/fonts', flatten: true},
                    {   expand: true, src: ['src/css/*'], dest: 'build/<%= meta.version.eva %>/css', flatten: true},
                    {   expand: true, src: ['src/css/ebi-complaince/*'], dest: 'build/<%= meta.version.eva %>/css/ebi-complaince/', flatten: true},
                    {   expand: true, src: ['src/img/'], dest: 'build/<%= meta.version.eva %>/', flatten: true},
                    {   expand: true, src: ['src/*.html'], dest: 'build/<%= meta.version.eva %>/', flatten: true, filter: 'isFile'},
                    {   expand: true, src: ['lib/jsorolla/build/1.1.9/genome-viewer/*.js'], dest: 'build/<%= meta.version.eva %>',flatten: false},
                    {   expand: true, src: ['lib/jsorolla/vendor/**'], dest: 'build/<%= meta.version.eva %>',flatten: false},
                    {   expand: true, src: ['lib/jsorolla/styles/**'], dest: 'build/<%= meta.version.eva %>',flatten: false},
                    {   expand: true, src: ['vendor/ext-6.0.1/**'], dest: 'build/<%= meta.version.eva %>'},
                    {   expand: true, src: ['src/js/browser-detect.js'], dest: 'build/<%= meta.version.eva %>/js',flatten: true},
                    {   expand: true, cwd:'bower_components/bootstrap/dist', src: ['**'], dest: 'build/<%= meta.version.eva %>/vendor/bootstrap'}
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
                    ext: '-<%= meta.version.eva %>-'+date+'.min.css'
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
                        ],
                        'vendor': [
                            'build/<%= meta.version.eva %>/vendor/ext-6.0.1/js/ext-all.js',
                            '<%= uglify.vendors.dest %>'
                        ],
                        'browser-detect': [
                            'build/<%= meta.version.eva %>/js/browser-detect.min.js'
                        ],
                        'ebi-web-guidelines-js': [
                            'build/<%= meta.version.eva %>/js/ebi-web-guidelines.js'
                        ]
                    },
                    styles: {
                        'css': [
                            'build/<%= meta.version.eva %>/lib/jsorolla/styles/css/style.min.css',
                            'build/<%= meta.version.eva %>/css/eva-<%= meta.version.eva %>-'+date+'.min.css'
                        ],
                        'vendor': [
                            'build/<%= meta.version.eva %>/vendor/ext-6.0.1/theme/theme-ebi-embl-all.css',
                            'build/<%= meta.version.eva %>/vendor/bootstrap/css/bootstrap.min.css',
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
                files: [{
                    expand: true,
                    cwd: 'src/img/',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: 'build/<%= meta.version.eva %>/img/'
                }]
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
        },
        bower: {
            install: {
                options: {
                    targetDir: './tmp',
                    install: true
                }
            }
        }

    });


    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-html-build');
    grunt.loadNpmTasks('grunt-hub');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-minify-html');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-bower-task');

    //selenium with mocha
    grunt.registerTask('test', ['mochaTest']);

    //bower install
    grunt.registerTask('bower-install', ['bower:install']);

    // Default task.
    grunt.registerTask('default', ['bower-install','hub:genomeViewer','clean:eva','concat','uglify', 'copy:eva','cssmin', 'htmlbuild:eva', 'minifyHtml', 'imagemin', 'exec']);

};
