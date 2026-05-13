import connectDB from "@/lib/connectDB";
import Order from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    try {
        await connectDB();
        const {otp, orderId}= await req.json();
        if(!orderId || !otp){
            return NextResponse.json({message:"Both OTP and order Id must be provided."}, {status:400});
        }
        const order= await Order.findById(orderId);
        if(!order){
            return NextResponse.json({message:"Order does not exist."}, {status:404});
        }
        // console.log(orderId);
        // console.log(order._id);
        console.log(order.deliveryOtp);
        // console.log(otp);
        if(order.deliveryOtp !==otp || !order.otpExpiresAt || order.otpExpiresAt<new Date()){
            
            return NextResponse.json({message:"Invalid or expired otp"},{status:400});
        }
        order.orderStatus="delivered";
        order.isPaid=true;
        order.deliveryDate= new Date();
        order.deliveryOtp= undefined;
        order.otpExpiresAt= undefined;
        await order.save();
        return NextResponse.json({message:"Order delivered!"}, {status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message:`Error updating Order delivery status: ${error}`}, {status:500});
    }
}