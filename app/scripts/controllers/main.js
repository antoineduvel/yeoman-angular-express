'use strict';

angular.module('yoaeApp')
    .controller('MainCtrl', function ($scope, $timeout, $http) {

        // valeur initiale des tris
        $scope.tri = 'occurances';
        $scope.reverse = 'true';

        var getFromServer = function () {
            $http.get('/sites').success(function (resp) {
                $scope.sitesFromServer = resp;
                $scope.$apply();

                for (var i = 0 ; i < $scope.sitesFromServer.length ; i++) {
                    if ($scope.sitesFromServer[i].enCours) {
                        $timeout(getFromServer, 5000);
                        break;
                    }
                }


            });
        };

        getFromServer();

        $scope.submitSite = function (site) {
            $http.post('/create', site).success(function () {
                getFromServer();
                $scope.site.lien = "";
                $scope.site.commentaire = "";
            });
        }

        $scope.deleteSite = function (site) {
            $http.post('/delete', site).success(function () {
                getFromServer();
            });
        }

    });
