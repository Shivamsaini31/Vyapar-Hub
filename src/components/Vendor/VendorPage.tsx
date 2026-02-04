"use client"
import { IUser } from '@/model/user.model'
import React, { useState } from 'react'
import VendorDashboard from './VendorDashboard'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';

function VendorPage({user}:{user:IUser}) {
    const [openVerifyForm, setOpenVerifyForm]=useState(false);
    const [shopName,setShopName]=useState(user?.shopName ||"");
    const [shopAddress,setShopAddress]=useState(user?.shopAddress ||"");
    const [gstNumber,setGstNumber]=useState(user?.gstNumber ||"");
    const [loading, setLoading]=useState(false);
    const router=useRouter();
const handleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();
    if(!shopName || !shopAddress || !gstNumber){
      alert("Please fill all the fields");
      return;
    }
    setLoading(true); 
    try {
      const res=await axios.post("/api/vendor/editDetails",{
        shopName,
        shopAddress,
        gstNumber,
      });
      setLoading(false);
      console.log("Vendor details updated:", res.data);
      setOpenVerifyForm(false)
      alert("Details updated successfully");  
      router.push("/");
    } catch (error) {
      setLoading(false);
      alert("Error updating details");
      console.log(`Error updating vendor details: ${error}`);
      setOpenVerifyForm(false);
    }
  }

    if(!user){
        return <div className="w-full min-h-screen flex items-center
        justify-center text-white bg-linear-to-br from-gray-900 via-black to-gray-900">
            Loading...
        </div>
    }
    if(user.verificationStatus =="approved"){
  return (
    <div className="w-full min-h-screen pt-16">
      <VendorDashboard/>
    </div>
  )}
  if(user.verificationStatus=="pending"){
    return <div className="w-full min-h-screen flex items-center
    justify-center text-white bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4">
        <div className="bg-white/10 backdrop-blur-md p-12 rounded-2xl shadow-2xl border border-white/30 max-w-2xl
        w-full text-center">
            <h2 className="text-4xl font-bold mb-6 text-blue-400">Verification Pending⌛</h2>
            <p className="text-gray-200 text-lg leading-relaxed">
                You can access vendor features only after <span className="font-semibold">admin verification.</span>
            </p>
            <div className="mt-6 text-base text-gray-300">
                Verification Status:{" "}<span className="font-semibold text-blue-400 uppercase">{user.verificationStatus}</span>
            </div>
            <div className="mt-10 text-sm text-gray-400">
                It usually takes 2-3 hours. Please wait patiently.
            </div>
        </div>
        </div>
  }
  if(user.verificationStatus=="rejected"){
    return <div className="w-full min-h-screen flex items-center
    justify-center text-white bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4">
        <div className="bg-white/10 backdrop-blur-md p-12 rounded-2xl shadow-2xl border border-white/30 max-w-2xl
        w-full text-center">
            <h2 className="text-4xl font-bold mb-6 text-red-400">Verification Rejected❌</h2>
            <p className="text-gray-200 text-lg leading-relaxed">
                Your business verification was rejected by <span className="font-semibold">Admin.</span>
            </p>
            <div className="mt-6 text-base text-gray-300">
                Verification Status:{" "}<span className="font-semibold text-red-400 uppercase">{user.verificationStatus}</span>
            </div>
            <div className="mt-2 text-lg text-red-300">
                Rejected reason: {user.rejectedReason || "No reason provided."}
            </div>
            {!openVerifyForm?(
                <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold mt-2"
                onClick={()=>setOpenVerifyForm(true)}>
                    Verify Again
                </button>
            ):(
                <div className="mt-6 text-left space-y-4">
                    <input type="text" placeholder="Shop Name"
                    className="w-full p-3 rounded bg-white/10 border border-white/20"
                    onChange={(e)=>setShopName(e.target.value)}
                    value={shopName}/>
                    <input type="text" placeholder="Shop Address"
                    className="w-full p-3 rounded bg-white/10 border border-white/20"
                    onChange={(e)=>setShopAddress(e.target.value)}
                    value={shopAddress}/>
                    <input type="text" placeholder="GSTIN"
                    className="w-full p-3 rounded bg-white/10 border border-white/20"
                    onChange={(e)=>setGstNumber(e.target.value)}
                    value={gstNumber}/>
                    <div className="w-full flex justify-around flex-col sm:flex-row">
                    <button className="flex-1 m-1 bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold cursor-pointer"
                    onClick={handleSubmit}>{loading?<ClipLoader size={22}/>:"Submit & Verify again"}</button>
                    <button className="flex-1 m-1 bg-gray-600 hover:bg-gray-700 py-3 rounded-lg font-semibold cursor-pointer"
                    onClick={()=>setOpenVerifyForm(false)}>{loading?<ClipLoader size={22}/>:"Cancel"}</button>
                    </div>
                </div>
            )}
        </div>
        </div>
  }
}

export default VendorPage
