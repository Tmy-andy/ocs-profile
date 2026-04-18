import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.model.js';

dotenv.config();

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = await User.find({});
  for (const u of users) {
    const lower = u.username.toLowerCase();
    if (u.username !== lower) {
      console.log(`Renaming "${u.username}" -> "${lower}"`);
      await User.updateOne({ _id: u._id }, { $set: { username: lower } });
    }
  }
  console.log('Done.');
  process.exit(0);
})();
