import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getUserId } from '../utils/userId';

export const useBackground = () => {
  const [background, setBackground] = useState({ type: '', value: '' });

  const applyBackground = useCallback((type, value) => {
    if (type === 'custom') {
      document.body.style.backgroundImage = `url(${value})`;
    } else if (type === 'predefined') {
      document.body.style.backgroundImage = `url(${process.env.PUBLIC_URL}/${value})`;
    } else {
      document.body.style.backgroundImage = 'none';
    }
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      const userId = getUserId();
      try {
        const res = await axios.get(`/api/user/background?userId=${userId}`);
        const { backgroundType, backgroundValue } = res.data;
        setBackground({ type: backgroundType, value: backgroundValue });
        applyBackground(backgroundType, backgroundValue);
      } catch (err) {
        const storedCustom = localStorage.getItem('customBackground');
        const storedSelected = localStorage.getItem('selectedBackground');

        if (storedCustom) {
          setBackground({ type: 'custom', value: storedCustom });
          applyBackground('custom', storedCustom);
        } else if (storedSelected) {
          setBackground({ type: 'predefined', value: storedSelected });
          applyBackground('predefined', storedSelected);
        }
      }
    };

    fetchSettings();
  }, [applyBackground]);

  const updateBackground = async (type, value) => {
    const userId = getUserId();
    setBackground({ type, value });
    applyBackground(type, value);

    if (type === 'custom') {
      localStorage.setItem('customBackground', value);
      localStorage.removeItem('selectedBackground');
    } else if (type === 'predefined') {
      localStorage.setItem('selectedBackground', value);
      localStorage.removeItem('customBackground');
    } else {
      localStorage.removeItem('customBackground');
      localStorage.removeItem('selectedBackground');
    }

    try {
      await axios.post('/api/user/background', {
        userId,
        backgroundType: type,
        backgroundValue: value,
      });
    } catch (err) {
      console.error('Error saving background:', err);
    }
  };

  return { background, updateBackground };
};