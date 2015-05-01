'use strict';

angular.module('dju').controller('DjuController', [function () {
    var self = this;
    self.file = {};

    self.updateFile = function(file) {
        self.file = file;
    };

}]);
