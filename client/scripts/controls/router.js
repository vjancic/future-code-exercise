/*jslint nomen: true, white: true */

(function (define, angular, document) {
    'use strict';

    define(['ctl/ads', 'ctl/ad', 'ctl/auth'], function () {
        var app = angular.module('app');
        app.config(function ($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('/ads');

            $stateProvider.state('ads', {
                url: '/ads',
                templateUrl: 'templates/main.html',
                controller: 'adsController'
            });

            $stateProvider.state('view', {
                url: '/ad/:id',
                templateUrl: 'templates/view.html',
                controller: 'adController'
            });

			$stateProvider.state('search', {
                url: '/ads/:action/:id',
                templateUrl: 'templates/main.html',
                controller: 'adsController'
            });

            $stateProvider.state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'loginController'
            });
        });

        angular.element(document).ready(function () {
            angular.bootstrap(document, ['app']);
        });
    });
}(this.define, this.angular, this.document));
