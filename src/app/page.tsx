import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import React from "react";
import User from "@/model/user.model";
import { redirect } from "next/navigation";
import EditRoleAndPhone from "@/components/EditRoleAndPhone";
import Navbar from "@/components/Navbar";
import UserDashboard from "@/components/User/UserDashboard";
import VendorDashboard from "@/components/Vendor/VendorDashboard";
import AdminDashboard from "@/components/Admin/AdminDashboard";
import Footer from "@/components/Footer";
import EditVendorDetails from "@/components/Vendor/EditVendorDetails";
import VendorPage from "@/components/Vendor/VendorPage";

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
  if(user.role=="vendor"){
    const inCompleteDetails= !user.shopName || ! user.shopAddress || !user.gstNumber;
    if(inCompleteDetails){
      return <EditVendorDetails/>
    }
  }
  const plainUser=JSON.parse(JSON.stringify(user));
  return <div className="flex min-h-screen items-center justify-center 
  bg-gradient-to-br from-gray-900 via-black to-gray-900 font-sans flex-col">

    <Navbar user={plainUser}/>
    {user.role=="user" ? <UserDashboard/>: user.role=="vendor"? <VendorPage user={plainUser}/> : <AdminDashboard/>}
    <Footer user={plainUser}/>
  </div>
}
