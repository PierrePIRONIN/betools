const Big = require('bignumber.js');
const _ = require('lodash');

/**
 * DjuController
 *
 * @description :: Server-side logic for managing djus
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function reduceDjus(djus, computationTemperature) {
    var positiveTemperatures = djus.map(function (dju) {
        var temperature = computationTemperature.minus(dju.temperature).toFixed(1);
        if (temperature >= 0) {
            return temperature;
        }
        return 0;
    });

    var dju = positiveTemperatures.reduce(function (dju, temperature) {
        return dju.plus(temperature);
    }, new Big(0));

    dju = dju.div(24);

    return dju;
}

module.exports = {


    /**
     * `DjuController.compute()`
     */
    compute: function (req, res) {
        var computation = req.body;
        var weekDaysNumber = computation.weekDays.length;

        var startDay = parseInt(computation.startDate.split('/')[0]);
        var startMonth = parseInt(computation.startDate.split('/')[1]);
        var startHour = parseInt(computation.startHour.split(':')[0]);
        var endDay = parseInt(computation.endDate.split('/')[0]);
        var endMonth = parseInt(computation.endDate.split('/')[1]);
        var endHour = parseInt(computation.endHour.split(':')[0]);
        var endMinutes = parseInt(computation.endHour.split(':')[1]);

        if (startHour === 0) {
            startHour = 24;
        }
        if (endHour === 0) {
            endHour = 24;
        }
        if (endMinutes === 0) {
            endHour = endHour - 1;
        }
        var hours = [];
        if (startHour < endHour) {
            hours = _.range(startHour, endHour + 1);
        } else {
            hours = _.range(startHour, 25);
            hours.push.apply(hours, _.range(1, endHour + 1));
        }
        var allDayHours = _.range(1, 25);

        var startMonthDays = [];
        var middleMonths = [];
        var middleMonthDays = [];
        var endMonthDays = [];
        var findHeatingQuery = [];
        var findReducedQueryDays = [];
        if (startMonth < endMonth) {
            startMonthDays = _.range(startDay, 32);
            middleMonths = _.range(startMonth, endMonth);
            middleMonthDays = _.range(1, 32);
            endMonthDays = _.range(1, endDay + 1);
            findHeatingQuery = [
                {month: startMonth, day: {$in: startMonthDays}, hour: {$in: hours}},
                {month: {$in: middleMonths}, day: {$in: middleMonthDays}, hour: {$in: hours}},
                {month: endMonth, day: {$in: endMonthDays}, hour: {$in: hours}}
            ];
            findReducedQueryDays = [
                {month: startMonth, day: {$in: startMonthDays}, hour: {$in: allDayHours}},
                {month: {$in: middleMonths}, day: {$in: middleMonthDays}, hour: {$in: allDayHours}},
                {month: endMonth, day: {$in: endMonthDays}, hour: {$in: allDayHours}}
            ];
        } else if ((startMonth === endMonth) && (startDay < endDay)) {
            startMonthDays = _.range(startDay, endDay + 1);
            middleMonths = [];
            middleMonthDays = [];
            endMonthDays = [];
            findHeatingQuery = [
                {month: startMonth, day: {$in: startMonthDays}, hour: {$in: hours}}
            ];
            findReducedQueryDays = [
                {month: startMonth, day: {$in: startMonthDays}, hour: {$in: allDayHours}}
            ];
        } else {
            startMonthDays = _.range(startDay, 32);
            middleMonths = _.range(startMonth + 1, 13);
            middleMonths.push.apply(middleMonths, _.range(1, endMonth));
            middleMonthDays = _.range(1, 32);
            endMonthDays = _.range(1, endDay + 1);
            findHeatingQuery = [
                {month: startMonth, day: {$in: startMonthDays}, hour: {$in: hours}},
                {month: {$in: middleMonths}, day: {$in: middleMonthDays}, hour: {$in: hours}},
                {month: endMonth, day: {$in: endMonthDays}, hour: {$in: hours}}
            ];
            findReducedQueryDays = [
                {month: startMonth, day: {$in: startMonthDays}, hour: {$in: allDayHours}},
                {month: {$in: middleMonths}, day: {$in: middleMonthDays}, hour: {$in: allDayHours}},
                {month: endMonth, day: {$in: endMonthDays}, hour: {$in: allDayHours}}
            ];
        }

        var findReducedQueryHours = [
            {month: startMonth, day: {$in: startMonthDays}, hour: {$nin: hours}},
            {month: {$in: middleMonths}, day: {$in: middleMonthDays}, hour: {$nin: hours}},
            {month: endMonth, day: {$in: endMonthDays}, hour: {$nin: hours}}
        ];

        Dju.find({$or: findHeatingQuery}, function (err, heatingDjus) {
            if (err) {
                return res.serverError(err);
            }

            var djuHeating = reduceDjus(heatingDjus, new Big(computation.temperature));
            djuHeating = djuHeating.times(weekDaysNumber).div(7).toFixed(0);

            if (computation.reducedTemperature !== undefined) {
                Dju.find({$or: findReducedQueryHours}, function (err, reducedDjus) {
                    if (err) {
                        return res.serverError(err);
                    }

                    var djuReduced = reduceDjus(reducedDjus, new Big(computation.reducedTemperature));
                    djuReduced = djuReduced.times(weekDaysNumber).div(7);

                    Dju.find({$or: findReducedQueryDays}, function (err, reducedDjus) {
                        if (err) {
                            return res.serverError(err);
                        }

                        var djuReducedDays = reduceDjus(reducedDjus, new Big(computation.reducedTemperature));
                        djuReducedDays = djuReducedDays.times(7 - weekDaysNumber).div(7);

                        return res.json({
                            djuHeating: djuHeating,
                            djuReduced: djuReduced.plus(djuReducedDays).toFixed(0)
                        });
                    });
                });
            } else {
                return res.json({
                    djuHeating: djuHeating,
                    djuReduced: null
                });
            }
        });
    }
};

