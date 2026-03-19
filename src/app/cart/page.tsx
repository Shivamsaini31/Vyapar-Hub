"use client"
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

function Cart() {
    const [cart, setCart]=useState<any[]>([]);
    const getCart=async()=>{
            try {
                const result=await axios.get("/api/user/cart/get");
                setCart(result.data.cart|| []);
                console.log(cart);
            } catch (error) {
                console.error("Error fetching cart:", error);
                alert("Failed to fetch cart!");
            }
        }

    useEffect(()=>{
        
        getCart();
    },[]);
    const handleRemove=async(productId:string)=>{           
        try {
            const result=confirm("Do you really want to remove this product from the cart?");
            if(result){
            await axios.post("api/user/cart/remove",{productId});
            getCart();
            alert("Product removed from the cart");
            }
            
        } catch (error) {
            console.log(`Error Removing product ${error}`);
            alert("Error removing product from the cart");
        }

    }
    const handleCartUpdate=async(productId:string, quantity:number)=>{
        try{
            if(quantity<=0){
                handleRemove(productId);
                return;
            }
        const result=await axios.post("/api/user/cart/update",{
            productId,
            quantity
        });
        getCart();
    }
    catch(error){
        console.error("Error updating cart:", error);
        alert("Failed to update cart!");
    }

    }
    if(cart===null){
        return <div className="min-h-screen flex items-center justify-center bg-linear-to-br
    from-gray-900 via-black to-gray-900 p-6 text-white text-4xl">Cart Empty</div>
    }
  return (
    <div className="min-h-screen bg-linear-to-br
    from-gray-900 via-black to-gray-900 p-6 text-white ">
        <div className="max-w-5xl mx-auto space-y-4">
            {cart.map((item,index)=>(
                <div key={index} className="bg-white/10 p-4 rounded-lg flex gap-4">
                    <Image src={item.product.image1} alt={item.product.title}
                    width={100} height={100}/>
                    <div className="flex-1">
                        <h3 className="font-bold">{item.product.title}</h3>
                        <p className="text-green-500">₹ {item.product.price}</p>

                        <div className="flex gap-2 mt-2">
                            <button onClick={()=>{handleCartUpdate(item.product._id, item.quantity-1)}} className="border border-gray-600 px-2 rounded">-</button>
                            <span>{item.quantity}</span>
                            <button onClick={()=>{handleCartUpdate(item.product._id, item.quantity+1)}} className="border border-gray-600 px-2 rounded">+</button>
                        </div>
                        <div className="w-full flex justify-start gap-4 align-center">
                        <button className="mt-3 bg-blue-600 px-4 py-2 rounded"> Checkout this product</button>
                        <button onClick={()=>handleRemove(item.product._id)} className="block mt-2 text-red-400 cursor-pointer">Remove</button>
                        </div>
                        
                        
                    </div>
                    
                    <div className="font-bold">₹{item.product.price * item.quantity}</div>
                </div>
            ))}

        </div>
      
    </div>
  )
}

export default Cart
