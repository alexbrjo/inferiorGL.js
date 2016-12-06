/* 
 * https://www.sitepoint.com/writing-awesome-build-script-grunt/
 */
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['build/**/*.js'],
                dest: 'dist/InferiorGL.js'
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
                src:"InferiorGL.*",
                dest:'test',
                expand:true
            }
        },
        clean:{
            build:{
                src:'build'
            },
            test:{
                src:'InferiorGL.*'
            }
        },
        uglify: {
            build: {
                files: {
                    'dist/InferiorGL.min.js': [ 'dist/InferiorGL.js' ]
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
        'build', 
        'cleans, copys to build folder and uglifies', 
        ['clean', 'copy:build', 'concat', 'uglify', 'copy:test']
    );

};