"use client"
import UseGetAllOrders from '@/redux/hooks/UseGetAllOrders';
import UseGetCurrentUser from '@/redux/hooks/UseGetCurrentUser';
import { RootState } from '@/redux/store';
import React from 'react'
import { FiTruck } from 'react-icons/fi';
import { useSelector } from 'react-redux'
import {motion} from "motion/react";  

function Orders() {

    UseGetCurrentUser();
    UseGetAllOrders();
    const {allOrdersData}=useSelector((state:RootState)=>state.user);
    const {userData}=useSelector((state:RootState)=>state.user);
    const orders=Array.isArray(allOrdersData)?
    allOrdersData.filter((o)=>String(o.buyer._id)===String(userData?._id)):[];
    console.log("orders: ",orders);

    const formatDate=(date:string)=>{
        if(!date) return "";
        const d= new Date(date);
        return d.toLocaleDateString("en-IN",{
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"

        });

    }
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        My Orders
                    </h1>
                    <p className="text-sm text-gray-300">All orders placed by you</p>
                </div>
                <div className="text-sm text-gray-300">{orders?.length} orders</div>

            </div>
            {/* lg device */}
            <div className="hidden lg:block bg-white/5 border border-white/10 
            rounded-xl overflow-auto shadow-xl shadow-black/40 ">
                <table className="w-full text-left">
                    <thead className="text-xs bg-white/5 border-b border-white/10 text-gray-300 uppercase tracking-wider">
                    <tr>
                        <th className="px-4 py-4">OrderId</th>
                        <th className="px-4 py-4">Date</th>
                        <th className="px-4 py-4">Products</th>
                        <th className="px-4 py-4">Vendor</th>
                        <th className="px-4 py-4">Payment</th>
                        <th className="px-4 py-4">Status</th>
                        <th className="px-4 py-4 text-right">Total</th>
                        <th className="px-4 py-4 text-center">Actions</th>
                    </tr>

                    </thead>
                    <tbody>
                        {orders.length!==0 ? (orders.map((o, i)=>(
                            <tr key={i} className='border-t border-white/5 hover:bg-white/10 transition-all duration-200'>
                                <td className="px-4 py-4 text-sm">#{String(o._id)}</td>
                                <td className="px-4 py-4 text-sm">{formatDate(String(o.createdAt))}</td>
                                <td className="px-4 py-4 text-sm">{o.products.map((p, idx)=>(
                                    <div key={idx} className="text-gray-200">{p.product.title} x {p.quantity}</div>
                                ))}</td>
                                <td className="px-4 py-4 text-sm">{o.productVendor.shopName}</td>
                                <td className="px-4 py-4 text-sm">{o.paymentMethod.toUpperCase()}
                                    <div className={`text-xs ${o.isPaid?
                                        "text-green-400" : "text-yellow-400"
                                    }`}>{o.isPaid? "Paid" : "pending"}</div>
                                    
                                </td>
                                <td className="px-4 py-4 text-sm">{o.orderStatus.toUpperCase()}</td>
                                <td className="px-4 py-4 text-nowrap text-right text-green-300 font-semibold">₹ {o.totalAmount}</td>
                                <td className="px-4 py-4 flex justify-center ">
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-white/10 rounded hover:bg-white/20 cursor-pointer text-nowrap">Check Details</button>
                                        <button className="px-3 py-1 bg-white/10 rounded hover:bg-white/20 flex gap-0.5 items-center justify-center cursor-pointer text-nowrap">
                                        <FiTruck/><span>Track Order</span>
                                        </button>
                                    </div>
                                </td>
                        </tr>
                        ))):(
                            <tr>
                                <td colSpan={8} className="px-4 py-4 text-center text-gray-300">
                                    No orders found!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
            </div>
            <div className="lg:hidden space-y-4">
                        {orders.length!==0?(
                            orders.map((o,i)=>(
                                <motion.div
                                initial={{opacity:0, scale:0.95}}
                                animate={{opacity:1, scale:1}}
                                transition={{duration:0.4}}
                                key={i}
                                className=" bg-white/5 border border-white/10 rounded-xl
                                p-4"><div className="flex justify-between">
                                    <div>
                                        <div className="text-sm text-gray-300">#{String(o._id)}</div>
                                        <div className="text-xs text-gray-400">{formatDate(String(o.createdAt))}</div>
                                        <div className="text-sm text-gray-300 mt-1">{o.productVendor.shopName}</div>
                                    </div>
                                    <div className="text-green-300 font-bold text-right">₹ {o.totalAmount}</div>
                                </div>
                                <div className="mt-3 flex justify-between">
                                    <div >
                                        <div className="text-md text-gray-400">Payment Method: {o.paymentMethod.toUpperCase()}</div>
                                        <div className={`text-xs ${o.isPaid?"text-green-400":"text-yellow-400"}`}>
                                            {o.isPaid? "Paid": "Pending"}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-400">Status</div>
                                        <div className="text-sm font-semibold" >{o.orderStatus.toUpperCase()}</div>
                                    </div>
                                </div>
                                <div className="mt-3 space-y-1">
                                    {o.products.map((p,i)=>(
                                        <div key={i} className="text-gray-200">{p.product.title} x{p.quantity}</div>
                                    ))}
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <button className="flex-1 py-2 bg-white/10 rounded">Check Details</button>
                                    <button className="flex-1 py-2 bg-white/10 rounded  flex items-center justify-center gap-1"><FiTruck/> Track Order</button>
                                </div>
                                </motion.div>
                            ))
                        ):(
                            <div className="text-xl text-center text-white bg-white/5 border border-white/10
                            p-4 rounded-xl">No orders found!</div>
                        )}
                </div>

        </div>
      
    </div>
  )
}

export default Orders
