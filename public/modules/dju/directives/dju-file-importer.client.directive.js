'use strict';

angular.module('dju').directive('djuFileImporter', ['$parse',
    function ($parse) {
        return {
            restrict: 'A',
            scope: {
                method: '&djuFileImporter'
            },
            link: function postLink(scope, element, attrs) {
                var callbackMethod = scope.method();
                var browseButton = element.find('input');
                browseButton.bind('change', function (changeEvent) {
                    var file = changeEvent.target.files[0];
                    scope.$apply(callbackMethod(file));
                });
            }
        };
    }
])
;
