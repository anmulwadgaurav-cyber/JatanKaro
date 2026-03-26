import mongoose from "mongoose";

function connectToMongoDB() {
  mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB Connected Successfully");
}

export default connectToMongoDB;
