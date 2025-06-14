import mongoose from "mongoose";
import "colors";

const databaseConnection= () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("✅ MongoDB connection successful".green.inverse);
    })
    .catch((err) => {
      console.error(`❌ Database connection error: ${err.message}`.red.bold);
      process.exit(1);
    });
};

export default databaseConnection

