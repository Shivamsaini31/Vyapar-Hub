import { IOrder } from "@/model/order.model";
import { IUser } from "@/model/user.model";
import { createSlice } from "@reduxjs/toolkit";
import { setAllProductsData } from "./vendorSlice";


interface IUserData{
    userData: IUser | null,
    allOrdersData: IOrder[] 
}
const initialState:IUserData={
    userData: null,
    allOrdersData: []
}

const userSlice= createSlice({
    name:"user",
    initialState,
    reducers:{
        setUserData:(state, action)=>{
            state.userData=action.payload;
        },
        setAllOrdersData:(state, action)=>{
            state.allOrdersData=action.payload;
        }
    },
})

export const {setUserData}= userSlice.actions;
export default userSlice.reducer;
