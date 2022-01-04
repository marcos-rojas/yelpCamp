const PORT = 3000;
const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const ejsMate = require("ejs-mate")
const methodOverride = require('method-override')
const Campground = require('./models/campground')

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
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground)
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id', async(req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', {campground})
})

app.put('/campgrounds/:id', async(req, res) => {
    const {id} = req.params;
    const campground = req.body.campground;
    const campgroundUpdated = await Campground.findByIdAndUpdate(id, {
        ...campground
    })
    res.redirect(`/campgrounds/${campgroundUpdated._id}`)
})

app.get('/campgrounds/:id/edit', async(req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', {campground})
})

app.delete('/campgrounds/:id', async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})

app.get('*', async(req, res) => {
    res.send('404 amigo')
})
app.listen(PORT, function () {
    console.log(`Connected to port ${PORT}`);
})
