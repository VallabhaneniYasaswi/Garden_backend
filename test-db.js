const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    await mongoose.connect('mongodb+srv://weather:sravanthi@cluster0.iyeku.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
    
    // Test creating a document
    const GardenTip = require('./models/GardenTip');
    const testTip = new GardenTip({
      title: 'Test Tip',
      description: 'Test Description',
      category: 'basics',
      details: ['Test Detail'],
      user: '65716f021234567890123456'
    });
    
    await testTip.save();
    console.log('Test document created successfully');
    
    mongoose.disconnect();
  } catch (err) {
    console.error('Database test failed:', err);
  }
};

testConnection(); 