'use strict';

var mongoose = require('mongoose'),
    Location = mongoose.model('Location');

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRadians) === 'undefined') {
    Number.prototype.toRadians = function() {
        return this * Math.PI / 180;
    };
}

var calculateDistance = function(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var lat1rad = lat1.toRadians();
    var lat2rad = lat2.toRadians();
    var latDelta = (lat2 - lat1).toRadians();
    var lonDelta = (lon2 - lon1).toRadians();

    var a = Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
        Math.cos(lat1rad) * Math.cos(lat2rad) *
        Math.sin(lonDelta / 2) * Math.sin(lonDelta / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;
    return d;
};

/**
 * Create a location
 */
exports.save = function(req, res) {

    var location = new Location(req.body);
    location.lat = req.param('lat');
    location.lon = req.param('lon');

    Location.findOne({})
        .sort('-date')
        .exec(function(err, previousLocation) {
            if (previousLocation) {
                location.distance = Math.round(calculateDistance(location.lat, location.lon, previousLocation.lat, previousLocation.lon) * 1000);
                location.interval = Math.round((location.date - previousLocation.date) / 1000);
                location.speed = location.distance / location.interval * 3.6;
            }
            location.save(function(err) {
                if (err) {
                    res.status(500);
                } else {
                    res.jsonp(location);
                }
            });
        });

};
