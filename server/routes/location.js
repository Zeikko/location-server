'use strict';

module.exports = function(app) {

    // Home route
    var location = require('../controllers/location');

    app.route('/location').get(location.save);

};
