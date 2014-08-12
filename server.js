var express =           require('express')
    , http =            require('http')
    , https =           require('https')
    , fs =              require('fs')
    , passport =        require('passport')
    , path =            require('path')
    , morgan =          require('morgan')
    , bodyParser =      require('body-parser')
    , methodOverride =  require('method-override')
    , cookieParser =    require('cookie-parser')
    , cookieSession =   require('cookie-session')
    , session =         require('express-session')
    , csrf =            require('csurf')
    , User =            require('./server/models/User.js')
    , mongo =           require('mongodb')
    , monk =            require('monk')
    , db =              monk('localhost:27017/publishing_house');

var app = module.exports = express();

app.set('views', __dirname + '/client/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'client')));
app.use(cookieParser());
app.use(session(
    {
        secret: process.env.COOKIE_SECRET || "Superdupersecret"
    }));

var env = process.env.NODE_ENV || 'development';
if ('development' === env || 'production' === env) {
    app.use(csrf());
    app.use(function(req, res, next) {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        next();
    });
}

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();

    User.initUsers(db);
});


app.use(passport.initialize());
app.use(passport.session());


passport.use(User.localStrategy);
//passport.use(User.twitterStrategy());  // Comment out this line if you don't want to enable login via Twitter
//passport.use(User.facebookStrategy()); // Comment out this line if you don't want to enable login via Facebook
//passport.use(User.googleStrategy());   // Comment out this line if you don't want to enable login via Google
//passport.use(User.linkedInStrategy()); // Comment out this line if you don't want to enable login via LinkedIn

passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

require('./server/routes.js')(app);

//app.set('port', process.env.PORT || 8000);
//http.createServer(app).listen(app.get('port'), function(){
//    console.log("Express server listening on port " + app.get('port'));
//});

var privateKey  = fs.readFileSync('crt/publishing.key', 'utf8');
var certificate = fs.readFileSync('crt/publishing.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
app.set('port', process.env.PORT || 8443);
https.createServer(credentials, app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
