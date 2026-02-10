const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Load environment variables in development mode
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// Cloudinary account configuration using environment variables
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Configure storage parameters for Multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "BookMyVenue_Assets", // Updated for brand consistency
        allowedFormats: ["png", "jpg", "jpeg"],
    },
});

module.exports = {
    cloudinary,
    storage,
};