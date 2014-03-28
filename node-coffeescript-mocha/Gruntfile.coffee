module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    simplemocha:
      options:
        timeout: 3000
        ignoreLeaks: false
        ui: 'bdd'
      all:
        src: 'spec/**/*'

    mochaTest:
      test:
        options:
          reporter: 'spec'
          require: 'coffee-script/register'
        src: 'spec/**/*'

    grunt.loadNpmTasks 'grunt-mocha-test'

    grunt.registerTask 'default', ['mochaTest']