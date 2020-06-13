if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
// login
const passport = require('passport')
const session = require('express-session')

const indexRouter = require('./routes/index.js')
const loginRouter = require('./routes/login')
const registerRouter = require('./routes/register')
const authorRouter = require('./routes/authors.js')
const bookRouter = require('./routes/books.js')

// express
app.set('view engine', 'ejs')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
// sending data via url to the server
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
// passport Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

// mongoDB
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection 
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

//routes
app.use('/', indexRouter)
app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)


// server
const port = process.env.PORT || 5000
app.listen(port, () => {
    try {
        console.log(`Listening at http://localhost:${port}`)
    } catch (error) {
        console.log(error)
    }
})