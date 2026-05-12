import connectDB from "@/lib/connectDB";
import { sendDeliveryOtpEmail } from "@/lib/mailer";
import Order from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){
    try {
        await connectDB();
        const {orderId, status}= await req.json();
        const order= await Order.findById(orderId).populate("buyer");
        if(!order){
            return NextResponse.json({message:"Order not found!"},{status: 404});

        }
        if(status==="shipped" || status==="confirmed"){
            order.orderStatus=status;
            await order.save();
            return NextResponse.json({message: "Status updated succesfully!"},{status: 200});
        }
        if(status==="delivered"){
            const otp= Math.floor(1000+Math.random()*9000).toString();
            order.deliveryOtp= otp;
            order.otpExpiresAt= new Date(Date.now()+10*60*1000);
            await order.save();
            const email= order.buyer?.email;
            if(!email){
                return NextResponse.json({message:"Buyer mail not found"},{
                    status:404
                })
            }
            await sendDeliveryOtpEmail(email,otp);
            return NextResponse.json({message:"Delivery OTP sent"},{status:200});
        }
        return NextResponse.json({message:"Invalid status"}, {status:400});

    } catch (error) {
        return NextResponse.json({message:`Failed to update order status:${error}`}, {status:500})
    }
}