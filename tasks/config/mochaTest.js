module.exports = function (grunt) {

    grunt.config.set('simplemocha', {
        options: {
            globals: ['should'],
            timeout: 10000,
            ui: 'bdd',
            reporter: 'mocha-spec-cov-alt'
        },

        all: { src: ['test/**/*.js'] }
    });

    grunt.loadNpmTasks('grunt-simple-mocha');
};
