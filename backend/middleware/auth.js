const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Créer un token JWT
const createToken = (user) => {
  return jwt.sign(
    {
      id: user.id || user._id,
      username: user.username,
      role: user.role
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
};

// Middleware de vérification du token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token requis' });
  }

  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expiré' });
      }
      return res.status(403).json({ error: 'Token invalide' });
    }

    req.user = user;
    next();
  });
};

// Middleware pour vérifier le rôle admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
  }
  next();
};

module.exports = {
  createToken,
  authenticateToken,
  requireAdmin
};


