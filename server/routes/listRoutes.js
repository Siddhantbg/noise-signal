const express = require('express');
const router = express.Router();
const TaskList = require('../models/TaskList');

// Get list by type
router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    let list = await TaskList.findOne({ type });
    
    if (!list) {
      list = new TaskList({ type, items: [] });
      await list.save();
    }
    
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching list' });
  }
});

// Add item to list
router.post('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { text } = req.body;
    
    let list = await TaskList.findOne({ type });
    if (!list) {
      list = new TaskList({ type, items: [] });
    }
    
    list.items.push({
      text,
      completed: false,
      createdAt: new Date()
    });
    
    await list.save();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Error adding item to list' });
  }
});

// Update item in list
router.put('/:type/:itemId', async (req, res) => {
  try {
    const { type, itemId } = req.params;
    const { completed } = req.body;
    
    const list = await TaskList.findOne({ type });
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    
    const item = list.items.id(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    item.completed = completed;
    await list.save();
    
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Error updating item' });
  }
});

// Delete item from list
router.delete('/:type/:itemId', async (req, res) => {
  try {
    const { type, itemId } = req.params;
    
    const list = await TaskList.findOne({ type });
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    
    list.items.pull(itemId);
    await list.save();
    
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Error deleting item' });
  }
});

module.exports = router;
