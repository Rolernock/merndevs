import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import UserModel from '../models/UserModel.js'
import CommentModel from '../models/CommentModel.js'
import PostModel from '../models/PostModel.js'
import ProfileModel from '../models/ProfileModel.js'

//Helper functions
const findProfileByUserId = async (userId, res) => {
  const profile = await ProfileModel.findOne({ user: userId })
  if (!profile) {
    res.status(404)
    throw new Error('Profile not found')
  }
  return profile
}

const findProfileById = async (profileId, res) => {
  const profile = await ProfileModel.findById(profileId)
  if (!profile) {
    res.status(404)
    throw new Error('Profile not found')
  }
  return profile
}

const splitStringToArray = str =>
  str
    ? str
        .toString()
        .split(',')
        .map(item => item.trim())
    : []

//@route - POST - /api/profile
//@desc - Add Profile
//@access - Private
export const addProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { githubusername, website, location, skills, bio, X, linkedin } =
    req.body
  const profileFields = {
    name: req.user.name,
    avatar: req.user.avatar,
    user: req.user._id,
    githubusername,
    website,
    location,
    bio,
    skills: splitStringToArray(skills),
    social: { X, linkedin }
  }
  let profile = await ProfileModel.findOne({ user: req.user._id })
  if (profile) {
    profile = await ProfileModel.findOneAndUpdate(
      { user: req.user._id },
      { $set: profileFields },
      { new: true }
    )
    return res.json(profile)
  }
  profile = await ProfileModel.create(profileFields)
  return res.json(profile)
})

//@route - GET - /api/profile
//@desc - Get all profiles
//@access - Public
export const allProfiles = asyncHandler(async (req, res) => {
  const profiles = await ProfileModel.find()
  if (!profiles.length) {
    res.status(404)
    throw new Error('No profiles found')
  }

  return res.json(profiles)
})

//@route - GET - /api/profile/me
//@desc - Get current profile
//@access - Private
export const currentProfile = asyncHandler(async (req, res) => {
  const profile = await findProfileByUserId(req.user._id, res)
  return res.json(profile)
})

//@route - GET - /api/profile/:profileId
//@desc - Get profile by id
//@access - Public
export const getProfileById = asyncHandler(async (req, res) => {
  const profile = await findProfileById(req.params.profileId, res)
  return res.json(profile)
})

//@route - GET - /api/profile/followers
//@desc - Get followers
//@access - Private
export const getFollowers = asyncHandler(async (req, res) => {
  const profile = await findProfileByUserId(req.user._id, res)
  return res.json(profile.followers)
})

//@route - GET - /api/profile/following
//@desc - Get following
//@access - Private
export const getFollowing = asyncHandler(async (req, res) => {
  const profile = await findProfileByUserId(req.user._id, res)
  return res.json(profile.following)
})

//@route - GET - /api/profile/followers/:profileId
//@desc - Get followers by profileId
//@access - Private
export const getFollowersById = asyncHandler(async (req, res) => {
  const profile = await findProfileById(req.params.profileId, res)
  return res.json(profile.followers)
})

//@route - GET - /api/profile/following/:profileId
//@desc - Get following by profileId
//@access - Private
export const getFollowingById = asyncHandler(async (req, res) => {
  const profile = await findProfileById(req.params.profileId, res)
  return res.json(profile.following)
})

//@route - PUT - /api/profile/:profileId
//@desc - Follow a user
//@access - Private
export const followUser = asyncHandler(async (req, res) => {
  const currentUserProfile = await findProfileByUserId(req.user._id, res)
  const targetUserProfile = await findProfileById(req.params.profileId, res)

  if (targetUserProfile._id.equals(currentUserProfile._id)) {
    res.status(400)
    throw new Error('You cannot follow yourself')
  }

  const alreadyFollowing = targetUserProfile.followers.some(
    index => index._id.toString() === currentUserProfile._id.toString()
  )

  if (alreadyFollowing) {
    res.status(400)
    throw new Error('Already following')
  }
  const currentProfile = {
    _id: currentUserProfile._id,
    name: currentUserProfile.name,
    bio: currentUserProfile.bio,
    avatar: currentUserProfile.avatar,
    createdAt: currentUserProfile.createdAt
  }
  const targetProfile = {
    _id: targetUserProfile._id,
    name: targetUserProfile.name,
    bio: targetUserProfile.bio,
    avatar: targetUserProfile.avatar,
    createdAt: currentUserProfile.createdAt
  }

  currentUserProfile.following.push(targetProfile)
  targetUserProfile.followers.push(currentProfile)
  await currentUserProfile.save()
  await targetUserProfile.save()
  return res.json({ msg: 'following' })
})

//@route - PUT - /api/profile/unfollow/:profileId
//@desc - Unfollow User
//@access - Private
export const unfollowUser = asyncHandler(async (req, res) => {
  const currentUserProfile = await findProfileByUserId(req.user._id, res)
  const targetUserProfile = await findProfileById(req.params.profileId, res)

  const followerIndex = targetUserProfile.followers.findIndex(
    index => index._id === currentUserProfile._id.toString()
  )

  const followingIndex = currentUserProfile.following.findIndex(
    index => index._id === targetUserProfile._id.toString()
  )

  if (followingIndex === -1) {
    res.status(400)
    throw new Error('Not following')
  }

  targetUserProfile.followers.splice(followerIndex, 1)
  currentUserProfile.following.splice(followingIndex, 1)

  await targetUserProfile.save()
  await currentUserProfile.save()

  return res.json({ msg: 'unfollowed' })
})

//@route - PUT - /api/profile/projects
//@desc - Add projects
//@access - Private
export const addProjects = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { title, description, link, technologies, startDate, status } = req.body
  const addProject = {
    title,
    description,
    link,
    technologies: splitStringToArray(technologies),
    startDate,
    status
  }
  const profile = await findProfileByUserId(req.user._id, res)

  profile.projects.unshift(addProject)
  await profile.save()
  return res.json(profile)
})

//@route - GET - /api/profile/projects
//@desc - Get Projects
//@access - Private
export const getProjects = asyncHandler(async (req, res) => {
  const profile = await findProfileByUserId(req.user._id, res)
  return res.json(profile.projects)
})

//@route - GET - /api/profile/projects/:profileId
//@desc - Get project by profileId
//@access - Private
export const getProjectsById = asyncHandler(async (req, res) => {
  const profile = await findProfileById(req.params.profileId, res)
  return res.json(profile.projects)
})

//@route - DELETE - /api/profile/projects/:projectId
//@desc - Delete project by id
//@access - Private
export const deleteProject = asyncHandler(async (req, res) => {
  const profile = await findProfileByUserId(req.user._id, res)

  const projectIndex = profile.projects.findIndex(
    project => project._id.toString() === req.params.projectId
  )
  if (projectIndex === -1) {
    res.status(404)
    throw new Error('Project not found')
  }

  profile.projects.splice(projectIndex, 1)
  await profile.save()
  return res.json({ msg: 'Project deleted' })
})

//@route - DELETE - /api/profile/:profileId
//@desc - Delete profile by id
//@access - Private/Admin
export const deleteProfileById = asyncHandler(async (req, res) => {
  const profile = await findProfileById(req.params.profileId, res)
  await ProfileModel.findByIdAndDelete(profile._id)
  return res.json({ msg: 'Profile deleted' })
})

//@route - DELETE - /api/profile/me
//@desc - Delete profile
//@access - Private
export const deleteProfile = asyncHandler(async (req, res) => {
  const profile = await findProfileByUserId(req.user._id, res)

  await ProfileModel.findByIdAndDelete(profile._id)
  res.json({ msg: 'Profile deleted' })
})

//@route - DELETE - /api/profile/me
//@desc - Delete account
//@access - Private
export const deleteAccount = asyncHandler(async (req, res) => {
  const profile = await ProfileModel.findOne({ user: req.user._id })
  if (!profile) {
    res.status(404)
    throw new Error('Account not found')
  }

  await UserModel.findByIdAndDelete(req.user._id)
  await ProfileModel.findOneAndDelete({ user: req.user._id })
  await PostModel.deleteMany({ user: req.user._id })
  await CommentModel.deleteMany({ user: req.user._id })
  res.clearCookie('jwt')
  return res.json({ msg: 'Account deleted.' })
})

//@route - DELETE - /api/profile/account/:profileId
//@desc - Delete account by profileId
//access - Private/Admin
export const deleteAccountById = asyncHandler(async (req, res) => {
  const profile = await findProfileById(req.params.profileId, res)

  const user = await UserModel.findById(profile.user).select('-password')
  if (!user) {
    re.status(404)
    throw new Error('User not found')
  }

  await CommentModel.deleteMany({ user: user._id })
  await ProfileModel.findOneAndDelete({ user: user._id })
  await PostModel.deleteMany({ user: user._id })
  await UserModel.findByIdAndDelete(user._id)
  return res.json({ msg: 'Account deleted.' })
})
