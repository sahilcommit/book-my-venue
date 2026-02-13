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
            enum: ['day', 'hour'], // Only allows these two values
            default: 'day'
        }
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

/**
 * Post-Middleware: Cascading Delete
 * When a Listing is deleted, this automatically removes all associated reviews 
 * from the database to prevent "orphan" data.
 */
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;