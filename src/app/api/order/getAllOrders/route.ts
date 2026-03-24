import connectDB from "@/lib/connectDB";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import Order from "@/model/order.model";

export async function GET(){
    try {
        await connectDB();
        const session=await auth();
        if(!session || !session.user?.id || !session.user?.email){
            return NextResponse.json({message:"Unauthorized"}, {status:401});
        }
        const userId=session.user.id;
        const orders=await Order.find().populate("buyer", "name phone email image").populate("productVendor","name shopName email")
        .populate({
            path:"products.product",
            model:"Product",
            select: "title image1 price category stock vendor replacementDays"
        }).sort({createdAt:-1});
        return NextResponse.json(orders, {status:200});

    } catch (error) {
        return NextResponse.json({message:`Failed to fetch orders ${error}`}, {status:500});
    }
}