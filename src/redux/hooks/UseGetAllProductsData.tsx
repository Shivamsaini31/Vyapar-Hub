"use client"
import {useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import axios from 'axios';
import { setAllProductsData } from '../vendorSlice';

function UseGetAllProducts() {
    const dispatch=useDispatch<AppDispatch>();
  useEffect(()=>{
    const fetchProducts=async()=>{
        try {
            const res=await axios.get("api/vendor/allProducts");
            console.log("products:", res.data);
            if(res?.data)dispatch(setAllProductsData(res.data.products));
        } catch (error) {
            console.log(`Error fetching products: ${error}`);
            dispatch(setAllProductsData([]));
        }
    }
    fetchProducts();
  },[])
}

export default UseGetAllProducts
