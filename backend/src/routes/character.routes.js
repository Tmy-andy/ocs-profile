import express from 'express';
import { body } from 'express-validator';
import {
  getAllCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  deleteCharacter
} from '../controllers/character.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Validation rules
const characterValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  
  body('avatarImage')
    .trim()
    .notEmpty()
    .withMessage('Avatar image URL is required')
    .isURL()
    .withMessage('Avatar image must be a valid URL'),
  
  body('about')
    .trim()
    .notEmpty()
    .withMessage('About section is required')
    .isLength({ max: 500 })
    .withMessage('About section cannot exceed 500 characters'),
  
  body('backstory')
    .trim()
    .notEmpty()
    .withMessage('Backstory is required')
    .isLength({ max: 2000 })
    .withMessage('Backstory cannot exceed 2000 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => tags.length <= 10)
    .withMessage('Cannot have more than 10 tags')
];

// Routes
router.route('/')
  .get(getAllCharacters)
  .post(protect, characterValidation, createCharacter); // Protected

router.route('/:id')
  .get(getCharacterById)
  .put(protect, characterValidation, updateCharacter) // Protected
  .delete(protect, deleteCharacter); // Protected

export default router;
