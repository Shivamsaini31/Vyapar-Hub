import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import Product from "@/model/product.model";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectDB();
        const session= await auth();
        if(!session || !session?.user || !session?.user?.email){
            return NextResponse.json({message:"Unauthorized user"},{status:400});
        }
        const {productId, quantity=1}=await req.json();
        if(!productId){
            return NextResponse.json({message:"Product Id is required."},{status:400});
        }
        const user= await User.findById(session?.user?.id);
        if(!productId){
            return NextResponse.json({message:"User not found."},{status:400});
        }
        const product= await Product.findById(productId);
        if(!product){
            return NextResponse.json({message:"Product not found!"}, {status:400}); 
        }
        const existingProduct=await user.cart.find((item:any)=>
            item.product?.toString()===productId.toString()
        )
        if(existingProduct){
            existingProduct.quantity+=quantity;
        } else{
            user.cart.push({
                product: product._id,
                quantity
            })
        }
        await user.save();
        return NextResponse.json({
            message:"Product Added to cart✅",
        }, {status:201});

    } catch (error) {
        return NextResponse.json({
            message:`Failed to add product in cart: ${error}`
        },{status:500});
    }

}