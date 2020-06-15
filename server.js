if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// express
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override') // override post to put or delete
const bodyParser = require('body-parser')
// login
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const passportSetup = require('./config/passport-setup')
// router
const indexRouter = require('./routes/index.js')
const loginRouter = require('./routes/login')
const logoutRouter = require('./routes/logout')
const registerRouter = require('./routes/register')
const authorRouter = require('./routes/authors.js')
const bookRouter = require('./routes/books.js')

const app = express()

// express
app.set('view engine', 'ejs')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false })) // sending data via url to the server
app.use(bodyParser.json())

// mongoDB
const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection 
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

// passport Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: db })
}))
app.use(passport.initialize());
app.use(passport.session());
passportSetup

//routes
app.use('/', indexRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)
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