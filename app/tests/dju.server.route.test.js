'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    agent = request.agent(app),
    fs = require('fs'),
    mongoose = require('mongoose'),
    Dju = mongoose.model('Dju');

describe('dju computation', function () {
    before(function (done) {
        this.timeout(10000);
        fs.readFile(__dirname + '/resources/djus.json', function (err, data) {
            var djus = JSON.parse(data);
            Dju.create(djus, function () {
                done();
            });
        });
    });

    it('from 01/10 to 31/04, all the week, with 20°C all the day should return 2661', function (done) {
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
                response.body.djuHeating.should.be.equal('2772');
                /* jshint ignore:start */
                should(response.body.djuReduced).be.null;
                /* jshint ignore:end */
                done();
            });
    });

    it('from 15/10 to 15/04, all the week, with 20°C from 8:00 to 18:00 should return 959', function (done) {
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
                response.body.djuHeating.should.be.equal('959');
                /* jshint ignore:start */
                should(response.body.djuReduced).be.null;
                /* jshint ignore:end */
                done();
            });
    });

    it('from 15/10 to 15/04, all the week, with 18°C from 8:00 to 18:00 should return 807', function (done) {
        request(app)
            .post('/computeDju')
            .send({
                temperature: 18,
                startDate: '15/10',
                endDate: '15/04',
                weekDays: [0, 1, 2, 3, 4, 5, 6],
                startHour: '08:00',
                endHour: '18:00'
            })
            .end(function (err, response) {
                response.status.should.be.equal(200);
                response.body.djuHeating.should.be.equal('807');
                /* jshint ignore:start */
                should(response.body.djuReduced).be.null;
                /* jshint ignore:end */
                done();
            });
    });

    it('from 15/10 to 15/04, no week-end, from 8:00 to 17:00 should return 627 for heating with 20°C and 1550 for reduced with 17°C', function (done) {
        request(app)
            .post('/computeDju')
            .send({
                temperature: 20,
                startDate: '15/10',
                endDate: '15/04',
                weekDays: [0, 1, 2, 3, 4],
                startHour: '08:00',
                endHour: '17:00',
                reducedTemperature: 17
            })
            .end(function (err, response) {
                response.status.should.be.equal(200);
                response.body.djuHeating.should.be.equal('627');
                response.body.djuReduced.should.be.equal('1546');
                done();
            });
    });

    it('from 15/09 to 07/05, no week-end, from 7:00 to 20:00 should return 1089 for heating with 21°C and 417 for reduced with 8°C', function (done) {
        request(app)
            .post('/computeDju')
            .send({
                temperature: 21,
                startDate: '15/09',
                endDate: '07/05',
                weekDays: [0, 1, 2, 3, 4],
                startHour: '07:00',
                endHour: '20:00',
                reducedTemperature: 8
            })
            .end(function (err, response) {
                response.status.should.be.equal(200);
                response.body.djuHeating.should.be.equal('1085');
                response.body.djuReduced.should.be.equal('413');
                done();
            });
    });

    it('from 01/09 to 30/05, week-end, all day should return 885 for heating with 20°C and 184 for reduced with 5°C', function (done) {
        request(app)
            .post('/computeDju')
            .send({
                temperature: 20,
                startDate: '01/09',
                endDate: '30/05',
                weekDays: [5, 6],
                startHour: '00:00',
                endHour: '23:59',
                reducedTemperature: 5
            })
            .end(function (err, response) {
                response.status.should.be.equal(200);
                response.body.djuHeating.should.be.equal('886');
                response.body.djuReduced.should.be.equal('185');
                done();
            });
    });


    it('from 01/10 to 30/04, all week, all day should return 2772 for heating with 20°C', function (done) {
        request(app)
            .post('/computeDju')
            .send({
                temperature: 20,
                startDate: '01/10',
                endDate: '30/04',
                weekDays: [0, 1, 2, 3, 4, 5, 6],
                startHour: '00:00',
                endHour: '23:59'
            })
            .end(function (err, response) {
                response.status.should.be.equal(200);
                response.body.djuHeating.should.be.equal('2772');
                /* jshint ignore:start */
                should(response.body.djuReduced).be.null;
                /* jshint ignore:end */
                done();
            });
    });
});
