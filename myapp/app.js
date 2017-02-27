/**
 * Created by matthewyun on 1/20/16.
 */
'use strict';

// *******************  Module dependencies *******************
var application_root = __dirname,
    express = require( 'express' ), //Web framework
    path = require( 'path' ), //Utilities for dealing with file paths
    bodyParser = require('body-parser'), //Parser for reading request body
    mongoose = require( 'mongoose'), //MongoDB integration

    methodOverride = require('method-override'),
    passport = require('passport'),
    flash    = require('connect-flash'),
    morgan       = require('morgan'),// log every request to the console
    cookieParser = require('cookie-parser'),// read cookies (needed for auth)
    session      = require('express-session'),

    configDB = require('./config/database.js'),

    dailyJob = require('cron').CronJob, //Allows time-based execution

    cronJob = require('./config/cronJob.js');

// *******************  Configuration *******************
//Create server
var app = express();

require('./config/passport')(passport); // pass passport for configuration


// Define route variables
//var routes = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.set('view engine', 'ejs'); // set up ejs for templating


//Connect to database
mongoose.connect(configDB.url);

//set up express application
//app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

app.use(bodyParser.urlencoded({ extended: false }));//parses request body and populates request.body
app.use(bodyParser.json());

//checks request.body for HTTP method overrides
app.use(methodOverride());

// required for passport
app.use(session({ secret: 'topsecretstocksecrets' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//Daily job
new dailyJob('00 01 00 * * *', cronJob.updateTargetDatePrice
    , null, true, 'America/New_York');

// *******************  Routes  *******************
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

//Where to serve static content
app.use( express.static( path.join( application_root, 'public') ) );

// *******************  Start server *******************
var port = 4444;
app.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});