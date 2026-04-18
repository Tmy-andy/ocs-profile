// Generate slug for any user that doesn't have one (run once after migration)
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.model.js';

dotenv.config();

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = await User.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }] });
  console.log(`Found ${users.length} user(s) without slug.`);
  for (const u of users) {
    await u.save(); // pre-save hook auto-generates
    console.log(`  ${u.username} -> ${u.slug}`);
  }
  console.log('Done.');
  process.exit(0);
})().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
