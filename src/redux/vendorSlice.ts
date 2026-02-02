import { IUser } from "@/model/user.model";
import { createSlice } from "@reduxjs/toolkit";


interface IAllVendorsData{
    allVendorsData: IUser[];
}
const initialState:IAllVendorsData={
    allVendorsData:[],
}

const vendorSlice= createSlice({
    name:"vendors",
    initialState,
    reducers:{
        setAllVendorsData:(state, action)=>{
            state.allVendorsData=action.payload;
        }
    },
})

export const {setAllVendorsData}= vendorSlice.actions;
export default vendorSlice.reducer;
