const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing users (optional, but good for demo)
    await User.deleteMany();

    const demoUser = {
      name: 'Ananya Sharma',
      email: 'ananya@example.com',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&q=80&auto=format&fit=crop',
      bio: 'Adventure seeker obsessed with sunsets, street food, and stories from the road. 24 countries down, the whole world to go! 🌏',
    };

    await User.create(demoUser);

    console.log('Demo user created: ananya@example.com / password123');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
