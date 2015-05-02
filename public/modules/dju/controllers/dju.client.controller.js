'use strict';

angular.module('dju').controller('DjuController', [ 'DjuFile', function (DjuFile) {
    var self = this;
    self.file = {};

    self.updateFile = function(file) {
        self.file = file;
    };

    self.importData = function() {
        DjuFile.importFileCsv(self.file);
    };
}]);
