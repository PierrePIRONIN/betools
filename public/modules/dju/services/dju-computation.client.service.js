'use strict';

angular.module('dju').factory('DjuComputation', ['$http', function ($http) {
    return {
        computeDju: function (computation, onSuccess) {
            $http.post('/computeDju', computation)
                .success(onSuccess);
        }
    };
}]);
