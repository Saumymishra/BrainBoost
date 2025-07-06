import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ProfilePage = () => {
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/user/progress', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch progress');
        const data = await res.json();
        setUserProgress(data);
      } catch (err) {
        console.error(err);
        setUserProgress(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Circular Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 p-2 bg-purple-600 rounded-full hover:bg-purple-700 flex items-center justify-center"
        aria-label="Go back"
      >
        <ArrowLeft className="h-6 w-6 text-white" />
      </button>

      {loading ? (
        <div className="text-center">Loading your profile...</div>
      ) : !userProgress ? (
        <div className="text-center">No progress data available.</div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6">Your Profile & Progress</h1>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Quiz Progress</h2>
            <p>Total Quizzes Taken: {userProgress.totalQuizzes}</p>
            <p>Average Score: {userProgress.avgScore}%</p>
            <p>Last Quiz Date: {new Date(userProgress.lastQuizDate).toLocaleDateString()}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
