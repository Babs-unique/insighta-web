import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface AuthState {
user: any // Replace 'any' with the actual user type
isAuthenticated: boolean
}

const initialState: AuthState = {
user: null,
isAuthenticated: false,
}

export const authSlice = createSlice({
name: 'auth',
initialState,
reducers: {
    login: (state, action: PayloadAction<any>) => {
    state.user = action.payload
    state.isAuthenticated = true
    },
    logout: (state) => {
    state.user = null
    state.isAuthenticated = false
    },
},
})

// Action creators are generated for each case reducer function
export const { login, logout } = authSlice.actions

export default authSlice.reducer