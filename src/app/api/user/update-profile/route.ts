// export const runtime = "nodejs";

import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await auth();
    if (!session || !session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    // console.log("Received form data:", formData);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const file = formData.get("image") as File | null;
    // console.log("image: ", file);

    if (!name || !phone) {
      return NextResponse.json(
        { message: "Name and phone are required" },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;
    if (file) {
      imageUrl = await uploadOnCloudinary(file);
      console.log("Uploaded image URL:", imageUrl);
      if (!imageUrl) {
        return NextResponse.json(
          { message: "Image upload failed" },
          { status: 500 }
        );
      }
    }

    const updateData: any = { name, phone };
    if (imageUrl) updateData.image = imageUrl;

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Profile updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
