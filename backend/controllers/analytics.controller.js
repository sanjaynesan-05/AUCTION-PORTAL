const { AuctionEvent, Player, Team } = require('../models');

class AnalyticsController {
  async getOverview(req, res) {
    try {
      const [totalRevenue, totalPlayersSold] = await Promise.all([
        AuctionEvent.sum('finalPrice', { where: { eventType: 'sold' } }),
        AuctionEvent.count({ where: { eventType: 'sold' } }),
      ]);

      res.json({
        totalRevenue: totalRevenue || 0,
        totalPlayersSold,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPlayerAnalytics(req, res) {
    try {
      const soldPlayers = await AuctionEvent.findAll({
        where: { eventType: 'sold' },
        include: [{
          model: Player,
          as: 'Player',
          attributes: ['name', 'role', 'nationality', 'age'],
        }],
        order: [['finalPrice', 'DESC']],
      });

      // Group by role
      const priceByRole = {};
      soldPlayers.forEach(event => {
        if (!event.Player) return; // Skip if player association failed

        const role = event.Player.role;
        if (!priceByRole[role]) priceByRole[role] = [];
        priceByRole[role].push(event.finalPrice);
      });

      // Calculate averages
      const avgPriceByRole = {};
      Object.keys(priceByRole).forEach(role => {
        const prices = priceByRole[role];
        avgPriceByRole[role] = prices.reduce((a, b) => a + b, 0) / prices.length;
      });

      res.json({
        priceByRole: avgPriceByRole,
        topExpensivePlayers: soldPlayers.slice(0, 10).filter(event => event.Player).map(event => ({
          name: event.Player.name,
          role: event.Player.role,
          price: event.finalPrice,
        })),
        totalSold: soldPlayers.length,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTeamAnalytics(req, res) {
    try {
      const teamPurchases = await AuctionEvent.findAll({
        where: { eventType: 'sold' },
        include: [{
          model: Player,
          as: 'Player',
          attributes: ['role'],
        }, {
          model: Team,
          as: 'Team',
          attributes: ['name', 'shortName'],
        }],
      });

      const teamStats = {};
      teamPurchases.forEach(event => {
        if (!event.Team || !event.Player) return; // Skip if associations failed

        const teamName = event.Team.name;
        if (!teamStats[teamName]) {
          teamStats[teamName] = {
            totalSpent: 0,
            playersAcquired: 0,
            spendingByRole: {},
          };
        }

        teamStats[teamName].totalSpent += event.finalPrice;
        teamStats[teamName].playersAcquired += 1;

        const role = event.Player.role;
        teamStats[teamName].spendingByRole[role] =
          (teamStats[teamName].spendingByRole[role] || 0) + event.finalPrice;
      });

      res.json({
        teamStats,
        totalTeamsActive: Object.keys(teamStats).length,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AnalyticsController();