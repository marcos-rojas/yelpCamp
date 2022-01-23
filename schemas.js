const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');
const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
       "string.htmlStrip": "{{#label}} not contain any html tags"
    },
    rules: {
    scapeHTML: {
     validate(value, helpers) {
       const clean = sanitizeHtml(value, {
         allowedTags: [],
         allowedAttributes: {},
       });
       if (clean == value) {
         return clean;
       }
       return helpers.error("string.scapeHTML", {value})
     }
   } } } ) 

const Joi = BaseJoi.extend(extension);

const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().scapeHTML(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().scapeHTML(),
        description: Joi.string().required().scapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required().scapeHTML(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
})

module.exports.campgroundSchema = campgroundSchema;
module.exports.reviewSchema = reviewSchema;