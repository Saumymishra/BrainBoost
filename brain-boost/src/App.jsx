import React from 'react';
import { Routes, Route, useLocation, useParams } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePopup from './pages/ProfilePopup';
import Navbar from './components/Navbar';
import QuizPage from './pages/QuizPage';
import TrackProgress from './pages/TrackProgress';
import QuizHistory from './pages/QuizHistory';

const App = () => {
  const location = useLocation();

  return (
    <div className="font-sans">
      {/* Only show Navbar if not on homepage */}
      {location.pathname !== '/' && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/track-progress" element={<TrackProgress />} />
        <Route path="/quiz/:noteId" element={<QuizPageWrapper />} />
        <Route path="/profile" element={<ProfilePopup />} />
        <Route path="/quiz-history" element={<QuizHistory />} />
      </Routes>
    </div>
  );
};

// Wrapper to pass token and noteId to QuizPage
const QuizPageWrapper = () => {
  const { noteId } = useParams();
  const token = localStorage.getItem('authToken');
  return <QuizPage noteId={noteId} token={token} />;
};

export default App;
