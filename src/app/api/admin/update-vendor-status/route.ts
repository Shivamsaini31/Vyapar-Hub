import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    try {
        await connectDB();
        const session=await auth();
        if(session?.user?.role!=="admin"){
            return NextResponse.json({message:"Unauthorized"}, {status:401});
        }
        const {vendorId, status, rejectReason}=await req.json();
        if(!vendorId || !status){
            return NextResponse.json({message:"Vendor ID and status are required"}, {status:400});
        }
        const vendor=await User.findById(vendorId);
        if(status==="approved"){
            vendor.verificationStatus="approved";
            vendor.approvedAt=new Date();
            vendor.rejectedReason="";
            await vendor.save();
            return NextResponse.json({message:"Vendor approved successfully"}, {status:200});
        }
        if(status==="rejected"){
            vendor.verificationStatus="rejected";
            vendor.rejectedReason=rejectReason || "rejected by admin";
            await vendor.save();
            return NextResponse.json({message:"Vendor rejected successfully"}, {status:200});
        }
        return NextResponse.json({message:"Vendor status updated successfully", vendor}, {status:200});


    } catch (error) {
        return NextResponse.json({message:`Error updating vendor status ${error}`}, {status:500});
    }
}