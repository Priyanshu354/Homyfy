const Joi = require('joi');
const review = require('./models/review');

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
        image: Joi.string().uri().allow(''), // Allow empty string or valid URI
        price: Joi.number().positive().required(),
        location: Joi.string().required(),
        country: Joi.string().required()
    }).required()
});


module.exports = { listingSchema };

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
});

