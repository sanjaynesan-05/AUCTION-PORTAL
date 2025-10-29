const express = require('express');
const { Player, Team } = require('../models');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');
const { validatePlayer, validateUUID, validatePlayerQuery } = require('../middleware/validator');
const { writeLimiter } = require('../middleware/rateLimiter');
const { Op } = require('sequelize');

const router = express.Router();

/**
 * @route   GET /api/players
 * @desc    Get all players with optional filtering
 * @access  Protected (Viewers see only their team's players)
 */
router.get('/', authMiddleware, validatePlayerQuery, async (req, res) => {
  try {
    const { role, sold, teamId } = req.query;

    // Build query filter
    const where = {};
    if (role) where.role = role;
    if (sold !== undefined) where.sold = sold === 'true';
    if (teamId) where.teamId = teamId;

    // 🔒 VIEWER RESTRICTION: Only see their own team's players
    if (req.user.role === 'viewer') {
      if (!req.user.teamId) {
        return res.status(403).json({
          success: false,
          message: 'You are not assigned to any team. Please contact admin.',
        });
      }
      // Force filter to viewer's team only
      where.teamId = req.user.teamId;
      where.sold = true; // Only show sold players (players they bought)
    }

    const players = await Player.findAll({
      where,
      include: [
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name', 'shortName', 'color', 'logo'],
        },
      ],
      order: [['name', 'ASC']],
    });

    res.status(200).json({
      success: true,
      count: players.length,
      data: players,
      teamRestricted: req.user.role === 'viewer', // Let frontend know it's filtered
    });
  } catch (error) {
    console.error('Get players error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch players.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   GET /api/players/:id
 * @desc    Get single player by ID
 * @access  Protected
 */
router.get('/:id', authMiddleware, validateUUID, async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id, {
      include: [
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name', 'shortName', 'color'],
        },
      ],
    });

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: player,
    });
  } catch (error) {
    console.error('Get player error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch player.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   POST /api/players
 * @desc    Create a new player
 * @access  Protected (Admin only)
 */
router.post('/', authMiddleware, requireRole('admin'), writeLimiter, validatePlayer, async (req, res) => {
  try {
    const player = await Player.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Player created successfully.',
      data: player,
    });
  } catch (error) {
    console.error('Create player error:', error);

    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: error.errors.map((e) => e.message),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create player.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   PUT /api/players/:id
 * @desc    Update player
 * @access  Protected (Admin only)
 */
router.put('/:id', authMiddleware, requireRole('admin'), writeLimiter, validateUUID, validatePlayer, async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found.',
      });
    }

    await player.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Player updated successfully.',
      data: player,
    });
  } catch (error) {
    console.error('Update player error:', error);

    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: error.errors.map((e) => e.message),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update player.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   DELETE /api/players/:id
 * @desc    Delete player
 * @access  Protected (Admin only)
 */
router.delete('/:id', authMiddleware, requireRole('admin'), writeLimiter, validateUUID, async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found.',
      });
    }

    await player.destroy();

    res.status(200).json({
      success: true,
      message: 'Player deleted successfully.',
    });
  } catch (error) {
    console.error('Delete player error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete player.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
