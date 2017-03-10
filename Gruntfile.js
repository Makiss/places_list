'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    sass: {
      style: {
        files: {
          'build/css/style.css': 'src/sass/style.scss'
        }
      }
    },

    postcss: {
      style: {
        options: {
          processors: [
            require('autoprefixer')({browsers: [
              'last 1 version',
              'last 2 Chrome versions',
              'last 2 Firefox versions',
              'last 2 Opera versions',
              'last 2 Edge versions'
            ]}),
            require('css-mqpacker')({
              sort: true
            })
          ]
        },
        src: 'build/css/*.css'
      }
    },

    csso: {
      style: {
        options: {
          report: 'qzip'
        },
        files: {
          'build/css/style.min.css': ['build/css/style.css']
        }
      }
    },

    imagemin: {
      images: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          src: ['build/img/**/*.{png,jpg,gif}']
        }]
      }
    },

    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        caseSensitive: true,
        keepClosingSlash: false
      },
      html: {
        files: {
          'build/index.html': 'src/index.html'
        }
      }
    },

    concat: {
      dist: {
        src: [
          'src/js/utils.js',
          'src/js/history.js',
          'src/js/location.js',
          'src/js/locations-list.js',
          'src/js/history-list.js'
        ],
        dest: 'build/js/script.js'
      },
    },

    uglify: {
      build: {
        files: {
          'build/js/script.min.js': 'build/js/script.js'
        }
      }
    },

    copy: {
      build: {
        files: [{
          expand: true,
          cwd: 'src',
          src: [
            'img/**',
            'data/**'
          ],
          dest: 'build'
        }]
      }
    },

    clean: {
      build: ['build']
    },

    browserSync: {
      server: {
        bsFiles: {
          src: [
            'build/*.html',
            'build/css/*.css',
            'build/js/**/*.js'
          ]
        },
        options: {
          server: 'build',
          watchTask: true,
          notify: false,
          open: true,
          ui: false
        }
      }
    },

    watch: {
      html: {
        files: ['*.html'],
        tasks: ['copy:html', 'htmlmin']
      },
      js: {
        files: ['src/js/**/*.js'],
        tasks: ['concat', 'uglify']
      },
      style: {
        files: ['sass/**/*.{scss,sass}'],
        tasks: ['sass', 'postcss', 'csso'],
        options: {
          spawn: false
        }
      }
    },

    sprite: {
      all: {
        src: 'src/img/*.png',
        dest: 'build/img/spritesheet.png',
        destCss: 'src/img/sprites.css'
      }
    }
  });

  grunt.registerTask('serve', ['browserSync', 'watch']);

  grunt.registerTask('build', [
    'clean',
    'copy',
    'sass',
    'postcss',
    'csso',
    'imagemin',
    'sprite',
    'htmlmin',
    'concat',
    'uglify'
  ]);
};
