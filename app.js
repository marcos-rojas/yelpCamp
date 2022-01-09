const PORT = 3000;
const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const ejsMate = require("ejs-mate");
const methodOverride = require('method-override')
const Campground = require('./models/campground')
const ExpressError = require('./utilities/ExpressError');
const catchAsync = require('./utilities/catchAsync');
const {campgroundSchema} = require('./schemas.js');

mongoose.connect("mongodb://localhost:27017/yelp-camp", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('database connection open');
    })
    .catch(err => {
        console.log('Oh no mongoDB error');
        console.log(err);
    })

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'))

const validateCampground = (req, res, nect) =>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', catchAsync( async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}));

app.get('/campgrounds/new', (req, res, next) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    //if(!req.body.campground) throw new ExpressError('Invalid campground Data', 400)
    const campground = new Campground(req.body.campground)
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/campgrounds/:id', catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', {campground})
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async(req, res) => {
    const {id} = req.params;
    const campground = req.body.campground;
    const campgroundUpdated = await Campground.findByIdAndUpdate(id, {
        ...campground
    })
    res.redirect(`/campgrounds/${campgroundUpdated._id}`)
}))

app.get('/campgrounds/:id/edit', catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', {campground})
}))

app.delete('/campgrounds/:id',catchAsync( async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not Found', 404));
})

app.use((err, req, res, next) =>{
    const {statusCode = 500} = err;
    if(!err.message){
        err.message = 'Something went really wrong'
    }
    if(!(err instanceof ExpressError)){
        err.message = "Send me a message if you find this"
    }
    res.status(statusCode)
    res.render('error', {err});
})

app.listen(PORT, function () {
    console.log(`Connected to port ${PORT}`);
})
