import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: "user",
    initialState:{
        userData: null
    },
    reducers:{
        setUserData : ((state,action) => {
            state.userData = action.payload //userData mein value update ho jaegi

        })
    }
})

export const {setUserData} = userSlice.actions 

export default userSlice.reducer;