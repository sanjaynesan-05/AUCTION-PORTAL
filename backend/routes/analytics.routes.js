const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/overview', analyticsController.getOverview);
router.get('/players', analyticsController.getPlayerAnalytics);
router.get('/teams', analyticsController.getTeamAnalytics);

module.exports = router;