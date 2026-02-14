"use client";
import { IProduct } from "@/model/product.model";
import { RootState } from "@/redux/store";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

function Products() {
  const router = useRouter();
  const currUser = useSelector((state: RootState) => state.user.userData);
  const allProductsData = useSelector(
    (state: RootState) => state.vendors.allProductsData,
  );
  const myProducts =
    currUser?._id && allProductsData.length > 0
      ? allProductsData.filter(
          (p: any) =>
            p.vendor === currUser?._id || p.vendor?._id === currUser?._id,
        )
      : [];
  return (
    <div className="w-full p-4 sm:p-8 text-white">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">My Products</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/addVendorProduct")}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg 
        font-semibold text-sm sm:text-base"
        >
          + Add Product
        </motion.button>
      </div>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10">
        <table className="w-full text-left">
          <thead className="bg-white/10">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Title</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Active</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  No Vendor's products.
                </td>
              </tr>
            ) : (
              myProducts.map((product, index) => (
                <tr
                  key={index}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4">
                    <Image
                      src={product?.image1}
                      alt="img1"
                      height={50}
                      width={50}
                      className="rounded object-cover"
                    />
                  </td>
                  <td className="p-4">{product?.title}</td>
                  <td className="p-4">₹ {product?.price || "-"}</td>
                  <td className="p-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs
                  bg-yellow-500/30 text-yellow-300"
                    >
                      {product?.verificationStatus?.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-sm ${
                        product?.isActive ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {product?.isActive ? "active" : "InActive"}
                    </span>
                  </td>
                  <td className="p-4 text-center flex flex-col space-y-1">
                  <motion.button 
                  whileHover={{scale:1.02}}
                  whileTap={{scale:0.98}}
                  className="px-3 py-1 rounded text-sm bg-purple-600 hover:bg-purple-700">
                    Edit
                  </motion.button>
                  <motion.button 
                  whileHover={{scale:1.02}}
                  whileTap={{scale:0.98}}
                  disabled={product.verificationStatus !=="approved"}
                  className={`px-3 py-1 rounded text-sm
                  ${product.verificationStatus==="approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-600 cursor-not-allowed"

                  }`}>
                    {product.isActive? "Disable" : "Enable"}
                  </motion.button>

                  {
                    product.verificationStatus==="rejected"
                    && (
                      <div className="mt-2 bg-red-500/10 border border-red-500/30
                      text-red-300 text-xs p-2 rounded">
                        <p>
                        <b>Rejected:</b>
                        {product.rejectedReason || "No reason provided!"}
                        </p>
                        <p  className="mt-1 text-yellow-300">
                          After edit, the product will be resent for re-verification.

                        </p>

                         
                      </div>
                    )
                  }
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* mobile card  */}
      <div className="md:hidden flex flex-col gap-4">
        {myProducts.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            No Pending requests.
          </div>
        ) : (
          myProducts.map((product, index) => (
            <div
              key={index}
              className="bg-white/10 border border-white/20 rounded-xl p-4 space-y-2"
            >
              {/* <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">{product?.title}</h3>
              <span className="px-3 py-1 rounded-full text-xs bg-yellow-500/30 text-yellow-300">
              {product?.verificationStatus?.toUpperCase()}
              </span>
              </div> */}

              <div className="flex items-center gap-3">
                <Image
                  src={product?.image1}
                  alt="img1"
                  height={60}
                  width={60}
                  className="rounded object-cover"
                />
              </div>
              <div>
                <h2 className="font-semibold">{product.title}</h2>
                <p className="text-sm text-gray-300">₹ {product.price}</p>
              </div>
              <div className="mt-3 text-sm space-y-1">
                <p>
                  <b>Status:</b>
                  <span
                    className={
                      product.verificationStatus === "approved"
                        ? "text-green-400"
                        : product.verificationStatus === "pending"
                          ? "text-yellow-400"
                          : "text-red-400"
                    }
                  >
                    {" "}
                    {product?.verificationStatus[0].toUpperCase()}
                    {product?.verificationStatus.slice(1)}
                  </span>
                </p>
                <p>
                  <b>Active:</b>
                  <span
                    className={
                      product.isActive ? "text-green-400" : "text-red-400"
                    }
                  >
                    {" "}
                    {product.isActive ? "Yes" : "No"}
                  </span>
                </p>
              </div>
              {
                    product.verificationStatus==="rejected"
                    && (
                      <div className="mt-2 bg-red-500/10 border border-red-500/30
                      text-red-300 text-xs p-2 rounded">
                        <p>
                        <b>Rejected:</b>
                        {product.rejectedReason || "No reason provided!"}
                        </p>
                        <p  className="mt-1 text-yellow-300">
                          After edit, the product will be resent for re-verification.

                        </p>

                         
                      </div>
                    )
                  }
                  <div className="flex gap-3  mt-4">
                    <motion.button 
                  whileHover={{scale:1.02}}
                  whileTap={{scale:0.98}}
                  className="px-3 py-1 rounded text-sm bg-purple-600 hover:bg-purple-700">
                    Edit
                  </motion.button>
                  <motion.button 
                  whileHover={{scale:1.02}}
                  whileTap={{scale:0.98}}
                  disabled={product.verificationStatus !=="approved"}
                  className={`px-3 py-1 rounded text-sm
                  ${product.verificationStatus==="approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-600 cursor-not-allowed"

                  }`}>
                    {product.isActive? "Disable" : "Enable"}
                  </motion.button>
                  </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Products;
