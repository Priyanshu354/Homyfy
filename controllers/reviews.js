const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
    //console.log(req.params);
    let { id } = req.params;
    let listing = await Listing.findById(req.params.id);
    
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    //console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    //console.log("new review saved");
    req.flash("success", "new review created!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "review deleted");
    res.redirect(`/listings/${id}`);
};