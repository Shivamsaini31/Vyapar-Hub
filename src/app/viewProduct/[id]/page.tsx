"use client";
import { IProduct } from "@/model/product.model";
import UseGetAllProducts from "@/redux/hooks/UseGetAllProductsData";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaStar, FaRegStar, FaUserCircle } from "react-icons/fa";
import { motion } from "motion/react";
import ProductCard from "@/components/ProductCard";
import axios from "axios";
import { ClipLoader } from "react-spinners";

function ViewProduct() {
  const params = useParams();
  const productId = params.id as string;
  const allProductsData = useSelector(
    (state: RootState) => state.vendors.allProductsData,
  );
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const product: IProduct | undefined = allProductsData.find(
    (p: IProduct) => String(p._id) === productId,
  );

  const totalReviews=product?.reviews?.length ?? 0;
  const avgRating=product && totalReviews > 0?(
    product.reviews!.reduce((sum:number, r:{rating:number})=>sum+r.rating,0)/totalReviews
  ).toFixed(1): 0;

  UseGetAllProducts();
  console.log(product);
  const images: string[] = [
    product?.image1,
    product?.image2,
    product?.image3,
    product?.image4,
  ].filter((img): img is string => Boolean(img));
  const [activeImage, setActiveImage] = useState(0);

  const relatedProducts = allProductsData.filter(
    (p: IProduct) =>
      p.category === product?.category && String(p._id) !== productId,
  );
  const handleSubmitReview = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("productId", String(productId));
      formData.append("rating", String(reviewRating));
      formData.append("comment", reviewComment);
      if (reviewImage) {
        formData.append("image", reviewImage);
      }
      const productReview = await axios.post("/api/user/addReview", formData);
      console.log(productReview.data);
      setLoading(false);
      setReviewImage(null);
      setReviewComment("");
      setReviewRating(0);
      setPreview(null);
      alert("Review submitted successfully!");
    } catch (error) {
      console.log(`Error in submitting review:${error}`);
      setLoading(false);
      alert("Failed to submit review. Please try again.");
    }
  };
  useEffect(() => {
    if (!images.length) return;
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);
  // console.log(product);
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* left top */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* main image */}
            <div
              className="relative w-full lg:w-[450px] h-[420px] bg-white
            rounded-lg overflow-hidden flex items-center justify-center border border-white/10"
            >
              <Image
                src={images[activeImage]}
                alt="activeImage"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* image thumbnails */}
            <div className="flex flex-row lg:flex-col gap-3 justify-center">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`relative w-20 h-20 border rounded cursor-pointer overflow-hidden
                  flex items-center justify-center hover:scale-[110%]
                  transition-all ${
                    activeImage === index
                      ? "border-blue-600"
                      : "border-white/20"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image src={img} alt="img" fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
          {/* right bottom */}
          {product && (
            <div>
              <h3 className="text-3xl text-white font-bold mb-3">
                {product?.title}
              </h3>
              <p className="text-gray-400 mb-2">{product?.category}</p>
              <p className="text-2xl text-green-500 font-bold">
                ₹{product?.price}
              </p>

              {/* reviews */}
              <div className="flex items-center gap-2 mt-1 mb-4">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((i) => (
                    Math.round(Number(avgRating))>=i?
                    <FaStar key={i} />
                    : <FaRegStar key={i}/>
                  ))}
                </div>
                <span className="text-gray-400 text-sm">({avgRating} / {totalReviews}) reviews</span>
              </div>
              <p className="text-gray-300 mb-4">{product?.description}</p>
              <p className="text-gray-50 mb-3">
                Stock :{" "}
                <span
                  className={`${
                    product?.stock > 0 ? "text-green-400" : "text-red-400"
                  }
              `}
                >
                  {product?.stock > 0 ? "Available" : "Out of stock"}
                </span>
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded
            font-semibold transition text-white"
              >
                Add to Cart
              </motion.button>
            </div>
          )}
        </div>

        {product && (
          <div className="mt-10 bg-white/5 border border-white/10 rounded-lg p-6">
            {product.isWearable && (
              <div className="mb-5">
                <p className="font-semibold mb-2 text-white">Available Sizes</p>
                <div className="flex flex-wrap gap-2">
                  {product?.sizes?.map((size, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 border border-white/20 bg-white rounded"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2 mb-6 text-gray-300">
              {product?.replacementDays !== "0" && (
                <p className="">
                  ✅Replacement available within {product.replacementDays}.
                </p>
              )}
              {product.freeDelivery && <p>✅ Free Delivery</p>}
              {product.payOnDelivery && <p>✅ Pay on Delivery</p>}
              {product?.warranty !== "No warranty" &&
              product?.warranty !== "0" ? (
                <p>✅ Warranty : {product.warranty}</p>
              ) : (
                <p>❌ No Warranty Available</p>
              )}
            </div>
            {Array.isArray(product?.detailsPoints) &&
              product?.detailsPoints.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2 text-white">Highlights</h3>
                  <ul className="list-disc pl-5 space-y-w text-gray-300">
                    {product.detailsPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}

        {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-5 text-white">
              Related Products
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {relatedProducts.slice(0, 8).map((p: IProduct) => (
                <ProductCard key={p?._id?.toString()} product={p} />
              ))}
            </div>
          </div>
        )}
        <div className="mt-16 bg-white/5 border border-white/10 rounded-lg p-6">
          <h2 className="text-white text-2xl font-bold mb-6">
            Customer Reviews
          </h2>
          <div className="mb-8">
            <p className="text-white font-semibold mb-2">Add your review</p>
            <div className="flex gap-2 mb-3 text-yellow-400">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  onClick={() => setReviewRating(i)}
                  className="cursor-pointer"
                >
                  {i <= reviewRating ? <FaStar /> : <FaRegStar />}
                </span>
              ))}
            </div>
            <textarea
              placeholder="Write a Review..."
              onChange={(e) => setReviewComment(e.target.value)}
              value={reviewComment}
              className="w-full p-3 rounded bg-black text-white border border-white/20 mb-3
            focus:outline-none focus:ring focus:ring-blue-500"
              rows={3}
            />
            <div className="flex flex-col">
              <label htmlFor="img" className="text-white font-semibold mb-2">
                Select Image for review
              </label>
              <input
                type="file"
                id="img"
                accept="image/*"
                className="mb-3 text-black bg-white w-[200px] rounded-lg p-2 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setReviewImage(file);
                    setPreview(URL.createObjectURL(file));
                  } else {
                    setReviewImage(null);
                    setPreview("");
                  }
                }}
              />

              {preview && (
                <Image
                  src={preview}
                  alt="preview"
                  height={100}
                  width={100}
                  className="rounded mb-3"
                />
              )}

              
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              onClick={handleSubmitReview}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded 
            text-white font-semibold mt-4"
            >
              {loading ? <ClipLoader size={22} /> : "Submit Review"}
            </motion.button>

            
            {product?.reviews && product?.reviews?.length>0 ? (
                  <h2 className="text-white font-semibold  text-2xl mt-5">Reviews</h2>
                ) : 
                <h2 className="text-white font-semibold text-2xl mt-5">No Reviews found.</h2>
                }

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
                
                
                {product?.reviews && product?.reviews?.length>0 &&  product?.reviews?.map((review,index)=>(
                  <div key={index}
                  className="bg-white border border-black/10 rounded-xl p-5 w-[250px]">
                    <div className="flex items-center mb-2 gap-3">
                      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center 
                      justify-center bg-black">
                        {review?.user?.image
                        ? <Image src={review.user.image} alt="user" width={40} height={40} 
                        className="rounded-full object-cover w-9 h-9"/>
                        : <FaUserCircle size={20} className="w-9 h-9"/>}
                      </div> 
                      <div className="">
                        <p className="text-black font-semibold text-sm">{review?.user?.name}</p>
                        <div className="flex text-yellow-400">
                          {[1,2,3,4,5,].map((i)=>(
                            i<=review?.rating?<FaStar key={i}/> : <FaRegStar key={i}/>
                          ))}
                        </div>

                      </div>
                    </div>
                    <p className="text-gray-900 text-sm mt-2">{review?.comment}</p>

                    {review?.image ?
                    <div className="w-[180px] h-[180px] border border-white/10 rounded-lg overflow-hidden bg-black">
                      <Image src={review.image} alt="review" width={180}
                      height={180} className="object-contain"/>
                    </div>
                    : <div className="w-[180px] h-[180px] border border-white/10 rounded-lg overflow-hidden bg-gray-400 flex
                    items-center justify-center text-white text-md">
                      
                      No image found
                      
                      </div>
                    }
                  </div>
                ))}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProduct;
