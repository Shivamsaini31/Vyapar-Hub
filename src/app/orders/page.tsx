"use client"
import { RootState } from '@/redux/store';
import React from 'react'
import { useSelector } from 'react-redux'

function Orders() {
    const {allOrders}=useSelector((state:RootState)=>state.user);
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br
    from-gray-900 via-black to-gray-900 text-white text-4xl">
        Orders Page
      
    </div>
  )
}

export default Orders
