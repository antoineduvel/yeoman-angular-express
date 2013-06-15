'use strict';

angular.module('yoaeApp')
    .controller('MainCtrl', function ($scope, $http) {

        $http.get('/sites').success(function (resp) {
            $scope.sitesFromServer = resp;
        });


        $scope.submitSite = function (site) {
            $http.post('/create', site).success(function () {
                $http.get('/sites').success(function (resp) {
                    $scope.sitesFromServer = resp;
                });
                $scope.site.link = "";
                $scope.site.desc = "";
            });
        }

    });
