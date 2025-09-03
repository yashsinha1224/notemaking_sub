import { NextRequest, NextResponse } from 'next/server'
import connectDB from '../../../../lib/mogodb'
import { User } from '../../../../lib/mogodb'
import otpGenerator from 'otp-generator'
import mailSender from '../../../../lib/utils/mailSender'
import { SignupOTP } from '../../../../lib/mogodb'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { name, email } = await request.json()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!name || !email || !emailRegex.test(email)) {
      return NextResponse.json(
        { valid: false, message: 'Please provide a valid name and email address' },
        { status: 400 }
      )
    }

    // check if already user
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({
        valid: true,
        userExists: true,
        message: 'User already exists. Please sign in instead.',
        userId: existingUser._id
      })
    }

    // generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    })

    // remove old signups
    await SignupOTP.deleteMany({ email: email.toLowerCase() })

    await SignupOTP.create({
      email: email.toLowerCase(),
      name,
      otp
    })

    await mailSender(
      email,
      'Verify Your Email - Signup OTP',
      `<h1>Welcome to Our App!</h1>
       <p>Hi ${name},</p>
       <p>Your OTP for email verification is: <strong>${otp}</strong></p>
       <p>This code will expire in 5 minutes.</p>`
    )

    return NextResponse.json({
      valid: true,
      userExists: false,
      message: 'OTP sent to your email for verification',
      email: email.toLowerCase(),
      name
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { valid: false, message: 'Server error during signup. Please try again.' },
      { status: 500 }
    )
  }
}