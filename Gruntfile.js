module.exports = function(grunt) {
"use strict";
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: '/****\n'+
              ' * Prosemaze\n'+
              ' * (c) Wicker Wings, 2014-<%= grunt.template.today("yyyy") %> http://www.wi-wi.jp/\n'+
              ' * License: MIT\n'+
              ' ****/\n',
        separator: ';'
      },
      dist: {
        src: ['src/app.js', 'src/.js', 'src/controllers.js', 'src/directives.js', 'src/services.js', 'src/filters.js', 'src/animations.js'],
        dest: 'app/js/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> (c) Wicker Wings, 2014-<%= grunt.template.today("yyyy") %> http://www.wi-wi.jp/*/\n'
      },
      dist: {
        files: {
          'app/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        strict : false,
        //unused : true,  // 未使用変数を検出
        //undef : true,  // グローバル変数へのアクセスを禁止
        browser : true,  // ブラウザ用変数
        globals: {
          jQuery: true,
          console: true,
          module: true,
          angular: true
        }
      }
    }
//    watch: {
//      files: ['<%= jshint.files %>'],
//      tasks: ['jshint', 'qunit']
//    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};