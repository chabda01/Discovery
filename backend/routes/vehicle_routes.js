// ============================================
// FICHIER: routes/vehicle.routes.js
// ============================================

function createVehicleRoutes(db) {
  const router = express.Router();
  const adapter = new DatabaseAdapter(db);

  // GET /api/vehicles - Récupérer tous les véhicules
  router.get('/', authenticateToken, async (req, res) => {
    try {
      const vehicles = await adapter.getAllVehicles();
      res.json(vehicles);
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // GET /api/vehicles/:id - Récupérer un véhicule
  router.get('/:id', authenticateToken, async (req, res) => {
    try {
      const vehicle = await adapter.getVehicleById(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ error: 'Véhicule non trouvé' });
      }
      res.json(vehicle);
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // POST /api/vehicles - Créer un véhicule
  router.post('/', authenticateToken, validate(schemas.vehicleCreate), async (req, res) => {
    try {
      const vehicle = await adapter.createVehicle(req.body);
      res.status(201).json(vehicle);
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // PUT /api/vehicles/:id - Mettre à jour un véhicule
  router.put('/:id', authenticateToken, validate(schemas.vehicleUpdate), async (req, res) => {
    try {
      const vehicle = await adapter.updateVehicle(req.params.id, req.body);
      if (!vehicle) {
        return res.status(404).json({ error: 'Véhicule non trouvé' });
      }

      // Notifier via WebSocket (géré dans server.js)
      if (global.io) {
        global.io.emit('vehicle_updated', vehicle);
      }

      res.json(vehicle);
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  return router;
}
