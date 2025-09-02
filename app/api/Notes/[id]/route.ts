import { NextRequest, NextResponse } from 'next/server'
import connectDB, { Note, User } from '../../../../lib/mogodb'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const note = await Note.findById(params.id).populate('userId', 'name email')
    
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }
    
    return NextResponse.json(note)
  } catch (error) {
    console.error('GET note by ID error:', error)
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const { name, description, note } = await request.json()
    
    const updatedNote = await Note.findByIdAndUpdate(
      params.id,
      { name, description, note },
      { new: true, runValidators: true }
    )
    
    if (!updatedNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }
    
    return NextResponse.json(updatedNote)
  } catch (error) {
    console.error('PUT note error:', error)
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const note = await Note.findById(params.id)
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }
    
    await User.findByIdAndUpdate(
      note.userId,
      { $pull: { notesId: params.id } }
    )
    
    await Note.findByIdAndDelete(params.id)
    
    return NextResponse.json({ message: 'Note deleted successfully' })
  } catch (error) {
    console.error('DELETE note error:', error)
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
  }
}