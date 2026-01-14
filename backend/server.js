const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const config = require('./config/config');
const db = require('./database/db');
const createRoutes = require('./routes');
const WebSocketManager = require('./websocket/websocket');

// Créer l'application Express
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    name: 'VoltaLink API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      docs: '/api/docs',
      auth: '/api/auth/login',
      vehicles: '/api/vehicles',
      firmwares: '/api/firmwares',
      updates: '/api/updates',
      features: '/api/features',
      stats: '/api/stats'
    },
    websocket: 'ws://localhost:' + config.PORT,
    database: config.DB_TYPE,
    login: {
      username: 'admin',
      password: 'admin123'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: db ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Initialiser et démarrer le serveur
async function startServer() {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 Démarrage de VoltaLink Backend');
    console.log('='.repeat(60));

    // Connexion à la base de données
    console.log(`\n📦 Base de données: ${config.DB_TYPE.toUpperCase()}`);
    await db.connect();

    // Initialiser les routes
    console.log('\n🛣️  Initialisation des routes...');
    const routes = createRoutes(db);
    
    app.use('/api/auth', routes.auth);
    app.use('/api/vehicles', routes.vehicles);
    app.use('/api/firmwares', routes.firmwares);
    app.use('/api', routes.updates);
    app.use('/api', routes.features);
    app.use('/api/stats', routes.stats);
    
    console.log('✅ Routes configurées');

    // Initialiser WebSocket
    console.log('\n📡 Initialisation WebSocket...');
    const wsManager = new WebSocketManager(io, db);
    wsManager.initialize();
    
    // Rendre le WebSocket Manager accessible globalement
    global.io = io;
    global.wsManager = wsManager;

    // Gestion des erreurs
    app.use((err, req, res, next) => {
      console.error('❌ Erreur serveur:', err);
      res.status(500).json({
        error: 'Erreur interne du serveur',
        message: config.NODE_ENV === 'development' ? err.message : undefined
      });
    });

    // Route 404
    app.use((req, res) => {
      res.status(404).json({
        error: 'Route non trouvée',
        path: req.path,
        method: req.method
      });
    });

    // Démarrer le serveur
    server.listen(config.PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log('✅ SERVEUR DÉMARRÉ');
      console.log('='.repeat(60));
      console.log(`\n📍 API REST:`);
      console.log(`   • URL: http://localhost:${config.PORT}`);
      console.log(`   • Environnement: ${config.NODE_ENV}`);
      console.log(`   • Base de données: ${config.DB_TYPE}`);
      
      console.log(`\n📡 WebSocket:`);
      console.log(`   • URL: ws://localhost:${config.PORT}`);
      
      console.log(`\n🔐 Identifiants par défaut:`);
      console.log(`   • Username: admin`);
      console.log(`   • Password: admin123`);
      
      console.log(`\n📊 Endpoints principaux:`);
      console.log(`   • POST   /api/auth/login`);
      console.log(`   • GET    /api/vehicles`);
      console.log(`   • POST   /api/vehicles/:id/update`);
      console.log(`   • POST   /api/vehicles/:id/features/:fid/toggle`);
      console.log(`   • GET    /api/stats`);
      
      console.log(`\n🚗 Simulateur:`);
      console.log(`   • Lancer: node simulator/vehicle_simulator.js 1`);
      
      console.log('\n' + '='.repeat(60) + '\n');
    });

  } catch (error) {
    console.error('\n❌ Erreur démarrage serveur:', error);
    process.exit(1);
  }
}

// Gestion de l'arrêt propre
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Arrêt du serveur...');
  
  try {
    await db.close();
    server.close(() => {
      console.log('✅ Serveur arrêté proprement\n');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'arrêt:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n\n🛑 Signal SIGTERM reçu, arrêt du serveur...');
  await db.close();
  process.exit(0);
});

// Démarrer le serveur
/ ============================================
// FICHIER 6/6 - SERVER PRINCIPAL
// Nom du fichier: server.js
// ============================================

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const config = require('./config/config');
const db = require('./database/db');
const createRoutes = require('./routes');
const WebSocketManager = require('./websocket/websocket');

// Créer l'application Express
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    name: 'VoltaLink API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      docs: '/api/docs',
      auth: '/api/auth/login',
      vehicles: '/api/vehicles',
      firmwares: '/api/firmwares',
      updates: '/api/updates',
      features: '/api/features',
      stats: '/api/stats'
    },
    websocket: 'ws://localhost:' + config.PORT,
    database: config.DB_TYPE,
    login: {
      username: 'admin',
      password: 'admin123'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: db ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Initialiser et démarrer le serveur
async function startServer() {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 Démarrage de VoltaLink Backend');
    console.log('='.repeat(60));

    // Connexion à la base de données
    console.log(`\n📦 Base de données: ${config.DB_TYPE.toUpperCase()}`);
    await db.connect();

    // Initialiser les routes
    console.log('\n🛣️  Initialisation des routes...');
    const routes = createRoutes(db);
    
    app.use('/api/auth', routes.auth);
    app.use('/api/vehicles', routes.vehicles);
    app.use('/api/firmwares', routes.firmwares);
    app.use('/api', routes.updates);
    app.use('/api', routes.features);
    app.use('/api/stats', routes.stats);
    
    console.log('✅ Routes configurées');

    // Initialiser WebSocket
    console.log('\n📡 Initialisation WebSocket...');
    const wsManager = new WebSocketManager(io, db);
    wsManager.initialize();
    
    // Rendre le WebSocket Manager accessible globalement
    global.io = io;
    global.wsManager = wsManager;

    // Gestion des erreurs
    app.use((err, req, res, next) => {
      console.error('❌ Erreur serveur:', err);
      res.status(500).json({
        error: 'Erreur interne du serveur',
        message: config.NODE_ENV === 'development' ? err.message : undefined
      });
    });

    // Route 404
    app.use((req, res) => {
      res.status(404).json({
        error: 'Route non trouvée',
        path: req.path,
        method: req.method
      });
    });

    // Démarrer le serveur
    server.listen(config.PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log('✅ SERVEUR DÉMARRÉ');
      console.log('='.repeat(60));
      console.log(`\n📍 API REST:`);
      console.log(`   • URL: http://localhost:${config.PORT}`);
      console.log(`   • Environnement: ${config.NODE_ENV}`);
      console.log(`   • Base de données: ${config.DB_TYPE}`);
      
      console.log(`\n📡 WebSocket:`);
      console.log(`   • URL: ws://localhost:${config.PORT}`);
      
      console.log(`\n🔐 Identifiants par défaut:`);
      console.log(`   • Username: admin`);
      console.log(`   • Password: admin123`);
      
      console.log(`\n📊 Endpoints principaux:`);
      console.log(`   • POST   /api/auth/login`);
      console.log(`   • GET    /api/vehicles`);
      console.log(`   • POST   /api/vehicles/:id/update`);
      console.log(`   • POST   /api/vehicles/:id/features/:fid/toggle`);
      console.log(`   • GET    /api/stats`);
      
      console.log(`\n🚗 Simulateur:`);
      console.log(`   • Lancer: node simulator/vehicle_simulator.js 1`);
      
      console.log('\n' + '='.repeat(60) + '\n');
    });

  } catch (error) {
    console.error('\n❌ Erreur démarrage serveur:', error);
    process.exit(1);
  }
}

// Gestion de l'arrêt propre
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Arrêt du serveur...');
  
  try {
    await db.close();
    server.close(() => {
      console.log('✅ Serveur arrêté proprement\n');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'arrêt:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n\n🛑 Signal SIGTERM reçu, arrêt du serveur...');
  await db.close();
  process.exit(0);
});

// Démarrer le serveur
startServer();
