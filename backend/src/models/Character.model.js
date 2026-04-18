import mongoose from 'mongoose';

// Helper function to generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD') // Normalize Vietnamese characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

const characterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Character name is required'],
      trim: true,
      maxLength: [100, 'Name cannot exceed 100 characters']
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true
    },
    characterId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    avatarImage: {
      type: String,
      required: [true, 'Avatar image URL is required'],
      trim: true
    },
    about: {
      type: String,
      required: [true, 'About section is required'],
      maxLength: [500, 'About section cannot exceed 500 characters']
    },
    backstory: {
      type: String,
      required: [true, 'Backstory is required'],
      maxLength: [2000, 'Backstory cannot exceed 2000 characters']
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function(tags) {
          return tags.length <= 10;
        },
        message: 'Cannot have more than 10 tags'
      }
    },
    isPublic: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
characterSchema.index({ name: 1 });
characterSchema.index({ tags: 1 });
characterSchema.index({ createdAt: -1 });
// Note: slug already has unique: true in schema, no need for separate index

// Pre-save hook to generate slug
characterSchema.pre('save', async function(next) {
  if (this.isModified('name') || this.isNew) {
    let baseSlug = generateSlug(this.name);
    let slug = baseSlug;
    let counter = 1;

    // Check if slug exists, if so add counter
    while (await mongoose.models.Character.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
    this.characterId = slug; // Use slug as characterId too
  }
  next();
});

const Character = mongoose.model('Character', characterSchema);

export default Character;
