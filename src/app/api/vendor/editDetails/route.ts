import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest } from "next/server";


export async function POST(req:NextRequest){
    try {
        await connectDB();
        const {shopName, shopAddress, gstNumber}= await req.json();
        const session= await auth();
        if(!session?.user?.email){
            return new Response(JSON.stringify({message:"Unauthorized"}), {status:401});
        }
        const userEmail=session.user.email;
        const user=await User.findOne({email:userEmail});
        if(!user){
            return new Response(JSON.stringify({message:"User not found"}), {status:404});
        }
        const result= await User.findOneAndUpdate(
            {email:userEmail},
            {
                
                    shopName:shopName,
                    shopAddress:shopAddress,
                    gstNumber:gstNumber,
                    verificationStatus:"pending",
                    requestedAt: new Date(),
                
            },
            {new:true}
        );
        return new Response(JSON.stringify({message:"Vendor details updated successfully", result}), {status:200});


        
    } catch (error) {
        return new Response(JSON.stringify({message:`Edit Vendor details error: ${error}`}), {status:500});
    }
    

}