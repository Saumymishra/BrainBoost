import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import NoteCard from '../components/NoteCard';
import UploadZone from '../components/UploadZone';

const DashboardPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadedNotes, setUploadedNotes] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (!token || !userEmail) {
      navigate('/login');
    }
  }, [token, userEmail, navigate]);

  useEffect(() => {
    if (token && userEmail) {
      fetch(`http://localhost:5000/api/upload?userId=${encodeURIComponent(userEmail)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch notes');
          return res.json();
        })
        .then((data) => {
          if (data.notes) setUploadedNotes(data.notes);
        })
        .catch((err) => {
          console.error('Error fetching notes:', err);
          setMessage('❌ Failed to load notes');
        });
    }
  }, [token, userEmail]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('userId', userEmail);

    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setUploadedNotes((prev) => [data.note, ...prev]);
        setMessage('✅ Upload successful!');
        setSelectedFile(null);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`❌ Upload failed: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error uploading file');
    }
  };

  const visibleNotes = showAll ? uploadedNotes : uploadedNotes.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Notes</h1>
          <p className="text-gray-600">Upload new notes or review your existing quiz materials</p>
        </div>

        {/* Upload Zone */}
        <UploadZone onFileUpload={handleUpload} />

        {/* Notes Grid */}
        <div className="my-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Notes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleNotes.length > 0 ? (
              visibleNotes.map((note) => <NoteCard key={note._id} note={note} />)
            ) : (
              <div className="text-center py-12 col-span-full">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No notes yet</h3>
                <p className="text-gray-600 mb-6">
                  Upload your first set of notes to get started
                </p>
              </div>
            )}
          </div>

          {/* Toggle Buttons */}
          {uploadedNotes.length > 4 && (
            <div className="text-right mt-4">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-sm text-purple-600 hover:underline"
              >
                {showAll ? 'View Less ↑' : 'View All Notes →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
