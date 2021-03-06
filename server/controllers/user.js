var _ =           require('underscore')
    , User =      require('../models/User.js')
    , userRoles = require('../../client/js/routingConfig').userRoles
    , url =       require('url')
    , fs =        require('fs');

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

    updateUser : function (req, res) {
        var fstream;
        var username = '';
        var description = '';
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            var date  = new Date();
            var dateString = date.getYear() + 1900 + "_" + date.getMonth() + "_" + date.getDay() + "_" + date.getHours() + "_" + date.getMinutes() +
                "_" + date.getSeconds() + "_" + date.getMilliseconds();
            var filepath = __dirname + '/uploads/' + dateString + filename;
            fstream = fs.createWriteStream(filepath);

            console.log("!!!! FILE!!!");
            console.log(file);

            file.pipe(fstream);
            fstream.on('close', function () {
                User.updateUser(req.db, username, description, filepath, dateString + filename, file.type, function() {
                    console.log("Everything OK");
                    res.end();
                });
            });
        });
        req.busboy.on('field', function(fieldname, val) {
            if (fieldname == 'username') {
                username = val;
            }

            if (fieldname == 'description') {
                description = val;
            }
        });
        req.busboy.on('finish', function(){

        });
    },

    getUserAvatar : function(req, res) {
        var objUserName = url.parse(req.url,true).query;
        User.getUserAvatar(req.db, objUserName.username, res);
    }

};