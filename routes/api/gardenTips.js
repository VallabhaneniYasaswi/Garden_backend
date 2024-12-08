const express = require('express');
const router = express.Router();
const GardenTip = require('../../models/GardenTip');

// Get all tips
router.get('/', async (req, res) => {
  try {
    const tips = await GardenTip.find().sort({ createdAt: -1 });
    res.json(tips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new tip
router.post('/', async (req, res) => {
  try {
    const newTip = new GardenTip(req.body);
    const savedTip = await newTip.save();
    res.status(201).json(savedTip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete tip
router.delete('/:id', async (req, res) => {
  try {
    const deletedTip = await GardenTip.findByIdAndDelete(req.params.id);
    if (!deletedTip) {
      return res.status(404).json({ message: 'Tip not found' });
    }
    res.json({ message: 'Tip deleted successfully', tip: deletedTip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 