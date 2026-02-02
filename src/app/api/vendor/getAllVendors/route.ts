import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        await connectDB();
        const vendors= await User.find({role:"vendor"}).sort({createdAt:-1}).select("-password");
        if(!vendors){
            return NextResponse.json({message:"No vendors found"}, {status:404})
        }
        return  NextResponse.json({vendors}, {status:200});

    } catch (error) {
        return NextResponse.json({message:`Error fetching vendors: ${error}`}, {status:500});
    }
}