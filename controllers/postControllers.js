import path from 'path'
import fs from 'fs'
import { validationResult } from 'express-validator'
import asyncHandler from 'express-async-handler'
import PostModel from '../models/PostModel.js'
import CommentModel from '../models/CommentModel.js'

//Helper Functions - Finding Comment and Post By their IDs
const findPostById = async (postId, res) => {
  const post = await PostModel.findById(postId)
  if (!post) {
    res.status(404)
    throw new Error('Post not found')
  }
  return post
}

const findCommentById = async (commentId, res) => {
  const comment = await CommentModel.findById(commentId)
  if (!comment) {
    res.status(404)
    throw new Error('Comment not found')
  }
  return comment
}

//@route - POST - /api/posts
//@desc - Add post
//@access - Private
export const addPost = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { subject, content, image } = req.body
  const { _id: userId, name, avatar } = req.user
  const newPost = {
    user: userId,
    subject,
    content,
    image,
    name,
    avatar
  }
  const post = await PostModel.create(newPost)
  return res.json(post)
})

//@route - GET - /api/posts
//@desc - Get all posts
//@access - Public
export const getAllPosts = asyncHandler(async (req, res) => {
  const count = await PostModel.countDocuments()
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1
  const keyword = req.query.keyword
    ? { subject: { $regex: req.query.keyword, $options: 'i' } }
    : {}
  const posts = await PostModel.find({ ...keyword })
    .populate('user', ['name', 'avatar'])
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 })
  if (!posts) {
    res.status(404)
    throw new Error('No post found')
  }
  return res.json({ posts, page, pages: Math.ceil(count / pageSize) })
})

//@route - GET - /api/posts/:postId
//@desc - Get post by Id
//@access - Public
export const getPostById = asyncHandler(async (req, res) => {
  const post = await findPostById(req.params.postId, res)
  return res.json(post)
})

//@route - DELETE - /api/posts/:postId
//@desc - Delete post by Id
//@access - Private
export const deletePost = asyncHandler(async (req, res) => {
  const { _id: userId, isAdmin } = req.user
  const { postId } = req.params
  const post = await findPostById(postId, res)

  const isPostOwner = post.user.equals(userId)
  if (!isPostOwner && !isAdmin) {
    res.status(403)
    throw new Error('Only post Owner and Admins can delete this post')
  }

  if (post.image) {
    const __dirname = path.resolve()
    const imagePath = path.join(__dirname, post.image)
    fs.unlink(imagePath, err => {
      if (err) {
        throw new Error(err)
      }
    })
  }

  await PostModel.findByIdAndDelete(postId)
  await CommentModel.deleteMany({ post: postId })
  return res.json({ msg: 'Post deleted.' })
})

//@route - PUT - /api/posts/:postId/read
//@desc - Add read
//@access - Private
export const addRead = asyncHandler(async (req, res) => {
  const post = await findPostById(req.params.postId, res)
  const read = post.reads.some(read => read.equals(req.user._id))
  if (read) {
    res.status(400)
    throw new Error('Already read')
  }
  post.reads.push(req.user._id)
  await post.save()
  return res.json(post.reads)
})

//@route - PUT - /api/posts/:postId/like
//@desc - Like a post
//@access - Private
export const likePost = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user
  const post = await findPostById(req.params.postId, res)

  const likeIndex = post.likes.some(like => like.equals(userId))
  if (likeIndex) {
    res.status(400)
    throw new Error('Already liked the post')
  }

  post.likes.push(userId)
  await post.save()
  return res.json(post.likes)
})

//@route - PUT - /api/posts/:postId/unlike
//@desc - Unlike a post
//@access - Private
export const unlikePost = asyncHandler(async (req, res) => {
  const post = await findPostById(req.params.postId, res)

  const likeIndex = post.likes.findIndex(like => like.equals(req.user._id))
  if (likeIndex === -1) {
    res.status(400)
    throw new Error('You have not liked the post')
  }
  post.likes.splice(likeIndex, 1)
  await post.save()
  return res.json(post.likes)
})

//@route - GET - /api/posts/:postId/like
//@desc - Get likes
//@access - Private
export const getLikes = asyncHandler(async (req, res) => {
  const post = await PostModel.findById(req.params.postId).populate('likes', [
    'name',
    'avatar'
  ])
  if (!post) {
    res.status(404)
    throw new Error('Post not found')
  }
  return res.json(post.likes)
})

//@route - GET - /api/posts/:postId/comment
//@desc - Get comments
//@access - Private
export const getComments = asyncHandler(async (req, res) => {
  const comments = await CommentModel.find({
    post: req.params.postId
  }).sort({ createdAt: -1 })
  if (!comments) {
    res.status(404)
    throw new Error('Comments not found')
  }
  return res.json(comments)
})

//@route - PUT - /api/posts/:postId/comment
//@desc - Add Comments
//@access - Private
export const addComments = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { name, avatar, _id: user } = req.user
  const { content } = req.body
  const post = await findPostById(req.params.postId, res)

  const newPost = {
    user,
    post: post._id,
    content,
    name,
    avatar
  }
  const comment = await CommentModel.create(newPost)
  return res.json(comment)
})

//@route - GET - /api/posts/:postId/comment/:commentId/likes
//@desc - Get comment likes
//access - Private
export const getCommentLikes = asyncHandler(async (req, res) => {
  await findPostById(req.params.postId, res)

  const comment = await CommentModel.findById(req.params.commentId).populate(
    'likes',
    ['name', 'avatar']
  )
  if (!comment) {
    res.status(404)
    throw new Error('Comment not found')
  }

  return res.json(comment.likes)
})

//@route - PUT - /api/posts/:postId/comment/:commentId
//@desc - Like a comment
//@access - Private
export const likeComment = asyncHandler(async (req, res) => {
  await findPostById(req.params.postId, res)

  const comment = await findCommentById(req.params.commentId, res)

  const likeIndex = comment.likes.some(index => index.equals(req.user._id))

  if (likeIndex) {
    res.status(400)
    return res.json({ msg: `You've already liked the comment` })
  }

  comment.likes.push(req.user._id)
  await comment.save()
  return res.json(comment.likes)
})

//@route - DELETE - /api/posts/:postId/comment/:commentId/likes
//@desc - Unlike a comment
//@access - Private
export const unlikeComment = asyncHandler(async (req, res) => {
  await findPostById(req.params.postId, res)

  const comment = await findCommentById(req.params.commentId, res)

  const likeIndex = comment.likes.findIndex(index => index.equals(req.user._id))
  if (likeIndex === -1) {
    res.status(400)
    throw new Error(`You have not liked the comment`)
  }

  comment.likes.splice(likeIndex, 1)
  await comment.save()
  return res.json({ msg: 'unliked' })
})

//@route - DELETE - /api/posts/:postId/comment/:commentId
//@desc - Delete Comment
//@access - Private
export const deleteComment = asyncHandler(async (req, res) => {
  const { _id: userId, isAdmin } = req.user
  const { commentId } = req.params
  await findPostById(req.params.postId, res)

  const comment = await findCommentById(commentId, res)

  const commentOwner = comment.user.equals(userId)
  if (!commentOwner && !isAdmin) {
    res.status(403)
    throw new Error('Only the Owner and Admins can delete the comment')
  }
  await CommentModel.findByIdAndDelete(commentId)
  return res.json({ msg: 'Comment deleted' })
})

//@route - POST - /api/posts/:postId/:commentId/nested
//@desc - Add Nested Comment
//@access - Private
export const addNestedComment = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { _id: userId, name, avatar } = req.user
  await findPostById(req.params.postId, res)
  const newComment = {
    date: Date.now(),
    user: userId,
    nestedContent: req.body.nestedContent,
    name,
    avatar
  }

  const comment = await findCommentById(req.params.commentId, res)
  comment.nestedComments.unshift(newComment)
  await comment.save()
  return res.json(comment.nestedComments)
})

//@route - PUT - /api/posts/:postId/:commentId/nested/:id
//@desc - Like nested comment
//@access Private
export const likeNestedComment = asyncHandler(async (req, res) => {
  await findPostById(req.params.postId)
  const comment = await findCommentById(req.params.commentId)
  const findIndex = comment.nestedComments.findIndex(
    index => index._id.toString() === req.params.id
  )

  if (findIndex === -1) {
    res.status(404)
    throw new Error('Comment not found')
  }

  const likedComment = comment.nestedComments[findIndex].likes.some(like =>
    like.equals(req.user._id)
  )
  if (likedComment) {
    res.status(400)
    throw new Error(`You've already liked the comment`)
  }
  comment.nestedComments[findIndex].likes.push(req.user._id)
  await comment.save()
  return res.json(comment.nestedComments[findIndex].likes)
})

//@route - PATCH - /api/posts/:postId/:commentId/nested/:id
//desc - Unlike nested Comment
//@access - Private
export const unlikeNestedComment = asyncHandler(async (req, res) => {
  await findPostById(req.params.postId)
  const comment = await findCommentById(req.params.commentId)

  const findIndex = comment.nestedComments.findIndex(
    index => index._id.toString() === req.params.id
  )

  if (findIndex === -1) {
    res.status(404)
    throw new Error('Comment not found')
  }

  const likedCommentIndex = comment.nestedComments[findIndex].likes.findIndex(
    like => like.equals(req.user._id)
  )
  if (likedCommentIndex === -1) {
    res.status(400)
    throw new Error(`You've not liked the comment`)
  }
  comment.nestedComments[findIndex].likes.splice(likedCommentIndex, 1)
  await comment.save()
  return res.json(comment.nestedComments[findIndex].likes)
})

//@route - DELETE - /api/posts/:postId/:commentId/nested/:id
//@desc - Delete nested Comment
//@access - Private
export const deleteNestedComment = asyncHandler(async (req, res) => {
  await findPostById(req.params.postId, res)
  const comment = await findCommentById(req.params.commentId, res)

  const findIndex = comment.nestedComments.findIndex(
    index => index._id.toString() === req.params.id
  )

  if (findIndex === -1) {
    res.status(404)
    throw new Error('Comment not found')
  }

  const isCommentOwner = comment.nestedComments[findIndex].user.equals(
    req.user._id
  )
  if (!isCommentOwner && !req.user.isAdmin) {
    res.status(403)
    throw new Error('Not authorized to delete this comment')
  }
  comment.nestedComments.splice(findIndex, 1)
  await comment.save()
  return res.json(comment.nestedComments)
})
