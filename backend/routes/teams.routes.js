const express = require('express');
const { Team, Player } = require('../models');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   GET /api/teams
 * @desc    Get all teams
 * @access  Protected
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const teams = await Team.findAll({
      include: [
        {
          model: Player,
          as: 'players',
          attributes: ['id', 'name', 'role', 'price', 'nationality'],
        },
      ],
      order: [['name', 'ASC']],
    });

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teams.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   GET /api/teams/:id
 * @desc    Get single team by ID
 * @access  Protected
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id, {
      include: [
        {
          model: Player,
          as: 'players',
          attributes: ['id', 'name', 'role', 'price', 'nationality', 'image'],
        },
      ],
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   POST /api/teams
 * @desc    Create a new team
 * @access  Protected (Admin only)
 */
router.post('/', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const team = await Team.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Team created successfully.',
      data: team,
    });
  } catch (error) {
    console.error('Create team error:', error);

    // Handle validation errors
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: error.errors.map((e) => e.message),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create team.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   PUT /api/teams/:id
 * @desc    Update team
 * @access  Protected (Admin only)
 */
router.put('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found.',
      });
    }

    await team.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Team updated successfully.',
      data: team,
    });
  } catch (error) {
    console.error('Update team error:', error);

    // Handle validation errors
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: error.errors.map((e) => e.message),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update team.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   DELETE /api/teams/:id
 * @desc    Delete team
 * @access  Protected (Admin only)
 */
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found.',
      });
    }

    await team.destroy();

    res.status(200).json({
      success: true,
      message: 'Team deleted successfully.',
    });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete team.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
