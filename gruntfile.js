module.exports = function (grunt) {

    grunt.file.defaultEncoding = 'utf8';
    grunt.file.preserveBOM = false;

    grunt.initConfig({
        'special-html': {
            compile: {
                files:
                    grunt.file.expandMapping(['**/*.cshtml'], 'vCloud.Survey.Web/views/', {
                        cwd: 'vCloud.Survey.Web/views',
                        rename: function (destBase, destPath) {
                            return destBase + destPath.replace(/\.cshtml$/, '.cshtml');
                        }
                    })
            }
        },

        jade: {
            dehtml_content: {
                options: {
                    pretty: true
                },
                files:
                    grunt.file.expandMapping(['**/*.jade'], 'vCloud.Survey.Web/content/de/', {
                        cwd: 'development/de-app/content/',
                        rename: function (destBase, destPath) {
                            return destBase + destPath.replace(/\.jade$/, '.html');
                        }
                    })
            },
            dehtml_views: {
                options: {
                    pretty: true
                },
                files:
                    grunt.file.expandMapping(['*.jade'], 'vCloud.Survey.Web/views/QD/', {
                        cwd: 'development/de-app/views/',
                        rename: function (destBase, destPath) {
                            return destBase + destPath.replace(/\.jade$/, '.cshtml');
                        }
                    })
            },

            dbhtml_content: {
                options: {
                    pretty: true
                },
                files:
                    grunt.file.expandMapping(['**/*.jade'], 'vCloud.Survey.Web/content/db/', {
                        cwd: 'development/db-app/content/',
                        rename: function (destBase, destPath) {
                            return destBase + destPath.replace(/\.jade$/, '.html');
                        }
                    })
            },
            dbhtml_views: {
                options: {
                    pretty: true
                },
                files:
                    grunt.file.expandMapping(['**/*.jade'], 'vCloud.Survey.Web/views/', {
                        cwd: 'development/db-app/views/',
                        rename: function (destBase, destPath) {
                            return destBase + destPath.replace(/\.jade$/, '.cshtml');
                        }
                    })
            },
            wshtml_content: {
                options: {
                    pretty: true
                },
                files:
                    grunt.file.expandMapping(['**/*.jade'], 'vCloud.Survey.Web/content/ws/', {
                        cwd: 'development/ws-app/content/',
                        rename: function (destBase, destPath) {
                            return destBase + destPath.replace(/\.jade$/, '.html');
                        },
                    })
            },
            wshtml_views: {
                options: {
                    pretty: true
                },
                files:
                    grunt.file.expandMapping(['index.jade'], 'vCloud.Survey.Web/views/home/', {
                        cwd: 'development/ws-app/content/',
                        rename: function (destBase, destPath) {
                            return destBase + destPath.replace(/\.jade$/, '.cshtml');
                        },
                    })
            },
        },

        concat: {
            options: {
                separator: ';',
            },
            dejs: {
                src: ['development/de-app/script/*.js'],
                dest: 'vCloud.Survey.Web/script/de-index.js',
            },
            dbjs: {
                src: ['development/db-app/script/*.js'],
                dest: 'vCloud.Survey.Web/script/db-index.js',
            },
            wsjs: {
                src: ['development/ws-app/script/*.js'],
                dest: 'vCloud.Survey.Web/script/ws-index.js',
            },
        },

        /*        less: {
         development: {

         options: {
         strictImports:true,
         syncImport:true,
         },
         files:[
         {
         expand: true,
         cwd: 'de-app/style/',
         src: ['*.less'],
         dest: 'vCloud.Survey.Web/css',
         ext: '.css'
         }
         ]
         },*/
        /*            production: {
         options: {
         paths: ["assets/css"],
         plugins: [
         new require('less-plugin-autoprefix')({browsers: ["last 2 versions"]}),
         new require('less-plugin-clean-css')(cleanCssOptions)
         ],
         modifyVars: {
         imgPath: '"http://mycdn.com/path/to/images"',
         bgColor: 'red'
         }
         },
         files: {
         "path/to/result.css": "path/to/source.less"
         }
         }
         },*/

        uglify: {
            options: {
                mangle: true
            },
            my_target: {
                files: {
                    'vCloud.Survey.Web/script/de-index.min.js': ['vCloud.Survey.Web/script/de-index.js']
                }
            }
        },
        watch: {
            options: {
                livereload: 1337,
            },
            jade_de_content: {
                files: ['development/de-app/content/**/*.jade'],
                tasks: ['jadeDeContent']
            },
            jade_de_views: {
                files: ['development/de-app/views/**/*.jade'],
                tasks: ['jadeDeViews','specialViewsHtml']
            },
            jade_db_content: {
                files: ['development/db-app/content/**/*.jade'],
                tasks: ['jadeDbContent']
            },
            jade_db_views: {
                files: ['development/db-app/views/**/*.jade'],
                tasks: ['jadeDbViews','specialViewsHtml']
            },
            jade_ws_content: {
                files: ['development/ws-app/content/**/*.jade'],
                tasks: ['jadeWsContent']
            },
            jade_ws_views: {
                files: ['development/ws-app/content/index.jade'],
                tasks: ['jadeWsViews','specialViewsHtml']
            },
            concat: {
                files: ['development/de-app/script/*.js'],
                tasks: ['jsconcat']
            },
        },
    });

    // 载入concat和uglify插件，分别对于合并和压缩
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jade');
    //grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-special-html');

    // 注册任务
    grunt.registerTask('default');
    grunt.registerTask('jadeToHml', ['jade']);
    grunt.registerTask('jadeDeContent', ['jade:dehtml_content']);
    grunt.registerTask('jadeDeViews', ['jade:dehtml_views']);
    grunt.registerTask('jadeDbContent', ['jade:dbhtml_content']);
    grunt.registerTask('jadeDbViews', ['jade:dbhtml_views']);
    grunt.registerTask('jadeWsContent', ['jade:wshtml_content']);
    grunt.registerTask('jadeWsViews', ['jade:wshtml_views']);
    //grunt.registerTask('lessToCss', ['less']);
    grunt.registerTask('jsconcat', ['concat']);
    grunt.registerTask('jsuglify', ['uglify']);
    grunt.registerTask('specialViewsHtml', ['special-html']);
};
