// Quick admin setup - no interactive prompts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.model.js';

dotenv.config();

const createAdmin = async () => {
  try {
    console.log('🔐 Creating admin user...\n');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if admin exists
    const existingAdmin = await User.findOne({});
    if (existingAdmin) {
      console.log('❌ Admin already exists!');
      console.log(`   Username: ${existingAdmin.username}`);
      console.log('\n💡 Login at: http://localhost:5173/admin');
      process.exit(0);
    }

    // Create admin with default credentials
    const admin = await User.create({
      username: 'admin',
      password: '123456',
      role: 'admin'
    });

    console.log('✅ Admin user created!\n');
    console.log('📝 Login Details:');
    console.log('   Username: admin');
    console.log('   Password: 123456');
    console.log('\n🌐 Login URL: http://localhost:5173/admin');
    console.log('\n⚠️  IMPORTANT: Change password after first login!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
