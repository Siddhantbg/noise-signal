import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getUserId } from '../utils/userId';
import { toast } from 'react-toastify';
import { serverUrl } from '../apiConfig';

export const useBackground = () => {
  const [background, setBackground] = useState({ type: '', value: '' });
  const [backgroundError, setBackgroundError] = useState(null);

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
        const res = await axios.get(`${serverUrl}/api/user/background?userId=${userId}`);
        if (res.data) {
          const { backgroundType, backgroundValue } = res.data;
          setBackground({ type: backgroundType, value: backgroundValue });
          applyBackground(backgroundType, backgroundValue);
        }
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
    setBackgroundError(null);
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

    const toastId = toast.loading('Saving background...');
    try {
      await axios.post(`${serverUrl}/api/user/background`, {
        userId,
        backgroundType: type,
        backgroundValue: value,
      });
      toast.update(toastId, { render: 'Background saved!', type: 'success', isLoading: false, autoClose: 2000 });
    } catch (err) {
      setBackgroundError('Failed to save background. Please try again.');
      toast.update(toastId, { render: 'Failed to save background.', type: 'error', isLoading: false, autoClose: 3000 });
      console.error('Error saving background:', err);
    }
  };

  return { background, updateBackground, backgroundError };
};