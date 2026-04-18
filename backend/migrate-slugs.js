// Migration script to add slug to existing characters
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Helper function to generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const migrateCharacters = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const Character = mongoose.model('Character', new mongoose.Schema({}, { strict: false }));
    
    const characters = await Character.find({});
    console.log(`📦 Found ${characters.length} characters to update`);

    for (const character of characters) {
      if (!character.slug) {
        let baseSlug = generateSlug(character.name);
        let slug = baseSlug;
        let counter = 1;

        // Check if slug exists
        while (await Character.findOne({ slug, _id: { $ne: character._id } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        character.slug = slug;
        character.characterId = slug;
        await character.save();
        console.log(`✅ Updated: ${character.name} → ${slug}`);
      } else {
        console.log(`⏭️  Skipped: ${character.name} (already has slug: ${character.slug})`);
      }
    }

    console.log('✨ Migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrateCharacters();
