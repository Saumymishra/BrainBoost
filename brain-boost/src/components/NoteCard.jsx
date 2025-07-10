import React from "react";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NoteCard = ({ note }) => {
  const navigate = useNavigate();

  const handleTakeQuiz = () => {
    // Navigate immediately, no await, no API call here
    navigate(`/quiz/${note._id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FileText className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {note.originalname.length > 10
                ? note.originalname.substring(0, 10) + "..."
                : note.originalname}
            </h3>
            <p className="text-sm text-gray-500">{note.mimetype}</p>
          </div>
        </div>
        <span className="text-xs text-gray-400">
          {note.uploadedAt ? new Date(note.uploadedAt).toLocaleDateString() : ""}
        </span>
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-sm text-gray-600">
          {note.mcqs?.length || 0} questions generated
        </span>
        <div className="flex items-center space-x-4">
          {note.path && (
            <a
              href={`http://localhost:5000/${note.path.replace(/\\/g, "/")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 font-medium text-sm hover:underline"
            >
              View File
            </a>
          )}
          <button
            onClick={handleTakeQuiz}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm hover:underline"
          >
            Take Quiz →
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
