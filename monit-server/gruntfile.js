module.exports = function(grunt) {

    grunt.initConfig({

        copy: {
            target: {
                files: [
                    {
                        expand: true,
                        src: [
                            'app.js',
                            'package.json',
                            'routes/**',
                            'public/**',
                            'views/**'
                        ],
                        dest: 'dist/'
                    }
                ]
            }
        },

    });

    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['copy']);

};