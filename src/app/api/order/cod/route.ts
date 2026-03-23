import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import Order from "@/model/order.model";
import Product from "@/model/product.model";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){
    try {
        await connectDB();
        const session= await auth();
        if(!session || !session.user?.id || !session.user?.email){
            return NextResponse.json({message:"Unauthorized"}, {status:401});
        }
        const userId=session.user.id;
        const {
            productId,
            quantity,
            address,
            amount,
            deliveryCharge,
            serviceCharge,
        }= await req.json();
        if(!productId || !quantity){
            return NextResponse.json({message:"Product ID and quantity are required"}, {status:400});
        }
        if(!address || !address.name || !address.phone || !address.city || !address.pinCode || !address.address){
            return NextResponse.json({message:"Complete address details are required"}, {status:400});
        }
        if(
            typeof amount!=="number" ||
            typeof quantity!=="number" ||
            typeof deliveryCharge!=="number" ||
            typeof serviceCharge!=="number"
        ){
            return NextResponse.json({message:"Amount, quantity, delivery charge and service charge must be numbers"}, {status:400});
        }
        
        const user= await User.findById(userId);
        if(!user || !user.cart){
            return NextResponse.json({message:"User not found or cart is empty"}, {status:404});
        }
        const cartItem=user.cart.find((item:any)=>item.product._id.toString()===productId.toString());
        if(!cartItem){
            return NextResponse.json({message:"Product not found in cart"}, {status:404});
        }

        if(!cartItem){
            return NextResponse.json({message:"Product not found in cart"}, {status:404});
        }

        const product= await Product.findById(productId);
        if(!product){
            return NextResponse.json({message:"Product not found"}, {status:404});
        }
        if(product.stock<quantity){
            return NextResponse.json({message:"Insufficient stock"}, {status:400});
        }
        const productsTotal= product.price*quantity;

        const order= await Order.create({
            buyer:userId,
            products:[
                {
                    product:productId,
                    quantity:quantity,
                    price:product.price
                }
            ],
            productVendor:product.vendor,
            productsTotal:productsTotal,
            deliveryCharge:deliveryCharge,
            serviceCharge:serviceCharge,
            totalAmount:amount,
            address:address,
            paymentMethod:"cod",
            isPaid:false,
            orderStatus:"pending",
            returnedAmount:0,

        });

        await Product.findByIdAndUpdate(productId,{
            $inc:{stock:-quantity},
            isStockAvailable: product.stock-quantity>0
        });
        user.cart=user.cart.filter((item:any)=>item.product._id.toString()!==productId.toString());
        user.orders.push(order._id);
        await user.save();
        return NextResponse.json({message:"Order placed successfully", orderId:order._id}, {status:201});
        

    } catch (error) {
        return NextResponse.json({message:"Internal server error"}, {status:500});
    }
}