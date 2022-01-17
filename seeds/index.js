const mongoose = require('mongoose');
const axios = require('axios').default;
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect("mongodb://localhost:27017/yelp-camp", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('database connection open');
    })
    .catch(err => {
        console.log('Oh no mongo error');
        console.log(err);
    })
const sample = (arr) => (arr[Math.floor(Math.random() * arr.length)]);

async function seedImg() {
    try {
        const resp = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: '',
                // client_id: 'djwskD_P9_4dluHpa5QxNe_4ZA4wa77s1WOn6S3s4Z0',
                collections: 1114848,
            },
        })
        return resp.data.urls.small
    } catch (err) {
        console.error(err)
    }
}

const seedDB = async function () {
    await Campground.deleteMany({});
    for (let i = 0; i < 15; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "61defb94c9887f17f1de89e7",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Nothing quite gets you into the holiday spirit like going to a Christmas festival. Walking down a candy cane lane, snapping photos with Santa, riding a holiday train, sipping hot chocolate while enjoying spectacular holiday lights - these are classic holiday moments that you and the entire family will forever cherish.",
            price: price,
            images: [  
                {
                  url: 'https://res.cloudinary.com/dw9nm5hzr/image/upload/v1642096322/YelpCamp/ixfpfsuvk7s3tojnepov.jpg',
                  filename: 'YelpCamp/ixfpfsuvk7s3tojnepov',
                },
                {
                  url: 'https://res.cloudinary.com/dw9nm5hzr/image/upload/v1642096322/YelpCamp/tk52qxfih7uar2bs5vkg.jpg',
                  filename: 'YelpCamp/tk52qxfih7uar2bs5vkg',
                }
              ]
        });
        await camp.save();
    }
}
seedDB().then(() => {
    console.log('Closing DB')
    mongoose.connection.close();
});