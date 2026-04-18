import Character from '../models/Character.model.js';
import { validationResult } from 'express-validator';

// @desc    Get all characters
// @route   GET /api/characters
// @access  Public
export const getAllCharacters = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, tags } = req.query;
    
    const query = { isPublic: true };
    
    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    const characters = await Character.find(query)
      .sort({ createdAt: -1 })
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
    
    // Try to find by slug first, then by _id
    let character;
    
    // Check if it looks like a MongoDB ObjectId (24 hex characters)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      character = await Character.findById(id).select('-__v');
    } else {
      // Otherwise, treat it as a slug
      character = await Character.findOne({ slug: id }).select('-__v');
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
// @access  Public (in production, should be protected)
export const createCharacter = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    // Generate unique character ID if not provided
    if (!req.body.characterId) {
      req.body.characterId = `c${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
    }
    
    const character = await Character.create(req.body);
    
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

// @desc    Update character
// @route   PUT /api/characters/:id
// @access  Public (in production, should be protected)
export const updateCharacter = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const character = await Character.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-__v');
    
    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Character not found'
      });
    }
    
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

// @desc    Delete character
// @route   DELETE /api/characters/:id
// @access  Public (in production, should be protected)
export const deleteCharacter = async (req, res, next) => {
  try {
    const character = await Character.findByIdAndDelete(req.params.id);
    
    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Character not found'
      });
    }
    
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
