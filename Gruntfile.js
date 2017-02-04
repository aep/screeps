var credentials = require('./credentials.js');

module.exports = function(grunt) {


    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        ts: {
            default : {
                src: ["src/**/*.ts", "!node_modules/**/*.ts"],
                dest: 'dist',
                tsconfig: true
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'src' ,src: ['**.js'], dest: 'dist/', filter: 'isFile'}
                ]
            }
        },
        screeps: {
            options: {
                email: credentials.email,
                password : credentials.password,
                branch: 'default',
                ptr: false
            },
            dist: {
                src: ['dist/*.js']
            }
        }
    });
    grunt.registerTask("default", ["ts", "copy", "screeps"]);
}
