import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("Connected to DB");
    });

    connection.on("error", (err) => {
      console.log("Error to connect to DB: " + err);
    });
  } catch (e) {
    console.log("Something went wrong to connect to DB: " + e);
  }
};
