import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { serverUrl } from '../apiConfig';

const List = ({ type }) => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]); // For new item images
  const [draggedIndex, setDraggedIndex] = useState(null); // For custom drag and drop

  // Fetch items when type changes
  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${serverUrl}/api/lists/${type}`);
      setItems(response.data.entries || []);
    } catch (err) {
      console.error(`Error fetching ${type} items:`, err);
      setError(`Failed to load ${type} items. Please try again.`);
      
      // Try to get from local storage as fallback
      const storedItems = localStorage.getItem(`${type}Items`);
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      } else {
        setItems([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Custom drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
    // Add visual feedback
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    
    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    
    // Remove the dragged item
    newItems.splice(draggedIndex, 1);
    
    // Insert at new position
    if (draggedIndex < dropIndex) {
      newItems.splice(dropIndex - 1, 0, draggedItem);
    } else {
      newItems.splice(dropIndex, 0, draggedItem);
    }
    
    setItems(newItems);
    localStorage.setItem(`${type}Items`, JSON.stringify(newItems));
    setDraggedIndex(null);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
  };

  // Add a new item
  const addItem = async () => {
    if (!newItem.trim()) return;
    
    // Prepare FormData for text and images
    const formData = new FormData();
    formData.append('text', newItem.trim());
    selectedImages.forEach((img, idx) => {
      formData.append('images', img);
    });
    formData.append('completed', false);

    // Optimistically update UI
    const tempImages = selectedImages.map(img => URL.createObjectURL(img));
    const updatedItems = [...items, { text: newItem.trim(), completed: false, images: tempImages }];
    try {
      setItems(updatedItems);
      setNewItem('');
      setSelectedImages([]);

      // Save to server (multipart/form-data)
      await axios.post(`${serverUrl}/api/lists/${type}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Update local storage as backup
      localStorage.setItem(`${type}Items`, JSON.stringify(updatedItems));
      
      // Show success toast
      toast.success(`Item added to ${type === 'signal' ? 'Signal' : 'Noise'} list!`, {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error(`Error adding ${type} item:`, err);
      setError(`Failed to add item. Please try again.`);

      // Still update local storage even if server fails
      localStorage.setItem(`${type}Items`, JSON.stringify(updatedItems));

      // Show error toast
      toast.error(`Failed to add item to ${type === 'signal' ? 'Signal' : 'Noise'} list. Saved locally.`, {
        position: 'top-center',
        autoClose: 3000,
      });

      // Register for background sync when online
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-lists');
      }
    }
  };

  // Start editing an item
  const startEditing = (index) => {
    setEditingIndex(index);
    setEditText(items[index].text);
  };

  // Save edited item
  const saveEdit = async (index) => {
    if (!editText.trim()) return;
    
    const updatedItems = [...items];
    updatedItems[index].text = editText.trim();
    
    try {
      // Optimistically update UI
      setItems(updatedItems);
      setEditingIndex(null);
      
      // Save to server
      await axios.put(`${serverUrl}/api/lists/${type}/${items[index]._id}`, { completed: items[index].completed, text: editText.trim() });
      
      // Update local storage as backup
      localStorage.setItem(`${type}Items`, JSON.stringify(updatedItems));
      
      // Show success toast
      toast.success(`Item updated in ${type === 'signal' ? 'Signal' : 'Noise'} list!`, {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error(`Error updating ${type} item:`, err);
      setError(`Failed to update item. Please try again.`);
      
      // Still update local storage even if server fails
      localStorage.setItem(`${type}Items`, JSON.stringify(updatedItems));
      
      // Show error toast
      toast.error(`Failed to update item in ${type === 'signal' ? 'Signal' : 'Noise'} list. Updated locally.`, {
        position: 'top-center',
        autoClose: 3000,
      });
      
      // Register for background sync when online
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-lists');
      }
    }
  };

  // Delete an item
  const deleteItem = async (index) => {
    const itemToDelete = items[index];
    const updatedItems = items.filter((_, i) => i !== index);
    
    try {
      // Optimistically update UI
      setItems(updatedItems);
      
      // Save to server
      await axios.delete(`${serverUrl}/api/lists/${type}/${itemToDelete._id}`);
      
      // Update local storage as backup
      localStorage.setItem(`${type}Items`, JSON.stringify(updatedItems));
      
      // Show success toast
      toast.success(`Item removed from ${type === 'signal' ? 'Signal' : 'Noise'} list!`, {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error(`Error deleting ${type} item:`, err);
      setError(`Failed to delete item. Please try again.`);
      
      // Still update local storage even if server fails
      localStorage.setItem(`${type}Items`, JSON.stringify(updatedItems));
      
      // Show error toast
      toast.error(`Failed to remove item from ${type === 'signal' ? 'Signal' : 'Noise'} list. Removed locally.`, {
        position: 'top-center',
        autoClose: 3000,
      });
      
      // Register for background sync when online
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-lists');
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    addItem();
  };

  // Get suggestion based on time of day (bonus feature)
  const getSuggestion = () => {
    if (type !== 'signal') return null;
    
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 9) {
      return { text: 'Morning Deep Work', emoji: '🌅' };
    } else if (hour >= 9 && hour < 12) {
      return { text: 'Focus Session', emoji: '🧠' };
    } else if (hour >= 12 && hour < 14) {
      return { text: 'Lunch Break', emoji: '🍽️' };
    } else if (hour >= 14 && hour < 17) {
      return { text: 'Afternoon Tasks', emoji: '📋' };
    } else if (hour >= 17 && hour < 20) {
      return { text: 'Evening Walk', emoji: '🚶' };
    } else if (hour >= 20 && hour < 23) {
      return { text: 'Reading Time', emoji: '📚' };
    } else {
      return { text: 'Sleep & Recharge', emoji: '😴' };
    }
  };

  // Get emoji for list item based on type
  const getItemEmoji = () => {
    return type === 'signal' ? '✅' : '⛔';
  };

  const suggestion = getSuggestion();

  return (
    <div>
      {/* List header with description */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {type === 'signal' ? 'Signal' : 'Noise'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {type === 'signal' 
            ? 'Important tasks that drive progress' 
            : 'Distractions that reduce focus'}
        </p>
      </div>
      
      {/* Suggestion card (bonus feature) */}
      {type === 'signal' && suggestion && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{suggestion.emoji}</span>
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-300">Suggestion</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">{suggestion.text}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Form to add new items */}
      <div className="card-glass mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              className="input-field flex-grow"
              placeholder={type === 'signal' ? 'Add an important task...' : 'Add a distraction...'}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              required
              style={{ minWidth: 0 }}
            />
            {/* Hidden file input */}
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={e => setSelectedImages(Array.from(e.target.files))}
            />
            {/* Cloud icon as file upload trigger */}
            <label
              htmlFor="file-upload"
              className="theme-toggle cursor-pointer flex items-center justify-center h-12 w-12"
              title="Upload images"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
                <path d="M7.5 18.5h9a4 4 0 0 0 0-8c-.1 0-.2 0-.3.01A6 6 0 1 0 6.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </label>
            <button 
              type="submit" 
              className={`btn ${type === 'signal' ? 'btn-primary' : 'btn-secondary'} px-6 py-3 flex items-center space-x-2`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add</span>
            </button>
          </div>
          {/* Preview selected images */}
          {selectedImages.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-3 border-t border-white/20 dark:border-gray-700/20">
              {selectedImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`preview-${idx}`}
                    className="h-16 w-16 object-cover rounded-lg border border-white/30 dark:border-gray-700/30 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== idx))}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="card-glass text-center py-8">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading {type} items...</p>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100/90 backdrop-blur-sm text-red-700 rounded-xl dark:bg-red-900/60 dark:text-red-200 border border-red-200/50 dark:border-red-800/30 shadow-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}
      
      {/* List items with custom drag-and-drop */}
      <ul className="space-y-2">
        {isLoading ? (
          <li className="text-gray-400 text-center py-4">Loading...</li>
        ) : items.length === 0 ? (
          <div className="card-glass text-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-200/50 dark:bg-gray-700/50 rounded-full flex items-center justify-center">
                {type === 'signal' ? (
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  No {type} items yet
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {type === 'signal' ? 'Add your important focus activities above' : 'Add your distractions to track above'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          items.map((item, index) => (
            <li
              key={item._id || `item-${index}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnter={handleDragEnter}
              className={`task-item group flex items-center justify-between cursor-move ${draggedIndex === index ? 'task-item-dragging' : ''}`}
              style={{
                background: 'rgba(255,255,255,0.15)',
                transform: draggedIndex === index ? 'rotate(3deg)' : 'none',
              }}
            >
              {editingIndex === index ? (
                <div className="flex-grow flex">
                  <input
                    type="text"
                    className="input-field flex-grow dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    autoFocus
                  />
                  <button
                    onClick={() => saveEdit(index)}
                    className="ml-2 btn bg-primary text-white dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center flex-grow">
                    {/* Drag handle */}
                    <span className="mr-3 text-gray-400 cursor-grab active:cursor-grabbing">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"></path>
                      </svg>
                    </span>
                    <span className="flex items-center dark:text-gray-200">
                      <span className="mr-2">{getItemEmoji()}</span>
                      {item.text}
                    </span>
                  </div>
                  {/* Show images if present */}
                  {item.images && item.images.length > 0 && (
                    <div className="flex flex-wrap gap-1 ml-2">
                      {item.images.map((imgUrl, i) => (
                        <img
                          key={i}
                          src={imgUrl}
                          alt={`task-img-${i}`}
                          className="h-8 w-8 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}
                  <div className="flex space-x-1">
                    <button
                      onClick={() => startEditing(index)}
                      className="p-1 text-gray-500 hover:text-primary transition-colors duration-200 dark:text-gray-400 dark:hover:text-blue-400"
                      aria-label="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteItem(index)}
                      className="p-1 text-gray-500 hover:text-red-500 transition-colors duration-200 dark:text-gray-400 dark:hover:text-red-400"
                      aria-label="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default List;