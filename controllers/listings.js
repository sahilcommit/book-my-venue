const Listing = require("../models/listings.js");
const { cloudinary } = require("../cloudConfig");

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

// POST: Save new venue to DB with Cloudinary image
module.exports.createListing = async (req, res) => {
    const url = req.file.path;
    const filename = req.file.filename;
    
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id; 
    newlisting.image = { url, filename };
    
    await newlisting.save();
    req.flash("success", "New Venue Added Successfully!");
    res.redirect("/listings");
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
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

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