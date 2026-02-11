import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/connectDB";
import Product from "@/model/product.model";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    try {
        await connectDB();
        const session = await auth();
        if(!session || !session?.user?.id || !session?.user.email){
            return NextResponse.json({message:"Unauthorized user"},{status:400});
        }
        const formData=await req.formData();
        const title=formData.get("title") as string;
        const description=formData.get("description");
        const price=formData.get("price");
        const stock=Number(formData.get("stock"));
        const category=formData.get("category") as string;
        const isWearable=formData.get("isWearable")==="true";
        const sizes=formData.getAll("sizes");
        const replacementDays=Number(formData.get("replacementDays")||0);
        const freeDelivery=formData.get("freeDelivery")==="true";
        const warranty= formData.get("warranty") as string || "No warranty";
        const payOnDelivery=formData.get("payOnDelivery")==="true";
        const detailPoints=formData.getAll("detailPoints");
        const img1=formData.get("image1") as Blob;
        const img2=formData.get("image2") as Blob;
        const img3=formData.get("image3") as Blob;
        const img4=formData.get("image4") as Blob;

        if(!title || !description || !price || !stock || !category || !img1 || !img2 || !img3 || !img4){
            return NextResponse.json({message:"All fields and images are required"},{status:400})
        }
        if(isWearable && sizes.length==0){
            return NextResponse.json({message:"sizes are required for wearable products."}, {status:400})
        }
        const image1=uploadOnCloudinary(img1);
        const image2=uploadOnCloudinary(img2);
        const image3=uploadOnCloudinary(img3);
        const image4=uploadOnCloudinary(img4);

        const product= await Product.create(
            {
                title,
                description,
                price,
                stock,
                isStockAvailable: stock > 0,
                image1,
                image2,
                image3,
                image4,
                category,
                vendor:session?.user?.id,
                isWearable,
                sizes: isWearable ? sizes : [],
                replacementDays,
                warranty,
                payOnDelivery,
                freeDelivery,
                detailPoints,
                verificationStatus:"pending",
                isActive:false,

            }
        )

        await User.findByIdAndUpdate(session.user.id,
            {
                $push :{vendorProducts: product._id}
            }, {new:true}
        )
        return NextResponse.json({product},{status:201});


        
    } catch (error) {
        return NextResponse.json({message:`failed to create new product: ${error}`},{status:500})
    }
    

}