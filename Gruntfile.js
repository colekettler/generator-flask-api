'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
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
      base: {
        src: ['test/test-base.js']
      },
      endpoint: {
        src: ['test/test-endpoint.js']
      },
      model: {
        src: ['test/test-model.js']
      },
      resource: {
        src: ['test/test-resource.js']
      },
      schema: {
        src: ['test/test-schema.js']
      },
      utils: {
        src: ['test/test-utils.js']
      },
      version: {
        src: ['test/test-version.js']
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
      },
      base: {
        files: ['generators/base/**/*.js'],
        tasks: ['test:base']
      },
      endpoint: {
        files: ['generators/endpoint/**/*.js'],
        tasks: ['test:endpoint']
      },
      model: {
        files: ['generators/model/**/*.js'],
        tasks: ['test:model']
      },
      resource: {
        files: ['generators/resource/**/*.js'],
        tasks: ['test:resource']
      },
      schema: {
        files: ['generators/schema/**/*.js'],
        tasks: ['test:schema']
      },
      utils: {
        files: ['generators/utils/**/*.js'],
        tasks: ['test:utils']
      },
      version: {
        files: ['generators/version/**/*.js'],
        tasks: ['test:version']
      }
    },

    clean: {
      coverage: {
        src: ['test/coverage/']
      }
    },

    mochaIstanbul: {
      coverage: {
        src: 'test',
        options: {
          coverageFolder: 'test/coverage',
          mask: 'test-*.js',
          print: 'both',
          reporter: 'spec'
        }
      }
    }
  });

  // Ordinarily this would be handled with newer, but it seems to be a little
  // borked with jshint right now. ¯\(°_o)/¯
  grunt.event.on('watch', function(action, filepath) {
    grunt.config('jshint.all.src', filepath);
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-newer');

  grunt.renameTask('mochaTest', 'test');
  grunt.renameTask('mocha_istanbul', 'mochaIstanbul');

  grunt.registerTask('default', ['jshint:all', 'test:all']);
  grunt.registerTask('cover', ['clean:coverage', 'mochaIstanbul']);
  // Travis
  grunt.registerTask('ci', ['mochaIstanbul']);
};
