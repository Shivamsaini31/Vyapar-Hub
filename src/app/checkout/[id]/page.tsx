"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import {FaStripe} from "react-icons/fa"

function Checkout() {
  const params = useParams();
  const productId = params.id as string;
  const [item, setItem] = useState<any>(null);
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe">(
    "stripe",
  );
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const productTotal= item ? item.product.price * item.quantity : 0;
  const deliveryCharge= item?.product.freeDelivery? 0 : 50;
  const serviceCharge=30;
  const finalTotal= deliveryCharge+productTotal+ serviceCharge;

  useEffect(() => {
    if (!productId) return;
    const loadItem = async () => {
      try {
        const result = await axios.get("/api/user/cart/get");
        const foundItem = result.data.cart.find(
          (item: any) => item.product._id === productId,
        );
        if (!foundItem) {
          router.replace("/cart");
          return;
        }

        setItem(foundItem);
      } catch (error) {
        console.log(error);
        alert("Failed to load cart item for checkout!");
      }
    };
    loadItem();
  }, [productId, router]);
  console.log(item);
  return (
    <div
      className="min-h-screen bg-linear-to-br from-[#020617] via-black to-[#020617] px-4 py-12 text-white 
    flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl 
        p-6 md:p-10 grid md:grid-cols-2 gap-8"
      >
        <div className="space-y-5">
          <h2 className="text-2xl font-bold text-white">Delivery Address</h2>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-xl 
                bg-black/60 border border-white/20 text-white placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/40 transition"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <input
            type="text"
            placeholder="Phone number"
            className="w-full p-3 rounded-xl 
                bg-black/60 border border-white/20 text-white placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/40 transition"
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
          />
          <textarea
            placeholder="Address"
            className="w-full p-3 rounded-xl 
                bg-black/60 border border-white/20 text-white placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/40 transition"
            onChange={(e) => setAddress(e.target.value)}
            value={address}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="City"
              className="w-full p-3 rounded-xl 
                bg-black/60 border border-white/20 text-white placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/40 transition"
              onChange={(e) => setCity(e.target.value)}
              value={city}
            />
            <input
              type="text"
              placeholder="Pin Code"
              className="w-full p-3 rounded-xl 
                bg-black/60 border border-white/20 text-white placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/40 transition"
              onChange={(e) => setPinCode(e.target.value)}
              value={pinCode}
            />
          </div>
        </div>
        <div className="space-y-5">
            <h2 className="text-2xl font-bold text-white">Order Summary</h2>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl 
            border border-white/10">
                {item &&<>
                 <Image src={item.product.image1} alt="img" width={120} height={120}
                className="w-20 h-20 object-contain rounded-lg bg-white"/>
                <div className="flex-1">
                    <p className="font-semibold text-gray-100">{item.product.title}</p>
                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-green-400">₹ {productTotal}</p>
                </>}
            </div>
            <div className="space-y-2 text-sm text-gray-300">
                <div className=" flex justify-between">
                    <span>Delivery Charger:</span>
                    <span>₹ {deliveryCharge.toFixed(2)}</span>
                </div>
                <div className=" flex justify-between">
                    <span>Service Charge:</span>
                    <span>₹ {serviceCharge.toFixed(2)}</span>
                </div>
                <div className=" flex justify-between text-lg font-bold border-t border-white/20 pt-3 text-white">
                    <span >Total:</span>
                    <span className="text-green-400">₹ {finalTotal.toFixed(2)}</span>
                </div>
            </div>
            <div className="space-y-3">
                <p className="font-semibold text-white">Payment Method</p>
                <div className="flex gap-3">
                    <motion.button
            whileHover={{scale:1.03}}
            whileTap={{scale:0.97}}
             disabled={!item?.product.payOnDelivery}
                    onClick={()=>{setPaymentMethod("cod")}} 
                    className={`py-3 font-semibold flex-1 rounded-xl transition text-white ${
                        paymentMethod==="cod"
                        ? "bg-blue-600"
                        : "bg-white/10"
                    } ${item?.product.payOnDelivery? "cursor-pointer": "cursor-not-allowed opacity-40"}`}>Cash On Delivery</motion.button>
                    <motion.button
            whileHover={{scale:1.03}}
            whileTap={{scale:0.97}}
             onClick={()=>setPaymentMethod("stripe")}
                    className={`py-3 font-semibold flex-1 rounded-xl transition flex items-center justify-center gap-2
                        text-white cursor-pointer  ${
                        paymentMethod==="stripe"
                        ? "bg-blue-600"
                        : "bg-white/10"
                    }`}
                        ><FaStripe className="text-xl border p-[2px] rounded text-black bg-green-300"/>Stripe</motion.button>
                </div>
            </div>
            <motion.button
            whileHover={{scale:1.03}}
            whileTap={{scale:0.97}} 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600
            hover:opacity-90 py-4 rounded-2xl font-semibold text-white text-lg transition cursor-pointer">{
                paymentMethod==="cod"
                ? "Place Order"
                : "Proceed to Secure Payment"
            }</motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default Checkout;
