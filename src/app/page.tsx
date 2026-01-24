import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import React from "react";
import User from "@/model/user.model";
import { redirect } from "next/navigation";
import EditRoleAndPhone from "@/components/EditRoleAndPhone";

export default async function Home() {
  await connectDB();
  const session = await auth();
  const user = await User.findById(session?.user?.id);
  if (!user) {
    redirect("/login");
  }
  const inComplete =
    !user.role || !user.phone || (!user.phone && user.role == "user");
  if (inComplete) {
    return <EditRoleAndPhone />;
  }
  return <div></div>;
}
