const Listing = require("../models/listings.js");
const { cloudinary } = require("../cloudConfig");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// GET: Display all venues or search results
module.exports.index = async (req, res) => {
    let { search } = req.query;
    let AllListings;

    if (search) {
        // Advanced search across multiple fields
        AllListings = await Listing.find({
            $or: [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } }
            ]
        });
    } else {
        AllListings = await Listing.find({});
    }

    if (AllListings.length === 0 && search) {
        req.flash("error", "No venues match your search!");
        return res.redirect("/listings");
    }

    res.render("listings/index.ejs", { AllListings });
};

// GET: Render form to create new venue
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// GET: Show detailed info for one venue
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    // Nested population: Get reviews, review authors, AND the venue owner
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "The venue you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

// POST: Save new venue with Geocoding AND Cloudinary Image
module.exports.createListing = async (req, res, next) => {
    try {
        //  Geocoding: Get coordinates from Mapbox
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        }).send();

        // Validation: Check if Mapbox found the location
        if (!response.body.features.length) {
            req.flash("error", "Location not found! Please enter a valid address.");
            return res.redirect("/listings/new");
        }

        //  Image: Get Cloudinary data from Multer
        const url = req.file.path;
        const filename = req.file.filename;

        // Create the listing object
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id; 
        newListing.image = { url, filename };

        //  Save the Mapbox coordinates (GeoJSON)
        // If Mapbox finds nothing,  provide a fallback or let it error
        if (response.body.features.length > 0) {
            newListing.geometry = response.body.features[0].geometry;
        }

        await newListing.save();
        req.flash("success", "New Venue Added Successfully!");
        res.redirect("/listings");
    } catch (err) {
        next(err); 
    }
};

// GET: Render edit form with image transformation
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash("error", "Venue not found or no longer available.");
        return res.redirect("/listings");
    }

    // Cloudinary Image Transformation for the preview
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/w_250,h_200,c_fill");
    
    res.render("listings/edit.ejs", { listing, originalUrl });
};

// PUT: Update venue details and handle image replacement
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    
    // Re-calculate coordinates based on the NEW location
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();

    //Validation: Check if Mapbox found the location
    if (!response.body.features.length) {
        req.flash("error", "Location not found! Please enter a valid address.");
        return res.redirect(`/listings/${id}/edit`);
    }

    //Update the listing text and location fields
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    //  Save the new coordinates into the listing
    if (response.body.features.length > 0) {
        listing.geometry = response.body.features[0].geometry;
    }

    if (req.file) {
        // Delete old image from Cloudinary to save storage space
        if (listing.image && listing.image.filename) {
            await cloudinary.uploader.destroy(listing.image.filename);
        }
    
        // Update with new image data
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listing.save();
    }
    await listing.save();
    req.flash("success", "Venue Details Updated!");
    res.redirect(`/listings/${id}`);
};

// DELETE: Remove venue and its image from Cloudinary
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (listing.image && listing.image.filename) {
        await cloudinary.uploader.destroy(listing.image.filename);
    }

    await Listing.findByIdAndDelete(id);
    req.flash("success", "Venue Listing Deleted!");
    res.redirect("/listings");
};