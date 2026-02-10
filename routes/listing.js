const express = require("express");
const router = express.Router();
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

// Root Routes: Handles the main venue gallery and new venue creation
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn, 
        upload.single('listing[image]'), 
        validateListing, 
        wrapAsync(listingController.createListing)
    );

// Render the form to create a new venue listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

// ID-Specific Routes: Handles viewing, updating, and deleting individual venues
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn, 
        isOwner, 
        upload.single('listing[image]'), 
        validateListing, 
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn, 
        isOwner, 
        wrapAsync(listingController.destroyListing)
    );

// Render the form to edit an existing venue
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;