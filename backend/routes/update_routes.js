const express = require('express');
const { schemas, validate } = require('../models/models');
const { authenticateToken } = require('../middleware/auth');
const DatabaseAdapter = require('../models/adapters');

function createUpdateRoutes(db) {
  const router = express.Router();
  const adapter = new DatabaseAdapter(db);

  // GET /api/vehicles/:id/can-update - Vérifier si mise à jour possible
  router.get('/vehicles/:id/can-update', authenticateToken, async (req, res) => {
    try {
      const vehicle = await adapter.getVehicleById(req.params.id);
      
      if (!vehicle) {
        return res.status(404).json({ error: 'Véhicule non trouvé' });
      }

      const checks = {
        battery: vehicle.battery_level >= 50,
        online: vehicle.status === 'online',
        stopped: vehicle.speed === 0,
        not_updating: !vehicle.is_updating
      };

      const reasons = [];
      if (!checks.battery) reasons.push('Batterie insuffisante (< 50%)');
      if (!checks.online) reasons.push('Véhicule hors ligne');
      if (!checks.stopped) reasons.push('Véhicule en mouvement');
      if (!checks.not_updating) reasons.push('Mise à jour déjà en cours');

      res.json({
        allowed: Object.values(checks).every(v => v),
        reasons,
        checks
      });
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // POST /api/vehicles/:id/update - Lancer une mise à jour
  router.post('/vehicles/:id/update', authenticateToken, validate(schemas.updateRequest), async (req, res) => {
    try {
      const { id } = req.params;
      const { firmware_version } = req.body;

      // Vérifier le véhicule
      const vehicle = await adapter.getVehicleById(id);
      if (!vehicle) {
        return res.status(404).json({ error: 'Véhicule non trouvé' });
      }

      // Vérifier les conditions
      if (vehicle.battery_level < 50 || vehicle.status !== 'online' || 
          vehicle.speed !== 0 || vehicle.is_updating) {
        return res.status(400).json({ error: 'Conditions non remplies pour la mise à jour' });
      }

      // Récupérer le firmware
      const firmware = await adapter.getFirmwareByVersion(firmware_version);
      if (!firmware) {
        return res.status(404).json({ error: 'Firmware non trouvé' });
      }

      // Créer l'enregistrement de mise à jour
      const update = await adapter.createUpdate(id, firmware.id || firmware._id);

      // Marquer le véhicule comme en cours de mise à jour
      await adapter.updateVehicle(id, { is_updating: true, status: 'updating' });

      // Envoyer via WebSocket au véhicule
      if (global.wsManager) {
        global.wsManager.sendToVehicle(id, {
          type: 'start_update',
          data: {
            update_id: update.id || update._id,
            firmware: firmware
          }
        });
      }

      res.json(update);
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // GET /api/updates - Historique des mises à jour
  router.get('/updates', authenticateToken, async (req, res) => {
    try {
      const updates = await adapter.getUpdateHistory();
      res.json(updates);
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  return router;
}

module.exports = createUpdateRoutes;