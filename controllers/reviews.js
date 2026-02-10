const Listing = require("../models/listings.js");
const Review = require("../models/review.js");

// POST: Create a new review and link it to a venue
module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); 
    
    // Assign the current logged-in user as the review author
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

// DELETE: Remove a review and update the listing's review array
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    // Remove the reference to the review from the Listing's reviews array
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    
    // Delete the actual review document
    await Review.findByIdAndDelete(reviewId);
    
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
};