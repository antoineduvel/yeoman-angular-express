'use strict';

angular.module('yoaeApp')
    .controller('MainCtrl', function ($scope, $timeout, $http) {

        var countUp = function () {
            $http.get('/sites').success(function (resp) {
                $scope.sitesFromServer = resp;
                $scope.$apply();
                //TODO conditionner le timeout au fait qu'il y a des infos en attente
                $timeout(countUp, 5000);
            });
        };

        countUp();

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
