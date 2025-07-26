import mongoose from "mongoose";


const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODP_URI}/mern-auth`)
        console.log(`\nMongoDb connected || Host : ${connectionInstance.Connection.host}`);
        // console.log(connectionInstance.connection);
    } catch (error) {
        console.log("MONGODB CONNECTION FAILED",error);
        process.exit(1);
        
    }
}
export default connectDB;