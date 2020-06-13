const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

router.get('/', (req, res) => {
    res.render('login/index')
})
router.post('/', function(req, res) {
    passport.authenticate('local', function(err, user, info='') {
        return res.render('login/index', info)
    })(req, res);
})

// passport Strategies
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err) }
            if (!user) { return done(null, false, { errorMessage: 'Incorrect username' }) }            
            if (!bcrypt.compare(password, user.password)) { return done(null, false, { errorMessage: 'Incorrect password' }) }
            return done(null, user, { message: 'Successful Login' })
        });
    }
))

// passport login
passport.serializeUser(function(user, done) { done(null, user.id) });
passport.deserializeUser(function(id, done) { User.findById(id, function(err, user) { done(err, user) }) })

module.exports = router