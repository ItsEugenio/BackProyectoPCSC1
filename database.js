import mongoose from "mongoose";
import config from "./config.js";

(async () => {
  try {
    const db = await mongoose.connect(config.mongodbURL);
    console.log("Database Connected", db.connection.name);
  } catch (error) {
    console.error(error);
  }
})();