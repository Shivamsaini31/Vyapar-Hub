"use client";
import { AnimatePresence, motion } from "motion/react";
import {
  AiOutlineShop,
  AiOutlineHome,
  AiOutlineFileText,
} from "react-icons/ai";
import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import { FcNext } from "react-icons/fc";
import axios from "axios";
import { useRouter } from "next/navigation";

function EditVendorDetails() {
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const router= useRouter();
  const handleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();
    if(!shopName || !address || !gstNumber){
      alert("Please fill all the fields");
      return;
    }
    setLoading(true); 
    try {
      const res=await axios.post("/api/vendor/editDetails",{
        shopName,
        shopAddress: address,
        gstNumber
      });
      setLoading(false);
      console.log("Vendor details updated:", res.data);
      alert("Details updated successfully");  
      router.push("/");
    } catch (error) {
      setLoading(false);
      alert("Error updating details");
      console.log(`Error updating vendor details: ${error}`);
    }
  }
  return (
    <div
      className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6"
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/10 backdrop-blur-md 
        rounded-3xl shadow-xl p-8 border border-white/10"
        >
          <h3 className="text-3xl font-semibold text-center mb-4">
            Complete Your shop details
          </h3>
          <p className="text-center text-gray-300 mb-6 text-sm">
            Enter your business information to activate your vendor account.
          </p>
          <form 
          onSubmit={handleSubmit}
          className="flex flex-col gap-6">
            <div className="relative">
              <AiOutlineShop
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={22}
              />
              <input
                type="text"
                placeholder="Shop Name"
                className="w-full bg-white/10 border border-white/30 rounded-lg p-3 pl-10
                focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setShopName(e.target.value)}
                value={shopName}
              />
            </div>
            <div className="relative">
              <AiOutlineHome
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={22}
              />
              <input
                type="text"
                placeholder="Shop Address"
                className="w-full bg-white/10 border border-white/30 rounded-lg p-3 pl-10
                focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setAddress(e.target.value)}
                value={address}
              />
            </div>
            <div className="relative">
              <AiOutlineFileText
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={22}
              />
              <input
                type="text"
                placeholder="GST Number"
                className="w-full bg-white/10 border border-white/30 rounded-lg p-3 pl-10
                focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setGstNumber(e.target.value)}
                value={gstNumber}
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ opacity: 0.7, scale: 0.95 }}
              whileHover={{ opacity: 1, scale: 1.05 }}
              className="text-xl flex items-center justify-center gap-2 w-full border border-white/30 bg-blue-600 mt-2 px-8 py-3 hover:bg-blue-500/20 rounded-xl font-medium"
            >
              {loading ? (
                <ClipLoader size={20} />
              ) : (
                <>
                  Submit
                  <FcNext size={20} />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default EditVendorDetails;
