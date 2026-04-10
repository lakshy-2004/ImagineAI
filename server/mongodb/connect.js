import mongoose from "mongoose";

const connectDB = (url) => {
    mongoose.set('strictQuery', true); // controls the extra field querys which are not in schema

    mongoose.connect(url)
    .then(()=> console.log('Database Connected -----:'))
    .catch((err)=> console.log('Database Not Connected',err));
}

export default connectDB;