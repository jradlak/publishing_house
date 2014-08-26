'use strict';
/**
 * Created by Jakub on 2014-08-26.
 */

/* jasmine specs for user service go here */

describe('user_service', function() {
    var Users;
    var Auth;
    var $httpBackend;

    // you need to indicate your module in a test
    beforeEach(function() {
        module('publishing_house');
    });

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        Auth = $injector.get('Auth');
        Users = $injector.get('Users');
    }));

    // On module load there will always be a stateChange event to the login state
    beforeEach(function() {
        $httpBackend.expectGET('login').respond();
        $httpBackend.flush();
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('User', function() {
        describe('instantiate', function () {
            it('should have getAll function', function () {
                expect(Users.getAll).to.not.be.undefined;
                expect(angular.isFunction(Users.getAll)).to.equal(true);
            });
        });

        /** TODO: Work on this!!
        describe('getAll', function() {
            it('should return no users', function () {
                expect(Users.getAll()).to.equal(undefined);
            });
        });
        */
    });
});