/*jslint nomen: true, white: true*/

(function (define, angular) {
    'use strict';

    define(function () {
    	var app = angular.module('app'),
            responsePromise;

    	app.controller('postController',
            ['$scope', '$http', '$log', '$window', 'auth',
            function ($scope, $http, $log, $window, auth) {
                $scope.post = {};
				$scope.post.error = false;
                $scope.post.type = "offer";

                function ajaxSuccess(data) {
                    $window.location.hash = "#/ad/" + data;
                }

                function ajaxError(data, status) {
					$scope.post.message = data;
					$scope.post.error = true;

                    $log.error(status);
                    $log.error(data);
                }

                $scope.post.submit = function () {
                    responsePromise = $http.post("/ad/" + auth.getInfo(), {
						headline: $scope.post.head || "",
						body: $scope.post.body || "",
                        location: $scope.post.location || "",
                        tags: $scope.post.tags || "",
                        expiry: $scope.post.expiry || 0,
                        type: $scope.post.type || "offer"
					});

                    responsePromise.success(ajaxSuccess);
                    responsePromise.error(ajaxError);
                };
        }]);
    });
}(this.define, this.angular));
