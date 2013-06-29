'use strict';

describe('Controller: MainCtrl', function () {

    // load the controller's module
    beforeEach(module('yoaeApp'));

    var MainCtrl,
        scope,
        backend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
        scope = $rootScope.$new();
        backend = $httpBackend;

        $httpBackend.expectGET('/sites').
            respond('[{"__v":0,"_id":"51caea9cd162730200000003","enCours":false,"lien":"mongolab.org","note":3,"occurances":1,"titre":"Open-source MongoDB Tools | MongoLab","tags":[]},{"__v":0,"_id":"51cf0990d76f2c8d03000002","enCours":false,"lien":"www.angularjs.fr","note":3,"occurances":1,"titre":"302 Found","tags":[{"name":"javascript","_id":"51cf0990d76f2c8d03000003"}]}]');

        MainCtrl = $controller('MainCtrl', {
            $scope: scope
        });
    }));

    it('should attach a tri variable', function () {
        expect(scope.tri).toEqual("occurances");
    });

    it('should attach 2 sites', function () {
        expect(scope.sitesFromServer).toEqual(null);
        backend.flush();

        expect(scope.sitesFromServer.length).toEqual(2);
    });
});
