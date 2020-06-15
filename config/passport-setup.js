const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

// passport Strategies
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, async function (err, user) {
            if (err) { return done(err) }
            if (!user) { return done(null, false, { errorMessage: 'Incorrect username' }) } 
            if (! await user.validPassword(password)) { return done(null, false, { errorMessage: 'Incorrect password' }) }
            return done(null, user, { message: 'Successful Login' })
        });
    }
))
// passport login
passport.serializeUser(function(user, done) { done(null, user.id) });
passport.deserializeUser(function(id, done) { 
    User.findById(id, function(err, user) { done(err, user) }) 
})