const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/', (req, res) => {
    res.locals.authenticated = req.isAuthenticated()
    res.render('login/index')
})

router.post('/', function(req, res) {
    passport.authenticate('local', function(err, user, info='') {
        req.login(user, function(err) { if (err) { return next(err); } });
        res.locals.authenticated = req.isAuthenticated()
        return res.render('login/index', info)
    })(req, res);
})


module.exports = router