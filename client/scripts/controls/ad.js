/*jslint nomen: true, white: true*/

(function (define, angular) {
    'use strict';

    define(function () {
    	var app = angular.module('app'),
            getAddress,
            postAddress,
            responsePromise;

    	app.controller('adController',
            ['$stateParams', '$scope', '$http', '$log', 'auth',
            function ($stateParams, $scope, $http, $log, auth) {
                getAddress = "/ad/" + $stateParams.id;
                postAddress = "/activity/" + $stateParams.id + "/" + auth.getInfo();
                $scope.data = {};

                function ajaxSuccess(data) {
                    var isLoggedIn = auth.isLoggedIn(),
                        isNotExpired;

                    if (data instanceof Array && data.length) {
                        $scope.data.ad = angular.copy(data[0]);

                        isNotExpired = (data[0].expiry === 0 || data[0].expiry > new Date().getTime());

                        $scope.data.canLock = isLoggedIn && isNotExpired;
                    }
                }

                function ajaxError(data, status) {
                    $log.error(status);
                    $log.error(data);
                }

				function getAd() {
					responsePromise = $http.get(getAddress);
					responsePromise.success(ajaxSuccess);
					responsePromise.error(ajaxError);
				}

				$scope.data.submit = function (type) {
                    responsePromise = $http.post(postAddress,
                    {
                        type: type,
                        comment: $scope.data.comment
                    });
                    responsePromise.success(ajaxSuccess);
					responsePromise.error(ajaxError);
				};

				getAd();
        }]);
    });
}(this.define, this.angular));
