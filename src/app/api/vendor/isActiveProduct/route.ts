import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import Product from "@/model/product.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    try {
        await connectDB();
        const session= await auth();
        if(!session?.user || !session?.user?.email ){
            return NextResponse.json({message:"Unauthorized"},{status:400})
        }
        const {productId, isActive}= await req.json();
        
        const product= await Product.findByIdAndUpdate(productId,
        {isActive}, {new:true});
        if(!product){
            return NextResponse.json({message:"Product not found."}, {status:400});
        }
        return NextResponse.json(product, {status:200})
    } catch (error) {
        console.log(`Error in updating active status of the product: ${error}`);
        return NextResponse.json({message:"Product active status update error."},{status:500});
    }
}