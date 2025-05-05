require("dotenv").config({ path: "../.env" });

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL;
console.log("ATLASDB_URL:", process.env.ATLASDB_URL);

// Check if dbUrl is defined
if (!dbUrl) {
  console.error("MongoDB connection string (ATLASDB_URL) is not defined in .env");
  process.exit(1); // Exit the process if the connection string is missing
} else {
  console.log("ATLASDB_URL loaded successfully:", dbUrl); // Confirm if it's loaded correctly
}

async function main() {
  try {
    // Establish MongoDB connection
    await mongoose.connect(dbUrl);
    console.log("Connected to DB");

    // Initialize database with data after successful connection
    await initDB(); 
  } catch (err) {
    console.error("Connection error", err);
  }
}

// Initialize the database by inserting data
const initDB = async () => {
  try {
    // Delete existing data (if any)
    await Listing.deleteMany({});
    
    // Add owner field to the data
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "6817c37ecc7b8f33af8df05e" // You can change the owner ID as needed
    }));
    
    // Insert the data
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
  } catch (err) {
    console.error("Initialization error", err);
  }
}

// Call the main function to start the process
main();
