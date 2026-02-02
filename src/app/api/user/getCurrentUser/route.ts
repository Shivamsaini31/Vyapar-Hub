import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextResponse } from "next/server";


export  async function GET() {
    try {
        await connectDB();
        const session = await auth();
        const user= await User.findOne({email:session?.user?.email}).select("-password");
        if(!user){
            return new Response(JSON.stringify({message:"User not found"}), {status:404});
        }
        return new NextResponse(JSON.stringify({user}), {status:200});

    } catch (error) {
        return new NextResponse(JSON.stringify({message:`Get current user error: ${error}`}), {status:500}); 
    }

}