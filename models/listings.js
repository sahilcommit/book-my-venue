const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "listingimage",
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1697807646004-31ae73a1a625?q=80&w=2070&auto=format&fit=crop",
            set: (v) => v === "" ? "https://images.unsplash.com/photo-1697807646004-31ae73a1a625?q=80&w=2070&auto=format&fit=crop" : v,
        },
    },
    location: String,
    country: String,
    category: {
        type: String,
        enum: ["Event Halls", "Wedding Venues", "Concert Spaces", "Party Venues", "Corporate Events", "Banquet Halls", "Outdoor Venues", "Photo Shoots", "Others"],
        default: "Others"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    price: {
        value: {
            type: Number,
            required: true,
            min: 0
        },
        unit: {
            type: String,
            enum: ['day', 'hour'],
            default: 'day'
        }
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, 
{ 
    // This second argument enables virtuals to be visible 
    // when you convert the document to JSON or Objects
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
});

/**
 * Virtual: Average Rating Calculation
 * Calculates the mean rating from the reviews array on the fly.
 */
listingSchema.virtual("avgRating").get(function () {
    if (!this.reviews || this.reviews.length === 0) {
        return 0;
    }
    let sum = 0;
    for (let review of this.reviews) {
        sum += review.rating;
    }
    return (sum / this.reviews.length).toFixed(1); 
});

/**
 * Post-Middleware: Cascading Delete
 * Automatically removes associated reviews when a Listing is deleted.
 */
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;