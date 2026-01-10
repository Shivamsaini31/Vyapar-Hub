import mongoose from "mongoose";
const mongoDBURI= process.env.MONGODB_URI;

if(!mongoDBURI){
    throw new Error("MONGODB_URI is not defined in environment variables");
}

let cached= global.mongoose;

// Initialize the global mongoose cache object if it doesn't exist
if(!cached){
    cached = global.mongoose= {conn:null, promise:null};
}

const connectDB=async()=>{
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise){
        cached.promise= mongoose.connect(mongoDBURI).then((conn)=>conn.connection);
    }
    try{
        const conn=await cached.promise;
        cached.conn=conn;
        return conn;
    } catch(error){
        console.log("Error connecting DB:", error);
    }
}

export default connectDB;