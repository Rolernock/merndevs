import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const initialState = {
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,
  userById: null,
  users: [],
  messages: []
}

export const registerUser = createAsyncThunk(
  '/users/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/users', formData)
      return data
    } catch (err) {
      const errors = err.response.data.errors
      errors.map(error => toast.error(error.msg))
      return rejectWithValue(errors)
    }
  }
)

export const loginUser = createAsyncThunk(
  '/users/loginUser',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/users/login', formData)
      toast.success(`Welcome back ${data.name}`)
      return data
    } catch (err) {
      const errors = err.response.data.errors
      errors.map(error => toast.error(error.msg))
      return rejectWithValue(errors)
    }
  }
)

export const allUsers = createAsyncThunk(
  '/users/allUsers',
  async ({ keyword = '' }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/users?keyword=${keyword}`)
      return data
    } catch (err) {
      const errors = err.response.data.errors
      errors.map(error => toast.error(error.msg))
      return rejectWithValue(errors)
    }
  }
)

export const allMessages = createAsyncThunk(
  '/users/messages',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/users/messages')
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const updateUser = createAsyncThunk(
  '/users/updateUser',
  async ({ formData, userId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/users/${userId}`, formData)
      return data
    } catch (err) {
      const errors = err.response.data.errors
      errors.map(error => toast.error(error.msg))
      return rejectWithValue(errors)
    }
  }
)

export const deleteUser = createAsyncThunk(
  '/users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/users/${userId}`)
      return toast.success(data.msg)
    } catch (err) {
      const errors = err.response.data.errors
      errors.map(error => toast.error(error.msg))
      return rejectWithValue(errors)
    }
  }
)

export const logOut = createAsyncThunk(
  '/users/logOut',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/users/logout')
      return toast.success(data.msg)
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const getUserById = createAsyncThunk(
  '/users/getUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/users/${userId}`)
      return data
    } catch (err) {
      const errors = err.response.data.errors
      errors.map(error => toast.error(error.msg))
      return rejectWithValue(errors)
    }
  }
)

export const resetPasswordEmail = createAsyncThunk(
  '/users/resetPasswordEmail',
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/users/forgot-password', { email })
      return toast.success(data.msg)
    } catch (err) {
      const errors = err.response.data.errors
      errors.map(error => toast.error(error.msg))
      return rejectWithValue(errors)
    }
  }
)

export const sendMessage = createAsyncThunk(
  '/users/sendMessage',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/users/messages', formData)
      toast.success(data.msg)
      return data
    } catch (err) {
      const errors = err.response.data.errors
      errors.map(error => toast.error(error.msg))
      return rejectWithValue(errors)
    }
  }
)

export const getMessages = createAsyncThunk(
  '/users/getMessages',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/users/message')
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const deleteMessage = createAsyncThunk(
  '/users/deleteMessage',
  async (messageId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/users/messages/${messageId}`)
      return toast.success(data.msg)
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const resetPassword = createAsyncThunk(
  '/users/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/api/users/reset-password/${token}`, {
        password
      })
      return toast.success(data.msg)
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

const userSlice = createSlice({
  name: 'users',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload
        localStorage.setItem('user', JSON.stringify(action.payload))
      })
      .addCase(registerUser.rejected, state => {
        state.user = null
        localStorage.removeItem('user')
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload
        localStorage.setItem('user', JSON.stringify(action.payload))
      })
      .addCase(loginUser.rejected, state => {
        state.user = null
        localStorage.removeItem('user')
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.messages = action.payload
      })
      .addCase(allUsers.fulfilled, (state, action) => {
        state.users = action.payload
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.userById = action.payload
      })
      .addCase(logOut.fulfilled, state => {
        state.user = null
        localStorage.removeItem('user')
      })
      .addCase(allMessages.fulfilled, (state, action) => {
        state.messages = action.payload
      })
  }
})

export default userSlice.reducer
