'use strict';

var djus = require('../../app/controllers/djus.server.controller');

module.exports = function(app) {
	app.route('/djuCSVFile')
		.post(djus.importCSV);
};
