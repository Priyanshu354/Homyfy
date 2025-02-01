const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    console.log("connected to DB");
    await initDB();  // Call initDB after connection is established
  } catch (err) {
    console.error("Connection error", err);
  }
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
      ...obj, owner: "67503d52e42e4cd3387b7767"
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
  } catch (err) {
    console.error("Initialization error", err);
  }
}

main();
