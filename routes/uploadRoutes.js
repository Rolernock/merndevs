import path from 'path'
import express from 'express'
import multer from 'multer'
const router = express.Router()

const __dirname = path.resolve()
const location = path.join(__dirname, '/uploads')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, location)
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname)
    const basename = path.basename(file.originalname, extname)
    cb(null, `${basename}-${Date.now()}${extname}`)
  }
})

const checkFileTypes = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp/i
  const extname = filetypes.test(path.extname(file.originalname))
  if (extname) {
    cb(null, true)
  } else {
    cb('Images Only')
  }
}

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    checkFileTypes(file, cb)
  }
})

router.post('/', upload.single('image'), (req, res) => {
  return res.json({
    msg: 'Image Uploaded',
    image: `/uploads/${req.file.filename}`
  })
})

export default router
