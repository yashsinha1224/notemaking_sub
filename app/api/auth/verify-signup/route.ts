import { NextRequest, NextResponse } from 'next/server'
import connectDB, { User, SignupOTP } from '../../../../lib/mogodb'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { name, email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // lookup OTP in SignupOTP collection
    const otpRecord = await SignupOTP.findOne({
      email: email.toLowerCase(),
      otp
    })

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    // check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      await SignupOTP.deleteOne({ _id: otpRecord._id })
      return NextResponse.json(
        { success: false, message: 'User already exists. Please sign in instead.' },
        { status: 400 }
      )
    }

    // pick name from request or OTP record
    const userName = name || otpRecord.name
    if (!userName) {
      return NextResponse.json(
        { success: false, message: 'Name is required for signup' },
        { status: 400 }
      )
    }

    // create new user
    const user = new User({
      name: userName,
      email: email.toLowerCase()
    })
    await user.save()

    // cleanup signup OTP
    await SignupOTP.deleteOne({ _id: otpRecord._id })

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Verify signup error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error during verification. Please try again.' },
      { status: 500 }
    )
  }
}
