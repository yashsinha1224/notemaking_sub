import mongoose from 'mongoose'

const MONGODB_URI = process.env.DATABASE_URL!

if (!MONGODB_URI) {
  throw new Error('Please define the DATABASE_URL environment variable')
}

let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}

// User Schema - matches your Prisma schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  notesId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }]
}, {
  timestamps: true
})

// Note Schema - matches your Prisma schema
const noteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  note: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
})

// OTP Schema - for OTP authentication
const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // 5 minutes in seconds - document auto-deletes
  }
})
const signupOtpSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // auto-delete after 5 minutes
  }
})
// Create indexes for better performance
otpSchema.index({ userId: 1, createdAt: -1 })
otpSchema.index({ email: 1, createdAt: -1 })
signupOtpSchema.index({ email: 1, createdAt: -1 })


export const User = mongoose.models.User || mongoose.model('User', userSchema)
export const Note = mongoose.models.Note || mongoose.model('Note', noteSchema)
export const OTP = mongoose.models.OTP || mongoose.model('OTP', otpSchema)
export const SignupOTP =mongoose.models.SignupOTP || mongoose.model('SignupOTP', signupOtpSchema)
export default connectDB