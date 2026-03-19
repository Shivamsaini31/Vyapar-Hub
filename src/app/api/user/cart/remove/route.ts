import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    try {
        await connectDB();
        const session=await auth();
        if(!session || !session?.user || !session?.user?.email){
            return NextResponse.json({message:"Unauthorized user"},{status:400});
        }
        const {productId}=await req.json();   
        if(!productId){
            return NextResponse.json({message:"Product Id is required."},{status:400});
        }
        const user=await User.findById(session?.user?.id);
        if(!user || !user.cart){
            return NextResponse.json({message:"User not found."},{status:400});
        }
        const item=user.cart.find((item:any)=>
            item.product?.toString()===productId.toString()
        ); 
        if(!item){
            return NextResponse.json({message:"Product not found in cart!"}, {status:400});
        }
        user.cart = user.cart.filter((cartItem: any) => cartItem.product?.toString() !== productId.toString());
        await user.save();
        return NextResponse.json({
            message:"Product removed from cart✅",
        }, {status:200}); 


    } catch (error) {
        console.error("Error updating cart:", error);
        return NextResponse.json({message:"Failed to update cart!"}, {status:500});
    }
}