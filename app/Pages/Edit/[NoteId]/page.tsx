// Edit page component - app/edit/[noteId]/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Notes from '../../../Json/Notes.json';

const EditNotePage = () => {
  const router = useRouter();
  const params = useParams();
  const noteId = params.NoteId as string;

  const [noteData, setNoteData] = useState({
    noteId: '',
    description: '',
    note: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoteData = () => {
      // Use the imported Notes directly
      const currentNote = Notes.find((note: any) => note.noteId === noteId);
      
      if (currentNote) {
        setNoteData(currentNote);
      } else {
        console.log('Note not found:', noteId);
        // Optionally redirect back or show error
      }
      setLoading(false);
    };
    console.log('Fetching note for ID:', noteId);
    if (noteId) {
      fetchNoteData();
    }
  }, [noteId]);

  const handleSave = () => {
    console.log('Saving note:', noteData);
    
    // Since you're using a static JSON file, you have a few options:
    
    // Option 1: Use localStorage to store modified notes
    let savedNotes = [];
    try {
      savedNotes = JSON.parse(localStorage.getItem('modifiedNotes') || '[]');
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      savedNotes = [];
    }
    
    // Remove existing note with same ID and add updated one
    const filteredNotes = savedNotes.filter((note: any) => note.noteId !== noteId);
    const updatedNotes = [...filteredNotes, noteData];
    
    localStorage.setItem('modifiedNotes', JSON.stringify(updatedNotes));
    
    // Navigate back to home
    router.push('/');
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="text-gray-600">Loading note...</div>
      </div>
    );
  }

  // If note not found
  if (!noteData.noteId) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Note not found</h2>
          <p className="text-gray-600 mb-4">The note with ID "{noteId}" could not be found.</p>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full h-screen flex items-center justify-between bg-white text-black flex-col'>
      <header className="w-full p-4 bg-gray-50 flex flex-row justify-between items-center">
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="font-semibold text-gray-700">Edit Note</span>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save size={16} />
          <span>Save</span>
        </button>
      </header>
      
      <div className='flex w-full h-full m-12 justify-center max-w-7xl mx-4 mb-12 bg-gray-100 rounded-3xl shadow-2xl overflow-hidden'>
        <div className="w-full p-6 flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note ID
            </label>
            <input
              type="text"
              value={noteData.noteId}
              onChange={(e) => setNoteData({ ...noteData, noteId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter note ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={noteData.description}
              onChange={(e) => setNoteData({ ...noteData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter description"
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note Content
            </label>
            <textarea
              value={noteData.note}
              onChange={(e) => setNoteData({ ...noteData, note: e.target.value })}
              className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-y-auto"
              placeholder="Write your note here..."
              style={{ minHeight: '200px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditNotePage;