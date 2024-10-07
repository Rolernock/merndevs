import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import axios from 'axios'

const initialState = {
  profile: null,
  profiles: [],
  projects: [],
  projectsById: [],
  followers: [],
  following: [],
  followersById: [],
  followingById: [],
  profileById: null
}

export const addProfile = createAsyncThunk(
  '/profiles/addProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/profile', formData)
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const currentProfile = createAsyncThunk(
  '/profiles/currentProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/profile/me')
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const getProfileById = createAsyncThunk(
  '/profiles/getProfileById',
  async (profileId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/profile/${profileId}`)
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const allProfiles = createAsyncThunk(
  '/profiles/allProfiles',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/profile')
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const deleteProfile = createAsyncThunk(
  '/profiles/deleteProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete('/api/profile')
      return toast.success(data.msg)
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const deleteAccount = createAsyncThunk(
  '/profiles/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete('/api/profile/me')
      return toast.success(data.msg)
    } catch (err) {
      const errors = err.response.data.errors
      errors.map(error => toast.error(error.msg))
      return rejectWithValue(errors)
    }
  }
)

export const deleteAccountById = createAsyncThunk(
  '/profiles/deleteAccountById',
  async (profileId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/profile/account/${profileId}`)
      return toast.success(data.msg)
    } catch (err) {
      const errors = err.response.data.errors
      errors.map(error => toast.error(error.msg))
      return rejectWithValue(errors)
    }
  }
)

export const getProjects = createAsyncThunk(
  '/profiles/getProjects',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/profile/projects')
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const getProjectsById = createAsyncThunk(
  '/profiles/getProjectsById',
  async (profileId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/profile/projects/${profileId}`)
      return data
    } catch (err) {
      const errors = err.response.data.errors
      errors.map(error => toast.error(error.msg))
      return rejectWithValue(errors)
    }
  }
)

export const deleteProject = createAsyncThunk(
  '/profiles/deleteProject',
  async (projectId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/profile/projects/${projectId}`)
      return toast.success(data.msg)
    } catch (err) {
      const errors = err.response.data.errors
      errors.map(error => toast.error(error.msg))
      return rejectWithValue(errors)
    }
  }
)

export const deleteProfileById = createAsyncThunk(
  '/profiles/deleteProfileById',
  async (profileId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/profile/${profileId}`)
      return toast.success(data.msg)
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const addProject = createAsyncThunk(
  '/profiles/addProject',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/profile/projects`, formData)
      return data
    } catch (err) {
      const errors = err.response.data.errors
      errors.map(error => toast.error(error.msg))
      return rejectWithValue(errors)
    }
  }
)

export const followUser = createAsyncThunk(
  '/profiles/followUser',
  async (profileId, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/profile/${profileId}`)
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const unfollowUser = createAsyncThunk(
  '/profiles/unfollowUser',
  async (profileId, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/profile/unfollow/${profileId}`)
      return data
    } catch (err) {
      return rejectWithValue(errors)
    }
  }
)

export const getFollowers = createAsyncThunk(
  '/profiles/getFollowers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/profile/followers')
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const getFollowing = createAsyncThunk(
  '/profile/getFollowing',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/profile/following')
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const getFollowersById = createAsyncThunk(
  '/profiles/getFollowersById',
  async (profileId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/profile/followers/${profileId}`)
      return data
    } catch (err) {
      const errors = err.response.data.errors
      return rejectWithValue(errors)
    }
  }
)

export const getFollowingById = createAsyncThunk(
  '/profiles/getFollowingById',
  async (profileId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/profile/following/${profileId}`)
      return data
    } catch (err) {
      const errors = err.response.data.errors
      errors.map(error => toast.error(error.msg))
      return rejectWithValue(errors)
    }
  }
)
const profileSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    clearProfile: state => {
      state.profile = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(addProfile.fulfilled, (state, action) => {
        state.profile = action.payload
      })
      .addCase(allProfiles.fulfilled, (state, action) => {
        state.profiles = action.payload
      })
      .addCase(getProjectsById.fulfilled, (state, action) => {
        state.projectsById = action.payload
      })
      .addCase(currentProfile.fulfilled, (state, action) => {
        state.profile = action.payload
      })
      .addCase(currentProfile.rejected, state => {
        state.profile = null
      })
      .addCase(getFollowers.fulfilled, (state, action) => {
        state.followers = action.payload
      })
      .addCase(getFollowing.fulfilled, (state, action) => {
        state.following = action.payload
      })
      .addCase(getFollowersById.fulfilled, (state, action) => {
        state.followersById = action.payload
      })
      .addCase(getFollowingById.fulfilled, (state, action) => {
        state.followingById = action.payload
      })
      .addCase(deleteAccount.fulfilled, state => {
        state.profile = null
        state.projects = []
        state.followers = null
        state.following = null
      })
      .addCase(deleteProfile.fulfilled, state => {
        state.profile = null
      })
      .addCase(getProfileById.fulfilled, (state, action) => {
        state.profileById = action.payload
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.projects = action.payload
      })
  }
})

export default profileSlice.reducer
