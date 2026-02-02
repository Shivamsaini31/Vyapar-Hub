"use client"
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { setUserData } from '../userSlice';

function UseGetCurrentUser() {
    const dispatch=useDispatch<AppDispatch>();
  useEffect(()=>{
    const fetchUser=async()=>{
        try {
            const res=await axios.get("/api/user/getCurrentUser");
            console.log("Current user:", res.data);
            if(res?.data)dispatch(setUserData(res.data));
        } catch (error) {
            console.log(`Error fetching current user: ${error}`);
            dispatch(setUserData(null));
        }
    
  }
  fetchUser();
},[])
}

export default UseGetCurrentUser
