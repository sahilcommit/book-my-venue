const Listing = require("./models/listings.js");
const expressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./schema.js"); 
const Review = require("./models/review.js");

// Middleware to ensure user is authenticated before accessing private routes
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to perform this action");
        return res.redirect("/login");
    }
    next();
};

// Saves the URL the user was trying to access to redirect them back after login
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// Authorization: Checks if the current user is the owner of the venue listing
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "Access denied: You do not have permission to edit this venue");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Server-side validation for listing data using Joi
module.exports.validateListing = (req, res, next) => {
    // Remove image property before Joi validation to prevent schema mismatch
    if (req.body.listing && req.body.listing.image) {
        delete req.body.listing.image;
    }

    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    }
    next();
};

// Server-side validation for review data using Joi
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body); 
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    } else {
        next();
    }
};

// Authorization: Ensures only the author of a review can delete it
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "Access denied: You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};