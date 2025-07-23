import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { serverUrl } from '../apiConfig';
import { useBackground } from '../hooks/useBackground';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const BackgroundSettings = () => {
  const [predefinedBackgrounds, setPredefinedBackgrounds] = useState([]);
  const fileInputRef = useRef(null);
  const { background, updateBackground, backgroundError } = useBackground();

  useEffect(() => {
    const fetchBackgrounds = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/backgrounds`);
        setPredefinedBackgrounds(res.data);
      } catch (err) {
        console.error('Error fetching backgrounds:', err);
      }
    };

    fetchBackgrounds();
  }, []);

  const handleSelect = (bg) => {
    updateBackground('predefined', bg);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        updateBackground('custom', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    updateBackground('none', 'none');
  };

  return (
    <div className="mt-6">
      <ToastContainer position="top-center" />
      <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Background</h4>
      {backgroundError && (
        <div className="mb-2 p-2 bg-red-100 text-red-700 rounded text-sm">
          {backgroundError}
        </div>
      )}
      <div className="flex overflow-x-auto space-x-3 mb-4 pb-2">
        {predefinedBackgrounds.map((bg) => (
          <div
            key={bg}
            onClick={() => handleSelect(bg)}
            className={`w-24 h-16 rounded-md cursor-pointer flex-shrink-0 bg-cover bg-center border-2 ${background.type === 'predefined' && background.value === bg ? 'border-blue-500' : 'border-transparent'}`}
            style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/${bg})` }}
          ></div>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => fileInputRef.current.click()}
          className="btn-secondary px-4 py-2 text-sm dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Upload
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
          accept="image/*"
        />
        <button 
          onClick={handleReset}
          className="btn-danger px-4 py-2 text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default BackgroundSettings;