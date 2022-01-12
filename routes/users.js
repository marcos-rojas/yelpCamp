const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utilities/catchAsync');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        console.log(password);
        req.flash('success', 'Welcome to yelpcamp');
        res.redirect('/campgrounds');
    }catch(e){
        req.flash('error', 'booh! '+ e.message);
        return res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});


router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}), (req, res) => {
    req.flash('success', 'Welcome back');
    res.redirect('/campgrounds');
});

router.get('/new', (req, res) => {
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be authenticated');
        res.redirect('/login');
    }
    res.render('campgrounds/new')
});
module.exports = router;