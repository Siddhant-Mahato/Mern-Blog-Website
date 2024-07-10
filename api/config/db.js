import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
    }
    catch (err) {
        console.log(err);
    }
};

export default connectDB;
