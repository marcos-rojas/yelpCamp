
const User = require('../models/user');

module.exports.renderNewForm = (req, res) => {
    res.render('users/register');
};

module.exports.createUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to yelpcamp');
            res.redirect('/campgrounds');
        });
    } catch (e) {
        req.flash('error', 'booh! ' + e.message);
        return res.redirect('/register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Hope to see you again');
    res.redirect('/campgrounds');
};