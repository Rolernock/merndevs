import { check } from 'express-validator'

export const validateNewUser = [
  check('name', 'Name is required').notEmpty(),
  check('email', 'Provide a valide email').isEmail().normalizeEmail(),
  check('password', 'Password must be atlease 6 characters long').isLength({
    min: 6
  })
]

export const validateUser = [
  check('email', 'Provide a valide email').isEmail().normalizeEmail(),
  check('password', 'Password is required').notEmpty()
]

export const validateEmail = [
  check('email', 'Please provide a valide email').isEmail().normalizeEmail()
]

export const validatePassword = [
  check('password', 'Password must be atlease 6 characters long').isLength({
    min: 6
  })
]

export const validateProfile = [
  check('githubusername', 'Github username is required').notEmpty(),
  check('skills', 'Skills are required').notEmpty(),
  check('bio', 'Bio is required').notEmpty()
]

export const validateProject = [
  check('title', 'Title is required').notEmpty(),
  check('description', 'Description is required').notEmpty(),
  check('technologies', 'Technologies are required').notEmpty(),
  check('status', 'Status is required').notEmpty(),
  check('link', 'Link is required').notEmpty()
]

export const validatePost = [
  check('subject', 'Subject is required').notEmpty(),
  check('content', 'Post body is required').notEmpty()
]

export const validateComment = [
  check('content', 'Comment is required').notEmpty()
]

export const validateNestedComment = [
  check('nestedContent', 'Nested Comment is required').notEmpty()
]

export const validateMessage = [
  check('subject', 'Subject is required').notEmpty(),
  check('message', 'Message is required').notEmpty()
]
