// Gán owner cho các character chưa có (gán vào admin đầu tiên)
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.model.js';
import Character from './src/models/Character.model.js';

dotenv.config();

const migrate = async () => {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.\n');

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('No admin user found. Run reset-admin.js first.');
      process.exit(1);
    }

    console.log(`Using admin: ${admin.username} (${admin._id})\n`);

    const orphans = await Character.find({ owner: { $exists: false } });
    console.log(`Found ${orphans.length} character(s) without owner.\n`);

    if (orphans.length === 0) {
      console.log('Nothing to migrate.');
      process.exit(0);
    }

    const result = await Character.updateMany(
      { owner: { $exists: false } },
      { $set: { owner: admin._id } }
    );

    console.log(`Updated ${result.modifiedCount} character(s). Owner = ${admin.username}.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

migrate();
