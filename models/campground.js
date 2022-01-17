const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
})
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

/* 
this is a virtual property not stores but calculated
each time we call it: like computed properties in Vue 
call a function and return a "computed" virtual property not stored
in real database
*/
ImageSchema.virtual('thumbnail').get( function(){
    return this.url.replace('/upload', '/upload/w_200/');
});


CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
});

const Campground =  mongoose.model('Campground', CampgroundSchema);
module.exports = Campground;
