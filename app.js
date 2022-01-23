if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize'); // Against mongo injection
const helmet = require('helment'); // against multiple security problems

const ejsMate = require("ejs-mate");
const methodOverride = require('method-override');
const ExpressError = require('./utilities/ExpressError');

const campgroundsRouter = require('./routes/campgrounds');
const reviewsRouter = require('./routes/reviews');
const usersRouter = require('./routes/users');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl, { useNewUrlParser: true,useUnifiedTopology: true })
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
app.use(mongoSanitize()); //security


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
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/douqbebwk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
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
        console.log(err)
        err.message = "Send me a message if you find this"
    }
    console.log(statusCode)
    res.status(statusCode)
    res.render('error', {err});
})

// Connecting to the server
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`Connected to port ${port}`);
})
