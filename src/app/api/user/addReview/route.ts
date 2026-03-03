import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/connectDB";
import Product from "@/model/product.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    try {
        await connectDB();
        const session = await auth();
        if(!session?.user || !session.user.email){
            return NextResponse.json({message:"Unauthorized"}, {status:401});
        }
        const userId=session.user?.id;
        const formData=await req.formData();

        const productId= formData.get("productId") as string;
        const rating= Number(formData.get("rating"));
        const comment= formData.get("comment") as string;
        const imageFile= formData.get("image") as File | null;

        if(!productId){
            return NextResponse.json({message:"Product ID is required"}, {status:400});
        }
        if(!rating || rating < 1 || rating > 5){
            return NextResponse.json({message:"Rating must be between 1 and 5"}, {status:400});
        }

        if(!comment || comment.trim().length===0){
            return NextResponse.json({message:"Comment is required"}, {status:400});
        }

        let imageUrl;
        if(imageFile){
            imageUrl= await uploadOnCloudinary(imageFile);
        }
        

        const product=await Product.findByIdAndUpdate(productId,{
            $push:{
                reviews:{
                    user:userId,
                    rating,
                    comment,
                    image:imageFile ? URL.createObjectURL(imageFile) : undefined,
                    createdAt:new Date(),
                }
            }
        },{new:true});
        await product?.save();
        return NextResponse.json({message:"Review added successfully", product});
    } catch (error) {
        console.log(`Error in adding reviews: ${error}`);
        return NextResponse.json({message:"Internal Server Error"}, {status:500});
    }
}