"use client"
import UseGetAllOrders from '@/redux/hooks/UseGetAllOrders';
import UseGetCurrentUser from '@/redux/hooks/UseGetCurrentUser';
import { RootState } from '@/redux/store';
import React from 'react'
import { FiTruck } from 'react-icons/fi';
import { useSelector } from 'react-redux'
import {motion} from "motion/react"; 
import { useState } from 'react'; 

function Orders() {

    UseGetCurrentUser();
    UseGetAllOrders();
    const {allOrdersData}=useSelector((state:RootState)=>state.user);
    const {userData}=useSelector((state:RootState)=>state.user);
    const orders=Array.isArray(allOrdersData)?
    allOrdersData.filter((o)=>String(o.buyer._id)===String(userData?._id)):[];
    // console.log("orders: ",orders);
    const [selectedOrder,setSelectedOrder]=useState<any | null>(null);
    const [trackOrderModel, setTrackOrderModel]=useState<any|null>(null);

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
    const cancelDisabled=(order:any)=> order.isPaid===true && order.paymentMethod==="stripe";
    const status=["pending", "confirmed", "shipped", "delivered", "returned"];
    const renderTrackStep=(currentStatus:string)=>{
        return(
            <div className="relative pl-6">
            <div className="absolute top-0 left-8 w-[1px] h-full bg-gray-600"></div>
                {status.map((s,i)=>{
                    const active= currentStatus===s;
                    return (
                        <div key={i} className="relative mb-6 flex items-start">
                            {/* dot */}
                            <div className={`w-4 h-4 rounded-full ${active ?
                                "bg-blue-500 shadow-lg shadow-blue-500/50":
                                "bg-gray-500"
                            }`}></div>
                            <div className="ml-4 text-sm capitalize" >{s}</div>
                        </div>
                    )
                })}
            
            </div>
        )
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
                                        <button className="px-3 py-1 bg-white/10 rounded hover:bg-white/20 cursor-pointer text-nowrap"
                                        onClick={()=>{setSelectedOrder(o)}}>Check Details</button>
                                        <button className="px-3 py-1 bg-white/10 rounded hover:bg-white/20 flex gap-0.5 items-center justify-center cursor-pointer text-nowrap"
                                        onClick={()=>{setTrackOrderModel(o)}}>
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
                                    <button className="flex-1 py-2 bg-white/10 rounded" onClick={()=>{setSelectedOrder(o)}}>Check Details</button>
                                    <button className="flex-1 py-2 bg-white/10 rounded  flex items-center justify-center gap-1"
                                    onClick={()=>setTrackOrderModel(o)}><FiTruck/> Track Order</button>
                                </div>
                                </motion.div>
                            ))
                        ):(
                            <div className="text-xl text-center text-white bg-white/5 border border-white/10
                            p-4 rounded-xl">No orders found!</div>
                        )}
                </div>

        </div>
        {selectedOrder && (
             <div className="fixed inset-0 flex items-center justify-center p-4 z-50 backdrop-blur-md">
                <motion.div
                initial={{scale: 0.95, opacity: 0}}
                animate={{scale:1, opacity:1}}
                transition={{duration:0.4}}
                className="relative z-10 w-full max-w-3xl bg-[#061526] border
                border-white/10 p-6 rounded-xl shadow-2xl shadow-black/40">
<div className="flex justify-between">
    
                    <h2 className="text-lg font-semibold">Order Details #{String(selectedOrder._id)}</h2>
                    <motion.button onClick={()=>setSelectedOrder(null)}
                    className="border border-white/20 bg-white/10 rounded-full px-2 py-1 cursor-pointer "> X </motion.button>
                    </div>
                    <p className="text-sm text-gray-300">{formatDate(String(selectedOrder.createdAt))}</p>

                    <hr className="my-4 border-white/10"/>
                    <h3 className="font-semibold mb-2">Product</h3>
                    {selectedOrder.products.map((p:any,i:any)=>(
                        <div key={i} className="flex justify-between bg-white/5 p-3 rounded mb-2">
                            <div>
                                <div className="font-medium">{p.product.title}</div>
                                <div>Qty: {p.quantity} * Price: {p.price}</div>
                            </div>
                        </div>
                    ))}
                    <hr className="my-4 border-white/10"/>
                    
                
                    <h3 className="font-semibold mb-2">Invoice</h3>
                    <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                            <span>Product total</span>
                            <span>₹ {selectedOrder.productsTotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Charge</span>
                            <span>₹ {selectedOrder.deliveryCharge}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Service Charge</span>
                            <span>₹ {selectedOrder.serviceCharge}</span>
                        </div>
                    </div>
                    <hr className="my-4 border-white/10"/>

                    <div className="flex justify-between font-semibold text-green-300">
                        <span>Total Amount</span>
                        <span>₹ {selectedOrder.totalAmount}</span>
                    </div>
                    {selectedOrder.isPaid===true && selectedOrder.paymentMethod ==="stripe" &&(
                        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs rounded-lg p-3 mt-4">
                            <p className="font-semibold mt-1">Important Note:</p>
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Order cancellation is not allowed for online payments. Please contact support for any issues.</li>
                                <li>You can only return the product after delivery.</li> 
                                <li>On return, you will receive only the product amount.</li>
                                <li> <b> Delivery and service charges are non-refundable</b></li>

                            </ul>
                        </div>
                    )}
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={()=>setSelectedOrder(null)} className='px-4 py-2 bg-white/10 rounded'>Cancel</button>
                        <button className="px-4 py-2 rounded flex items-center gap-2 transition bg-blue-500 hover:bg-blue-700 "
                        onClick={()=>setTrackOrderModel(selectedOrder)}>
                            <FiTruck/>Track Order
                        </button>
                        <button className={`px-4 py-2 rounded ${cancelDisabled(selectedOrder)
                            ? "bg-white/10 text-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}>
                            Cancel Order
                        </button>
                    </div>


                </motion.div>
             </div>
        )}
        {trackOrderModel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                initial={{scale:0.95, opacity:0}}
                animate={{scale:1, opacity:1}}
                transition={{duration:0.4}}
                className="z-50 relative w-full max-w-md bg-[#061526] border border-white/10 p-6 rounded-xl space-y-2">
                    <h2 className="text-xl font-semibold">Track Order
                    </h2>
                    <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                        <h2 className="text-lg font-bold mb-2 ">Complete Delivery Address
                    </h2>
                        <div className="flex justify-start gap-2">
                            <span className="font-semibold">Buyer Name:</span>
                            <span>{trackOrderModel.address.name}</span>

                        </div>
                        <div className="flex justify-start gap-2">
                            <span className="font-semibold">Delivery Address:</span>
                            <span>{trackOrderModel.address.address}</span>

                        </div>
                        <div className="flex justify-start gap-2">
                            <span className="font-semibold">City:</span>
                            <span>{trackOrderModel.address.city}</span>

                        </div>
                        <div className="flex justify-start gap-2">
                            <span className="font-semibold">Pincode:</span>
                            <span>{trackOrderModel.address.pinCode}</span>

                        </div>
                        <div className="flex justify-start gap-2">
                            <span className="font-semibold">Phone:</span>
                            <span>{trackOrderModel.address.phone}</span>

                        </div>
                    </p>
                    {renderTrackStep(trackOrderModel.orderStatus)}
                    <button onClick={()=>setTrackOrderModel(null)} className='px-4 py-2 bg-white/10 rounded cursor-pointer'>Cancel</button>
                </motion.div>
                
                
            </div>
        )}
      
    </div>
  )
}

export default Orders
