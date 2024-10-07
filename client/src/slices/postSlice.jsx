import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import axios from 'axios'

const initialState = {
  post: null,
  comments: [],
  posts: [],
  likes: []
}

export const addPost = createAsyncThunk(
  '/posts/addPost',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/posts', formData)
      return data
    } catch (err) {
      const errors = err.response.data.errors
      errors.map(error => toast.error(error.msg))
      return rejectWithValue(errors)
    }
  }
)

export const getAllPosts = createAsyncThunk(
  '/posts/getAllPosts',
  async ({ pageNumber = 1, keyword = '' }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/posts?pageNumber=${pageNumber}&keyword=${keyword}`
      )
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const uploadPostImage = createAsyncThunk(
  '/posts/uploadPostImage',
  async (imageData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/uploads', imageData)
      return data
    } catch (err) {
      const errors = err.response.data.errors
      errors.map(error => toast.error(error.msg))
      return rejectWithValue(errors)
    }
  }
)

export const getPostById = createAsyncThunk(
  '/posts/getPostById',
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/posts/${postId}`)
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const likeAPost = createAsyncThunk(
  '/posts/likeAPost',
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/posts/${postId}/like`)
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const unlikePost = createAsyncThunk(
  '/posts/unlikePost',
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/posts/${postId}/unlike`)
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const readPost = createAsyncThunk(
  '/post/readPost',
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/posts/${postId}`)
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const deletePost = createAsyncThunk(
  '/posts/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/posts/${postId}`)
      return toast.success(data.msg)
    } catch (err) {
      const errors = err.response.data.errors
      // errors.map(error => toast.error(error.msg))
      return rejectWithValue(errors)
    }
  }
)

export const addComment = createAsyncThunk(
  '/posts/addComment',
  async ({ postId, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/posts/${postId}/comment`, formData)
      return data
    } catch (err) {
      const errors = err.response.data.errors
      errors.map(error => toast.error(error.msg))
      return rejectWithValue(errors)
    }
  }
)

export const deleteComment = createAsyncThunk(
  '/posts/deleteComment',
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `/api/posts/${postId}/comment/${commentId}`
      )
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const likeComment = createAsyncThunk(
  '/posts/likeComment',
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `/api/posts/${postId}/comment/${commentId}/likes`
      )
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const unlikeComment = createAsyncThunk(
  '/posts/unlikeComment',
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `/api/posts/${postId}/comment/${commentId}/likes`
      )
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const getCommentLikes = createAsyncThunk(
  '/posts/getCommentLikes',
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/posts/${postId}/comment/${commentId}/likes`
      )
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const getComments = createAsyncThunk(
  '/posts/getComments',
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/posts/${postId}/comment`)
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const addNestedComment = createAsyncThunk(
  '/posts/addNestedComment',
  async ({ postId, commentId, replyContent }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `/api/posts/${postId}/comment/${commentId}/nested`,
        replyContent
      )
      return data
    } catch (err) {
      const errors = err.response.data.errors
      errors.map(error => toast.error(error.msg))
      return rejectWithValue(errors)
    }
  }
)

export const likeNestedComment = createAsyncThunk(
  '/posts/likeNestedComment',
  async ({ postId, commentId, id }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `/api/posts/${postId}/comment/${commentId}/nested/${id}`
      )
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const unlikeNestedComment = createAsyncThunk(
  '/posts/unlikeNestedComment',
  async ({ postId, commentId, id }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(
        `/api/posts/${postId}/comment/${commentId}/nested/${id}`
      )
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const deleteNestedComment = createAsyncThunk(
  '/posts/deleteNestedComment',
  async ({ postId, commentId, id }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `/api/posts/${postId}/comment/${commentId}/nested/${id}`
      )
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.posts = action.payload
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.post = action.payload
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.comments = action.payload
      })
      .addCase(getCommentLikes.fulfilled, (state, action) => {
        state.likes = action.payload
      })
  }
})

export default postSlice.reducer
