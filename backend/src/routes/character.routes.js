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

  body('avatarImage').optional({ checkFalsy: true }).trim().isURL().withMessage('Avatar image must be a valid URL'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => tags.length <= 10)
    .withMessage('Cannot have more than 10 tags'),

  body('core.relationshipStatus').optional()
    .isIn(['', 'single', 'dating', 'married', 'single-parent'])
    .withMessage('Invalid relationship status')
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
