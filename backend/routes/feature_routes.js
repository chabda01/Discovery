const express = require('express');
const { schemas, validate } = require('../models/models');
const { authenticateToken } = require('../middleware/auth');
const DatabaseAdapter = require('../models/adapters');

// ============================================
// FICHIER: routes/feature.routes.js
// ============================================
function createFeatureRoutes(db) {
  const router = express.Router();
  const adapter = new DatabaseAdapter(db);

  // GET /api/features - Récupérer toutes les features
  router.get('/features', authenticateToken, async (req, res) => {
    try {
      const features = await adapter.getAllFeatures();
      res.json(features);
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // GET /api/vehicles/:id/features - Features d'un véhicule
  router.get('/vehicles/:id/features', authenticateToken, async (req, res) => {
    try {
      const features = await adapter.getVehicleFeatures(req.params.id);
      res.json(features);
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // POST /api/vehicles/:vehicleId/features/:featureId/toggle - Activer/désactiver
  router.post('/vehicles/:vehicleId/features/:featureId/toggle', 
    authenticateToken, 
    validate(schemas.featureToggle), 
    async (req, res) => {
      try {
        const { vehicleId, featureId } = req.params;
        const { activate } = req.body;

        // Calculer la date d'expiration (30 jours)
        const expiresAt = activate 
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : null;

        const result = await adapter.toggleFeature(vehicleId, featureId, activate, expiresAt);

        // Récupérer les infos de la feature
        const features = await adapter.getAllFeatures();
        const feature = features.find(f => (f.id || f._id) == featureId);

        // Envoyer au véhicule via WebSocket
        if (global.wsManager) {
          global.wsManager.sendToVehicle(vehicleId, {
            type: 'feature_toggle',
            data: {
              feature_id: featureId,
              feature_name: feature.name,
              is_active: activate
            }
          });
        }

        res.json({
          ...result,
          feature_name: feature.name,
          feature_icon: feature.icon
        });
      } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
      }
    }
  );

  return router;
}

module.exports = createFeatureRoutes;