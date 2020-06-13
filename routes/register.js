const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const router = express.Router()

router.get('/', (req, res) => {
    res.render('register/index')
})

router.post('/', async(req, res) => {
    try {
        let hashedPassword = await bcrypt.hash(req.body.password, 10)
        let user = new User({
            username: req.body.username,
            email:req.body.email,
            password: hashedPassword
        })
        await user.save()
        res.render('register', {message: 'Successful Register'})
    } catch (error) {
        res.render('register', {errorMessage: 'Failed Registering'})
    }
})

module.exports = router