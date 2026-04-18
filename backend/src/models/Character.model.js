import mongoose from 'mongoose';

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

const relationshipLinkSchema = new mongoose.Schema({
  description: { type: String, trim: true, maxLength: 200 },
  character: { type: mongoose.Schema.Types.ObjectId, ref: 'Character', default: null },
  text: { type: String, trim: true, maxLength: 500 }
}, { _id: false });

const characterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Character name is required'],
      trim: true,
      maxLength: [100, 'Name cannot exceed 100 characters']
    },
    slug: { type: String, unique: true, trim: true, lowercase: true },
    characterId: { type: String, unique: true, sparse: true, trim: true },
    avatarImage: { type: String, trim: true, default: '' },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function(tags) { return tags.length <= 10; },
        message: 'Cannot have more than 10 tags'
      }
    },
    isPublic: { type: Boolean, default: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Character must have an owner']
    },

    // 1. Core data
    core: {
      fullName: { type: String, trim: true, default: '' },
      gender: { type: String, trim: true, default: '' },
      birthday: { type: String, trim: true, default: '' },
      age: { type: String, trim: true, default: '' },
      mbti: { type: String, trim: true, default: '' },
      appearance: { type: String, default: '' },
      physique: { type: String, trim: true, default: '' },
      occupation: { type: String, trim: true, default: '' },
      workplace: { type: String, trim: true, default: '' },
      nationality: { type: String, trim: true, default: '' },
      residence: { type: String, trim: true, default: '' },
      relationshipStatus: {
        type: String,
        enum: ['', 'single', 'dating', 'married', 'single-parent'],
        default: ''
      },
      partner: { type: relationshipLinkSchema, default: () => ({}) },
      personality: { type: String, default: '' }
    },

    // 2. Visual anchors
    visual: {
      face: { type: String, default: '' },
      hair: { type: String, default: '' },
      skin: { type: String, default: '' }
    },

    // 3. Aesthetics
    aesthetics: {
      outfit: { type: String, default: '' },
      colorPalette: { type: String, default: '' },
      accessories: { type: String, default: '' },
      inspiration: { type: String, default: '' }
    },

    // 4. Details
    details: {
      habits: { type: String, default: '' },
      flaws: { type: String, default: '' },
      likes: { type: String, default: '' },
      dislikes: { type: String, default: '' },
      intimateLife: { type: String, default: '' }
    },

    complexRelationships: { type: [relationshipLinkSchema], default: [] },

    // Backstory (existing, kept — displayed before additional)
    backstory: { type: String, default: '' },

    // 5. Additional
    additional: {
      skills: { type: String, default: '' },
      assets: { type: String, default: '' },
      secrets: { type: String, default: '' }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

characterSchema.index({ name: 1 });
characterSchema.index({ tags: 1 });
characterSchema.index({ createdAt: -1 });
characterSchema.index({ owner: 1 });

characterSchema.pre('save', async function(next) {
  if (this.isModified('name') || this.isNew) {
    let baseSlug = generateSlug(this.name);
    let slug = baseSlug;
    let counter = 1;
    while (await mongoose.models.Character.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
    this.characterId = slug;
  }
  next();
});

const Character = mongoose.model('Character', characterSchema);

export default Character;
