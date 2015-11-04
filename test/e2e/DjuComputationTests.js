const request = require('supertest');
const chai = require('chai');
var should = chai.should();


describe('Dju computation', () => {
    it('data fixture is correctly loaded', () => {
        Dju.count()
            .then(function (nb) {
                nb.should.equal(8760);
            });
    });

    it('from 01/10 to 31/04, all the week, with 20°C all the day should return 2772', (done) => {
        request(sails.hooks.http.app)
            .post('/dju/compute')
            .send({
                temperature: 20,
                startDate: '01/10',
                endDate: '31/04',
                weekDays: [0, 1, 2, 3, 4, 5, 6],
                startHour: '00:00',
                endHour: '23:59'
            })
            .expect(200)
            .end((err, res) => {
                res.body.djuHeating.should.be.equal('2772');
                should.not.exist(res.body.djuReduced);
                done();
            });
    });

    it('from 15/10 to 15/04, all the week, with 20°C from 8:00 to 18:00 should return 959', (done) => {
        request(sails.hooks.http.app)
            .post('/dju/compute')
            .send({
                temperature: 20,
                startDate: '15/10',
                endDate: '15/04',
                weekDays: [0, 1, 2, 3, 4, 5, 6],
                startHour: '08:00',
                endHour: '18:00'
            })
            .expect(200)
            .end((err, res) => {
                res.body.djuHeating.should.be.equal('959');
                should.not.exist(res.body.djuReduced);
                done();
            });
    });

    it('from 15/10 to 15/04, all the week, with 18°C from 8:00 to 18:00 should return 807', (done) => {
        request(sails.hooks.http.app)
            .post('/dju/compute')
            .send({
                temperature: 18,
                startDate: '15/10',
                endDate: '15/04',
                weekDays: [0, 1, 2, 3, 4, 5, 6],
                startHour: '08:00',
                endHour: '18:00'
            })
            .expect(200)
            .end((err, res) => {
                res.body.djuHeating.should.be.equal('807');
                should.not.exist(res.body.djuReduced);
                done();
            });
    });

    it('from 15/10 to 15/04, no week-end, from 8:00 to 17:00 should return 627 for heating with 20°C and 1550 for reduced with 17°C', (done) => {
        request(sails.hooks.http.app)
            .post('/dju/compute')
            .send({
                temperature: 20,
                startDate: '15/10',
                endDate: '15/04',
                weekDays: [0, 1, 2, 3, 4],
                startHour: '08:00',
                endHour: '17:00',
                reducedTemperature: 17
            })
            .expect(200)
            .end(function (err, res) {
                res.body.djuHeating.should.be.equal('627');
                res.body.djuReduced.should.be.equal('1546');
                done();
            });
    });

    it('from 15/09 to 07/05, no week-end, from 7:00 to 20:00 should return 1089 for heating with 21°C and 417 for reduced with 8°C', (done) => {
        request(sails.hooks.http.app)
            .post('/dju/compute')
            .send({
                temperature: 21,
                startDate: '15/09',
                endDate: '07/05',
                weekDays: [0, 1, 2, 3, 4],
                startHour: '07:00',
                endHour: '20:00',
                reducedTemperature: 8
            })
            .expect(200)
            .end((err, res) => {
                res.body.djuHeating.should.be.equal('1085');
                res.body.djuReduced.should.be.equal('413');
                done();
            });
    });

    it('from 01/09 to 30/05, week-end, all day should return 885 for heating with 20°C and 184 for reduced with 5°C', (done) => {
        request(sails.hooks.http.app)
            .post('/dju/compute')
            .send({
                temperature: 20,
                startDate: '01/09',
                endDate: '30/05',
                weekDays: [5, 6],
                startHour: '00:00',
                endHour: '23:59',
                reducedTemperature: 5
            })
            .expect(200)
            .end((err, res) => {
                res.body.djuHeating.should.be.equal('886');
                res.body.djuReduced.should.be.equal('185');
                done();
            });
    });
});
