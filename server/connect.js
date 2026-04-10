import mongoose from "mongoose";

let isConnected = false;

const connectDB = async (url) => {
  mongoose.set('strictQuery', true);

  if (isConnected) return;

  try {
    await mongoose.connect(url, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('Database Connected');
  } catch (err) {
    isConnected = false;
    console.log('Database Not Connected', err);
    throw err;
  }
}

export default connectDB;