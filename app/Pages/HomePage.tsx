'use client'
import React, { useState } from 'react';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import NoteBox from '../../app/Components/ListBox';
const HomePage = () => {
  const [notes, setNotes] = useState([
    {
      "noteId": "note-001",
      "description": "Meeting Notes",
      "note": "Discussed quarterly planning and budget allocation for the next phase of the project. Need to follow up with stakeholders by Friday."
    },
    {
      "noteId": "note-002", 
      "description": "Project Ideas",
      "note": "Brainstormed new features for the mobile app including dark mode, push notifications, and offline sync capabilities."
    },
    {
      "noteId": "note-003",
      "description": "Grocery List",
      "note": "Milk, eggs, bread, apples, chicken breast, pasta, olive oil, onions, garlic, tomatoes"
    },
    {
      "noteId": "note-004",
      "description": "Book Recommendations",
      "note": "The Design of Everyday Things by Don Norman, Atomic Habits by James Clear, System Design Interview by Alex Xu"
    },
    {
      "noteId": "note-005",
      "description": "Weekend Plans",
      "note": "Visit the art museum, try the new coffee shop downtown, finish reading the current novel, call mom and dad"
    },
    {
      "noteId": "note-006",
      "description": "Learning Goals",
      "note": "Master React hooks, learn TypeScript fundamentals, practice algorithm problems, read about system design patterns"
    }
  ]);

  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter(note => note.noteId !== noteId));
  };
   const router = useRouter();
  
  const handleNoteClick = (noteId: string) => {
    router.push(`/Pages/Edit/${noteId}`);
  };

  return (
    <div className='w-full h-screen flex items-center justify-between bg-white text-black flex-col'>
      <header className="w-full p-4 bg-gray-50 flex flex-row ">
        
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="font-semibold text-gray-700">Dashboard</span>
            </div>
        
      </header>
      
      <div className='flex w-full min-h-22 justify-center max-w-6xl bg-gray-500 rounded-3xl shadow-2xl overflow-hidden mx-4 my-4'>
       <div className="flex flex-col items-center justify-center text-white">
  <h1>Welcome User</h1>
  <p>Email: yashsinhaoffical@gmail.com</p>
</div>
      </div>
      
      <div className='flex w-full h-2/3 justify-center max-w-7xl mx-4 mb-12 bg-gray-100 rounded-3xl shadow-2xl overflow-hidden'>
        <div className='flex w-5/6 rounded-3xl flex-col p-6'>
          <div className="flex justify-between mb-6">
            <div className="text-sm font-medium text-gray-700">Note List</div>
          
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2">
            {notes.map((noteData) => (
              <NoteBox
                key={noteData.noteId}
                noteId={noteData.noteId}
                description={noteData.description}
                note={noteData.note}
                onDelete={handleDeleteNote}
                onClick={handleNoteClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;