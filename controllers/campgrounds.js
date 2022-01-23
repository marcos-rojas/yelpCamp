const Campground = require('../models/campground');
const {cloudinary} = require("../cloudinary")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder =  mbxGeocoding({accessToken: mapBoxToken});

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
};

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: 'Yosemite, CA',
        limit: 1,
    }).send();
    //if(!req.body.campground) throw new ExpressError('Invalid campground Data', 400)
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    
    campground.images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    console.log(campground)
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Succesfully created a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {path: 'author'}
    }).populate('author');
    
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
};

module.exports.updateCampground = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground
    });
    const images = req.files.map(f => ({
        url: f.path,
        filename: f.filename}));
    campground.images.push(...images);
    await campground.save();

    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull: {images:{filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Succesfully updated a new campground');
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Succesfully deleted a new campground');
    res.redirect('/campgrounds');
};