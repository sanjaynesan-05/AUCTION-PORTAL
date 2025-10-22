const express = require('express');
const Team = require('../models/Team');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   GET /api/teams
 * @desc    Get all teams
 * @access  Protected
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('players', 'name role price nationality')
      .sort({ name: 1 });

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
      error: error.message,
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
    const team = await Team.findById(req.params.id).populate('players', 'name role price nationality image');

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
      error: error.message,
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
    const team = new Team(req.body);
    await team.save();

    res.status(201).json({
      success: true,
      message: 'Team created successfully.',
      data: team,
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create team.',
      error: error.message,
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
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Team updated successfully.',
      data: team,
    });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update team.',
      error: error.message,
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
    const team = await Team.findByIdAndDelete(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Team deleted successfully.',
    });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete team.',
      error: error.message,
    });
  }
});

module.exports = router;
