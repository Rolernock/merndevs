import express from 'express'
import {
  validateProfile,
  validateProject
} from '../middleware/expressValidators.js'
import { protect, admin } from '../middleware/authMiddleware.js'
import {
  addProfile,
  allProfiles,
  getProjects,
  currentProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowersById,
  getFollowingById,
  getProfileById,
  deleteProfile,
  addProjects,
  getProjectsById,
  deleteProfileById,
  deleteProject,
  deleteAccount,
  deleteAccountById
} from '../controllers/profileControllers.js'
const router = express.Router()

router
  .route('/')
  .post(protect, validateProfile, addProfile)
  .get(allProfiles)
  .delete(protect, deleteProfile)
router.route('/me').get(protect, currentProfile).delete(protect, deleteAccount)
router.get('/followers', protect, getFollowers)
router.get('/following', protect, getFollowing)
router
  .route('/projects')
  .put(protect, validateProject, addProjects)
  .get(protect, getProjects)
router.get('/followers/:profileId', protect, getFollowersById)
router.get('/following/:profileId', protect, getFollowingById)
router
  .route('/:profileId')
  .put(protect, followUser)
  .get(getProfileById)
  .delete(protect, admin, deleteProfileById)
router.delete('/projects/:projectId', protect, deleteProject)
router.delete('/account/:profileId', protect, admin, deleteAccountById)
router.put('/unfollow/:profileId', protect, unfollowUser)
router.get('/projects/:profileId', protect, getProjectsById)

export default router
