const Joi = require('joi');

// Schémas de validation avec Joi
const schemas = {
  // Authentification
  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  }),

  // Véhicule
  vehicleCreate: Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid('moto', 'car', 'bus').required(),
    location_lat: Joi.number().min(-90).max(90).default(6.3703),
    location_lng: Joi.number().min(-180).max(180).default(2.3912)
  }),

  vehicleUpdate: Joi.object({
    name: Joi.string(),
    battery_level: Joi.number().min(0).max(100),
    status: Joi.string().valid('online', 'offline', 'updating'),
    location_lat: Joi.number().min(-90).max(90),
    location_lng: Joi.number().min(-180).max(180),
    speed: Joi.number().min(0)
  }).min(1),

  // Firmware
  firmwareCreate: Joi.object({
    version: Joi.string().required(),
    file_url: Joi.string().required(),
    release_notes: Joi.string().required(),
    size_mb: Joi.number().positive().required(),
    is_critical: Joi.boolean().default(false)
  }),

  // Mise à jour
  updateRequest: Joi.object({
    firmware_version: Joi.string().required()
  }),

  // Feature
  featureToggle: Joi.object({
    activate: Joi.boolean().required()
  })
};

// Middleware de validation
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation échouée',
        details: error.details[0].message
      });
    }
    next();
  };
};

module.exports = { schemas, validate };


