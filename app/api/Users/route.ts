import { NextRequest, NextResponse } from 'next/server'
import connectDB, { User } from '../../../lib/mogodb'

export async function GET() {
  try {
    await connectDB()
    const users = await User.find().populate('notesId')
    return NextResponse.json(users)
  } catch (error) {
    console.error('GET users error:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { name, email } = await request.json()
    
    const user = new User({
      name,
      email
    })
    
    await user.save()
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('POST user error:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}