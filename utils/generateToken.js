import jwt from 'jsonwebtoken'

const generateToken = (res, userId) => {
  const payload = { userId }
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d'
  })
  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'strict',
    httpOnly: true
  })
}

export default generateToken
