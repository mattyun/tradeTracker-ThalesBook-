/**
 * Created by matthewyun on 4/27/16.
 */
// app/routes.js
module.exports = function(app, passport) {

    // load Holdings model
    var Holdings = require('../models/holding');


    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        //res.render('index'); // load the index.jade file
        // render the page and pass in any flash data if it exists
        res.render('login', { message: req.flash('loginMessage') });
    });

    // =====================================
    // ABOUT ===============================
    // =====================================
    app.get('/about', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('about');
    });
    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/selection', // redirect to the secure selection section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/selection', // redirect to the secure selection section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/selection', isLoggedIn, function(req, res) {
        res.render('selection', {
            user : req.user, // get the user out of session and pass to template
            message: req.flash('loginMessage')
        });
    });

    app.get('/portfolio', isLoggedIn, function(req, res) {
        res.render('portfolio', {
            user : req.user, // get the user out of session and pass to template
            message: req.flash('loginMessage')
        });
    });


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // SAVE NEW POSITION ===================
    // =====================================

    //Insert a new position
    app.post('/api/position', function( request, response ) {
        var question = new Holdings({
            Name: request.body.Name,
            Symbol: request.body.Symbol,
            LastPrice: request.body.LastPrice,
            Outlook: request.body.Outlook,
            Impact: request.body.Impact,
            CurrentDate: request.body.CurrentDate,
            Date: request.body.Date,
            Notes: request.body.Notes,
            ID: request.user._id
        });

        question.save( function( err ) {
            if( !err ) {
//                response.redirect('portfolio');
                response.send('position posted')
                return console.log( 'created' );
            } else {
                return console.log( err );
            }
        });
    });

    // =====================================
    // GET POSITIONS =======================
    // =====================================

    app.get('/api/position', isLoggedIn, function(request, response) {
         return Holdings.find({ID: request.user._id}, function( err, positions ) {
            if( !err ) {
                return response.send( positions);
            } else {
                return console.log( err );
            }
        });
    });

    // =====================================
    // DELETE A POSITION ===================
    // =====================================
//    app.delete( '/api/position/:id', function(request, response ) {
//        console.log( 'Deleting book with id: ' + request.params.id );
//        return Holdings.find({_id:request.params.id}, function( err, pos ) {
//            return pos.remove( function( err ) {
//                if( !err ) {
//                    console.log( 'Book removed' );
//                    return response.send( '' );
//                } else {
//                    console.log( err );
//                }
//            });
//        });
//    });


    app.delete('/api/position/:id', function(request, response ) {
        console.log( 'Deleting book with id: ' + request.params.id );
//        Holdings.remove({_id:'ObjectId('+request.params.id+')}'},(function(err){
//        Holdings.remove({Symbol:'S'},(function(err){
        Holdings.remove({_id:request.params.id},(function(err){
            if( !err ) {
                console.log( 'Book removed' );
                return response.send( '' );
            } else {
                console.log( err );
            }
        }));
//            pos.remove( function( err ) {
//                if( !err ) {
//                    console.log( 'Book removed' );
//                    return response.send( '' );
//                } else {
//                    console.log( err );
//                }
//            });
//        });
    });

};
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


