import React, { useState, useEffect, useRef } from 'react';

const predefinedBackgrounds = [
  'backgrounds/forest.svg',
  'backgrounds/galaxy.svg',
  'backgrounds/clean-light.svg',
];

const BackgroundSelector = () => {
  const [selectedBackground, setSelectedBackground] = useState('');
  const [customBackground, setCustomBackground] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedCustom = localStorage.getItem('customBackground');
    const storedSelected = localStorage.getItem('selectedBackground');

    if (storedCustom) {
      setCustomBackground(storedCustom);
      document.body.style.backgroundImage = `url(${storedCustom})`;
    } else if (storedSelected) {
      setSelectedBackground(storedSelected);
      document.body.style.backgroundImage = `url(${storedSelected})`;
    } else {
      // Default background
      document.body.style.backgroundImage = 'none';
    }
  }, []);

  const handleSelect = (bg) => {
    setSelectedBackground(bg);
    setCustomBackground('');
    localStorage.setItem('selectedBackground', bg);
    localStorage.removeItem('customBackground');
    document.body.style.backgroundImage = `url(${bg})`;
  };

  const handleUpload = (e) => {
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
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setCustomBackground('');
    setSelectedBackground('');
    localStorage.removeItem('customBackground');
    localStorage.removeItem('selectedBackground');
    document.body.style.backgroundImage = 'none'; // Revert to default
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Change Background</h3>
      <div className="flex overflow-x-auto space-x-3 mb-4 pb-2">
        {predefinedBackgrounds.map((bg) => (
          <div
            key={bg}
            onClick={() => handleSelect(bg)}
            className={`w-24 h-16 rounded-md cursor-pointer flex-shrink-0 bg-cover bg-center border-2 ${selectedBackground === bg && !customBackground ? 'border-blue-500' : 'border-transparent'}`}
            style={{ backgroundImage: `url(${bg})` }}
          ></div>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => fileInputRef.current.click()}
          className="btn-secondary px-4 py-2 text-sm dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Upload Image
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

export default BackgroundSelector;