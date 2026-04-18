// Đổi password cho 1 user cụ thể mà không xoá ai
// Dùng: node reset-password.js <username> [newPassword]
import mongoose from 'mongoose';
import crypto from 'crypto';
import dotenv from 'dotenv';
import User from './src/models/User.model.js';

dotenv.config();

(async () => {
  const username = process.argv[2];
  if (!username) {
    console.error('Usage: node reset-password.js <username> [newPassword]');
    process.exit(1);
  }

  const newPassword =
    process.argv[3] ||
    crypto.randomBytes(9).toString('base64').replace(/[+/=]/g, '').slice(0, 12);

  await mongoose.connect(process.env.MONGODB_URI);

  const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') }).select('+password');
  if (!user) {
    console.error(`User "${username}" not found.`);
    process.exit(1);
  }

  user.password = newPassword;
  await user.save();

  console.log('\n=== PASSWORD UPDATED ===');
  console.log(`  Username: ${user.username}`);
  console.log(`  Role:     ${user.role}`);
  console.log(`  Password: ${newPassword}`);
  console.log('========================\n');
  console.log('LƯU LẠI — password không thể khôi phục nếu mất.\n');

  process.exit(0);
})().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
