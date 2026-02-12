"use client"
import React from 'react'
import UseGetCurrentUser from './redux/hooks/UseGetCurrentUser'
import UseGetAllVendors from './redux/hooks/UseGetAllVendors';
import UseGetAllProducts from './redux/hooks/UseGetAllProductsData';

function InitUser() {
    UseGetCurrentUser();
    UseGetAllVendors();
    UseGetAllProducts();
    return null;
}

export default InitUser
