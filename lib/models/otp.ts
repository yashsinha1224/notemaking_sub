// lib/models/OTP.ts
import mongoose from 'mongoose'

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

// Create index for better performance
otpSchema.index({ userId: 1, createdAt: -1 })
otpSchema.index({ email: 1, createdAt: -1 })

export const OTP = mongoose.models.OTP || mongoose.model('OTP', otpSchema)