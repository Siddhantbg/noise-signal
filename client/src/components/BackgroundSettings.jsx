import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const BackgroundSettings = () => {
  const [predefinedBackgrounds, setPredefinedBackgrounds] = useState([]);
  const [selectedBackground, setSelectedBackground] = useState('');
  const [customBackground, setCustomBackground] = useState('');
  const fileInputRef = useRef(null);

  const getUserId = () => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('userId', userId);
    }
    return userId;
  };

  useEffect(() => {
    const fetchBackgrounds = async () => {
      try {
        const res = await axios.get('/api/backgrounds');
        setPredefinedBackgrounds(res.data);
      } catch (err) {
        console.error('Error fetching backgrounds:', err);
      }
    };

    const fetchSettings = async () => {
      const userId = getUserId();
      try {
        const res = await axios.get(`/api/user/background?userId=${userId}`);
        const { backgroundType, backgroundValue } = res.data;
        if (backgroundType === 'custom') {
          setCustomBackground(backgroundValue);
          document.body.style.backgroundImage = `url(${backgroundValue})`;
        } else if (backgroundType === 'predefined') {
          setSelectedBackground(backgroundValue);
          document.body.style.backgroundImage = `url(${process.env.PUBLIC_URL}/${backgroundValue})`;
        }
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
      } catch (err) {
        // If no settings are found, we can just use local storage or defaults
        const storedCustom = localStorage.getItem('customBackground');
        const storedSelected = localStorage.getItem('selectedBackground');

        if (storedCustom) {
          setCustomBackground(storedCustom);
          document.body.style.backgroundImage = `url(${storedCustom})`;
        } else if (storedSelected) {
          setSelectedBackground(storedSelected);
          document.body.style.backgroundImage = `url(${process.env.PUBLIC_URL}/${storedSelected})`;
        } else {
          document.body.style.backgroundImage = 'none';
        }
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
      }
    };

    fetchBackgrounds();
    fetchSettings();
  }, []);

  const handleSelect = async (bg) => {
    const userId = getUserId();
    const bgUrl = `${process.env.PUBLIC_URL}/${bg}`;
    setSelectedBackground(bg);
    setCustomBackground('');
    localStorage.setItem('selectedBackground', bg);
    localStorage.removeItem('customBackground');
    document.body.style.backgroundImage = `url(${bgUrl})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';

    try {
      await axios.post('/api/user/background', {
        userId,
        backgroundType: 'predefined',
        backgroundValue: bg,
      });
    } catch (err) {
      console.error('Error saving background:', err);
    }
  };

  const handleUpload = (e) => {
    const userId = getUserId();
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setCustomBackground(base64String);
        setSelectedBackground('');
        localStorage.setItem('customBackground', base64String);
        localStorage.removeItem('selectedBackground');
        document.body.style.backgroundImage = `url(${base64String})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';

        axios.post('/api/user/background', {
          userId,
          backgroundType: 'custom',
          backgroundValue: base64String,
        }).catch(err => console.error('Error saving background:', err));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = async () => {
    const userId = getUserId();
    setCustomBackground('');
    setSelectedBackground('');
    localStorage.removeItem('customBackground');
    localStorage.removeItem('selectedBackground');
    document.body.style.backgroundImage = 'none'; // Revert to default

    try {
      await axios.post('/api/user/background', {
        userId,
        backgroundType: 'none',
        backgroundValue: 'none',
      });
    } catch (err) {
      console.error('Error resetting background:', err);
    }
  };

  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Background</h4>
      <div className="flex overflow-x-auto space-x-3 mb-4 pb-2">
        {predefinedBackgrounds.map((bg) => (
          <div
            key={bg}
            onClick={() => handleSelect(bg)}
            className={`w-24 h-16 rounded-md cursor-pointer flex-shrink-0 bg-cover bg-center border-2 ${selectedBackground === bg && !customBackground ? 'border-blue-500' : 'border-transparent'}`}
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