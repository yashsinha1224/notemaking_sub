'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { useParams } from 'next/navigation';

const CreateNotePage = () => {
  const router = useRouter();
  const params = useParams();
  const TEMP_USER_ID = params.id as string;

  const [noteData, setNoteData] = useState({
    name: '',
    description: '',
    note: ''
  });

  const [saving, setSaving] = useState(false);

  // Hardcoded user ID for now - replace with auth later

  const handleSave = async () => {
    // Basic validation
    if (!noteData.name.trim() || !noteData.description.trim()) {
      alert('Please fill in both name and description fields.');
      return;
    }

    try {
      setSaving(true);
      console.log('Creating note:', noteData);
      
      const response = await fetch('/api/Notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: noteData.name,
          description: noteData.description,
          note: noteData.note,
          userId: TEMP_USER_ID
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdNote = await response.json();
      console.log('Note created successfully:', createdNote);
      
      // Navigate back to home
      router.push(`/Pages/Dashboard/${TEMP_USER_ID}`);
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

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
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="font-semibold text-gray-700">Create New Note</span>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          <span>{saving ? 'Creating...' : 'Create Note'}</span>
        </button>
      </header>
      
      <div className='flex w-full h-full m-12 justify-center max-w-7xl mx-4 mb-12 bg-gray-100 rounded-3xl shadow-2xl overflow-hidden'>
        <div className="w-full p-6 flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note Name *
            </label>
            <input
              type="text"
              value={noteData.name}
              onChange={(e) => setNoteData({ ...noteData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter note name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <input
              type="text"
              value={noteData.description}
              onChange={(e) => setNoteData({ ...noteData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter a brief description"
              required
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note Content
            </label>
            <textarea
              value={noteData.note}
              onChange={(e) => setNoteData({ ...noteData, note: e.target.value })}
              className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none overflow-y-auto"
              placeholder="Write your note here..."
              style={{ minHeight: '200px' }}
            />
          </div>

          <div className="text-sm text-gray-500">
            * Required fields
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNotePage;