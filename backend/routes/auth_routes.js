const express = require('express');
const bcrypt = require('bcryptjs');
const { schemas, validate } = require('../models/models');
const { createToken, authenticateToken } = require('../middleware/auth');
const DatabaseAdapter = require('../models/adapters');

// ============================================
// FICHIER: routes/auth.routes.js
// ============================================

function createAuthRoutes(db) {
  const router = express.Router();
  const adapter = new DatabaseAdapter(db);

  router.post('/login', validate(schemas.login), async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await adapter.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'Identifiants invalides' });
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Identifiants invalides' });
      }

      const token = createToken(user);

      res.json({
        token,
        user: {
          id: user.id || user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Erreur login:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  return router;
}
