const createAuthRoutes = require('./auth_routes');
const createVehicleRoutes = require('./vehicle_routes');
const createFirmwareRoutes = require('./firmware_routes');
const createUpdateRoutes = require('./update_routes');
const createFeatureRoutes = require('./feature_routes');
const createStatsRoutes = require('./stats_routes');

function createRoutes(db) {
  return {
    auth: createAuthRoutes(db),
    vehicles: createVehicleRoutes(db),
    firmwares: createFirmwareRoutes(db),
    updates: createUpdateRoutes(db),
    features: createFeatureRoutes(db),
    stats: createStatsRoutes(db)
  };
}

module.exports = createRoutes;
