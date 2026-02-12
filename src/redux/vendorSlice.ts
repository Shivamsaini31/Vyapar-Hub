import { IProduct } from "@/model/product.model";
import { IUser } from "@/model/user.model";
import { createSlice } from "@reduxjs/toolkit";


interface IAllVendorsData{
    allVendorsData: IUser[];
    allProductsData: IProduct[];
}
const initialState:IAllVendorsData={
    allVendorsData:[],
    allProductsData:[],
}

const vendorSlice= createSlice({
    name:"vendors",
    initialState,
    reducers:{
        setAllVendorsData:(state, action)=>{
            state.allVendorsData=action.payload;
        },
        setAllProductsData:(state, action)=>{
            state.allProductsData=action.payload;
        },
    },
})

export const {setAllVendorsData}= vendorSlice.actions;
export const {setAllProductsData}= vendorSlice.actions;
export default vendorSlice.reducer;
