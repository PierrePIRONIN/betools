'use strict';

angular.module('dju').factory('DjuFile', ['$http', function ($http) {
    return {
        importFileCsv: function (fileCSV, onSuccess, onError) {
            var fd = new FormData();
            fd.append('files', fileCSV);
            $http.post('/djuCSVFile', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
                .success(onSuccess)
                .error(onError);
        }
    };
}
]);
