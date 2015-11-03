var Sails = require('sails');
var fs = require('fs');
var sails;
var environment = require('../config/env/test');

function loadDataFixtures(done) {
    var djusData = fs.readFileSync(process.env.PWD + '/test/resources/djus.json');
    var djus = JSON.parse(djusData);
    return Dju.create(djus);
}

before(function (done) {
    Sails.lift(environment, function (err, server) {
        sails = server;
        if (err) return done(err);

        loadDataFixtures()
            .then(function () {
                done(err, sails);
            })
    });
});

after(function (done) {
    Sails.lower(done);
});
