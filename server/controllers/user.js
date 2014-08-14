var _ =           require('underscore')
    , User =      require('../models/User.js')
    , userRoles = require('../../client/js/routingConfig').userRoles;

module.exports = {
    index: function(req, res) {
        User.initUsers(req.db);
        var users = User.findAll();
        _.each(users, function(user) {
            delete user.password;
        });
        res.json(users);
    }
};