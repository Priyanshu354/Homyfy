const { model } = require("mongoose");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });


module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs");
};

module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");

    //console.log(listing);
    if(!listing){
        req.flash("error", "listing not exist!");
        res.redirect("/listings");
    }
    else res.render("listing/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => { 
    const { title, description, image, price, location, country } = req.body.listing;
    const url = req.file.path;
    const filename = req.file.filename;

    let response = await geocodingClient.forwardGeocode({
        query: location,
        limit: 1
    }).send();

    const newListing = new Listing({
        title,
        description,
        image: {
            url,
            filename
        },
        price: Number(price),
        location,
        country,
        geometry: response.body.features[0].geometry,
    });

    newListing.owner = req.user._id;


    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

module.exports.editListings = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "listing not exist!");
        res.redirect("/listings");
    }

    let OrignalImageUrl = listing.image.url;
    OrignalImageUrl = OrignalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listing/edit.ejs", { listing, OrignalImageUrl });
};

module.exports.updateListings = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, location, country } = req.body.listing;
        const file = req.file;

        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.status(404).redirect("/listings");
        }

        if (!listing.owner.equals(res.locals.currUser._id)) {
            req.flash("error", "You do not have permission to update this listing");
            return res.status(403).redirect("/listings");
        }

        listing.title = title || listing.title;
        listing.description = description || listing.description;
        listing.price = price ? Number(price) : listing.price;
        listing.location = location || listing.location;
        listing.country = country || listing.country;

        if (file) {
            listing.image.url = file.path;
            listing.image.filename = file.filename;
        }

        await listing.save();
        req.flash("success", "Listing updated successfully");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        req.flash("error", "An error occurred while updating the listing");
        res.status(500).redirect("/listings");
    }
};


module.exports.deleteListings = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    if(!listing){
        req.flash("error", "listing not exist!");
        res.redirect("/listings");
    }
    else {
        req.flash("success", "listing deleted succesfully");
        res.redirect("/listings");
    }
};