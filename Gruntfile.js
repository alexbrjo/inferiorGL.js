module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            all: {
                src: ['build/**/*.js'],
                dest: 'dist/JoResEngine.js'
            },
            release: {
                src: ['build/**/*.js', '!build/**/*.dev.js'],
                dest: 'dist/JoResEngine.js'
            }
        },
        copy:{
            build:{
                cwd: 'src',
                src: ['**'],
                dest: 'build',
                expand: true
            },
            test:{
                cwd: 'dist',
                src: ["JoResEngine.*"],
                dest: 'test',
                expand: true
            },
            example:{
                cwd: 'dist',
                src: ["JoResEngine.*"],
                dest: 'sample',
                expand: true
            }
        },
        clean:{
            build:{
                src:'build'
            },
            test:{
                src:'JoResEngine.*'
            }
        },
        uglify: {
            build: {
                files: {
                    'dist/JoResEngine.min.js': [ 'dist/JoResEngine.js' ]
                }
            }
        },
        
        /**
         * Tests are currently running headless and therefore a complete 
         * instance of the app shouldn't be created
         */ 
        jasmine : {
            src : ['src/**/*.js', '!src/App.js'],
                options : {
                    specs : 'test/**/*.test.js'
                }
            }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.registerTask(
        'build', 
        'cleans, copys to build folder and uglifies', 
        ['clean', 'copy:build', 'concat:all', 'uglify', 'copy:test', 'copy:example']
    );
    grunt.registerTask(
        'build-release', 
        'builds the app the same way but without developer features', 
        ['clean', 'copy:build', 'concat:release', 'uglify', 'copy:test', 'copy:example']
    );
};
