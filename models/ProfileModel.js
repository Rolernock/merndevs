import mongoose from 'mongoose'
const { Schema } = mongoose

const profileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    avatar: String,
    githubusername: { type: String, required: true, trim: true },
    website: { type: String, trim: true },
    location: { type: String, trim: true },
    skills: {
      type: [String],
      required: true
    },
    bio: {
      type: String,
      required: true
    },
    followers: [
      {
        _id: String,
        bio: String,
        name: String,
        avatar: String,
        createdAt: Date
      }
    ],
    following: [
      {
        _id: String,
        bio: String,
        name: String,
        avatar: String,
        createdAt: Date
      }
    ],
    social: {
      linkedin: String,
      X: String
    },
    projects: [
      {
        title: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        link: { type: String, trim: true },
        technologies: [String],
        startDate: Date,
        status: {
          type: String,
          enum: ['in progress', 'completed'],
          default: 'completed'
        }
      }
    ]
  },
  { timestamps: true }
)

const ProfileModel = mongoose.model('Profile', profileSchema)

export default ProfileModel
