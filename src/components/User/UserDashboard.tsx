"use client"
import React from 'react'
import Slider from './Slider'
import CategorySlider from './CategorySlider'

function UserDashboard() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900
     font-sans flex-col">
      <Slider/>
      <CategorySlider/>
    </div>
  )
}

export default UserDashboard
