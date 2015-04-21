/*jslint nomen: true, white: true */

(function (define, angular, document) {
    'use strict';

    define(['ctl/ads', 'ctl/ad'], function () {
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
        });

        angular.element(document).ready(function () {
            angular.bootstrap(document, ['app']);
        });
    });
}(this.define, this.angular, this.document));
