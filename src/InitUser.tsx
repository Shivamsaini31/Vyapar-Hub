"use client"
import React from 'react'
import UseGetCurrentUser from './redux/hooks/UseGetCurrentUser'
import UseGetAllVendors from './redux/hooks/UseGetAllVendors';

function InitUser() {
    UseGetCurrentUser();
    UseGetAllVendors();
    return null;
}

export default InitUser
