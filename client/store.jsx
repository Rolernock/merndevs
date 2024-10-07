import { configureStore } from '@reduxjs/toolkit'
import userReducer from './src/slices/userSlice'
import profileReducer from './src/slices/profileSlice'
import postReducer from './src/slices/postSlice'

const store = configureStore({
  reducer: {
    users: userReducer,
    profiles: profileReducer,
    posts: postReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
})

export default store
