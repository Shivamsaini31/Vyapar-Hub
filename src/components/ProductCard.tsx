"use client";
import { IProduct } from "@/model/product.model";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import React, { useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaShoppingCart,
} from "react-icons/fa";

function ProductCard({ product }: { product: IProduct }) {
  const images = [
    product.image1,
    product.image2,
    product.image3,
    product.image4,
  ].filter(Boolean);
  const [curr, setCurr] = useState(0);
  const next = () => {
    setCurr((prev) => (prev + 1) % images.length);
  };
  const previous = () => {
    setCurr((prev) => (prev - 1 + images.length) % images.length);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 70, damping: 18 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-xl transition cursor-pointer"
    >
      {/* images */}
      <div className="relative w-full h-[220px] bg-gray-100 overflow-hidden flex items-center justify-center">
        <div className="relative w-[90%] h-[90%]">
          <Image
            src={images[curr]}
            alt={product.title}
            fill
            className="object-contain"
            sizes="(max-width:768px) 100vw, 300px"
          />
        </div>
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 p-2 
            rounded-full text-white z-10"
          onClick={(e) => {
            e.stopPropagation();
            previous();
          }}
        >
          <FaChevronLeft size={14} />
        </button>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 p-2 
            rounded-full text-white z-10 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
        >
          <FaChevronRight size={14} />
        </button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {images.map((_,i)=>(
            <span key={i} className={`w-2 h-2 rounded-full ${
                curr==i ? "bg-black": "bg-black/40"
            }`}></span>
        ))}
        </div>
      </div>
      {/* product data */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-sm text-black line-clamp-1">
            {product.title}
        </h3>
        <p className="text-xs text-gray-500">{product.category}</p>
        <p className="text-lg font-bold text-greeen-600">₹ {product.price}</p>
        <div className="flex items-center gap-1 text-yellow-500 text-sm">
            {[1,2,3,4,5].map((i)=>(
                <FaStar key={i}/>
            ))}
            <span className="text-gray-500 text-xs mt-1">
                5 (120)

            </span>
        </div>
        <p className="text-xs text-gray-500">Sold By: <span>{product.vendor.shopName}</span></p>

        <motion.button
        whileHover={{scale:1.03}}
        className="w-full mt-3 bg-black text-white py-2 rounded-lg flex items-center 
        justify-center gap-2 hover:bg-gray-900 transition">
            <FaShoppingCart size={14}/>Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}

export default ProductCard;
