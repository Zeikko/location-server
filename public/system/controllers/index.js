'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global', 'Locations',
    function($scope, Global, Locations) {
        $scope.global = Global;

        $scope.center = {};
        $scope.paths = {};
        $scope.markers = {};

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
                        speed: Math.round(locations[0].speed * 100) / 100,
                        timeago: moment(locations[0].date).fromNow()
                    });
                }
            });
        };

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
    }
]);
