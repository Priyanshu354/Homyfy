const Listing = require("./models/listing");
const review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be LoggedIn");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to do this");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to do this");
        return res.redirect(`/listings/${id}`);
    }
    
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to do this");
        return res.redirect(`/listings/${id}`);
    }
    
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params; 
    console.log(req.params);
    const listing = await Listing.findById(id); 
    const Review = await review.findById(reviewId); 

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    if (!Review) { 
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    if (!Review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to do this");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
