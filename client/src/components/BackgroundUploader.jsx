import React, { useState } from 'react';

const BackgroundUploader = ({ currentBackground, onBackgroundChange, onBackgroundReset }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    setError(null);
    setIsUploading(true);
    
    // Convert image to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      onBackgroundChange(event.target.result);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setError('Failed to read the image file');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-2 dark:text-gray-300">Background Image</h3>
      
      {/* Current background preview */}
      {currentBackground && (
        <div className="mb-3">
          <div className="relative w-full h-24 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <img 
              src={currentBackground} 
              alt="Current Background" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      
      <div className="flex flex-col space-y-2">
        {/* Upload button */}
        <label className="btn btn-primary text-center cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700">
          {isUploading ? 'Uploading...' : 'Upload New Background'}
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
        
        {/* Reset button */}
        {currentBackground && (
          <button 
            onClick={onBackgroundReset}
            className="btn bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            disabled={isUploading}
          >
            Reset to Default
          </button>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Recommended: Use a light image for better readability in light mode and a dark image for dark mode.
      </p>
    </div>
  );
};

export default BackgroundUploader;