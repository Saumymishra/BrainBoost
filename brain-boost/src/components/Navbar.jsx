import React from 'react';
import { Brain, User, LogOut, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear auth token
    navigate('/login'); // Navigate to login page
  };

  const handleUploadClick = () => {
    alert('Upload Notes clicked!');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
            tabIndex={0}
            role="button"
            onKeyDown={e => { if (e.key === 'Enter') navigate('/'); }}
          >
            <Brain className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              BrainBoost
            </span>
          </div>

          {location.pathname === '/dashboard' && (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleUploadClick}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:block">Upload Notes</span>
              </button>
              <div className="flex items-center space-x-2">
                <User
                  className="h-8 w-8 text-gray-600 p-1 border rounded-full hover:bg-gray-100 cursor-pointer"
                  onClick={handleProfileClick} // <-- Navigate to profile page on click
                  title="Your Profile"
                />
                <LogOut
                  className="h-8 w-8 text-gray-600 p-1 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={handleLogout}
                  title="Logout"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
