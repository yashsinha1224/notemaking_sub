import { NextRequest, NextResponse } from 'next/server'
import connectDB from '../../../../lib/mogodb'
import { User } from '../../../../lib/mogodb'
import { OTP } from '../../../../lib/mogodb'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { email, otp } = await request.json()
    
    if (!email || !otp) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email and OTP are required' 
      }, { status: 400 })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 })
    }

    const otpRecord = await OTP.findOne({ 
      userId: user._id,
      email: email.toLowerCase() 
    }).sort({ createdAt: -1 })

    if (!otpRecord) {
      return NextResponse.json({ 
        success: false, 
        message: 'OTP not found or expired' 
      }, { status: 400 })
    }

    if (otpRecord.otp !== otp) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid OTP' 
      }, { status: 400 })
    }

    // OTP is valid - delete it and log user in
    await OTP.deleteOne({ _id: otpRecord._id })

    return NextResponse.json({ 
      success: true, 
      message: 'OTP verified successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Server error. Please try again.' 
    }, { status: 500 })
  }
}