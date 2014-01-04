module.exports = function (grunt) {

    'use strict';

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Project configuration.
    grunt.initConfig({

        jshint : {
            files : [
                'lib/**/*.js',
                'test/**/*.js'
            ],
            options : {
                jshintrc : '.jshintrc'
            }
        },

        shell : {
            test: {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: "make test"
            }
        }
    });

    grunt.registerTask('test', 'Lint and run tests', ['jshint', 'shell:test']);
};
