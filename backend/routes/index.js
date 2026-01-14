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
