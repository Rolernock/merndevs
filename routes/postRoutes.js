import express from 'express'
import {
  validateComment,
  validateNestedComment,
  validatePost
} from '../middleware/expressValidators.js'
import {
  addPost,
  getAllPosts,
  getPostById,
  addRead,
  likePost,
  getLikes,
  unlikePost,
  deletePost,
  deleteComment,
  getComments,
  addComments,
  likeComment,
  unlikeComment,
  getCommentLikes,
  addNestedComment,
  likeNestedComment,
  unlikeNestedComment,
  deleteNestedComment
} from '../controllers/postControllers.js'
import { protect } from '../middleware/authMiddleware.js'
const router = express.Router()

router.route('/').post(protect, validatePost, addPost).get(getAllPosts)
router
  .route('/:postId')
  .get(getPostById)
  .delete(protect, deletePost)
  .put(protect, addRead)
router.route('/:postId/like').put(protect, likePost).get(protect, getLikes)
router.put('/:postId/unlike', protect, unlikePost)
router
  .route('/:postId/comment')
  .put(protect, validateComment, addComments)
  .get(protect, getComments)
router.delete('/:postId/comment/:commentId', protect, deleteComment)

router
  .route('/:postId/comment/:commentId/likes')
  .put(protect, likeComment)
  .get(protect, getCommentLikes)
  .delete(protect, unlikeComment)

router
  .route('/:postId/comment/:commentId/nested')
  .post(protect, validateNestedComment, addNestedComment)

router
  .route('/:postId/comment/:commentId/nested/:id')
  .put(protect, likeNestedComment)
  .patch(protect, unlikeNestedComment)
  .delete(protect, deleteNestedComment)
export default router
