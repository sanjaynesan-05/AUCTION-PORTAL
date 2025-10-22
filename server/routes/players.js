const express = require('express');
const Player = require('../models/Player');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   GET /api/players
 * @desc    Get all players
 * @access  Protected
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { role, sold, teamId } = req.query;

    // Build query filter
    const filter = {};
    if (role) filter.role = role;
    if (sold !== undefined) filter.sold = sold === 'true';
    if (teamId) filter.teamId = teamId;

    const players = await Player.find(filter)
      .populate('teamId', 'name shortName color')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: players.length,
      data: players,
    });
  } catch (error) {
    console.error('Get players error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch players.',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/players/:id
 * @desc    Get single player by ID
 * @access  Protected
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).populate('teamId', 'name shortName color');

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
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/players
 * @desc    Create a new player
 * @access  Protected (Admin only)
 */
router.post('/', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();

    res.status(201).json({
      success: true,
      message: 'Player created successfully.',
      data: player,
    });
  } catch (error) {
    console.error('Create player error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create player.',
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/players/:id
 * @desc    Update player
 * @access  Protected (Admin only)
 */
router.put('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Player updated successfully.',
      data: player,
    });
  } catch (error) {
    console.error('Update player error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update player.',
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/players/:id
 * @desc    Delete player
 * @access  Protected (Admin only)
 */
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Player deleted successfully.',
    });
  } catch (error) {
    console.error('Delete player error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete player.',
      error: error.message,
    });
  }
});

module.exports = router;
