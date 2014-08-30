var _ =           require('underscore')
    , User =      require('../models/User.js')
    , userRoles = require('../../client/js/routingConfig').userRoles
    , url = require('url');

module.exports = {
    index: function(req, res) {
        User.initUsers(req.db);
        var users = User.findAll();
        _.each(users, function(user) {
            delete user.password;
        });
        res.json(users);
    },

    loadByUserName : function(req, res) {
        var objUserName = url.parse(req.url,true).query;
        var user = User.findByUsername(objUserName.username);
        res.json(user);
    }
};