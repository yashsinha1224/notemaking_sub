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

export const User = mongoose.models.User || mongoose.model('User', userSchema)
export const Note = mongoose.models.Note || mongoose.model('Note', noteSchema)
export default connectDB