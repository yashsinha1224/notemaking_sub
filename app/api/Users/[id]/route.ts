import { NextResponse } from 'next/server'
import connectDB, { User } from '../../../../lib/mogodb'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const user = await User.findById(params.id).populate('notesId')

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('GET user by id error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}
