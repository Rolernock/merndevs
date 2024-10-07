import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import UserModel from '../models/UserModel.js'
export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await UserModel.findById(decoded.userId)
    } catch (err) {
      res.status(400)
      throw new Error('Invalid or expired token')
    }
    next()
  } else {
    res.status(404)
    throw new Error('No token, access denied')
  }
})

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(400)
    throw new Error('Access denied, admins only')
  }
}
