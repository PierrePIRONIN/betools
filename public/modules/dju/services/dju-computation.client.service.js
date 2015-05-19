'use strict';

angular.module('dju').factory('DjuComputation', ['$http', function ($http) {
    return {
        computeDju: function (onSuccess) {
            $http.get('/computeDju')
                .success(onSuccess);
        }
    };
}]);
