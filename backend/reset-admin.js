// Xóa toàn bộ users cũ và tạo admin mới với password random
import mongoose from 'mongoose';
import crypto from 'crypto';
import dotenv from 'dotenv';
import User from './src/models/User.model.js';

dotenv.config();

const resetAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.\n');

    const deleted = await User.deleteMany({});
    console.log(`Deleted ${deleted.deletedCount} existing user(s).\n`);

    const username = 'admin';
    const password = crypto.randomBytes(9).toString('base64').replace(/[+/=]/g, '').slice(0, 12);

    const admin = await User.create({
      username,
      password,
      displayName: 'Administrator',
      role: 'admin',
      isActivated: true
    });

    console.log('=== ADMIN CREATED ===');
    console.log(`  Username: ${admin.username}`);
    console.log(`  Password: ${password}`);
    console.log('=====================\n');
    console.log('LƯU LẠI THÔNG TIN NÀY — password không thể khôi phục nếu mất.\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

resetAdmin();
