import { NextRequest, NextResponse } from 'next/server'
import connectDB, { Note, User } from '../../../lib/mogodb'

export async function GET() {
  try {
    await connectDB()
    const notes = await Note.find().populate('userId', 'name email')
    return NextResponse.json(notes)
  } catch (error) {
    console.error('GET notes error:', error)
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { name, description, note, userId } = await request.json()
    
    const newNote = new Note({
      name,
      description,
      note,
      userId
    })
    
    await newNote.save()
    
    await User.findByIdAndUpdate(
      userId,
      { $push: { notesId: newNote._id } }
    )
    
    return NextResponse.json(newNote, { status: 201 })
  } catch (error) {
    console.error('POST note error:', error)
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const { id, name, description, note } = await request.json()
    
    const updatedNote = await Note.findByIdAndUpdate(
      id,
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