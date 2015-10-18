describe('DjuService', function() {
    it('fixture is ok', function () {
       expect(Djus.find().count()).toBe(8760);
    });

    it('from 01/10 to 30/04, all week, all day should return 2772 for heating with 20°C', function () {
        var computation = {
            temperature: 20,
            startDate: '01/10',
            endDate: '30/04',
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            startHour: '00:00',
            endHour: '23:59'
        };
        Meteor.call('computeDju', computation, function(error, result) {
            expect(error).toBeUndefined();
            expect(result.djuHeating).toBe('2772');
            expect(result.djuReduced).toBeNull();
        });
    });

    it('from 01/10 to 31/04, all the week, with 20°C all the day should return 2772', function () {
        var computation = {
            temperature: 20,
            startDate: '01/10',
            endDate: '31/04',
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            startHour: '00:00',
            endHour: '23:59'
        };
        Meteor.call('computeDju', computation, function(error, result) {
            expect(error).toBeUndefined();
            expect(result.djuHeating).toBe('2772');
            expect(result.djuReduced).toBeNull();
        });
    });

    it('from 15/10 to 15/04, all the week, with 20°C from 8:00 to 18:00 should return 959', function () {
        var computation = {
            temperature: 20,
            startDate: '15/10',
            endDate: '15/04',
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            startHour: '08:00',
            endHour: '18:00'
        };
        Meteor.call('computeDju', computation, function(error, result) {
            expect(error).toBeUndefined();
            expect(result.djuHeating).toBe('959');
            expect(result.djuReduced).toBeNull();
        });
    });

    it('from 15/10 to 15/04, all the week, with 18°C from 8:00 to 18:00 should return 807', function () {
        var computation = {
            temperature: 18,
            startDate: '15/10',
            endDate: '15/04',
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            startHour: '08:00',
            endHour: '18:00'
        };
        Meteor.call('computeDju', computation, function(error, result) {
            expect(error).toBeUndefined();
            expect(result.djuHeating).toBe('807');
            expect(result.djuReduced).toBeNull();
        });
    });

    it('from 15/10 to 15/04, no week-end, from 8:00 to 17:00 should return 627 for heating with 20°C and 1550 for reduced with 17°C', function () {
        var computation = {
            temperature: 20,
            startDate: '15/10',
            endDate: '15/04',
            weekDays: [0, 1, 2, 3, 4],
            startHour: '08:00',
            endHour: '17:00',
            reducedTemperature: 17
        };
        Meteor.call('computeDju', computation, function(error, result) {
            expect(error).toBeUndefined();
            expect(result.djuHeating).toBe('627');
            expect(result.djuReduced).toBe('1546');
        });
    });

    it('from 15/09 to 07/05, no week-end, from 7:00 to 20:00 should return 1089 for heating with 21°C and 417 for reduced with 8°C', function () {
        var computation = {
            temperature: 21,
            startDate: '15/09',
            endDate: '07/05',
            weekDays: [0, 1, 2, 3, 4],
            startHour: '07:00',
            endHour: '20:00',
            reducedTemperature: 8
        };
        Meteor.call('computeDju', computation, function(error, result) {
            expect(error).toBeUndefined();
            expect(result.djuHeating).toBe('1085');
            expect(result.djuReduced).toBe('413');
        });
    });

    it('from 01/09 to 30/05, week-end, all day should return 885 for heating with 20°C and 184 for reduced with 5°C', function () {
        var computation = {
            temperature: 20,
            startDate: '01/09',
            endDate: '30/05',
            weekDays: [5, 6],
            startHour: '00:00',
            endHour: '23:59',
            reducedTemperature: 5
        };
        Meteor.call('computeDju', computation, function(error, result) {
            expect(error).toBeUndefined();
            expect(result.djuHeating).toBe('886');
            expect(result.djuReduced).toBe('185');
        });
    });

});