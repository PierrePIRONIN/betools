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
                Dju.remove(function(err) {
                    if (err) {
                        return res.status(400).send({
                           message: errorHandler.getErrorMessage(err)
                        });
                    }
                });

                // Save dju in database
                djus.forEach(function(dju) {
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

exports.computeDju = function(req, res) {
    var computation  = req.body;

    var startDay = parseInt(computation.startDate.split('/')[0]);
    var startMonth = parseInt(computation.startDate.split('/')[1]);
    var endDay = parseInt(computation.endDate.split('/')[0]);
    var endMonth = parseInt(computation.endDate.split('/')[1]);
    var computationTemperature = new Big(computation.temperature);

    var startMonthDays = [];
    var middleMonths = [];
    var middleMonthDays = [];
    var endMonthDays = [];
    var findQuery = [];
    if(startMonth < endMonth) {
        startMonthDays = _.range(startDay, 32);
        middleMonths = _.range(startMonth, endMonth);
        middleMonthDays = _.range(1, 32);
        endMonthDays = _.range(1, endDay + 1);
        findQuery = [
            {month: startMonth, day: {$in: startMonthDays}},
            {month: {$in: middleMonths},  day: {$in: middleMonthDays}},
            {month: endMonth, day: {$in: endMonthDays}}
        ];
    } else if ( (startMonth === endMonth) && (startDay < endDay)) {
        startMonthDays = _.range(startDay, endDay + 1);
        findQuery = [
            {month: startMonth, day: {$in: startMonthDays}}
        ];
    } else {
        startMonthDays = _.range(startDay, 32);
        middleMonths = _.range(startMonth, 13);
        middleMonths.push.apply(middleMonths, _.range(1, endMonth + 1));
        middleMonthDays = _.range(1, 32);
        endMonthDays = _.range(1, endDay + 1);
        findQuery = [
            {month: startMonth, day: {$in: startMonthDays}},
            {month: {$in: middleMonths},  day: {$in: middleMonthDays}},
            {month: endMonth, day: {$in: endMonthDays}}
        ];
    }
    Dju.find({$or:findQuery}, function(err, djus) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        var positiveTemperatures = djus.map(function(dju) {
            var temperature = computationTemperature.minus(dju.temperature).toFixed(1);
            if (temperature >= 0) {
                return temperature;
            }
            return 0;
        });

        var dju = positiveTemperatures.reduce(function(dju, temperature) {
            return dju.plus(temperature);
        }, new Big(0));

        dju = dju.div(24).toFixed(0);

        res.json({dju: dju});
    });
};
