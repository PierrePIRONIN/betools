'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    errorHandler = require('./errors.server.controller'),
    multiparty = require('multiparty'),
    fs = require('fs'),
    Dju = mongoose.model('Dju');

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
                var dju = {
                    label: djuFile.originalFilename,
                    records: []
                };
                djusRecords.map(function (djuRecord) {
                    // pattern is day;month;hour;temperature
                    var data = djuRecord.split(';');
                    dju.records.push({
                        day: data[0],
                        month: data[1],
                        hour: data[2],
                        temperature: data[3]
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
                var djuBean = new Dju(dju);
                djuBean.save(function (err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    }
                    res.json(djuBean);
                });
            });
        }
    );
};

exports.computeDju = function(req, res) {
    res.json({dju: 2000});
};
