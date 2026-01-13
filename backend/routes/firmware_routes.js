// ============================================
// FICHIER: routes/firmware.routes.js
// ============================================

function createFirmwareRoutes(db) {
  const router = express.Router();
  const adapter = new DatabaseAdapter(db);

  // GET /api/firmwares - Récupérer tous les firmwares
  router.get('/', authenticateToken, async (req, res) => {
    try {
      const firmwares = await adapter.getAllFirmwares();
      res.json(firmwares);
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // POST /api/firmwares - Créer un firmware
  router.post('/', authenticateToken, validate(schemas.firmwareCreate), async (req, res) => {
    try {
      const firmware = await adapter.createFirmware(req.body);
      res.status(201).json(firmware);
    } catch (error) {
      if (error.message && error.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Cette version de firmware existe déjà' });
      }
      console.error('Erreur:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  return router;
}
