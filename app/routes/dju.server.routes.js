'use strict';

var djus = require('../../app/controllers/djus.server.controller');

module.exports = function(app) {
	app.route('/djuCSVFile')
		.post(djus.importCSV);

	app.route('/djus')
		.get(djus.list);

	app.route('/computeDju')
		.get(djus.computeDju);
};
