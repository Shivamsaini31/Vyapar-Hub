import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import Product from "@/model/product.model";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    try {
        await connectDB();
        const session=await auth();
        if(session?.user?.role!=="admin"){
            return NextResponse.json({message:"Unauthorized"}, {status:401});
        }
        const {productId, status, rejectReason}=await req.json();
        if(!productId || !status){
            return NextResponse.json({message:"Product ID and status are required"}, {status:400});
        }
        const product=await Product.findById(productId);
        if(status==="approved"){
            product.verificationStatus="approved";
            product.approvedAt=new Date();
            product.rejectedReason="";
            await product.save();
            return NextResponse.json({message:"Vendor approved successfully"}, {status:200});
        }
        if(status==="rejected"){
            product.verificationStatus="rejected";
            product.rejectedReason=rejectReason || "rejected by admin";
            await product.save();
            return NextResponse.json({message:"Vendor rejected successfully"}, {status:200});
        }
        return NextResponse.json({message:"Product status updated successfully", product}, {status:200});


    } catch (error) {
        console.log(`Error in updating product status: ${error}`)
        return NextResponse.json({message:`Error updating product status ${error}`}, {status:500});
    }
}