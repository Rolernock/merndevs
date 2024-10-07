import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import {
  validateNewUser,
  validateEmail,
  validateMessage,
  validatePassword,
  validateUser
} from '../middleware/expressValidators.js'
import {
  registerUser,
  loginUser,
  sendMessage,
  getMessages,
  allUsers,
  updateUser,
  userById,
  deleteUser,
  deleteMessage,
  resetPasswordEmail,
  resetPassword,
  logOut
} from '../controllers/userController.js'
const router = express.Router()

router
  .route('/')
  .post(validateNewUser, registerUser)
  .get(protect, admin, allUsers)
router
  .route('/messages')
  .post(protect, validateMessage, sendMessage)
  .get(protect, admin, getMessages)
router.post('/login', validateUser, loginUser)
router.delete('/messages/:messageId', protect, admin, deleteMessage)
router.post('/forgot-password', validateEmail, resetPasswordEmail)
router.post('/logout', logOut)
router.post('/reset-password/:token', validatePassword, resetPassword)
router
  .route('/:userId')
  .put(protect, admin, updateUser)
  .get(protect, admin, userById)
  .delete(protect, admin, deleteUser)

export default router
