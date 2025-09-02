import React from 'react';
import { Trash2 } from 'lucide-react';

type NoteBoxProps = {
  noteId?: string;
  description?: string;
  note?: string;
  onDelete?: (noteId: string) => void;
  onClick?: (noteId: string) => void;
};

const NoteBox: React.FC<NoteBoxProps> = ({ 
  noteId = "Note 1", 
  description = "Sample Description", 
  note = "This is a sample note content", 
  onDelete,
  onClick 
}) => {
  return (
    <div 
      onClick={() => onClick?.(noteId)}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-gray-900 mb-1">
            {noteId}
          </h3>
          
          {description && (
            <p className="text-sm text-gray-600 mb-2">
              {description}
            </p>
          )}
          
          <p className="text-sm text-gray-700">
            {note}
          </p>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(noteId);
          }}
          className="ml-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 flex-shrink-0"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default NoteBox;