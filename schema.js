

// Schema for validating new and updated venue listings
const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        // Change this from Joi.number() to Joi.object()
        price: Joi.object({
            value: Joi.number().required().min(0),
            unit: Joi.string().valid('day', 'hour').required()
        }).required(),
        image: Joi.string().allow("", null)
    }).required()
});

// Schema for validating user-submitted venue reviews and ratings
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
  }).required(),
});