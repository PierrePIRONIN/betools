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

    describe('from 01/10 to 31/04 with 20°C', function () {
        it('all the week should return 2661', function (done) {
            request(app)
                .post('/computeDju')
                .send({
                    computation: {
                        temperature: 20,
                        startDate: '01/10',
                        endDate: '31/04',
                        weekDays: [0, 1, 2, 3, 4, 5, 6],
                        startHour: '00:00',
                        endHour: '23:59'
                    }
                })
                .end(function (err, response) {
                    response.status.should.be.equal(200);
                    response.body.dju.should.be.exactly('2772');
                    done();
                });

        });
    });
});
