import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    userdata: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        login :(state,action)=>{
            state.isAuthenticated = true;
            state.userdata = action.payload;
        },
        logout: (state)=>{
            state.isAuthenticated = false;
            state.userdata = null;
        }
    }
})

export const {login,logout} = authSlice.actions; 

export default authSlice.reducer