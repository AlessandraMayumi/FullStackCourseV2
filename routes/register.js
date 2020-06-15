const express = require('express')
const User = require('../models/user')

const router = express.Router()

router.get('/', (req, res) => {
    req.logout();
    res.render('register/index')
})

router.post('/', async(req, res) => {
    try {
        let user = new User({
            username: req.body.username,
            email:req.body.email,
            password:req.body.password,
        })
        await user.save()
        res.render('register', {message: 'Successful Register'})
    } catch (error) {
        res.render('register', {errorMessage: 'Failed Registering'})
    }
})

module.exports = router