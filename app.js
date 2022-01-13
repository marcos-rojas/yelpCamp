const PORT = 3000;
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user');

const ejsMate = require("ejs-mate");
const methodOverride = require('method-override');
const ExpressError = require('./utilities/ExpressError');

const campgroundsRouter = require('./routes/campgrounds');
const reviewsRouter = require('./routes/reviews');
const usersRouter = require('./routes/users');

mongoose.connect("mongodb://localhost:27017/yelp-camp", { useNewUrlParser: true,
                                                         useUnifiedTopology: true })
    .then(() => {
        console.log('database connection open');
    })
    .catch(err => {
        console.log('Oh no mongoDB error');
        console.log(err);
    })

const app = express();

// View EJS engine, body parser and allow CRUD methods
// as well as static assets
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

//Session (express-session) and cookies, flash options(connect-flash)
const sessionConfig = {
    secret: 'holamundo',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now()+1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));

// Middleware for our session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for our flash objects
app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Routes to work with


app.use('/', usersRouter);
app.use('/campgrounds', campgroundsRouter);
app.use('/campgrounds/:id/reviews', reviewsRouter);

app.get('/', (req, res) => {
    res.render('home')
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not Found', 404));
});

// Middleware for errors
app.use((err, req, res, next) =>{
    const {statusCode = 500} = err;
    if(!err.message){
        err.message = 'Something went really wrong'
    }
    if(!(err instanceof ExpressError)){
       // console.log(err)
        err.message = "Send me a message if you find this"
    }
    console.log(statusCode)
    res.status(statusCode)
    res.render('error', {err});
})

// Connecting to the server
app.listen(PORT, function () {
    console.log(`Connected to port ${PORT}`);
})
