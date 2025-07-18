import React, { useState, useEffect } from 'react';
import axios from 'axios';

const List = ({ type }) => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch items when type changes
  useEffect(() => {
    fetchItems();
  }, [type]);

  // Fetch items from the server
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`/api/lists/${type}`);
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
  };

  // Add a new item
  const addItem = async () => {
    if (!newItem.trim()) return;
    
    const updatedItems = [...items, newItem.trim()];
    
    try {
      // Optimistically update UI
      setItems(updatedItems);
      setNewItem('');
      
      // Save to server
      await axios.post(`/api/lists/${type}`, { entries: updatedItems });
      
      // Update local storage as backup
      localStorage.setItem(`${type}Items`, JSON.stringify(updatedItems));
    } catch (err) {
      console.error(`Error adding ${type} item:`, err);
      setError(`Failed to add item. Please try again.`);
      
      // Still update local storage even if server fails
      localStorage.setItem(`${type}Items`, JSON.stringify(updatedItems));
      
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
    setEditText(items[index]);
  };

  // Save edited item
  const saveEdit = async (index) => {
    if (!editText.trim()) return;
    
    const updatedItems = [...items];
    updatedItems[index] = editText.trim();
    
    try {
      // Optimistically update UI
      setItems(updatedItems);
      setEditingIndex(null);
      
      // Save to server
      await axios.put(`/api/lists/${type}`, { entries: updatedItems });
      
      // Update local storage as backup
      localStorage.setItem(`${type}Items`, JSON.stringify(updatedItems));
    } catch (err) {
      console.error(`Error updating ${type} item:`, err);
      setError(`Failed to update item. Please try again.`);
      
      // Still update local storage even if server fails
      localStorage.setItem(`${type}Items`, JSON.stringify(updatedItems));
      
      // Register for background sync when online
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-lists');
      }
    }
  };

  // Delete an item
  const deleteItem = async (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    
    try {
      // Optimistically update UI
      setItems(updatedItems);
      
      // Save to server
      await axios.delete(`/api/lists/${type}`, { data: { entries: updatedItems } });
      
      // Update local storage as backup
      localStorage.setItem(`${type}Items`, JSON.stringify(updatedItems));
    } catch (err) {
      console.error(`Error deleting ${type} item:`, err);
      setError(`Failed to delete item. Please try again.`);
      
      // Still update local storage even if server fails
      localStorage.setItem(`${type}Items`, JSON.stringify(updatedItems));
      
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
      return { text: 'Rest & Recovery', emoji: '😴' };
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
        <h2 className={`text-xl font-semibold ${type === 'signal' ? 'text-signal' : 'text-noise'}`}>
          {type === 'signal' ? 'Signal' : 'Noise'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {type === 'signal' 
            ? 'Activities that move you forward' 
            : 'Distractions to avoid'}
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
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex">
          <input
            type="text"
            className="input-field flex-grow mr-2 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
            placeholder={type === 'signal' ? 'Add a focus activity...' : 'Add a distraction...'}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className={`btn-${type === 'signal' ? 'primary' : 'secondary'} px-4 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white`}
          >
            Add
          </button>
        </div>
      </form>
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {/* List items */}
      <ul className="space-y-2">
        {items.length === 0 && !isLoading ? (
          <li className="text-gray-500 dark:text-gray-400 text-center py-4">
            No items yet. Add your first one above.
          </li>
        ) : (
          items.map((item, index) => (
            <li 
              key={index} 
              className="card flex items-center justify-between transition-all duration-200 hover:shadow-md dark:bg-gray-800 dark:border-gray-700"
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
                  <span className="flex items-center dark:text-gray-200">
                    <span className="mr-2">{getItemEmoji()}</span>
                    {item}
                  </span>
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
                      className="p-1 text-gray-500 hover:text-noise transition-colors duration-200 dark:text-gray-400 dark:hover:text-red-400"
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