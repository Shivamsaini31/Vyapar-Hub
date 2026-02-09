"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { FiUpload } from "react-icons/fi";

function AddVendorProduct() {
  const categories = [
    { label: "Fashion & Lifestyle", icon: "👗" },
    { label: "Electronics & Gadgets", icon: "📱" },
    { label: "Home & Living", icon: "🏠" },
    { label: "Beauty & Personal Care", icon: "💄" },
    { label: "Toys, Kids & Baby", icon: "🧸" },
    { label: "Food & Grocery", icon: "🛒" },
    { label: "Sports & Fitness", icon: "⚽" },
    { label: "Automotive Accessories", icon: "🚗" },
    { label: "Gifts & Handcrafts", icon: "🎁" },
    { label: "Books & Stationery", icon: "📚" },
  ];
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [isWearable, setIsWearable]=useState(false);
  const [sizes, setSizes]=useState<string[]>([]);
  const [replacementDays, setReplacementDays]=useState("");
  const [warranty,setWarranty]=useState("");
  const [freeDelivery, setFreeDelivery]=useState(false);
  const [payOnDelivery, setPayOnDelivery]=useState(false);
  const [image1,setImage1]=useState<File|null>(null);
  const [image2,setImage2]=useState<File|null>(null);
  const [image3,setImage3]=useState<File|null>(null);
  const [image4,setImage4]=useState<File|null>(null);
  const [preview1,setPreview1]=useState<string|null>(null);
  const [preview2,setPreview2]=useState<string|null>(null);
  const [preview3,setPreview3]=useState<string|null>(null);
  const [preview4,setPreview4]=useState<string|null>(null);
  const [detailPoints,setDetailPoints]=useState<string[]>([]);
  const [currPoint,setCurrPoint]=useState<string>("");
  const [pointIndex, setPointIndex]=useState(0);
  const handleRemove=(i:number)=>{
    setDetailPoints((prev)=>
    prev.filter((_,idx)=>idx!==i));
    setPointIndex((prev)=>prev-1);
  }

  const toggleSizes=(size:string)=>{
    setSizes((prev)=>prev.includes(size)?prev.filter((s)=>s!==size): [...prev,size])
  }
  return (
    <div className="px-4 pt-20 pb-10 bg-gradient-to-br from-gray-600 via-black to-gray-600 text-white min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white/10 
      backdrop-blur-lg  p-6 sm:p-10 rounded-2xl border border-white/20 shadow-xl"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Add New Product</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 rounded bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Product Title"
          />

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-3 rounded bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Product Price"
          />

          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="p-3 rounded bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Stock Quantity"
          />

          <select
            className="p-3 rounded bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" className="bg-gray-900">
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat.label} value={cat.label} className="bg-gray-800">
                {cat.label}
              </option>
            ))}
            <option value="Others" className="bg-gray-800">
              Others
            </option>
          </select>
        </div>
        {category == "Others" && (
          <input
            type="text"
            className="mt-4 p-3 w-full bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="Type your custom category"
          />
        )}
        <textarea className="mt-4 p-3 w-full bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
        rows={3} 
        placeholder="Enter Product Description"
        value={description}
        onChange={(e)=>setDescription(e.target.value)}/>
        <div className="flex items-center gap-3 mt-5">
          <input type="checkbox" className="h-5 w-5" onClick={()=>setIsWearable(!isWearable)}/>
          <span className="text-sm"> This is a wearable/clothing product.</span>
        </div>
        {isWearable && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-semibold">Select all available sizes:</p>
          <div className="flex flex-wrap gap-3">
            {sizeOptions.map((size)=>(
              <button type="button" className={`px-4 py-1 rounded-full border
                ${sizes.includes(size)
                  ? "bg-blue-600 border-blue-500"
                  : "bg-white/10 border-white/20"
                }`}
              key={size} onClick={()=>toggleSizes(size)}>{size}</button>
            ))}
            
          </div>
          
          </div>
        ) }
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <input type="text" className="p-3 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ReplacementDays {eg: 7 days}"
              onChange={(e)=>setReplacementDays(e.target.value)}/>
              <input type="text" className="p-3 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Warranty period"
              onChange={(e)=>setWarranty(e.target.value)}/>
            </div>

             <div className="flex items-center gap-3 mt-5">
          <input type="checkbox" className="h-5 w-5" onClick={()=>setFreeDelivery(!freeDelivery)} checked={freeDelivery}/>
          <span className="text-sm" >Free Delivery</span>
     
          <input type="checkbox" checked={payOnDelivery} className="h-5 w-5 ml-4" onClick={()=>setPayOnDelivery(!payOnDelivery)}/>
          <span className="text-sm"> Pay On delivery</span>
        </div>

        <h3 className="mt-6 mb-3 font-semibold">Upload 4 images of the product</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* image 1 */}
          <div>
            <input type="file" hidden id="img1" accept="image/*" 
            onChange={(e)=>{
              const file=e.target.files?.[0];
              if(file)setPreview1(URL.createObjectURL(file));
              else return;
              setImage1(file);
              setPreview1(URL.createObjectURL(file));
              }}/>

              <label htmlFor="img1" 
              className="cursor-pointer bg-gray-800 p-2 rounded h-28 flex items-center justify-center border border-white/20 hover:border-blue-500">
                {preview1? (
                  <Image src={preview1} alt="img1" width={120} height={120}
                  className="w-full h-full object-cover rounded"/>
                ):(
                  <div className="flex flex-col items-center text-gray-400 text-xs">
                    <FiUpload size={22}/>
                    <span>Image 1</span>
                  </div>
                )}
              </label>
            </div>
          {/* image 2 */}
          <div>
            <input type="file" hidden id="img2" accept="image/*" 
            onChange={(e)=>{
              const file=e.target.files?.[0];
              if(!file) return;
              setImage2(file);
              setPreview2(URL.createObjectURL(file));
              }}/>

              <label htmlFor="img2" 
              className="hover:border-blue-500 cursor-pointer bg-gray-800 p-2 rounded h-28 flex items-center justify-center border border-white/20">
                {preview2? (
                  <Image src={preview2} alt="img1" width={120} height={120}
                  className="w-full h-full object-cover rounded"/>
                ):(
                  <div className="flex flex-col items-center text-gray-400 text-xs">
                    <FiUpload size={22}/>
                    <span>Image 2</span>
                  </div>
                )}
              </label>
            </div>
          {/* image 3 */}
          <div>
            <input type="file" hidden id="img3" accept="image/*" 
            onChange={(e)=>{
              const file=e.target.files?.[0];
              if(!file) return;
              setImage3(file);
              setPreview3(URL.createObjectURL(file));
              }}/>

              <label htmlFor="img3" 
              className="hover:border-blue-500 cursor-pointer bg-gray-800 p-2 rounded h-28 flex items-center justify-center border border-white/20">
                {preview3? (
                  <Image src={preview3} alt="img1" width={120} height={120}
                  className="w-full h-full object-cover rounded"/>
                ):(
                  <div className="flex flex-col items-center text-gray-400 text-xs">
                    <FiUpload size={22}/>
                    <span>Image 3</span>
                  </div>
                )}
              </label>
            </div>
             {/* image 4 */}
          <div>
            <input type="file" hidden id="img4" accept="image/*" 
            onChange={(e)=>{
              const file=e.target.files?.[0];
              if(!file) return;
              setImage4(file);
              setPreview4(URL.createObjectURL(file));
              }}/>

              <label htmlFor="img4" 
              className="hover:border-blue-500 cursor-pointer bg-gray-800 p-2 rounded h-28 flex items-center justify-center border border-white/20">
                {preview4? (
                  <Image src={preview4} alt="img1" width={120} height={120}
                  className="w-full h-full object-cover rounded"/>
                ):(
                  <div className="flex flex-col items-center text-gray-400 text-xs">
                    <FiUpload size={22}/>
                    <span>Image 4</span>
                  </div>
                )}
              </label>
            </div>



        </div>
        <div className="mt-6">
          <p className="font-semibold mb-2">Product detail Points</p>
          <div className="flex gap-2">
            <input 
            type="text" 
            placeholder={`Point ${pointIndex +1}`}
            onChange={(e)=>setCurrPoint(e.target.value)}
            value={currPoint}
            className="flex-1 p-3 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <button type="button" className="px-4 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
            onClick={()=>{
              if(!currPoint) return;
              setDetailPoints((prev)=>[...prev,currPoint]);
              setCurrPoint("");
              setPointIndex((prev)=>prev+1)
            }}>Add Point</button>
          </div>
          {detailPoints.length>0 &&(
            <ul className="mt-3 space-y-2">
              {detailPoints.map((point,index)=>(
                  <li key={index} className="flex justify-between items-center bg-white/10 p-2 rounded">
                    <span className="text-sm">{index+1}. {point}</span>
                    <button type="button" className="text-xs text-red-400" onClick={()=>handleRemove(index)}>Remove</button>
                  </li>
              ))}

            </ul>
          )}
        </div>
        <motion.button
        whileHover={{scale:1.02}}
        whileTap={{scale:0.95}}
        type="submit"
         className="w-full mt-8 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold">Add Product</motion.button>

      </motion.div>
    </div>
  );
}

export default AddVendorProduct;
