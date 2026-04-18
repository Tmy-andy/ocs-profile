import Character from '../models/Character.model.js';
import User from '../models/User.model.js';
import { validationResult } from 'express-validator';

// @desc    Get all characters (optionally filtered by owner username)
// @route   GET /api/characters?owner=<username>
// @access  Public
export const getAllCharacters = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, tags, owner } = req.query;

    const query = { isPublic: true };

    if (owner) {
      const ownerKey = owner.toLowerCase();
      const ownerUser = await User.findOne({ $or: [{ slug: ownerKey }, { username: ownerKey }] });
      if (!ownerUser) {
        return res.status(200).json({
          success: true,
          data: [],
          pagination: { page: 1, limit: parseInt(limit), total: 0, pages: 0 }
        });
      }
      query.owner = ownerUser._id;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    const characters = await Character.find(query)
      .populate('owner', 'username slug displayName')
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-__v');

    const total = await Character.countDocuments(query);

    res.status(200).json({
      success: true,
      data: characters,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single character by ID or slug
// @route   GET /api/characters/:id
// @access  Public
export const getCharacterById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let character;

    const populateArgs = [
      { path: 'owner', select: 'username slug displayName' },
      { path: 'core.partner.character', select: 'name slug owner', populate: { path: 'owner', select: 'slug username' } },
      { path: 'complexRelationships.character', select: 'name slug owner', populate: { path: 'owner', select: 'slug username' } }
    ];

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      character = await Character.findById(id).populate(populateArgs).select('-__v');
    } else {
      character = await Character.findOne({ slug: id }).populate(populateArgs).select('-__v');
    }

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Character not found'
      });
    }

    res.status(200).json({
      success: true,
      data: character
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid character ID format'
      });
    }
    next(error);
  }
};

// @desc    Create new character
// @route   POST /api/characters
// @access  Private
export const createCharacter = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    if (!req.body.characterId) {
      req.body.characterId = `c${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
    }

    const character = await Character.create({
      ...req.body,
      owner: req.user._id
    });

    res.status(201).json({
      success: true,
      data: character,
      message: 'Character created successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Character ID already exists'
      });
    }
    next(error);
  }
};

// @desc    Update character (owner only)
// @route   PUT /api/characters/:id
// @access  Private
export const updateCharacter = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const character = await Character.findById(req.params.id);

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Character not found'
      });
    }

    if (!character.owner.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own characters'
      });
    }

    // Prevent owner from being changed via update payload
    delete req.body.owner;

    Object.assign(character, req.body);
    await character.save();

    res.status(200).json({
      success: true,
      data: character,
      message: 'Character updated successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid character ID format'
      });
    }
    next(error);
  }
};

// @desc    Reorder characters (owner only)
// @route   PATCH /api/characters/reorder
// @access  Private
export const reorderCharacters = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return res.status(400).json({ success: false, message: 'orderedIds must be a non-empty array' });
    }

    const characters = await Character.find({ _id: { $in: orderedIds } }).select('_id owner');
    const notOwned = characters.find(c => !c.owner.equals(req.user._id));
    if (notOwned || characters.length !== orderedIds.length) {
      return res.status(403).json({ success: false, message: 'You can only reorder your own characters' });
    }

    const ops = orderedIds.map((id, index) => ({
      updateOne: { filter: { _id: id }, update: { $set: { displayOrder: index } } }
    }));
    await Character.bulkWrite(ops);

    res.status(200).json({ success: true, message: 'Order updated' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid character ID format' });
    }
    next(error);
  }
};

// @desc    Delete character (owner only — admin cannot delete others')
// @route   DELETE /api/characters/:id
// @access  Private
export const deleteCharacter = async (req, res, next) => {
  try {
    const character = await Character.findById(req.params.id);

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Character not found'
      });
    }

    if (!character.owner.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own characters'
      });
    }

    await character.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Character deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid character ID format'
      });
    }
    next(error);
  }
};
