"use client"
import React from 'react'
import UseGetCurrentUser from './redux/hooks/UseGetCurrentUser'
import UseGetAllVendors from './redux/hooks/UseGetAllVendors';
import UseGetAllProducts from './redux/hooks/UseGetAllProductsData';
import UseGetAllOrders from './redux/hooks/UseGetAllOrders';

function InitUser() {
    UseGetCurrentUser();
    UseGetAllVendors();
    UseGetAllProducts();
    UseGetAllOrders();
    return null;
}

export default InitUser
