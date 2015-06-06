'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    errorHandler = require('./errors.server.controller'),
    multiparty = require('multiparty'),
    fs = require('fs'),
    Dju = mongoose.model('Dju'),
    Big = require('big.js');

/**
 * Create a Dju
 */
exports.create = function (req, res) {

};

/**
 * Show the current Dju
 */
exports.read = function (req, res) {

};

/**
 * Update a Dju
 */
exports.update = function (req, res) {

};

/**
 * Delete an Dju
 */
exports.delete = function (req, res) {

};

/**
 * List of Djus
 */
exports.list = function (req, res) {
    Dju.find().sort({day: 1, month: 1, hour: 1}).exec(function (err, djus) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(djus);
        }
    });
};

/**
 * Import djus from CSV file
 * @param req
 * @param res
 */
exports.importCSV = function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
            // If err => Bad request
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
            // If files not present => Bad request
            if ((files.files === undefined) || (files.files.length === 0)) {
                return res.status(400).send({
                    message: 'files object is not set'
                });
            }
            var djuFile = files.files[0];
            fs.readFile(djuFile.path, 'utf8', function (err, data) {
                // If err => Bad request
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }

                // Create dju object with records
                var djusRecords = data.toString().split('\n');
                var djus = [];
                djusRecords.map(function (djuRecord) {
                    // pattern is day;month;hour;temperature
                    var data = djuRecord.split(';');
                    djus.push({
                        day: data[0],
                        month: data[1],
                        hour: data[2],
                        temperature: data[3],
                        label: djuFile.originalFilename
                    });
                });

                // Delete old djus
                Dju.remove(function (err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    }
                });

                // Save dju in database
                djus.forEach(function (dju) {
                    var djuBean = new Dju(dju);
                    djuBean.save(function (err) {
                        if (err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        }
                    });
                });
                res.json(djus);
            });
        }
    );
};

exports.computeDju = function (req, res) {
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
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        var djuHeating = reduceDjus(heatingDjus, new Big(computation.temperature));
        djuHeating = djuHeating.times(weekDaysNumber).div(7).toFixed(0);

        if (computation.reducedTemperature !== undefined) {
            Dju.find({$or: findReducedQueryHours}, function (err, reducedDjus) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }

                var djuReduced = reduceDjus(reducedDjus, new Big(computation.reducedTemperature));
                djuReduced = djuReduced.times(weekDaysNumber).div(7);

                Dju.find({$or: findReducedQueryDays}, function (err, reducedDjus) {
                    mongoose.set('debug', false);
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    }

                    var djuReducedDays = reduceDjus(reducedDjus, new Big(computation.reducedTemperature));
                    djuReducedDays = djuReducedDays.times(7 - weekDaysNumber).div(7);

                    res.json({
                        djuHeating: djuHeating,
                        djuReduced: djuReduced.plus(djuReducedDays).toFixed(0)
                    });
                });
            });
        } else {
            res.json({
                djuHeating: djuHeating,
                djuReduced: null
            });
        }

    });
};

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
