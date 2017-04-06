/*global module:false*/
module.exports = function (grunt) {
    var date = '<%= grunt.template.today("yyyymmddHH") %>';
    require('time-grunt')(grunt);
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
                eva: '3.2.0'
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
                    'src/js/eva.js',
                    'src/js/eva-google-analytics.js '
                ],
                dest: 'build/<%= meta.version.eva %>/js/eva-<%= meta.version.eva %>.js'
            },
            vendors: {
                src: [
                    './bower_components/jquery/dist/jquery.js',
                    './bower_components/underscore/underscore.js',
                    './bower_components/backbone/backbone.js',
                    './bower_components/highcharts-release/highcharts.js',
                    './bower_components/linqjs/linq.js',
                    './bower_components/vkbeautify/vkbeautify.js',
                    './bower_components/autotrack/autotrack.js'
                ],
                dest: 'build/<%= meta.version.eva %>/vendor/vendors.js'
            },
            ebi_framework_css: {
                src: [
                    'lib/EBI-Framework/css/ebi-global.css',
                    'lib/EBI-Framework/libraries/foundation-6/css/foundation.css',
                    'lib/EBI-Framework/css/theme-embl-petrol.css'
                ],
                dest: 'build/<%= meta.version.eva %>/lib/EBI-Framework/css/ebi-framework.css',
            },
            ebi_framework_js: {
                src: [
                    'lib/EBI-Framework/js/cookiebanner.js',
                    'lib/EBI-Framework/js/foot.js',
                    'lib/EBI-Framework/js/script.js',
                    'lib/EBI-Framework/libraries/foundation-6/js/foundation.js',
                    'lib/EBI-Framework/js/foundationExtendEBI.js'
                ],
                dest: 'build/<%= meta.version.eva %>/lib/EBI-Framework/js/ebi-framework.js'
            }
        },
        uglify: {

            eva: {
                src: '<%= concat.eva.dest %>',
                dest: 'build/<%= meta.version.eva %>/js/eva-<%= meta.version.eva %>-'+date+'.min.js'
            },
            gv_config: {
                src: 'lib/jsorolla/build/1.1.9/genome-viewer/gv-config.js',
                dest: 'lib/jsorolla/build/1.1.9/genome-viewer/gv-config.min.js'
            },
            vendors: {
                src: '<%= concat.vendors.dest %>',
                dest: 'build/<%= meta.version.eva %>/vendor/vendors-'+date+'.min.js'
            },
            ebi_framework_js : {
                src: '<%= concat.ebi_framework_js.dest %>',
                dest: 'build/<%= meta.version.eva %>/lib/EBI-Framework/js/ebi-framework-'+date+'.min.js'
            }
        },

        copy: {
            eva: {
                files: [
                    {   expand: true, src: ['src/files/*'], dest: 'build/<%= meta.version.eva %>/files', flatten: true},
                    {   expand: true, src: ['src/css/*'], dest: 'build/<%= meta.version.eva %>/css', flatten: true},
                    {   expand: true, src: ['src/img/'], dest: 'build/<%= meta.version.eva %>/', flatten: true},
                    {   expand: true, src: ['src/*.html'], dest: 'build/<%= meta.version.eva %>/', flatten: true, filter: 'isFile'},
                    {   expand: true, src: ['lib/jsorolla/build/1.1.9/genome-viewer/*.js'], dest: 'build/<%= meta.version.eva %>',flatten: false},
                    {   expand: true, src: ['lib/jsorolla/vendor/**'], dest: 'build/<%= meta.version.eva %>',flatten: false},
                    {   expand: true, src: ['vendor/ext-6.0.1/**'], dest: 'build/<%= meta.version.eva %>'},
                    {   expand: true, src: ['lib/EBI-Framework/libraries/modernizr/*'], dest: 'build/<%= meta.version.eva %>', flatten: false},
                    {   expand: true, src: ['lib/EBI-Framework/images/**'], dest: 'build/<%= meta.version.eva %>', flatten: false}
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
            ebi_framework: {
                files: [{
                    expand: true,
                    cwd: 'build/<%= meta.version.eva %>/lib/EBI-Framework/css',
                    src: ['*.css'],
                    dest: 'build/<%= meta.version.eva %>/lib/EBI-Framework/css',
                    ext: '-<%= meta.version.eva %>-'+date+'.min.css'
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
                    beautify: true,
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
                        'modernizr': 'build/<%= meta.version.eva %>/lib/EBI-Framework/libraries/modernizr/*.js',
                        'ebi_framework': 'build/<%= meta.version.eva %>/lib/EBI-Framework/js/*.min.js'
                    },
                    styles: {
                        'ebi_framework': [
                            'build/<%= meta.version.eva %>/lib/EBI-Framework/css/*.min.css'
                        ],
                        'css': [
                            'build/<%= meta.version.eva %>/css/*.min.css'
                        ],
                        'vendor': [
                            'build/<%= meta.version.eva %>/vendor/ext-6.0.1/theme/theme-ebi-embl-all.css'
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
            cleanBower: {
                cmd: 'rm -rf bower_components'
            },
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
        },
        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: /\.\.\//g,
                            replacement: function () {
                                return ''; // replaces "foo" to "bar"
                            }
                        }
                    ]
                },
                files: [
                    {expand: true, flatten: true, src: ['build/<%= meta.version.eva %>/index.html'], dest: 'build/<%= meta.version.eva %>'}
                ]
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
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-replace');


    //selenium with mocha
    grunt.registerTask('test', ['mochaTest']);

    //bower install
    grunt.registerTask('bower-install', ['bower:install']);

    //bower clean
    grunt.registerTask('bower-clean', ['exec:cleanBower']);

    //run test
    grunt.registerTask('run-test', ['exec:firefox', 'exec:chrome']);

    // Default task.
    grunt.registerTask('default', ['bower-clean', 'bower-install', 'hub:genomeViewer','clean:eva','concat','uglify', 'copy:eva','cssmin',  'htmlbuild:eva',  'imagemin', 'replace', 'minifyHtml', 'run-test']);

};
