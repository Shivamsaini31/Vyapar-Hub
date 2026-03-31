"use client"
import {useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import axios from 'axios';
import {setAllOrdersData} from "../userSlice"

function UseGetAllOrders() {
    const dispatch=useDispatch<AppDispatch>();
  useEffect(()=>{
    const fetchAllOrders=async()=>{
        try {
            const res=await axios.get("/api/order/getAllOrders");
            // console.log("products:", res.data);
            if(res?.data)dispatch(setAllOrdersData(res.data.orders));
        } catch (error) {
            console.log(`Error fetching products: ${error}`);
            dispatch(setAllOrdersData([]));
        }
    }
    fetchAllOrders();
  },[])
}

export default UseGetAllOrders
