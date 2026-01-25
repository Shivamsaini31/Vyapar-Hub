import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import React from "react";
import User from "@/model/user.model";
import { redirect } from "next/navigation";
import EditRoleAndPhone from "@/components/EditRoleAndPhone";
import Navbar from "@/components/Navbar";

export default async function Home() {
  await connectDB();
  const session = await auth();
  const user = await User.findById(session?.user?.id).lean();
  if (!user) {
    redirect("/login");
  }
  const inComplete =
    !user.role || !user.phone || (!user.phone && user.role == "user");
  if (inComplete) {
    return <EditRoleAndPhone />;
  }
  const plainUser=JSON.parse(JSON.stringify(user));
  return <div className="flex min-h-screen items-center justify-center 
  bg-gradient-to-br from-gray-900 via-black to-gray-900 font-sans flex-col">

    <Navbar user={plainUser}/>
  </div>;
}
