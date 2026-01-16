const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const DatabaseAdapter = require('../models/adapters');

function createStatsRoutes(db) {
  const router = express.Router();
  const adapter = new DatabaseAdapter(db);

  // GET /api/stats - Statistiques du dashboard
  router.get('/', authenticateToken, async (req, res) => {
    try {
      const stats = await adapter.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  return router;
}

module.exports = createStatsRoutes;
