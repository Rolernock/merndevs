import mongoose from 'mongoose'
const { Schema } = mongoose

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    },
    content: {
      type: String,
      required: true
    },
    name: String,
    avatar: String,
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    nestedComments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User'
        },
        nestedContent: {
          type: String,
          required: true
        },
        date: Date,
        name: String,
        avatar: String,
        likes: [
          {
            type: Schema.Types.ObjectId,
            ref: 'User'
          }
        ]
      }
    ]
  },
  { timestamps: true }
)

const CommentModel = mongoose.model('Comment', commentSchema)

export default CommentModel
