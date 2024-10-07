import { validationResult } from 'express-validator'
import gravatar from 'gravatar'
import crypto from 'crypto'
import asyncHandler from 'express-async-handler'
import UserModel from '../models/UserModel.js'
import ProfileModel from '../models/ProfileModel.js'
import CommentModel from '../models/CommentModel.js'
import MessageModel from '../models/MessageModel.js'
import PostModel from '../models/PostModel.js'
import sendEmail from '../utils/sendEmail.js'
import generateToken from '../utils/generateToken.js'

// Helper functions - Finding user by Ids and Users by email
const findUserById = async (userId, res) => {
  const user = await UserModel.findById(userId).select('-password')
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }
  return user
}

const findUserByEmail = async (email, res) => {
  const user = await UserModel.findOne({ email })
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }
  return user
}

//@route - POST - /api/users
//@desc - Register User
//@access - Public
export const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { name, email, password } = req.body
  let user = await UserModel.findOne({ email })
  if (user) {
    res.status(400)
    throw new Error('User already exists')
  }

  const avatar = gravatar.url(email, { s: 200, d: 'mm' })
  user = await UserModel.create({ name, email, password, avatar })
  generateToken(res, user._id)
  sendEmail({
    to: email,
    subject: 'Welcome to mernDevs',
    text: `Hello ${name}, \n\nWe are exited to have you join our community of MERN Stack developers, connect, share and grow with fellow developers.`,
    html: `<h1>Hello ${name},</h1>
           <p>Welcome to <strong>mernDevs</strong>, We are excited to have you join our community of MERN Stack developers, connect, share and grow with fellow developers.</p>`
  })
  return res.json({
    _id: user._id,
    name: user.name,
    avatar: user.avatar,
    email: user.email,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt
  })
})

//@route - POST - /api/users/login
//@desc - Login User
//@access - Public
export const loginUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { email, password } = req.body
  const user = await UserModel.findOne({ email })
  if (user && (await user.comparePassword(password))) {
    generateToken(res, user._id)
    return res.json({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      isAdmin: user.isAdmin
    })
  }

  res.status(400)
  throw new Error('Invalid user or password')
})

//@route - POST - /api/users/message
//@desc - Send Developer a message
//@access - Private
export const sendMessage = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { subject, whatsAppNumber, message } = req.body
  const messageContent = {
    name: req.user.name,
    email: req.user.email,
    subject,
    whatsAppNumber,
    message
  }
  await MessageModel.create(messageContent)
  return res.json({ msg: 'Message Sent!' })
})

//@route - GET - /api/users/messages
//@desc - Get All Messages
//@access - Private/Admin
export const getMessages = asyncHandler(async (req, res) => {
  const messages = await MessageModel.find()
  return res.json(messages)
})

//@route - DELETE - /api/users/messages/:messageId
//@desc - Delete message
//@access - Private/Admin
export const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params
  const message = await MessageModel.findById(messageId)
  if (!message) {
    res.status(404)
    throw new Error('Message not found')
  }
  await MessageModel.findByIdAndDelete(messageId)
  return res.json({ msg: 'Message deleted' })
})

//@route - GET - /api/users
//@desc - Get All Users
//@access - Private/Admin
export const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {}
  const users = await UserModel.find({ ...keyword })
    .select('-password')
    .sort({ createdAt: -1 })
  if (!users) {
    res.status(404)
    throw new Error('Users not found')
  }
  return res.json(users)
})

//@route - PUT - /api/users/:userId
//@desc - Update User
//@access - Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, password, isAdmin } = req.body
  const user = await findUserById(req.params.userId, res)
  if (user._id.toString() === process.env.SUPER_USER) {
    res.status(400)
    throw new Error('Not Allowed, Super Admin Cannot be changed')
  }
  user.name = name !== undefined ? name : user.name
  user.email = email !== undefined ? email : user.email
  if (password) {
    user.password = password !== undefined ? password : user.password
  }
  user.isAdmin = isAdmin !== undefined ? Boolean(isAdmin) : user.isAdmin
  await user.save()
  return res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin
  })
})

//@route - GET - /api/users/:userId
//@desc - Get user by id
//@access - Private/Admin
export const userById = asyncHandler(async (req, res) => {
  const user = await findUserById(req.params.userId, res)
  return res.json(user)
})

//@route - DELETE - /api/users/:userId
//@desc - Delete user by id
//@access - Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params
  const user = await findUserById(userId, res)

  if (user.isAdmin) {
    res.status(400)
    throw new Error('Cannot delete admin user.')
  }
  await UserModel.findByIdAndDelete(userId)
  await ProfileModel.findOneAndDelete({ user: userId })
  await PostModel.deleteMany({ user: userId })
  await CommentModel.deleteMany({ user: userId })
  return res.json({ msg: 'User deleted' })
})

//@route - POST - /api/users/forgot-password
//@desc - Reset password email
//@acess - Public
export const resetPasswordEmail = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { email } = req.body
  const user = await findUserByEmail(email, res)

  const resetToken = user.getResetPasswordToken()
  await user.save()
  const resetUrl = `merndevs.com/reset-password/${resetToken}`
  const message = `You requested a password reset. Please click the link below to reset you password:
    
    
    ${resetUrl}`
  try {
    sendEmail({
      to: user.email,
      subject: 'Password Reset',
      text: message
    })
    return res.json({ msg: 'Reset password email sent.' })
  } catch (err) {
    user.resetPasswordExpire = undefined
    user.resetPasswordToken = undefined
    await user.save()
    res.status(500)
    throw new Error(err)
  }
})

//@route - POST - /api/users/reset-password/:token
//@desc - Reset password
//@access - Public
export const resetPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')
  const user = await UserModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })
  if (!user) {
    res.status(400)
    throw new Error('Invalid or expired token')
  }

  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save()
  return res.json({ msg: 'Password reset was successfull' })
})

//@route - POST - /api/users/logOut
//@desc - Log out user
//@access - Public
export const logOut = (_, res) => {
  res.clearCookie('jwt')
  return res.json({ msg: 'User logged out' })
}
