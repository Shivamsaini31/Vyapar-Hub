"use client"
import {useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import axios from 'axios';
import { setAllProductsData } from '../vendorSlice';

function UseGetAllOrders() {
    const dispatch=useDispatch<AppDispatch>();
  useEffect(()=>{
    const fetchAllOrders=async()=>{
        try {
            const res=await axios.get("/api/order/getAllOrders");
            // console.log("products:", res.data);
            if(res?.data)dispatch(setAllProductsData(res.data.orders));
        } catch (error) {
            console.log(`Error fetching products: ${error}`);
            dispatch(setAllProductsData([]));
        }
    }
    fetchAllOrders();
  },[])
}

export default UseGetAllOrders
