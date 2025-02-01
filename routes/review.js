const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsyc = require("../utlis/wrapAsyc.js");
const ExpressError = require("../utlis/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

const validateReview = (req, res, next) => {
    //console.log(req.body);
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    } else {
        next();
    }
};

// create review
router.post("/",isLoggedIn, validateReview, wrapAsyc(reviewController.createReview));

// review delte route 
router.delete("/:reviewId",
    isLoggedIn,
    isAuthor,
    reviewController.deleteReview);


module.exports = router;