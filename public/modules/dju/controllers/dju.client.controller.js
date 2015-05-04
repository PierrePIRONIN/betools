'use strict';

angular.module('dju').controller('DjuController', ['DjuFile', 'Dju', 'ngTableParams',
    function (DjuFile, Dju, ngTableParams) {
        var self = this;

        //File
        self.file = {};
        self.updateFile = function (file) {
            self.file = file;
        };

        self.importData = function () {
            DjuFile.importFileCsv(self.file, function() {
                self.findDjus();
                self.recordsTable.reload();
            });
        };

        //Djus
        self.djus = [];
        self.findDjus = function () {
            self.djus = Dju.query();
        };

        //Djus table
        self.recordsTable = new ngTableParams(
            {
                page: 1,
                count: 10
            },
            {
                total: 0,
                getData: function ($defer) {
                    $defer.resolve(self.djus[0].records);
                }
            });
    }
]);

