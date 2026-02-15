import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/connectDB";
import Product from "@/model/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session?.user?.id || !session?.user.email) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 400 },
      );
    }
    const formData = await req.formData();
    const productId = formData.get("productId") as string;
    const product = await Product.findById( productId);
    if (!product) {
      return NextResponse.json(
        { message: "No product found with this id" },
        { status: 400 },
      );
    }
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const category = formData.get("category") as string;
    const isWearable = formData.get("isWearable") === "true";
    const sizes = formData.getAll("sizes") as string[];
    const replacementDays = (formData.get("replacementDays") || "0");
    const freeDelivery = formData.get("freeDelivery") === "true";
    const warranty = (formData.get("warranty") as string) || "No warranty";
    const payOnDelivery = formData.get("payOnDelivery") === "true";
    const detailPoints = formData.getAll("detailPoints");
    const img1 = formData.get("image1") as Blob|null;
    const img2 = formData.get("image2") as Blob|null;
    const img3 = formData.get("image3") as Blob|null;
    const img4 = formData.get("image4") as Blob|null;

    if (
      !title ||
      !description ||
      price===undefined ||
      stock==undefined ||
      !category
    ) {
      return NextResponse.json(
        { message: "All fields and images are required" },
        { status: 400 },
      );
    }
    if (isWearable && sizes.length == 0) {
      return NextResponse.json(
        { message: "sizes are required for wearable products." },
        { status: 400 },
      );
    }
    let image1=product?.image1, image2=product?.image2, image3=product?.image3, image4=product?.image4;

    if(img1)image1 = await uploadOnCloudinary(img1);
    if(img2)image2 = await uploadOnCloudinary(img2);
    if(img3)image3 = await uploadOnCloudinary(img3);
    if(img4)image4 = await uploadOnCloudinary(img4);

    const UpdatedProduct = await Product.findByIdAndUpdate(
      productId ,
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
        vendor: session?.user?.id,
        isWearable,
        sizes: isWearable ? sizes : [],
        replacementDays,
        warranty,
        payOnDelivery,
        freeDelivery,
        detailsPoints: detailPoints,
        verificationStatus: "pending",
        isActive: false,
      },
      { new: true },
    );
    return NextResponse.json({ message: "Product updated" }, { status: 201 });
  } catch (error) {
    console.log(`Error updating product: ${error}`);
    return NextResponse.json({ messgae: "Product Update failed" }, { status: 500 });
  }
}
