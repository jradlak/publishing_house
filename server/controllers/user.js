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
            console.log("Uploading: " + filename);
            var date  = new Date();
            var dateString = date.getYear() + 1900 + "_" + date.getMonth() + "_" + date.getDay() + "_" + date.getHours() + "_" + date.getMinutes() +
                "_" + date.getSeconds() + "_" + date.getMilliseconds();
            var filepath = __dirname + '/uploads/' + dateString + filename;
            fstream = fs.createWriteStream(filepath);
            file.pipe(fstream);
            fstream.on('close', function () {
                console.log(username);
                console.log(description);
                console.log('Zamkniecie strumienia pliku !!!');
                User.updateUser(req.db, username, description, filepath, function() {
                    console.log("smtng goes wrong!!!");
                });
                //res.redirect('back');
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
            //console.log(username);
            //console.log(description);
        });
    },

    uploadAvatar : function (req, res) {


        //console.log("file name", req.files.file.name);
        //console.log("file path", req.files.file.path);
    }
};