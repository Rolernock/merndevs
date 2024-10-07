import mongoose from 'mongoose'
const { Schema } = mongoose

const messageSchema = new Schema(
  {
    email: String,
    name: String,
    subject: String,
    whatsAppNumber: String,
    message: String
  },
  { timestamps: true }
)

const MessageModel = mongoose.model('Message', messageSchema)
export default MessageModel
