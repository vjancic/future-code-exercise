/*jslint nomen: true, white: true*/

(function (define, angular) {
    'use strict';

    define(function () {
    	var app = angular.module('app'),
            address,
            responsePromise;

    	app.controller('adController',
            ['$stateParams', '$scope', '$http', '$log',
            function ($stateParams, $scope, $http, $log) {
                address = "/ad/" + $stateParams.id;
                $scope.data = {};
                $scope.data.ads = [];

                function ajaxSuccess(data) {
                    $scope.data.ads = Array.prototype.slice.call(data);
                }

                function ajaxError(data, status) {
                    $log.error(status);
                    $log.error(data);
                }

                responsePromise = $http.get(address);
                responsePromise.success(ajaxSuccess);
                responsePromise.error(ajaxError);
        }]);
    });
}(this.define, this.angular));
