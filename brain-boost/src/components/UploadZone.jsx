import React, { useState, useRef } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';

const UploadZone = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', localStorage.getItem('userEmail'));

    setUploading(true);
    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Upload successful');
      } else {
        alert(`❌ Upload failed: ${data.message}`);
      }
    } catch (err) {
      alert('❌ Error uploading file');
      console.error(err);
    }
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFileUpload(files[0]);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div
      className={`rounded-3xl p-10 text-center border-2 border-dashed transition-all duration-300 ease-in-out shadow-xl backdrop-blur-md ${
        isDragOver
          ? 'border-purple-500 bg-purple-50/40'
          : 'border-gray-300 bg-white/30 hover:border-purple-400 hover:bg-gray-100/30'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        {uploading ? (
          <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
        ) : (
          <UploadCloud
            className={`h-12 w-12 transition-colors ${
              isDragOver ? 'text-purple-600' : 'text-gray-400'
            }`}
          />
        )}
        <h2 className="text-xl font-semibold text-gray-800">
          {uploading ? 'Uploading...' : 'Drop your notes here'}
        </h2>
        <p className="text-sm text-gray-600">
          Or click below to browse files from your device
        </p>

        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          disabled={uploading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full text-sm font-medium transition disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Choose File'}
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.docx,.txt"
        />
        <p className="text-xs text-gray-500">Max 5MB | Supports PDF, DOCX, TXT</p>
      </div>
    </div>
  );
};

export default UploadZone;
