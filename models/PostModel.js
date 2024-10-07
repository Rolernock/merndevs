import mongoose from 'mongoose'
const { Schema } = mongoose

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    subject: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    name: String,
    image: String,
    avatar: String,
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    reads: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
)

const PostModel = mongoose.model('Post', postSchema)

export default PostModel
