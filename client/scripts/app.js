(function (require) {
    'use strict';

    require.config({
        baseUrl: './scripts',
        paths: {
            dir: 'directives',
            res: 'resources',
            ctl: 'controls',
            angular: 'resources/angular.min',
            locale: 'resources/angular-locale_hr',
            route: 'resources/angular-ui-router.min',
            bootstrap: 'resources/ui-bootstrap.min',
            animate: 'resources/angular-animate.min',
            'underscore-min': 'resources/underscore-min',
            router: 'controls/router'
        },
        shim: {
            angular: { deps: ['underscore-min'], exports: 'angular' },
            bootstrap: ['angular'],
            animate: ['angular'],
            locale: ['angular'],
            route: ['bootstrap', 'animate', 'locale']
        }
    });

    require(['angular', 'route'], function (angular) {
        angular.module('app', ['ui.router', 'ui.bootstrap', 'ngAnimate']);
        require(['router']);
    });
}(this.require));
