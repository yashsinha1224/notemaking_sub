'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

const EditNotePage = () => {
  const router = useRouter();
  const params = useParams();
  const noteId = params.NoteId as string;

  const [noteData, setNoteData] = useState({
    _id: '',
    name: '',
    description: '',
    note: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchNoteData = async () => {
      try {
        console.log('Fetching note for ID:', noteId);
        const response = await fetch(`/api/Notes/${noteId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const note = await response.json();
        setNoteData({
          _id: note._id,
          name: note.name,
          description: note.description,
          note: note.note
        });
      } catch (error) {
        console.error('Error fetching note:', error);
      } finally {
        setLoading(false);
      }
    };

    if (noteId) {
      fetchNoteData();
    }
  }, [noteId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('Saving note:', noteData);
      
      const response = await fetch(`/api/Notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: noteData.name,
          description: noteData.description,
          note: noteData.note
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedNote = await response.json();
      console.log('Note saved successfully:', updatedNote);
      
      router.push('/');
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note. Please try again.');
    } finally {
      setSaving(false);
    }
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

  if (!noteData._id) {
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
          disabled={saving}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save'}</span>
        </button>
      </header>
      
      <div className='flex w-full h-full m-12 justify-center max-w-7xl mx-4 mb-12 bg-gray-100 rounded-3xl shadow-2xl overflow-hidden'>
        <div className="w-full p-6 flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note Name
            </label>
            <input
              type="text"
              value={noteData.name}
              onChange={(e) => setNoteData({ ...noteData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter note name"
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