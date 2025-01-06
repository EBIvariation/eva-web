/*global module:false*/
module.exports = function (grunt) {
    var date = '<%= grunt.template.today("yyyymmddHH") %>';
    require('time-grunt')(grunt);
    var envTarget = grunt.option('env') || 'prod';
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
                eva: '4.4.19'
            },
            submissionTemplate: {
                version: 'V1.1.5'
            }
        },
        build: {
            dir: 'build/<%= meta.version.eva %>-' + envTarget
        },
        serve: {
            options: {
                port: 9000
            }
        },
        bannereva: '/*\n'+
        ' *\n'+
        ' * European Variation Archive (EVA) - Open-access database of all types of genetic\n'+
        ' * variation data from all species\n'+
        ' *\n'+
        ' * Copyright 2014-'+new Date().getFullYear()+' EMBL - European Bioinformatics Institute\n'+
        ' *\n'+
        ' * Licensed under the Apache License, Version 2.0 (the "License");\n'+
        ' * you may not use this file except in compliance with the License.\n'+
        ' * You may obtain a copy of the License at\n'+
        ' *\n'+
        ' *    http://www.apache.org/licenses/LICENSE-2.0\n'+
        ' *\n'+
        ' * Unless required by applicable law or agreed to in writing, software\n'+
        ' * distributed under the License is distributed on an "AS IS" BASIS,\n'+
        ' * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n'+
        ' * See the License for the specific language governing permissions and\n'+
        ' * limitations under the License.\n'+
        ' *\n'+
        ' */\n\n',
        // Task configuration.

        config: {
            dev: {
                options: {
                    variables: {
                        'DBSNP_HOST': 'wwwint.ebi.ac.uk/dbsnp/webservices/rest',
                        'DBSNP_VERSION': 'v1',
                        'DGVA_HOST': 'wwwint.ebi.ac.uk/dgva/webservices/rest',
                        'DGVA_VERSION': 'v1',
                        'EVA_HOST': 'wwwint.ebi.ac.uk/eva/webservices/rest',
                        'EVA_RELEASE_HOST' : "wwwint.ebi.ac.uk/eva/webservices/release",
                        'EVA_ACCESSIONING_HOST': 'wwwint.ebi.ac.uk/eva/webservices/identifiers',
                        'EVA_VCF_DUMPER_HOST': 'wwwint.ebi.ac.uk/eva/webservices/vcf-dumper',
                        'EVA_VERSION': 'v1',
                        'EVA_STAT_VERSION': 'v2'
                    }
                }
            },
            staging: {
                options: {
                    variables: {
                        'DBSNP_HOST': 'wwwdev.ebi.ac.uk/dbsnp/webservices/rest',
                        'DBSNP_VERSION': 'v1',
                        'DGVA_HOST': 'wwwdev.ebi.ac.uk/dgva/webservices/rest',
                        'DGVA_VERSION': 'v1',
                        'EVA_HOST': 'wwwdev.ebi.ac.uk/eva/webservices/rest',
                        'EVA_RELEASE_HOST' : "wwwdev.ebi.ac.uk/eva/webservices/release",
                        'EVA_ACCESSIONING_HOST': 'wwwdev.ebi.ac.uk/eva/webservices/identifiers',
                        'EVA_VCF_DUMPER_HOST': 'wwwdev.ebi.ac.uk/eva/webservices/vcf-dumper',
                        'EVA_VERSION': 'v1',
                        'EVA_STAT_VERSION': 'v2'
                    }
                }
            },
            prod: {
                options: {
                    variables: {
                        'DBSNP_HOST': 'www.ebi.ac.uk/dbsnp/webservices/rest',
                        'DBSNP_VERSION': 'v1',
                        'DGVA_HOST': 'www.ebi.ac.uk/dgva/webservices/rest',
                        'DGVA_VERSION': 'v1',
                        'EVA_HOST': 'www.ebi.ac.uk/eva/webservices/rest',
                        'EVA_RELEASE_HOST' : "www.ebi.ac.uk/eva/webservices/release",
                        'EVA_ACCESSIONING_HOST': 'www.ebi.ac.uk/eva/webservices/identifiers',
                        'EVA_VCF_DUMPER_HOST': 'www.ebi.ac.uk/eva/webservices/vcf-dumper',
                        'EVA_VERSION': 'v1',
                        'EVA_STAT_VERSION': 'v2'
                    }
                }
            }
        },
        replace: {
            eva_manager: {
                options: {
                    patterns: [
                        {
                            match: 'DBSNP_HOST',
                            replacement: '<%= grunt.config.get("DBSNP_HOST") %>'
                        },
                        {
                            match: 'DBSNP_VERSION',
                            replacement: '<%= grunt.config.get("DBSNP_VERSION") %>'
                        },
                        {
                            match: 'DGVA_HOST',
                            replacement: '<%= grunt.config.get("DGVA_HOST") %>'
                        },
                        {
                            match: 'DGVA_VERSION',
                            replacement: '<%= grunt.config.get("DGVA_VERSION") %>'
                        },
                        {
                            match: 'EVA_HOST',
                            replacement: '<%= grunt.config.get("EVA_HOST") %>'
                        },
                        {
                            match: 'EVA_RELEASE_HOST',
                            replacement: '<%= grunt.config.get("EVA_RELEASE_HOST") %>'
                        },
                        {
                            match: 'EVA_ACCESSIONING_HOST',
                            replacement: '<%= grunt.config.get("EVA_ACCESSIONING_HOST") %>'
                        },
                        {
                            match: 'EVA_VCF_DUMPER_HOST',
                            replacement: '<%= grunt.config.get("EVA_VCF_DUMPER_HOST") %>'
                        },
                        {
                            match: 'EVA_VERSION',
                            replacement: '<%= grunt.config.get("EVA_VERSION") %>'
                        },
                        {
                            match: 'EVA_STAT_VERSION',
                            replacement: '<%= grunt.config.get("EVA_STAT_VERSION") %>'
                        }
                    ]
                },
                src: 'src/js/eva-manager-config.js',
                dest: 'src/js/eva-manager.js'
            },
            acceptance_test: {
                options: {
                    patterns: [
                        {
                            match: 'BASE_URL',
                            replacement: 'http://localhost:<%= serve.options.port %>/<%= build.dir %>/index.html'
                        }
                    ]
                },
                src: 'tests/acceptance/config-manager.js',
                dest: 'tests/acceptance/config.js'
            },
            html: {
                options: {
                    patterns: [
                        {
                            match: /\.\.\//g,
                            replacement: function () {
                                return ''; // replaces "foo" to "bar"
                            }
                        },
                        {
                            match: /METADATA_TEMPLATE_VERSION/g,
                            replacement: '<%= meta.submissionTemplate.version %>'
                        }
                    ]
                },
                files: [
                    {expand: true, flatten: true, src: ['<%= build.dir %>/index.html'], dest: '<%= build.dir %>'}
                ]
            }

        },

        concat: {
            eva: {
                options: {
                    banner: '<%= bannereva %>',
                    stripBanners: true
                },
                src: [
                    /** eva app js **/
                    'src/js/eva-manager.js',
                    'src/js/eva-annotation-model.js',
                    'src/js/eva-config.js',
                    'src/js/eva-menu.js',
                    'src/js/eva-adapter.js',
                    'src/js/variant-widget/eva-variant-widget-panel.js',
                    'src/js/variant-widget/eva-variant-widget.js',
                    'src/js/variant-widget/eva-variant-browser-grid.js',
                    'src/js/variant-widget/eva-variant-files-panel.js',
                    'src/js/variant-widget/eva-variant-genotype-grid-panel.js',
                    'src/js/variant-widget/eva-variant-population-stats-panel.js',
                    'src/js/variant-widget/eva-variant-annotation-panel.js',
                    'src/js/variant-widget/filters/eva-form-panel.js',
                    'src/js/variant-widget/filters/eva-species-filter-form-panel.js',
                    'src/js/variant-widget/filters/eva-study-filter-form-panel.js',
                    'src/js/variant-widget/filters/eva-position-filter-form-panel.js',
                    'src/js/variant-widget/filters/eva-population-frequency-filter-form-panel.js',
                    'src/js/variant-widget/filters/eva-protein-substitutions-score-filter-form-panel.js',
                    'src/js/variant-widget/filters/eva-consequence-type-filter-form-panel.js',
                    'src/js/variant-widget/filters/eva-conservation-score-filter-form-panel.js',
                    'src/js/variant-widget/filters/eva-annotation-version-filter-form-panel.js',
                    'src/js/study-browser/eva-study-browser-widget-panel.js',
                    'src/js/study-browser/eva-study-browser-filter-form-panel.js',
                    'src/js/study-browser/eva-study-browser-type-filter-form-panel.js',
                    'src/js/study-browser/eva-study-browser-text-search-form-panel.js',
                    'src/js/study-browser/eva-study-browser-grid.js',
                    'src/js/views/eva-study-view.js',
                    'src/js/views/eva-variant-view.js',
                    'src/js/views/eva-multi-variant-view.js',
                    'src/js/statistics/eva-statistics.js',
                    'src/js/statistics/dgva-statistics.js',
                    'src/js/beacon-form/eva-beacon-panel.js',
                    'src/js/beacon-form/eva-beacon-form.js',
                    'src/js/beacon-form/eva-variant-search-form.js',
                    'src/js/dbSNP-import/dbSNP-import-progress.js',
                    'src/js/rs-release/rs-release.js',
                    'src/js/eva.js',
                    'src/js/eva-google-analytics.js ',
                    'src/js/footer/footer.js ',
                ],
                dest: '<%= build.dir %>/js/eva-<%= meta.version.eva %>.js'
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
                dest: '<%= build.dir %>/vendor/vendors.js'
            },
            ebi_framework_css: {
                src: [
                    'lib/EBI-Framework/css/ebi-global.css',
                    'lib/EBI-Framework/libraries/foundation-6/css/foundation.css',
                    'lib/EBI-Framework/css/theme-embl-petrol.css'
                ],
                dest: '<%= build.dir %>/lib/EBI-Framework/css/ebi-framework.css',
            },
            ebi_framework_js: {
                src: [
                    'lib/EBI-Framework/js/cookiebanner.js',
                    'lib/EBI-Framework/js/script.js',
                    'lib/EBI-Framework/libraries/foundation-6/js/foundation.js',
                    'lib/EBI-Framework/js/foundationExtendEBI.js',
                    'lib/EBI-Framework/libraries/tablesorter/dist/js/jquery.tablesorter.min.js'
                ],
                dest: '<%= build.dir %>/lib/EBI-Framework/js/ebi-framework-'+date+'.js'
            }
        },
        uglify: {
            eva: {
                src: '<%= concat.eva.dest %>',
                dest: '<%= build.dir %>/js/eva-<%= meta.version.eva %>-'+date+'.min.js'
            },
            gv_config: {
                src: 'lib/jsorolla/build/1.1.9/genome-viewer/gv-config.js',
                dest: 'lib/jsorolla/build/1.1.9/genome-viewer/gv-config.min.js'
            },
            vendors: {
                src: '<%= concat.vendors.dest %>',
                dest: '<%= build.dir %>/vendor/vendors-'+date+'.min.js'
            },
            ebi_framework_js : {
                src: '<%= concat.ebi_framework_js.dest %>',
                dest: '<%= build.dir %>/lib/EBI-Framework/js/ebi-framework-'+date+'.min.js'
            }
        },

        copy: {
            eva: {
                files: [
                    {   expand: true, src: ['src/files/*'], dest: '<%= build.dir %>/files', flatten: true},
                    {   expand: true, src: ['src/css/*'], dest: '<%= build.dir %>/css', flatten: true},
                    {   expand: true, src: ['src/img/'], dest: '<%= build.dir %>/', flatten: true},
                    {   expand: true, src: ['src/img/optimized/*'], dest: '<%= build.dir %>/img/optimized', flatten: true},
                    {   expand: true, src: ['src/*.html'], dest: '<%= build.dir %>/', flatten: true, filter: 'isFile'},
                    {   expand: true, src: ['lib/jsorolla/build/1.1.9/genome-viewer/*.js'], dest: '<%= build.dir %>',flatten: false},
                    {   expand: true, src: ['lib/jsorolla/vendor/**'], dest: '<%= build.dir %>',flatten: false},
                    {   expand: true, src: ['vendor/ext-6.0.1/**'], dest: '<%= build.dir %>'},
                    {   expand: true, src: ['lib/EBI-Framework/libraries/modernizr/*'], dest: '<%= build.dir %>', flatten: false},
                    {   expand: true, src: ['lib/EBI-Framework/images/**'], dest: '<%= build.dir %>', flatten: false},
                    {   expand: true, src: ['lib/EBI-Framework/libraries/tablesorter/css/images/**'], dest: '<%= build.dir %>', flatten: false}
                ]
            }
        },

        cssmin: {
            eva: {
                files: [{
                    expand: true,
                    cwd: '<%= build.dir %>/css',
                    src: ['*.css'],
                    dest: '<%= build.dir %>/css',
                    ext: '-<%= meta.version.eva %>-'+date+'.min.css'
                }]
            },
            ebi_framework: {
                files: [{
                    expand: true,
                    cwd: '<%= build.dir %>/lib/EBI-Framework/css',
                    src: ['*.css'],
                    dest: '<%= build.dir %>/lib/EBI-Framework/css',
                    ext: '-<%= meta.version.eva %>-'+date+'.min.css'
                }]
            }
        },

        clean: {
            eva: ['<%= build.dir %>/']
        },

        htmlbuild: {
            eva: {
                src: 'src/index.html',
                dest: '<%= build.dir %>/',
                options: {
                    beautify: true,
                    scripts: {
                        'eva-js': '<%= uglify.eva.dest %>',
                        'lib': [
                            '<%= build.dir %>/lib/jsorolla/build/*/genome-viewer/genome-viewer.min.js',
                            '<%= build.dir %>/lib/jsorolla/build/*/genome-viewer/gv-config.min.js'
                        ],
                        'vendor': [
                            '<%= build.dir %>/vendor/ext-6.0.1/js/ext-all.js',
                            '<%= uglify.vendors.dest %>'
                        ],
                        'modernizr': '<%= build.dir %>/lib/EBI-Framework/libraries/modernizr/*.js',
                        'ebi_framework': '<%= uglify.ebi_framework_js.dest %>'
                    },
                    styles: {
                        'ebi_framework': [
                            '<%= build.dir %>/lib/EBI-Framework/css/*.min.css'
                        ],
                        'css': [
                            '<%= build.dir %>/css/*.min.css'
                        ],
                        'vendor': [
                            '<%= build.dir %>/vendor/ext-6.0.1/theme/theme-ebi-embl-all.css'
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
                    '<%= build.dir %>/index.html': '<%= build.dir %>/index.html'
                }
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/img/',
                    src: ['**/*.{png,jpg,gif,svg}', '!optimized/**'],
                    dest: '<%= build.dir %>/img/'
                }]
            }
        },
        mochaTest: {
            acceptanceTest: {
                options: {
                    quiet: false,
                    clearRequireCache: false,
                    timeout:1500000
                },
                src: [
                        'tests/acceptance/all_page.js',
                        'tests/acceptance/dbSNP_import.js',
                        'tests/acceptance/home_page.js',
                        'tests/acceptance/multi_variant_view.js',
                        'tests/acceptance/rs_release.js',
                        'tests/acceptance/study_browser.js',
                        'tests/acceptance/study_view.js',
                        'tests/acceptance/variant_browser.js',
                        'tests/acceptance/variant_view.js'
                     ]
            }
        },
        mocha_phantomjs: {
            unitTest: {
                src: ['./tests/**/*.html'],
            },
            options: {
                run: true
            }
        },
        exec: {
            startServer: {
                cmd: 'nohup grunt serve &'
            },
            cleanBower: {
                cmd: 'rm -rf bower_components'
            },
            firefox: {
                 cmd: 'env BROWSER=firefox  grunt acceptanceTest --colors'
            },
            chrome: {
                cmd: 'env BROWSER=chrome  grunt acceptanceTest --colors'
            }
        },
        bower: {
            install: {
                options: {
                    targetDir: './tmp',
                    install: true,
                    copy: true
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
    grunt.loadNpmTasks('grunt-config');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');

    grunt.loadNpmTasks('grunt-serve');

    //replace config
    grunt.registerTask('replace-config', ['replace:eva_manager', 'replace:acceptance_test']);

    //replace html
    grunt.registerTask('replace-html', ['replace:html']);

    //selenium with mocha
    grunt.registerTask('acceptanceTest', ['mochaTest:acceptanceTest']);

    // unit tests with mocha_phantomjs to run from command line
    grunt.registerTask('unitTest', ['mocha_phantomjs:unitTest']);

    //run test
    grunt.registerTask('runAcceptanceTest', ['exec:chrome']);

    //bower install
    grunt.registerTask('bower-install', ['bower:install']);

    //bower clean
    grunt.registerTask('bower-clean', ['exec:cleanBower']);

    //start http server
    grunt.registerTask('start-server', ['exec:startServer']);

    grunt.registerTask('run-all-tests', [
        'start-server',
        'config:' + envTarget,
        'replace-config',
        'bower-install',
        'hub:genomeViewer',
        'clean:eva',
        'concat',
        'uglify',
        'copy:eva',
        'cssmin',
        'htmlbuild:eva',
        'replace-html',
        'minifyHtml',
        'imagemin',
        'unitTest',
        'runAcceptanceTest'
    ]);

    //default build website.
    grunt.registerTask('default', [
        'start-server',
        'config:' + envTarget,
        'replace-config',
        'bower-install',
        'hub:genomeViewer',
        'clean:eva',
        'concat',
        'uglify',
        'copy:eva',
        'cssmin',
        'htmlbuild:eva',
        'replace-html',
        'minifyHtml',
        'imagemin'
    ]);
};
