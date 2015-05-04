/*jslint nomen: true, white: true */

(function (define, angular) {
    'use strict';

    define(function () {
        var app = angular.module('app');

        app.factory('auth', ['$window', function ($window) {
			var service = {};

			service.logout = function logout() {
				$window.sessionStorage.removeItem('bankOfHappiness');
				$window.localStorage.removeItem('bankOfHappiness');
			};

			service.login = function login(data, remember) {
				service.logout();

				if (remember) {
					$window.localStorage.setItem('bankOfHappiness', angular.toJson(data));
				} else {
					$window.sessionStorage.setItem('bankOfHappiness', angular.toJson(data));
				}
			};

            service.isLoggedIn = function isLoggedIn() {
				return $window.sessionStorage.hasOwnProperty('bankOfHappiness') || $window.localStorage.hasOwnProperty('bankOfHappiness');
			};

			service.getInfo = function getInfo() {
				return angular.fromJson(($window.sessionStorage.getItem('bankOfHappiness') || $window.localStorage.getItem('bankOfHappiness')));
			};

			return service;
        }]);
    });
}(this.define, this.angular));
