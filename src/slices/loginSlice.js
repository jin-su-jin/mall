import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginPost } from "../api/memberApi";
import { getCookie, removeCookie, setCookie } from "../util/cookieUtil";

const initState = {
    email :''
}

const loadMemberCookie = () => {
    const memberInfo = getCookie('member');
    console.log("===memberInfo==");
    console.log(memberInfo);
    return memberInfo;

}


//createAsyncThunk (이름 , 처리함수)
export const loginPostAsync = createAsyncThunk('loginPostAsync' , (param)=>loginPost(param));

const loginSlice = createSlice({
    name : 'loginSlice',
    initialState : loadMemberCookie()||initState,
    reducers:{
        login : (state , action) =>{
            //state -> 기존 상태
            //action -> 새로운 상태태
            console.log("login-----------loginSlice");
            console.log(action.payload);
            setCookie("member" , JSON.stringify(action.payload));

            return action.payload; // 새롭게 변경할 상태값을 return
        },
        logout : () => {
            console.log("logout --------------");
            removeCookie('member');
            return {...initState}
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loginPostAsync.fulfilled , (state , action)=>{
            console.log("fulfilled");
            
            // 새롭게 변경할 상태값을 return
            const payload = action.payload;

            if(!payload.error){
                setCookie("member" , JSON.stringify(payload) , 1);
            }
            return payload;
        })
        .addCase(loginPostAsync.pending ,  (state , action)=>{
            console.log("pending");
        })
        .addCase(loginPostAsync.rejected ,  (state , action)=>{
            console.log("rejected");
        })
    }
})

export const {login , logout} = loginSlice.actions;

export default loginSlice.reducer;