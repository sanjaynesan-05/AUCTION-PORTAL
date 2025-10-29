const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Validation rules for user registration
 */
const validateRegister = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('role')
    .optional()
    .isIn(['admin', 'presenter', 'viewer'])
    .withMessage('Role must be admin, presenter, or viewer'),
  handleValidationErrors,
];

/**
 * Validation rules for user login
 */
const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

/**
 * Validation rules for creating/updating a player
 */
const validatePlayer = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Player name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Player name must be between 2 and 100 characters'),
  body('role')
    .notEmpty()
    .withMessage('Player role is required')
    .isIn(['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'])
    .withMessage('Invalid player role'),
  body('basePrice')
    .notEmpty()
    .withMessage('Base price is required')
    .isFloat({ min: 0 })
    .withMessage('Base price must be a positive number'),
  body('nationality')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Nationality must not exceed 100 characters'),
  body('imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  body('stats')
    .optional()
    .isObject()
    .withMessage('Stats must be an object'),
  handleValidationErrors,
];

/**
 * Validation rules for creating/updating a team
 */
const validateTeam = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Team name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Team name must be between 2 and 100 characters'),
  body('shortName')
    .trim()
    .notEmpty()
    .withMessage('Short name is required')
    .isLength({ min: 2, max: 10 })
    .withMessage('Short name must be between 2 and 10 characters'),
  body('color')
    .optional()
    .trim()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Color must be a valid hex color code'),
  body('purse')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Purse must be a positive number'),
  handleValidationErrors,
];

/**
 * Validation rules for UUID parameters
 */
const validateUUID = [
  param('id')
    .isUUID()
    .withMessage('Invalid ID format'),
  handleValidationErrors,
];

/**
 * Validation rules for query parameters
 */
const validatePlayerQuery = [
  query('role')
    .optional()
    .isIn(['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'])
    .withMessage('Invalid role filter'),
  query('sold')
    .optional()
    .isBoolean()
    .withMessage('Sold filter must be a boolean'),
  query('teamId')
    .optional()
    .isUUID()
    .withMessage('Team ID must be a valid UUID'),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validatePlayer,
  validateTeam,
  validateUUID,
  validatePlayerQuery,
  handleValidationErrors,
};
