"use client";
import UseGetCurrentUser from "@/redux/hooks/UseGetCurrentUser";
import { AppDispatch, RootState } from "@/redux/store";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import defaultProfile from "@/assets/defaultProfile.png";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { setUserData } from "@/redux/userSlice";
function Profile() {
  UseGetCurrentUser();
  const user = useSelector((state: RootState) => state.user.userData);
  const router = useRouter();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditShop, setShowEditShop] = useState(false);
  const [previewImage, setPreviewImage] = useState(
    user?.image || defaultProfile,
  );
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [shopName, setShopName] = useState(user?.shopName || "");
  const [shopAddress, setShopAddress] = useState(user?.shopAddress || "");
  const [gstNumber, setGstNumber] = useState(user?.gstNumber || "");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setPreviewImage(user.image || defaultProfile);
    }
  }, [user]);

  const handlePreviewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName || !shopAddress || !gstNumber) {
      alert("Please fill all the fields");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/vendor/editDetails", {
        shopName,
        shopAddress,
        gstNumber,
      });
      setLoading(false);
      console.log("Vendor details updated:", res.data);
      alert("Details updated. Please await admin approval.");
      router.push("/");
    } catch (error) {
      setLoading(false);
      alert("Error updating details");
      console.log(`Error updating vendor details: ${error}`);
    }
  };
  const handleProfileUpdate = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    if (profileImage) formData.append("image", profileImage);
    setLoading(true);
    try {
      const res = await axios.post("/api/user/update-profile", formData);
      dispatch(setUserData(res.data));
      console.log(res);
      setLoading(false);
      alert("Profile Updated succesfully!✅");
      setProfileImage(null);
    } catch (error) {
      console.log(`Error updating profile ${error}`);
      setLoading(false);
      alert("Error updating profile!");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-600 via-black to-gray-600 text-white px-4 pt-24 pb-10">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-6 sm:p-10 rounded-2xl border border-white/20 shadow-xl"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-white/30
            hover:border-blue-400 hover:border-3"
          >
            <Image
              src={previewImage}
              alt="profile"
              width={120}
              height={120}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold mt-4">{user?.name}</h2>
          <p className="text-gray-300 text-sm sm:text-base">{user?.email}</p>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Role: <span className="capitalize text-blue-400">{user?.role}</span>
          </p>
        </div>
        <div className="mt-5 space-y-3 text-sm sm:text-base">
          <p>
            <b>Phone: </b>
            {user?.phone || "-"}
          </p>
          {user?.role === "vendor" && (
            <div>
              <p>
                <b>Shop Name: </b>
                {user?.shopName}
              </p>
              <p>
                <b>Shop Address: </b>
                {user?.shopAddress}
              </p>
              <p>
                <b>GSTIN: </b>
                {user?.gstNumber}
              </p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 mt-8">
          {user?.role === "user" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push("/orders")}
              className="bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold"
            >
              My Orders
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              setShowEditProfile(!showEditProfile);
              setShowEditShop(false);
            }}
            className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold"
          >
            Edit Profile
          </motion.button>
          {user?.role === "vendor" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                setShowEditShop(!showEditShop);
                setShowEditProfile(false);
              }}
              className="bg-gray-600 hover:bg-gray-700 py-3 rounded-lg font-semibold"
            >
              Edit Shop details
            </motion.button>
          )}
        </div>
        {showEditProfile && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0, y: 30 }}
            className="mt-10 bg-white/5 p-5 sm:p-6 rounded-xl border border-white/20"
          >
            <h3 className="text-xl font-bold mb-5">Edit Profile</h3>
            <div className="flex flex-col items-center mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-24 w-24 rounded-full overflow-hidden border-2 border-white/30 
                hover:border-blue-400 mb-3 cursor-pointer"
              >
                <Image
                  src={previewImage}
                  alt="profile image"
                  height={120}
                  width={120}
                  className="object-cover w-full h-full"
                />
              </motion.div>
              <label className="cursor-pointer bg-blue-600 px-4 py-2 rounded-lg text-sm">
                Select Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePreviewImage}
                />
              </label>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                className="w-full p-3 bg-white/10 border border-white/20 rounded"
                placeholder="Enter Full Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              <input
                type="text"
                className="w-full p-3 bg-white/10 border border-white/20 rounded"
                placeholder="Enter Phone Number"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={handleProfileUpdate}
                disabled={loading}
                className=" w-full bg-blue-700 hover:bg-gray-700 py-3 rounded-lg font-semibold"
              >
                {loading ? <ClipLoader size={20} /> : "Update Profile"}
              </motion.button>
            </div>
          </motion.div>
        )}
        {showEditShop && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0, y: 30 }}
            className="mt-10 bg-white/5 p-5 sm:p-6 rounded-xl border border-white/20"
          >
            <h3 className="text-xl font-bold mb-5">Edit Shop Details</h3>
            <div className="space-y-4">
              <input
                type="text"
                className="w-full p-3 bg-white/10 border border-white/20 rounded"
                placeholder="Enter Shop Name"
                onChange={(e) => setShopName(e.target.value)}
                value={shopName}
              />
              <input
                type="text"
                className="w-full p-3 bg-white/10 border border-white/20 rounded"
                placeholder="Enter Shop Address"
                onChange={(e) => setShopAddress(e.target.value)}
                value={shopAddress}
              />
              <input
                type="text"
                className="w-full p-3 bg-white/10 border border-white/20 rounded"
                placeholder="Enter GSTIN"
                onChange={(e) => setGstNumber(e.target.value)}
                value={gstNumber}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={handleSubmit}
                disabled={loading}
                className=" w-full bg-blue-700 hover:bg-gray-700 py-3 rounded-lg font-semibold"
              >
                {loading ? (
                  <ClipLoader size={20} color="white" />
                ) : (
                  "Update Shop Details"
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

    </div>
  );
}

export default Profile;
