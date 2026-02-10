
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config({ path: "../.env" }); 
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");


const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
      console.log("connected to DB");
      initDB(); 
  })
  .catch(err => console.log("Connection Error:", err));

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  try {
      await Listing.deleteMany({});
      
      // Mapping owner ID to every listing
      initData.data = initData.data.map((obj) => ({
          ...obj, 
          owner: "698b08d44c3696610ea1fafa"
      }));

      await Listing.insertMany(initData.data);
      console.log("Data was initialized successfully!");
  } catch (err) {
      console.log("Initialization Error:", err);
  }
};