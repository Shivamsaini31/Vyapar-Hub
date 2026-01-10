import connectDB from "@/lib/connectDB"
import { NextRequest, NextResponse } from "next/server"
import User from "@/model/user.model";
import bcrypt from "bcryptjs";


export async function POST(req:NextRequest){
    try{
        await connectDB();
    const {name, email, password}= await req.json();
    const existUser= await User.findOne({email});
    if(existUser){
        return NextResponse.json(
            {message:"User already exists"},
            {status:400}
        );
    }
    if(!name || !email || !password){
        return NextResponse.json({message:"All fields are required"}, {status:400});
    }
    const hashedPassword=await bcrypt.hash(password, 10);

    const newUser=await User.create({
        name, email,
        password:hashedPassword,
    });
    return NextResponse.json(
        {message:"User registered successfully", userId:newUser._id},
        {status:201}
    );
    } catch(error){
        console.log("Error in user registration:", error);
        return NextResponse.json(
            {message:"Internal Server Error"},
            {status:500}
        )
    }
    
    
}