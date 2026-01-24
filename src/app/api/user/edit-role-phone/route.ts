
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { auth } from "@/auth";
import User from "@/model/user.model";

export async function POST(req:NextRequest){
    try {
        const reqBody= await req.json();
        await connectDB();
        const {role, phone}=reqBody;
        const session= await auth();
        const user = await User.findOneAndUpdate({email:session?.user?.email}, {role, phone},{new:true});
        if(!user){
            return NextResponse.json({message:"User not found"},{status:404});
        }
        return NextResponse.json({message:"User updated successfully", user},{status:200});
    } catch (error) {
        return NextResponse.json({message:`Edit role and phone error ${error}.`},{status:500});
    }
}