import React, { useState, useEffect } from 'react';
import UserAnalytics from '../components/UserAnalytics';
import QuizHistory from '../pages/QuizHistory';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TrackProgress = () => {
  const token = localStorage.getItem('authToken');
  const userEmail = localStorage.getItem('userEmail');
  const navigate = useNavigate();
  const [showQuizHistory, setShowQuizHistory] = useState(false);

  useEffect(() => {
    if (!token || !userEmail) {
      console.warn('🚫 Missing token or userEmail. Cannot load analytics.');
    }
  }, [token, userEmail]);

  if (!token || !userEmail) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg">You must be logged in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto p-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-purple-600 rounded-full hover:bg-purple-700 flex items-center justify-center"
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        <h1 className="text-3xl font-bold ml-8 text-center flex-grow">Track Your Quiz Progress</h1>
      </div>

      {/* Analytics Charts */}
      <div className="max-w-4xl mx-auto p-4">
        <UserAnalytics userId={userEmail} token={token} />
      </div>

      {/* Toggle Button for Quiz History */}
      <div className="max-w-4xl mx-auto p-4">
        <button
          onClick={() => setShowQuizHistory(!showQuizHistory)}
          className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          {showQuizHistory ? 'Hide Quiz History' : 'Show Quiz History'}
        </button>
      </div>

      {/* Quiz History Table */}
      {showQuizHistory && (
        <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow mt-4">
          <QuizHistory userId={userEmail} token={token} />
        </div>
      )}
    </div>
  );
};

export default TrackProgress;
