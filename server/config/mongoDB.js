import mongoose from 'mongoose'

const connectDB = async () => {
    await mongoose.connect(process.env.MongoDB_URI)
        .then(() => console.log("MongoDB connected"))
        .catch(err => console.error("MongoDB connection error:", err));
}

export default connectDB;