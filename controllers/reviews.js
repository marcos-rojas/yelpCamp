const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createdReview = async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', 'You review has been save');
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.deleteReview = async (req, res) =>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'You review has been deleted');
    res.redirect(`/campgrounds/${id}`);
};

