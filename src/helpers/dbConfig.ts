import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      dbName: process.env.MONGO_DB_NAME,
    });

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("Connected to DB");
    });

    connection.on("error", (err) => {
      console.log("Error to connect to DB: " + err);
      process.exit();
    });
  } catch (e) {
    console.log("Something went wrong to connect to DB: " + e);
  }
};
