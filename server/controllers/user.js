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
    },

    updateUser : function (req) {
       User.updateUser(req.db, req.body.username, req.body.role, req.body.description, req.files.avatar, callback)
    },

    uploadAvatar : function (req) {
        console.log('!!! WE ARE IN uploadAvatar');
        // show the uploaded file name
        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);
        });
        
        //console.log("file name", req.files.file.name);
        //console.log("file path", req.files.file.path);
    }
};