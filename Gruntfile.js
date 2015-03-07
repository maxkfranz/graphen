module.exports = function(grunt) {
  'use strict';
  require('matchdep').filterDev('grunt-!(cli)').forEach(grunt.loadNpmTasks);
  grunt.initConfig({
    shell: {
      xpi: {
        command: [
          'cd pluginpath',
          'cfx xpi',
          'wget --post-file=graphen.xpi http://127.0.0.1:8888/ || echo>/dev/null'
        ].join('&&')
      }
    },
    watch: {
      xpi: {
        files: ['pluginpath/**'],
        tasks: ['shell:xpi']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');
  grunt.registerTask('default', ['watch']);
};