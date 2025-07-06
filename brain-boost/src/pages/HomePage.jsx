import React from 'react';
import { Upload, BookOpen, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-white rounded-full shadow-lg">
              <Brain className="h-16 w-16 text-purple-600" />
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              BrainBoost
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-4 font-light">
            Upload Your Notes. Generate Quizzes. Boost Learning.
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Transform your study materials into interactive quizzes with AI. 
            Make learning more engaging and track your progress.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Get Started
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
            <Upload className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Easy Upload</h3>
            <p className="text-gray-600">Simply drag and drop your notes or documents</p>
          </div>
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
            <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
            <p className="text-gray-600">Advanced AI generates relevant quiz questions</p>
          </div>
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
            <BookOpen className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor your learning journey and improvements</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
