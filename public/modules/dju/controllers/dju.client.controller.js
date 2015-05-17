'use strict';

angular.module('dju').controller('DjuController', ['DjuFile', 'Dju', 'ngTableParams',
    function (DjuFile, Dju, ngTableParams) {
        var self = this;

        // File
        self.file = {};
        self.updateFile = function (file) {
            self.file = file;
        };

        self.importData = function () {
            DjuFile.importFileCsv(self.file, function () {
                self.findDjus();
                self.recordsTable.reload();
            });
        };

        // Djus
        self.djus = [];
        self.findDjus = function () {
            self.djus = Dju.query();
        };

        // Referential
        self.recordsTable = new ngTableParams();

        // Computation
        self.weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
        self.computation = {
            startDate: null,
            endDate: null,
            weekDays: [],
            startHour: null,
            endHour: null
        }
        self.toggleDay = function(day) {
            var index = self.computation.weekDays.indexOf(day);

            if( index > -1) {
                self.computation.weekDays.splice(index, 1);
            } else {
                self.computation.weekDays.push(day);
            }
        }

    }
]);

