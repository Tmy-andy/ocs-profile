// Admin Setup Script
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';
import User from './src/models/User.model.js';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const setupAdmin = async () => {
  try {
    console.log('🔐 Admin User Setup\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if admin exists
    const existingAdmin = await User.findOne({});
    if (existingAdmin) {
      console.log('❌ Admin user already exists!');
      console.log(`   Username: ${existingAdmin.username}`);
      console.log('\n💡 Use that username to login at /admin');
      process.exit(0);
    }

    // Get credentials
    const username = await question('Enter admin username: ');
    const password = await question('Enter admin password (min 6 chars): ');

    if (!username || username.length < 3) {
      console.log('\n❌ Username must be at least 3 characters');
      process.exit(1);
    }

    if (!password || password.length < 6) {
      console.log('\n❌ Password must be at least 6 characters');
      process.exit(1);
    }

    // Create admin user
    const admin = await User.create({
      username: username.trim().toLowerCase(),
      password: password,
      role: 'admin'
    });

    console.log('\n✅ Admin user created successfully!');
    console.log(`\n📝 Login Details:`);
    console.log(`   Username: ${admin.username}`);
    console.log(`   Password: ${password}`);
    console.log(`\n🌐 Login URL: http://localhost:5173/admin`);
    console.log(`\n🎉 You can now login to manage characters!`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
};

setupAdmin();
