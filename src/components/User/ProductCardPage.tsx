"use client";
import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import ProductCard from "../ProductCard";
import { IProduct } from "@/model/product.model";

function ProductCardPage() {
  const { allProductsData } = useSelector((state: RootState) => state.vendors);
  const products = Array.isArray(allProductsData)
    ? allProductsData.filter(
        (p) => p.verificationStatus === "approved" && p.isActive === true,
      )
    : [];
  console.log(products);
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-gray-900 via-black to-gray-900 px-4 py-6">
      <div className="max-w-7xl mx-auto mb-13 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Explore Verified & Trending Products
        </h1>
        <p className="text-sm text-gray-200">
          Shop only from approved sellers with guaranteed quality
        </p>
      </div>
      <div className="max-w-7xl mx-auto">
        {products.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            No Products available right now.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p: any) => (
              <ProductCard product={p} key={p._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCardPage;
