import { NextRequest, NextResponse } from 'next/server'
import connectDB from '../../../../lib/mogodb'
import { User } from '../../../../lib/mogodb'
import { OTP } from '../../../../lib/mogodb'
import otpGenerator from 'otp-generator'
import mailSender from '../../../../lib/utils/mailSender'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { email } = await request.json()
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ 
        valid: false, 
        message: 'Please enter a valid email address' 
      }, { status: 400 })
    }
    
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    
    if (existingUser) {
      // Generate OTP
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      })

      // Delete any existing OTPs for this user
      await OTP.deleteMany({ userId: existingUser._id })

      // Create new OTP
      await OTP.create({
        userId: existingUser._id,
        email: email.toLowerCase(),
        otp: otp
      })

      // Send OTP via email
      await mailSender(
        email,
        "Login OTP",
        `<h1>Your Login OTP</h1><p>Your OTP code is: <strong>${otp}</strong></p><p>This code will expire in 5 minutes.</p>`
      )

      return NextResponse.json({ 
        valid: true, 
        userExists: true,
        message: 'OTP sent to your email address',
        userId: existingUser._id
      })
    } else {
      return NextResponse.json({ 
        valid: true, 
        userExists: false,
        message: 'Email not found. Would you like to create an account?'
      })
    }
    
  } catch (error) {
    console.error('Email check error:', error)
    return NextResponse.json({ 
      valid: false, 
      message: 'Server error. Please try again.' 
    }, { status: 500 })
  }
}