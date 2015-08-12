'use strict';

module.exports = function (grunt) {
  // Project configuration
  grunt.initConfig({
    // Metadata
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: {
        src: ['Gruntfile.js', 'generators/**/*.js', 'test/*.js']
      },
      options: {
        jshintrc: true,
        force: true,
        reporter: require('jshint-stylish')
      }
    },

    test: {
      all: {
        src: ['test/test-*.js']
      },
      app: {
        src: ['test/test-app.js']
      },
      options: {
        reporter: 'nyan'
      }
    },

    watch: {
      scripts: {
        files: ['Gruntfile.js', 'generators/**/*.js', 'test/*.js'],
        tasks: ['jshint:all'],
        options: {
          spawn: false
        }
      },
      tests: {
        files: ['test/*.js'],
        tasks: ['newer:test:all']
      },
      app: {
        files: ['generators/app/**/*.js'],
        tasks: ['test:app']
      }
    }
  });

  // Ordinarily this would be handled with newer, but it seems to be a little
  // borked with jshint right now. ¯\(°_o)/¯
  grunt.event.on('watch', function(action, filepath) {
    grunt.config('jshint.all.src', filepath);
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-newer');

  grunt.renameTask('mochaTest', 'test');

  grunt.registerTask('default', ['jshint:all', 'test:all']);
};
