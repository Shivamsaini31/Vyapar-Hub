"use client"

import React, { useEffect, useState } from 'react'
import {AnimatePresence, motion} from 'motion/react' 
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaChevronCircleRight } from "react-icons/fa";

function CategorySlider() {
    const [startIndex,setStartIndex]=useState(0);
    useEffect(()=>{
        const interval=setInterval(()=>{
            setStartIndex((startIndex)=>startIndex===0?5:0);
        },5000)
        return ()=>clearInterval(interval);
},[]);
    const categories=[
        {label:"Fashion & Lifestyle", icon:"👗"},
        {label:"Electronics & Gadgets", icon:"📱"},
        {label:"Home & Living", icon:"🏠"},
        {label:"Beauty & Personal Care", icon:"💄"},
        {label:"Toys, Kids & Baby", icon:"🧸"},
        {label:"Food & Grocery", icon:"🛒"},
        {label:"Sports & Fitness", icon:"⚽"},
        {label:"Automotive Accessories", icon:"🚗"},
        {label:"Gifts & Handcrafts", icon:"🎁"},
        {label:"Books & Stationery", icon:"📚"},
    ];
  return (
    <motion.div
    initial={{opacity:0, y:60}} 
    whileInView={{opacity:1, y:0}}
    transition={{duration:0.8}}
    viewport={{once:true}}
    className="w-full mx-auto p-8 text-center bg-gradient-to-br from-black via-gray-900 to-black relative">
        <h2 className="text-3xl font-semibold mb-6 text-white">Shop by Categories</h2>
        <div className="relative ">
            <AnimatePresence mode="wait">
                <motion.div
                key={startIndex}
                initial={{opacity:0, x:120}}
                animate={{opacity:1, x:0}}
                exit={{opacity:0, x:-120}}
                transition={{duration:0.6}}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
                >
                    {
                        categories.slice(startIndex,startIndex+5).map((item,index)=>(
                            <motion.div key={index}
                            whileHover={{scale:1.03}}
                            className="bg-white/10 border border-white/20 p-6 rounded-xl cursor-pointer text-white">
                                <span className="text-4xl mb-2 block">{item.icon}</span>
                                <p className="text-sm font-medium">{item.label}</p>
                            </motion.div>
                        ))
                    }

                </motion.div>
            </AnimatePresence>
            <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800/60
             text-white px-1 py-1 rounded-full cursor-pointer " onClick={()=>setStartIndex(0)}
            ><FaCircleChevronLeft size={24}/></button>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800/60
             text-white px-1 py-1 rounded-full cursor-pointer" onClick={()=>setStartIndex(5)}
            ><FaChevronCircleRight size={24}/></button>
        </div>

    </motion.div>
  )
}

export default CategorySlider
