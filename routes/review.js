const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js"); 
const reviewController = require("../controllers/reviews.js");

/**
 * REVIEW ROUTES
 * Parent Route: /listings/:id/reviews
 */

// POST Route: Create a new review for a specific venue
router.post(
    "/", 
    isLoggedIn, 
    validateReview, 
    wrapAsync(reviewController.createReview)
);

// DELETE Route: Remove a specific review
router.delete(
    "/:reviewId", 
    isLoggedIn, 
    isReviewAuthor, 
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;