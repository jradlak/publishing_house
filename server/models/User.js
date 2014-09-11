var User
    , _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , check =           require('validator').check
    , userRoles =       require('../../client/js/routingConfig').userRoles
    , fs =              require('fs')
    , MongoDb =         require('MongoDb');


var users = [];

module.exports = {
    initUsers : function(db) {
        if (users.length > 0) {
            return;
        }

        var collection = db.get('usercollection');
        collection.find({},{},function(e,docs) {
            for (var u in docs)
            {
                var usr = {
                    id :  docs[u].id, //_.max(users, function(user) { return user.id; }).id + 1,
                    username : docs[u].username,
                    password : docs[u].password,
                    description : docs[u].description,
                    avatar_path : docs[u].avatar_path,
                    creation_date : docs[u].creation_date,
                    role : {
                        bitMask : docs[u].role.bitMask,
                        title : docs[u].role.title
                    }
                };

                users.push(usr);
            }
        });
    },

    addUser: function(db, username, password, role, callback) {
        if(this.findByUsername(username) !== undefined)  return callback("UserAlreadyExists");

        var user = {
            id:         _.max(users, function(user) { return user.id; }).id + 1,
            username:   username,
            password:   password,
            description : {},
            creation_date : new Date(),
            role:       role
        };
        users.push(user);

        //writing to database:
        var collection = db.get('usercollection');
        collection.insert(user);

        callback(null, user);
    },

    updateUser : function(db, username, description, avatarPath, avatarLink, imageType, callback) {
        var user = this.findByUsername(username);
        if(user == undefined) {
            return callback("UserDontExist");
        }

        var imageData = fs.readFileSync(avatarPath);

        var collection = db.get('usercollection');
        collection.findAndModify({ query: {username : username},
            update: {
                id : user.id,
                username : username,
                password : user.password,
                description : description,
                avatarLink : avatarLink,
                avatar : new MongoDb.Binary(imageData),
                avatarType : imageType,
                role : user.role
            }});
    },

    findAll: function() {
        return _.map(users, function(user) { return _.clone(user); });
    },

    findById: function(id) {
        return _.clone(_.find(users, function(user) { return user.id === id }));
    },

    findByUsername: function(username) {
        return _.clone(_.find(users, function(user) { return user.username === username; }));
    },

    validate: function(user) {
        check(user.username, 'Username must be 1-20 characters long').len(1, 20);
        check(user.password, 'Password must be 5-60 characters long').len(5, 60);
        check(user.username, 'Invalid username').not(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);

        // TODO: Seems node-validator's isIn function doesn't handle Number arrays very well...
        // Till this is rectified Number arrays must be converted to string arrays
        // https://github.com/chriso/node-validator/issues/185
        var stringArr = _.map(_.values(userRoles), function(val) { return val.toString() });
        check(user.role, 'Invalid user role given').isIn(stringArr);
    },

    localStrategy: new LocalStrategy(
        function(username, password, done) {

            var user = module.exports.findByUsername(username);

            if(!user) {
                done(null, false, { message: 'Incorrect username.' });
            }
            else if(user.password != password) {
                done(null, false, { message: 'Incorrect username.' });
            }
            else {
                return done(null, user);
            }
        }
    ),

    serializeUser: function(user, done) {
        done(null, user.id);
    },

    deserializeUser: function(id, done) {
        var user = module.exports.findById(id);

        if(user)    { done(null, user); }
        else        { done(null, false); }
    }
};