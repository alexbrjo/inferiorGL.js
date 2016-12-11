module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            game: {
                src: ['build/**/*.js', '!build/create/*'],
                dest: 'dist/ninja.js'
            },
            creator: {
                src: ['build/**/*.js', '!build/play/*'],
                dest: 'dist/LevelCreator.js'
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
                src: ["ninja.*", "LevelCreator.*"],
                dest: 'test',
                expand: true
            }
        },
        clean:{
            build:{
                src:'build'
            },
            test:{
                src:'ninja.*'
            }
        },
        uglify: {
            build: {
                files: {
                    'dist/ninja.min.js': [ 'dist/ninja.js' ],
                    'dist/LevelCreator.min.js': [ 'dist/LevelCreator.js' ]
                }
            }
        },
        
        /**
         * Tests are currently running headless and therefore a complete 
         * instance of the app shouldn't be created
         */ 
        jasmine : {
            src : ['src/**/*.js', '!src/Main.js'],
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
        'build-game', 
        'cleans, copys to build folder and uglifies', 
        ['clean', 'copy:build', 'concat:game', 'uglify', 'copy:test']
    );
    grunt.registerTask(
        'build-creator', 
        'cleans, copys to build folder and uglifies', 
        ['clean', 'copy:build', 'concat:creator', 'uglify', 'copy:test']
    );
    grunt.registerTask(
        'build', 
        'cleans, copys to build folder and uglifies', 
        ['build-game', 'build-creator']
    );
};
