'use strict';

module.exports = function(app) {

    var locations = require('../controllers/locations');

    app.route('/locations/create').get(locations.save);
    app.route('/locations').get(locations.all);

};
