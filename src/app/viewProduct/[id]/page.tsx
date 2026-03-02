"use client";
import { IProduct } from "@/model/product.model";
import UseGetAllProducts from "@/redux/hooks/UseGetAllProductsData";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {FaStar, FaRegStar} from "react-icons/fa";
import {motion } from "motion/react";

function ViewProduct() {
  const params = useParams();
  const productId = params.id as string;
  const  allProductsData  = useSelector((state: RootState) => state.vendors.allProductsData);
 const product:IProduct | undefined= allProductsData.find((p:IProduct)=>String(p._id)===productId);
 UseGetAllProducts();
  console.log(product)
  const images:string[] = [
    product?.image1,
    product?.image2,
    product?.image3,
    product?.image4,
  ].filter((img): img is string=>Boolean(img));
  const [activeImage, setActiveImage] = useState(0);

  useEffect(()=>{
    if(!images.length) return;
    const interval=setInterval(()=>{
      setActiveImage((prev)=> (prev+1)%images.length);
    },5000);
    return ()=>clearInterval(interval);
  },[images.length]);
    // console.log(product);
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* left top */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* main image */}
            <div className="relative w-full lg:w-[450px] h-[420px] bg-white
            rounded-lg overflow-hidden flex items-center justify-center border border-white/10">
              <Image src={images[activeImage]} alt="activeImage" fill
              className="object-cover"
              priority/>

            </div>
            {/* image thumbnails */}
            <div className="flex flex-row lg:flex-col gap-3 justify-center">
              {images.map((img,index)=>(
                <div key={index}
                className={`relative w-20 h-20 border rounded cursor-pointer overflow-hidden
                  flex items-center justify-center hover:scale-[110%]
                  transition-all ${activeImage===index
                    ?"border-blue-600"
                    : "border-white/20"
                  }`}
                  onClick={()=>setActiveImage(index)}>
                    <Image src={img} alt="img" fill className="object-cover"/>
                  </div>
              ))}

            </div>
          </div>
          {/* right bottom */}
          {product &&<div>
            <h3 className="text-3xl text-white font-bold mb-3">{product?.title}</h3>
            <p className="text-gray-400 mb-2">{product?.category}</p>
            <p className="text-2xl text-green-500 font-bold">₹{product?.price}</p>

            {/* reviews */}
            <div className="flex items-center gap-2 mt-1 mb-4">
              <div className="flex text-yellow-400">
                {
                  [1,2,3,4,5].map((i)=>(
                    <FaStar key={i} />
                  ))
                }
              </div>
              <span className="text-gray-400 text-sm">(4 / 120) reviews</span>

            </div>
            <p className="text-gray-300 mb-4">{product?.description}</p>
            <p className="text-gray-50 mb-3">
              Stock :{" "}<span className={`${product?.stock>0
                ? "text-green-400"
                : "text-red-400"
              }
              `}>
                {product?.stock >0 ? ("Available"):("Out of stock")}
              </span>
            </p>
            <motion.button
            whileHover={{scale:1.05}}
            whileTap={{scale:0.95}}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded
            font-semibold transition text-white">
              Add to Cart
            </motion.button>
          </div>}
        </div>

        {product && <div className="mt-10 bg-white/5 border border-white/10 rounded-lg p-6">
          {product.isWearable &&(
            <div className="mb-5">
              <p className="font-semibold mb-2 text-white">
                Available Sizes
              </p>
              <div className="flex flex-wrap gap-2">
                {product?.sizes?.map((size,index)=>(
                  <span key={index} className="px-3 py-1 border border-white/20 bg-white rounded">
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-2 mb-6 text-gray-300">
            {product?.replacementDays!=="0" &&(
              <p className="">
                ✅Replacement available within {product.replacementDays}.
              </p>
            )}
            {product.freeDelivery && <p>✅ Free Delivery</p>}
            {product.payOnDelivery && <p>✅ Pay on Delivery</p>}
            {product?.warranty!=="No warranty" && product?.warranty!=="0"
            ? <p>✅ Warranty : {product.warranty}</p>
          : <p>❌ No Warranty Available</p>}
          </div>
          {Array.isArray(product?.detailsPoints) && product?.detailsPoints.length > 0 &&(
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-white">Highlights</h3>
              <ul className="list-disc pl-5 space-y-w text-gray-300">
                {product.detailsPoints.map((point,index)=>(
                  <li key={index}>{point}</li>
                ))}
              </ul>
              
              </div>)}

        </div>}
      </div>
    </div>
  );
}

export default ViewProduct;
