/*jslint nomen: true, white: true*/

(function (define, angular, underscore) {
    'use strict';

    define(function () {
    	var app = angular.module('app'),
            adData = [],
            filteredData = [],
            location = "",
            address = "/ad",
            responsePromise,
            extractLocations = function () {
                var locations = underscore.pluck(adData, "location");
                return underscore.uniq(locations);
            },
            filterByLocation = function (val) {
                return val.location === location;
            },
            sortAdsAscended = function (val) {
                return val.date;
            },
            sortAdsDescended = function (val) {
                return -val.date;
            },
            sortExpiryAscended = function (val) {
                return val.expiry;
            },
            sortExpiryDescended = function (val) {
                return -val.expiry;
            },
            extractExpireless = function (val) {
                return val.expiry === 0;
            },
            extractExpiring = function (val) {
                return val.expiry > 0;
            },
            sortByExpiryAscended = function () {
                var expiring = underscore.filter(filteredData, extractExpiring),
                    expireless = underscore.filter(filteredData, extractExpireless),
                    expiringSorted = underscore.sortBy(expiring, sortExpiryAscended),
                    expirelessSorted = underscore.sortBy(expireless, sortAdsAscended);

                return Array.prototype.concat.call(expiringSorted, expirelessSorted);
            },
            sortByExpiryDescended = function () {
                var expiring = underscore.filter(filteredData, extractExpiring),
                    expireless = underscore.filter(filteredData, extractExpireless),
                    expiringSorted = underscore.sortBy(expiring, sortExpiryDescended),
                    expirelessSorted = underscore.sortBy(expireless, sortAdsDescended);

                return Array.prototype.concat.call(expiringSorted, expirelessSorted);
            };


    	app.controller('adsController',
            ['$stateParams', '$scope', '$http', '$log',
            function ($stateParams, $scope, $http, $log) {
                address = "/ad";
                $scope.data = {};
                $scope.data.ads = [];

                if ($stateParams.action) {
                    address += "/" + $stateParams.action;
                }

                if ($stateParams.id) {
                    address += "/" + $stateParams.id;
                }

                $scope.selectionChange = function selectionChange() {
                    switch($scope.data.sortSelection.toString()) {
                        case "0":
                            $scope.data.ads = underscore.sortBy(filteredData, sortAdsDescended);
                            break;
                        case "1":
                            $scope.data.ads = underscore.sortBy(filteredData, sortAdsAscended);
                            break;
                        case "2":
                            $scope.data.ads = sortByExpiryAscended();
                            break;
                        case "3":
                            $scope.data.ads = sortByExpiryDescended();
                            break;
                        default:
                            $scope.data.ads = filteredData;
                            break;
                    }
                };

                $scope.filterChange = function filterChange() {
                    location = $scope.data.filterSelection;

                    if (location === 'All') {
                        filteredData = Array.prototype.slice.call(adData);
                        $scope.selectionChange();
                        return;
                    }

                    filteredData = underscore.filter(adData, filterByLocation);
                    $scope.selectionChange();
                };

                function ajaxSuccess(data) {
                    adData = Array.prototype.slice.call(data);
                    $scope.data.locations = extractLocations();
                    $scope.filterChange();
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
}(this.define, this.angular, this._));
