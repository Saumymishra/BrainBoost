import React from 'react';
import { FileText } from 'lucide-react';

const NoteCard = ({ title, subject, date, questions }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FileText className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
            <p className="text-sm text-gray-500">{subject}</p>
          </div>
        </div>
        <span className="text-xs text-gray-400">{date}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{questions} questions generated</span>
        <button className="text-purple-600 hover:text-purple-700 font-medium text-sm hover:underline">
          Take Quiz →
        </button>
      </div>
    </div>
  );
};

export default NoteCard;