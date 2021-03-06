/*jslint nomen: true, white: true */

(function (define, angular, document) {
    'use strict';

    define(['ctl/ads', 'ctl/ad', 'ctl/auth', 'ctl/post'], function () {
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

			$stateProvider.state('register', {
                url: '/register',
                templateUrl: 'templates/register.html',
                controller: 'signupController'
            });

			$stateProvider.state('post', {
                url: '/post',
                templateUrl: 'templates/post.html',
                controller: 'postController'
            });
        });
		
		app.run(['$rootScope', '$state', 'auth', function($rootScope, $state, auth) {
			$rootScope.header = {};

			$rootScope.$on('$stateChangeStart', function(event, to, toParams, from, fromParams) {
				var loggedin = auth.isLoggedIn();
				var authorizationNeeded = to.name === 'post';
				
				$rootScope.header.isLoggedIn = loggedin;
				
				if(authorizationNeeded && !loggedin) {
					event.preventDefault();
					$state.go('login');
				}
			});
		}]);

        angular.element(document).ready(function () {
            angular.bootstrap(document, ['app']);
        });
    });
}(this.define, this.angular, this.document));
