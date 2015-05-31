'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    agent = request.agent(app),
    fs = require('fs'),
    mongoose = require('mongoose'),
    Dju = mongoose.model('Dju');

describe('dju computation', function () {
    before(function(done) {
        this.timeout(10000);
        fs.readFile(__dirname + '/resources/djus.json', function(err, data) {
            var djus = JSON.parse(data);
            Dju.create(djus, function() {
                done();
            });
        });
    });

    describe('from 01/10 to 31/04 all the week', function () {
        it(' with 20°C should return 2661', function (done) {
            request(app)
                .post('/computeDju')
                .send({
                        temperature: 20,
                        startDate: '01/10',
                        endDate: '31/04',
                        weekDays: [0, 1, 2, 3, 4, 5, 6],
                        startHour: '00:00',
                        endHour: '23:59'
                })
                .end(function (err, response) {
                    response.status.should.be.equal(200);
                    response.body.dju.should.be.exactly('2772');
                    done();
                });
        });
    });

    describe('from 15/10 to 15/04 all the week', function () {
        it(' with 20°C from 8:00 to 18:00 should return 959', function (done) {
            request(app)
                .post('/computeDju')
                .send({
                    temperature: 20,
                    startDate: '15/10',
                    endDate: '15/04',
                    weekDays: [0, 1, 2, 3, 4, 5, 6],
                    startHour: '08:00',
                    endHour: '18:00'
                })
                .end(function (err, response) {
                    response.status.should.be.equal(200);
                    response.body.dju.should.be.exactly('959');
                    done();
                });
        });
    });
});
