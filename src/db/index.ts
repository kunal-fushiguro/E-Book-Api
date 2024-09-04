import mongoose from "mongoose";
import { MONGODB_URL } from "../../config/env";

async function connectDatabase() {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected.");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Error in database connecting : " + err);
    });
    await mongoose.connect(MONGODB_URL || "", { dbName: "EBook" });
  } catch (error) {
    console.error("Failed to connect database : " + error);
    process.exit(1);
  }
}

export { connectDatabase };
