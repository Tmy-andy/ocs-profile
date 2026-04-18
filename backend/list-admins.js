import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.model.js';

dotenv.config();

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = await User.find({}, 'username slug displayName role isActivated createdAt').lean();
  console.log('\n=== ALL USERS ===');
  users.forEach(u => {
    console.log(`- ${u.username} | slug=${u.slug} | role=${u.role} | active=${u.isActivated} | name=${u.displayName}`);
  });
  console.log(`\nTotal: ${users.length}`);
  process.exit(0);
})();
