import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextResponse } from "next/server";


export async function GET(){
    try {
        await connectDB();
        const admin=await User.findOne({role:"admin"});
        return NextResponse.json({
            exists:!!admin // forcefully converts admin to a boolean 
        })
    } catch (error) {
        return NextResponse.json({
            message:`check-admin error: ${error}`
        },
    {status:500}
);
    }
}