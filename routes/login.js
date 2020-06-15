const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/', (req, res) => {
    res.render('login/index')
})

// https://dev.to/jakesweb/user-authentication-with-expressjs-44od
router.post('/', function(req, res) {
    passport.authenticate('local', function(err, user, info='') {
        req.login(user, function(err) {
            if (err) { return next(err); }
          });
        return res.render('login/index', info)
    })(req, res);
})


module.exports = router