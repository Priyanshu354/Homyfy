const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsyc = require("../utlis/wrapAsyc.js"); 
const ExpressError = require("../utlis/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const  listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    } else {
        next();
    }
};

// Listings Route
router
    .route("/")
    .get(wrapAsyc(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsyc(listingController.createListing)
    );

// Listing New
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show Route
router.get("/:id", wrapAsyc(listingController.showListings));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsyc(listingController.editListings));

// Update Route
router.put("/:id", isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsyc(listingController.updateListings));

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsyc(listingController.deleteListings));


module.exports = router;
