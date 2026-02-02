"use client"
import React,{useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import axios from 'axios';
import { setAllVendorsData } from '../vendorSlice';

function UseGetAllVendors() {
    const dispatch=useDispatch<AppDispatch>();
  useEffect(()=>{
    const fetchVendors=async()=>{
        try {
            const res=await axios.get("api/vendor/getAllVendors");
            // console.log("Vendors:", res.data);
            if(res?.data)dispatch(setAllVendorsData(res.data.vendors));
        } catch (error) {
            console.log(`Error fetching vendors: ${error}`);
            dispatch(setAllVendorsData([]));
        }
    }
    fetchVendors();
  },[])
}

export default UseGetAllVendors
