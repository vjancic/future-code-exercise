/*jslint nomen: true, white: true*/

(function (define, angular) {
    'use strict';

    define(function () {
    	var app = angular.module('app'),
            responsePromise;

    	app.controller('loginController',
            ['$scope', '$http', '$log', '$window',
            function ($scope, $http, $log, $window) {
                $scope.login = {};

                function ajaxSuccess(data) {
                    $log.log(data);
                }

                function ajaxError(data, status) {
                    $log.error(status);
                    $log.error(data);
                }

                $scope.login.submit = function () {
                    responsePromise = $http.post("/authenticate", { email: $scope.login.usr, password: $scope.login.pwd });
                    responsePromise.success(ajaxSuccess);
                    responsePromise.error(ajaxError);
                };
        }]);
    });
}(this.define, this.angular));
