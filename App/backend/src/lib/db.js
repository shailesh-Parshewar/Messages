import mongoose from "mongoose";
export const connectDB = async () => {
    try {
       const c = await mongoose.connect(process.env.MONGODB_URI)
       console.log(`mongoDB connected successfully ${c.connection.host}`)
    } catch (err) {
      console.error(`could not connect ERROR : ${err.message}`)   
    }
}