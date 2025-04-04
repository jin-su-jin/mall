import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartItems , postChangeCart } from "../api/cartApi";

export const getCartItemAsync = createAsyncThunk('getCartItemAsync', ()=>{
    return getCartItems();
});

export const postChangeCartAsync = createAsyncThunk('postChangeCartAsync', (param)=>{
    return postChangeCart(param);
});

const initState = [];

const cartSlice = createSlice({
    name :'cartSlice',
    initialState:initState,
    extraReducers : (builder)=>{
        //장바구니 가져옴
        builder.addCase(getCartItemAsync.fulfilled , (state,action)=>{
            console.log("getCartItemAsync.fulfilled");
            console.log(action.payload);
            if(action.payload.error){
                return initState;
            }else{
                return action.payload;
            }
           
        })
        .addCase(postChangeCartAsync.fulfilled, (state, action)=>{
            //장바구니 추가하기
            console.log("postChangeCartAsync.fulfilled");
            console.log(action.payload);
            return action.payload;
        })
    }
});

export default cartSlice.reducer;