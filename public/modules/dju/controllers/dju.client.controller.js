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
        self.weekDays = [
            {id:0, value:'Lundi'},
            {id:1, value:'Mardi'},
            {id:2, value:'Mercredi'},
            {id:3, value:'Jeudi'},
            {id:4, value:'Vendredi'},
            {id:5, value:'Samedi'},
            {id:6, value:'Dimanche'}
        ];
        self.regexDay = '(0?[1-9]|[1-2][0-9]|3[0-1])';
        self.regexMonth = '(0?[1-9]|1[0-2])';
        self.regexHours = '([01]?[0-9]|2[0-3])';
        self.regexMinutes = '([0-5][0-9])';
        self.patternDate = '/^' + self.regexDay + '\/' + self.regexMonth + '$/';
        self.patternTimestamp = '/^' + self.regexHours + '(:' + self.regexMinutes + ')?$/';

        self.computation = {
            startDate: null,
            endDate: null,
            weekDays: [],
            startHour: null,
            endHour: null
        }
        self.toggleDay = function(day) {
            var index = self.computation.weekDays.indexOf(day.id);

            if( index > -1) {
                self.computation.weekDays.splice(index, 1);
            } else {
                self.computation.weekDays.push(day.id);
            }
        }

    }
]);

