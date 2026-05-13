"use client"
import Order from '@/model/order.model';
import { IUser } from '@/model/user.model';
import UseGetAllOrders from '@/redux/hooks/UseGetAllOrders';
import UseGetCurrentUser from '@/redux/hooks/UseGetCurrentUser';
import { AppDispatch, RootState } from '@/redux/store'
import { setAllOrdersData } from '@/redux/userSlice';
import axios from 'axios';
import { AnimatePresence , motion} from 'motion/react';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners';

function VendorOrders() {
  const dispatch= useDispatch<AppDispatch>(); 
      UseGetCurrentUser();
    UseGetAllOrders();
    const [otpModel, setOtpModel]=useState<any|null>(null);
    const [otp, setOtp]= useState("");
    const {allOrdersData}=useSelector((state:RootState)=>state.user);
    const {userData}=useSelector((state:RootState)=>state.user);
    const orders=Array.isArray(allOrdersData)?
    allOrdersData.filter((o)=>String(o.productVendor._id)===String(userData?._id)):[];

    const statusOptions=["pending", "confirmed", "shipped", "delivered"];
    const updateStatus= async(orderId:string, status:string)=>{
      try {
        await axios.post("/api/order/update-status", {orderId, status});
        dispatch(setAllOrdersData(allOrdersData.map((o:any)=>(
          o._id===orderId && status!=="delivered" ? {...o, orderStatus:status}
          : o
        ))));
        if(status==="delivered") return ;
        alert("Order status updated...");
      } catch (error) {
        console.log("Error updating order status: ", error);
      }
    }
    const verifyOtp= async()=>{
      try {
        const res=await axios.post("/api/order/verify-delivery-otp",{orderId: otpModel._id, otp});
        // console.log(res);
        dispatch(setAllOrdersData(allOrdersData.map((o:any)=>(
          o._id===otpModel._id ?{...o, orderStatus: "delivered"}: o
        ))));
        alert("Order delivered✅");
        setOtpModel(null);
        setOtp("");

      } catch (error) {
        console.log("Error updating delivery status: ", error);
        alert("Order delivery Error");
      }
    }
 

  return (
     <div className="w-full px-3 sm:px-6 lg:px-10 py-6 text-white">
      <div className="flex justify-between">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center sm:text-left">
          Vendor's Orders
        </h1>
        <p className="text-gray-300">{orders.length} Orders</p>
        </div>
        {/* desktop table */}
        <div className="hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10">
        <table className="w-full text-left">
          <thead className="bg-white/10">
          <tr>
            <th className="p-4">Order ID</th>
            <th className="p-4">Buyer</th>
            <th className="p-4">Products</th>
            <th className="p-4">Payment</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-center">Update</th>
          </tr>

          </thead>
          <tbody>
            {orders.length===0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">No Orders found.</td>
              </tr>
            ):(
              orders.map((order,index)=>(
                <tr key={index} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-4">#{String(order._id)}</td>
                  <td className="p-4">{order.address.name}
                    <div className="text-xs text-gray-400">{order.address.phone}</div>
                  </td>
                  <td className="p-4">
                    {order.products.map((p:any, i:number)=>(
                      <div key={i}>
                        {p.product.title} x {p.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="p-4">{order.paymentMethod.toUpperCase()}
                    <div className="text-xs text-gray-400">{order.isPaid ? "Paid" : "pending"}</div>
                  </td>
                  <td className="p-4">{order.orderStatus.toUpperCase()}</td>
                  <td className="p-4">
                    <select 
                    onChange={async(e)=>{if(e.target.value==="delivered"){
                updateStatus(String(order._id), "delivered");
                setOtpModel(order);
              } else {
              updateStatus(String(order._id), e.target.value)}}}
                    value={order.orderStatus} className="bg-white/10 border border/white-20 rounded px-2 py-1 ">
                    {statusOptions.map((s,i)=>(
                      <option key={i} value={s} className="bg-black text-center">{s}</option>
                    ))}</select>
                  </td>
                  
                  
                </tr>
              ))

            )}
          </tbody>
        </table>
        </div>

        {/* mobile card */}
        <div className="md:hidden flex flex-col gap-4">
          {orders.length===0 ? 
          <div className="text-center text-gray-400 mt-10">
            No Orders found.
          </div>:(
          orders.map((order,index)=>(
          <div key={index} className="bg-white/10 border border-white/20 rounded-xl p-4 space-y-2">
            <div className="flex justify-between mb-2">
              <span className="text-sm">#{String(order._id)}</span>
              <span className="text-green-400 text-sm"> Rs. {order.totalAmount}</span>
             
            

          </div>
          <p className="text-sm">
            <b>Buyer: </b>{order.address.name}
          </p>
          <p className="text-xs text-gray-400">{order.address?.phone}</p>

          <div className="mt-2 text-sm">
            {order.products.map((p:any, i:number)=>(
              <p key={i}>
                {p.product?.title} x {p.quantity}
              </p>
            ))}
            </div>

            <div className="mt-3 text-sm">
              <b>Status:</b>{" "}
              <span className="capitalize">{order.orderStatus}</span>
            </div>
             <select 
             onChange={async(e)=>{
              if(e.target.value==="delivered"){
                updateStatus(String(order._id), "delivered");
                setOtpModel(order);
              } else{
              updateStatus(String(order._id), e.target.value)}}}
             value={order.orderStatus} className="bg-white/10 border border/white-20 rounded px-2 py-1 w-full">
                    {statusOptions.map((s,i)=>(
                      <option key={i} value={s} className="bg-black text-center">{s}</option>
                    ))}</select>
          </div>))
          )}
          

        </div>
        {otpModel &&(
          <div className="inset-0 fixed bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-[#061526] p-6 rounded-xl w-full max-w-md">
              <div className="flex justify-between mb-3">
              <h2 className="text-lg font-semibold">Enter Delivery OTP</h2>
              <button onClick={()=>{setOtpModel(null); setOtp("")}}
              className="p-2 rounded-xl bg-white/10 border border-white/20">x</button>
              </div>
              
              <input type="text" className="w-full bg-white/10 border border-white/20 px-4 py-2 rounded mb-4"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e)=>setOtp(e.target.value)}
              />
              <button onClick={verifyOtp} className="w-full bg-green-600 py-2 rounded flex items-center justify-center gap-2">
                Verify & Deliver
              </button>
            </div>
          </div>
        )}
        
       
      
    </div>
  )
}

export default VendorOrders
