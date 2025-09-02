'use client'
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import NoteBox from '../../app/Components/ListBox';

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const TEMP_USER_ID = "68b72fb98e98948ac07764bb"; 
  const router = useRouter();


  useEffect(() => {
    fetchNotes();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/Users');
      const users = await response.json();
      console.log(users);
      if (users.length > 0) {
        setUser(users[0]);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/Notes');
      const fetchedNotes = await response.json();
      
      const transformedNotes = fetchedNotes.map(note => ({
        noteId: note._id,
        description: note.description,
        note: note.note,
        name: note.name
      }));
      
      setNotes(transformedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      setNotes(notes.filter(note => note.noteId !== noteId));
      
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleNoteClick = (noteId: string) => {
    router.push(`/Pages/Edit/${noteId}`);
  };

  const createTestNote = async () => {
    try {
      const testNote = {
        name: "Test Note",
        description: "API Test Note",
        note: "This note was created via API!",
        userId: TEMP_USER_ID
      };

      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testNote)
      });

      if (response.ok) {
        fetchNotes();
      }
    } catch (error) {
      console.error('Error creating test note:', error);
    }
  };

  if (loading) {
    return (
      <div className='w-full h-screen flex items-center justify-center bg-white'>
        <div className="text-gray-600">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className='w-full h-screen flex items-center justify-between bg-white text-black flex-col'>
      <header className="w-full p-4 bg-gray-50 flex flex-row justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="font-semibold text-gray-700">Dashboard</span>
        </div>
        
        <button 
          onClick={createTestNote}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Add Test Note
        </button>
      </header>
      
      <div className='flex w-full min-h-22 justify-center max-w-6xl bg-gray-500 rounded-3xl shadow-2xl overflow-hidden mx-4 my-4'>
        <div className="flex flex-col items-center justify-center text-white">
          <h1>Welcome {user?.name || 'User'}</h1>
          <p>Email: {user?.email || 'Loading...'}</p>
        </div>
      </div>
      
      <div className='flex w-full h-2/3 justify-center max-w-7xl mx-4 mb-12 bg-gray-100 rounded-3xl shadow-2xl overflow-hidden'>
        <div className='flex w-5/6 rounded-3xl flex-col p-6'>
          <div className="flex justify-between mb-6">
            <div className="text-sm font-medium text-gray-700">
              Note List ({notes.length} notes)
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2">
            {notes.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p>No notes found. Click "Add Test Note" to create one!</p>
              </div>
            ) : (
              notes.map((noteData) => (
                <NoteBox
                  key={noteData.noteId}
                  noteId={noteData.noteId}
                  description={noteData.description}
                  note={noteData.note}
                  onDelete={handleDeleteNote}
                  onClick={handleNoteClick}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;