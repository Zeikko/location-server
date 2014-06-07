'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global', 'Locations', '$interval',
    function($scope, Global, Locations, $interval) {
        $scope.global = Global;

        $scope.center = {};
        $scope.paths = {};
        $scope.markers = {};
        $scope.speed = 0;

        $interval(function() {
            $scope.getLocations();
        }, 1000 * 30);

        $scope.chartOptions = {
        }

        $scope.getLocations = function() {
            Locations.query(function(locations) {
                if (locations.length) {
                    angular.extend($scope, {
                        paths: {
                            p1: toLeafletPath(locations)
                        },
                        center: {
                            lat: locations[0].lat,
                            lng: locations[0].lon,
                            zoom: 15
                        },
                        markers: {
                            location: {
                                lat: locations[0].lat,
                                lng: locations[0].lon,
                                message: 'I was here ' + moment(locations[0].date).fromNow(),
                                focus: false,
                                draggable: false
                            }
                        },
                        timeago: moment(locations[0].date).fromNow(),
                        speedChartData: [toFlotSeries(locations)],
                        distance: totalDistance(locations),
                        duration: totalDuration(locations)
                    });
                    if (typeof locations[0].speed !== 'undefined') {
                        $scope.speed = Math.round(locations[0].speed * 100) / 100;
                    }
                }
            });
        };

        var totalDuration = function(locations) {
            var pad = function(number) {
                if (number < 9) {
                    number = '0' + number;
                }
                return number;
            }

            var start = locations[0];
            console.log(start.date);
            var end = locations.pop();
            console.log(end.date);
            var duration = moment(start.date) - moment(end.date);
            duration /= 1000;
            var hours = Math.floor(duration / 3600);
            duration -= 3600 * hours;
            var minutes = Math.floor(duration / 60);
            duration -= 60 * minutes;
            var seconds = Math.round(duration);
            return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
        }

        var totalDistance = function(locations) {
            var distance = 0;
            angular.forEach(locations, function(location, key) {
                if (!isNaN(location.distance)) {
                    distance += location.distance;
                }
            });
            return distance;
        }

        var toLeafletPath = function(locations) {
            var path = {
                color: '#3383CC',
                weight: 4,
                latlngs: []
            };
            angular.forEach(locations, function(location, key) {
                path.latlngs.push({
                    lat: location.lat,
                    lng: location.lon
                });
            });
            return path;
        };

        var toFlotSeries = function(locations) {
            var serie = [];
            angular.forEach(locations, function(location, key) {
                if (!isNaN(location.speed)) {
                    serie.push([
                        moment(location.date).valueOf(),
                        Math.round(location.speed * 100) / 100
                    ]);
                }
            });
            serie.reverse();
            return serie;
        }
    }
]);
