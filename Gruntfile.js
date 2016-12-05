module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['build/**/*.js'],
                dest: 'dist/ninja.js'
            }
        },
        copy:{
            build:{
                cwd:'src',
                src:['**'],
                dest:'build',
                expand:true
            },
            test:{
                cwd:'dist',
                src:"ninja.*",
                dest:'test',
                expand:true
            }
        },
        clean:{
            build:{
                src:'build'
            },
            test:{
                src:'Ninja.*'
            }
        },
        uglify: {
            build: {
                files: {
                    'dist/Ninja.min.js': [ 'dist/Ninja.js' ]
                }
            }
        },
        karma: {
            options: {
                files: ['test/**/*.js'],
                browsers: ['Chrome', 'Firefox']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask(
        'test', 
        'Runs all tests in test folder', 
        ['karma']
    );
    grunt.registerTask(
        'build', 
        'cleans, copys to build folder and uglifies', 
        ['clean', 'copy:build', 'concat', 'uglify', 'copy:test']
    );

};