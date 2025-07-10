import React from 'react';
import UserAnalytics from '../components/UserAnalytics';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TrackProgress = () => {
  const token = localStorage.getItem('authToken');
  const userEmail = localStorage.getItem('userEmail');
  const navigate = useNavigate();

  if (!token || !userEmail) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg">You must be logged in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back button aligned to top right */}
      <div className="max-w-4xl mx-auto p-8 flex justify-start">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-purple-600 rounded-full hover:bg-purple-700 flex items-center justify-center"
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        <h1 className="text-3xl font-bold ml-8 text-center">Track Your Quiz Progress</h1>
      </div>

      
      <UserAnalytics userId={userEmail} token={token} />
    </div>
  );
};

export default TrackProgress;
