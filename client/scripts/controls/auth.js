/*jslint nomen: true, white: true*/

(function (define, angular) {
    'use strict';

    define(function () {
    	var app = angular.module('app'),
            responsePromise;

    	app.controller('loginController',
            ['$scope', '$http', '$log', '$state', 'auth',
            function ($scope, $http, $log, $state, auth) {
                $scope.login = {};
				$scope.login.error = false;

                function ajaxSuccess(data) {
					auth.login(data, $scope.login.remember);
					$state.go('ads');
                }

                function ajaxError(data, status) {
					auth.logout();

					$scope.login.message = data;
					$scope.login.error = true;

                    $log.error(status);
                    $log.error(data);
                }

                $scope.login.submit = function () {
                    responsePromise = $http.post("/authenticate", {
						email: $scope.login.usr || "",
						password: $scope.login.pwd || ""
					});

                    responsePromise.success(ajaxSuccess);
                    responsePromise.error(ajaxError);
                };
        }]);

		app.controller('signupController',
            ['$scope', '$http', '$log', '$state', 'auth',
            function ($scope, $http, $log, $state, auth) {
                $scope.register = {};
				$scope.register.notValid = true;
				$scope.register.error = false;

				function modify() {
					$scope.register.notValid = !($scope.register.email || "").match(/.+@.+\..+/i) || !$scope.register.name || !$scope.register.pwd;
				}

				$scope.$watch('register.email', modify);
				$scope.$watch('register.name', modify);
				$scope.$watch('register.pwd', modify);

                function ajaxSuccess(data) {
					auth.login(data);
					$state.go('ads');
                }

                function ajaxError(data, status) {
					auth.logout();

					$scope.register.message = data;
					$scope.register.error = true;

                    $log.error(status);
                    $log.error(data);
                }

                $scope.register.submit = function () {
                    responsePromise = $http.post("/register", {
						email: $scope.register.email || "",
						name: $scope.register.name || "",
						password: $scope.register.pwd || ""
					});

                    responsePromise.success(ajaxSuccess);
                    responsePromise.error(ajaxError);
                };
        }]);
    });
}(this.define, this.angular));
