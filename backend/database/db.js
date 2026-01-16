const config = require('../config/config');
const bcrypt = require('bcryptjs');

// ============================================
// SQLITE IMPLEMENTATION
// ============================================

class SQLiteDatabase {
  constructor() {
    this.db = null;
  }

  async connect() {
    const sqlite3 = require('sqlite3').verbose();
    const { promisify } = require('util');
    
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(config.SQLITE_PATH, async (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('✅ Connecté à SQLite');
          
          // Promisify les méthodes
          this.db.runAsync = promisify(this.db.run.bind(this.db));
          this.db.getAsync = promisify(this.db.get.bind(this.db));
          this.db.allAsync = promisify(this.db.all.bind(this.db));
          
          await this.initTables();
          resolve();
        }
      });
    });
  }

  async initTables() {
    await this.db.runAsync(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('moto', 'car', 'bus')),
        current_firmware_version TEXT DEFAULT 'v1.0',
        battery_level INTEGER DEFAULT 100 CHECK(battery_level >= 0 AND battery_level <= 100),
        status TEXT DEFAULT 'offline' CHECK(status IN ('online', 'offline', 'updating')),
        location_lat REAL DEFAULT 6.3703,
        location_lng REAL DEFAULT 2.3912,
        speed INTEGER DEFAULT 0,
        is_updating INTEGER DEFAULT 0,
        last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.db.runAsync(`
      CREATE TABLE IF NOT EXISTS firmwares (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version TEXT UNIQUE NOT NULL,
        file_url TEXT,
        release_notes TEXT,
        size_mb REAL,
        is_critical INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.db.runAsync(`
      CREATE TABLE IF NOT EXISTS features (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price_monthly INTEGER DEFAULT 0,
        icon TEXT,
        is_active_default INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.db.runAsync(`
      CREATE TABLE IF NOT EXISTS vehicle_features (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER,
        feature_id INTEGER,
        is_active INTEGER DEFAULT 0,
        activated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME,
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
        FOREIGN KEY (feature_id) REFERENCES features(id) ON DELETE CASCADE,
        UNIQUE(vehicle_id, feature_id)
      )
    `);

    await this.db.runAsync(`
      CREATE TABLE IF NOT EXISTS updates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER,
        firmware_id INTEGER,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed', 'failed')),
        progress INTEGER DEFAULT 0,
        started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        error_message TEXT,
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
        FOREIGN KEY (firmware_id) REFERENCES firmwares(id)
      )
    `);

    await this.db.runAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        email TEXT,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.insertDemoData();
  }

  async insertDemoData() {
    // Véhicules
    await this.db.runAsync(`
      INSERT OR IGNORE INTO vehicles (id, name, type, battery_level, status, location_lat, location_lng)
      VALUES 
        (1, 'Moto 001', 'moto', 85, 'online', 6.3703, 2.3912),
        (2, 'Voiture 042', 'car', 12, 'offline', 6.3650, 2.4183),
        (3, 'Bus 203', 'bus', 67, 'online', 6.3584, 2.4336)
    `);

    // Firmwares
    await this.db.runAsync(`
      INSERT OR IGNORE INTO firmwares (version, file_url, release_notes, size_mb, is_critical)
      VALUES 
        ('v1.0', '/firmwares/v1.0.bin', 'Version initiale', 10.5, 0),
        ('v1.1', '/firmwares/v1.1.bin', 'Optimisation batterie, correction bugs', 15.2, 0),
        ('v1.2', '/firmwares/v1.2.bin', 'Correctif sécurité critique', 12.8, 1),
        ('v2.0', '/firmwares/v2.0.bin', 'Nouvelle interface, mode éco', 25.4, 0)
    `);

    // Features
    await this.db.runAsync(`
      INSERT OR IGNORE INTO features (id, name, description, price_monthly, icon)
      VALUES 
        (1, 'Climatisation Premium', 'Climatisation automatique intelligente', 5000, '❄️'),
        (2, 'Mode Sport', 'Accélération maximale et performances accrues', 8000, '🏎️'),
        (3, 'GPS Navigation Premium', 'Navigation GPS avancée avec traffic temps réel', 3000, '🗺️')
    `);

    // Admin par défaut
    const passwordHash = await bcrypt.hash(config.DEFAULT_ADMIN_PASSWORD, 10);
    await this.db.runAsync(
      `INSERT OR IGNORE INTO users (username, password_hash, email) VALUES (?, ?, ?)`,
      [config.DEFAULT_ADMIN_USERNAME, passwordHash, config.DEFAULT_ADMIN_EMAIL]
    );

    console.log('✅ Données de démonstration insérées');
  }

  async close() {
    if (this.db) {
      await new Promise((resolve) => this.db.close(resolve));
      console.log('🔌 Connexion SQLite fermée');
    }
  }

  // Méthodes d'accès aux données
  async query(sql, params = []) {
    return await this.db.allAsync(sql, params);
  }

  async get(sql, params = []) {
    return await this.db.getAsync(sql, params);
  }

  async run(sql, params = []) {
    return await this.db.runAsync(sql, params);
  }
}


// ============================================
// MONGODB IMPLEMENTATION
// ============================================

class MongoDatabase {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect() {
    const { MongoClient } = require('mongodb');
    
    this.client = new MongoClient(config.MONGODB_URI);
    await this.client.connect();
    this.db = this.client.db();
    
    console.log('✅ Connecté à MongoDB');
    await this.insertDemoData();
  }

  async insertDemoData() {
    // Véhicules
    const vehiclesCount = await this.db.collection('vehicles').countDocuments();
    if (vehiclesCount === 0) {
      await this.db.collection('vehicles').insertMany([
        { _id: 1, name: 'Moto 001', type: 'moto', battery_level: 85, status: 'online', location_lat: 6.3703, location_lng: 2.3912, speed: 0, is_updating: false, current_firmware_version: 'v1.0', created_at: new Date() },
        { _id: 2, name: 'Voiture 042', type: 'car', battery_level: 12, status: 'offline', location_lat: 6.3650, location_lng: 2.4183, speed: 0, is_updating: false, current_firmware_version: 'v1.0', created_at: new Date() },
        { _id: 3, name: 'Bus 203', type: 'bus', battery_level: 67, status: 'online', location_lat: 6.3584, location_lng: 2.4336, speed: 0, is_updating: false, current_firmware_version: 'v1.0', created_at: new Date() }
      ]);
    }

    // Firmwares
    const firmwaresCount = await this.db.collection('firmwares').countDocuments();
    if (firmwaresCount === 0) {
      await this.db.collection('firmwares').insertMany([
        { version: 'v1.0', file_url: '/firmwares/v1.0.bin', release_notes: 'Version initiale', size_mb: 10.5, is_critical: false, created_at: new Date() },
        { version: 'v1.1', file_url: '/firmwares/v1.1.bin', release_notes: 'Optimisation batterie', size_mb: 15.2, is_critical: false, created_at: new Date() },
        { version: 'v1.2', file_url: '/firmwares/v1.2.bin', release_notes: 'Correctif sécurité', size_mb: 12.8, is_critical: true, created_at: new Date() },
        { version: 'v2.0', file_url: '/firmwares/v2.0.bin', release_notes: 'Nouvelle interface', size_mb: 25.4, is_critical: false, created_at: new Date() }
      ]);
    }

    // Features
    const featuresCount = await this.db.collection('features').countDocuments();
    if (featuresCount === 0) {
      await this.db.collection('features').insertMany([
        { _id: 1, name: 'Climatisation Premium', description: 'Climatisation automatique intelligente', price_monthly: 5000, icon: '❄️', created_at: new Date() },
        { _id: 2, name: 'Mode Sport', description: 'Accélération maximale', price_monthly: 8000, icon: '🏎️', created_at: new Date() },
        { _id: 3, name: 'GPS Navigation Premium', description: 'Navigation GPS avancée', price_monthly: 3000, icon: '🗺️', created_at: new Date() }
      ]);
    }

    // Admin
    const usersCount = await this.db.collection('users').countDocuments();
    if (usersCount === 0) {
      const passwordHash = await bcrypt.hash(config.DEFAULT_ADMIN_PASSWORD, 10);
      await this.db.collection('users').insertOne({
        username: config.DEFAULT_ADMIN_USERNAME,
        password_hash: passwordHash,
        email: config.DEFAULT_ADMIN_EMAIL,
        role: 'admin',
        created_at: new Date()
      });
    }

    console.log('✅ Données de démonstration insérées');
  }

  async close() {
    if (this.client) {
      await this.client.close();
      console.log('🔌 Connexion MongoDB fermée');
    }
  }

  collection(name) {
    return this.db.collection(name);
  }
}


// ============================================
// MARIADB IMPLEMENTATION
// ============================================

class MariaDatabase {
  constructor() {
    this.pool = null;
  }

  async connect() {
    const mariadb = require('mariadb');
    
    this.pool = mariadb.createPool({
      host: config.MARIADB_HOST,
      port: config.MARIADB_PORT,
      user: config.MARIADB_USER,
      password: config.MARIADB_PASSWORD,
      database: config.MARIADB_DATABASE,
      connectionLimit: 10
    });

    console.log('✅ Connecté à MariaDB');
    await this.initTables();
  }

  async initTables() {
    const conn = await this.pool.getConnection();
    
    try {
      await conn.query(`
        CREATE TABLE IF NOT EXISTS vehicles (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          type ENUM('moto', 'car', 'bus') NOT NULL,
          current_firmware_version VARCHAR(20) DEFAULT 'v1.0',
          battery_level INT DEFAULT 100 CHECK(battery_level >= 0 AND battery_level <= 100),
          status ENUM('online', 'offline', 'updating') DEFAULT 'offline',
          location_lat DECIMAL(10, 8) DEFAULT 6.3703,
          location_lng DECIMAL(11, 8) DEFAULT 2.3912,
          speed INT DEFAULT 0,
          is_updating BOOLEAN DEFAULT FALSE,
          last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await conn.query(`
        CREATE TABLE IF NOT EXISTS firmwares (
          id INT AUTO_INCREMENT PRIMARY KEY,
          version VARCHAR(20) UNIQUE NOT NULL,
          file_url VARCHAR(255),
          release_notes TEXT,
          size_mb DECIMAL(5, 2),
          is_critical BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await conn.query(`
        CREATE TABLE IF NOT EXISTS features (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          price_monthly INT DEFAULT 0,
          icon VARCHAR(50),
          is_active_default BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await conn.query(`
        CREATE TABLE IF NOT EXISTS vehicle_features (
          id INT AUTO_INCREMENT PRIMARY KEY,
          vehicle_id INT,
          feature_id INT,
          is_active BOOLEAN DEFAULT FALSE,
          activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMP NULL,
          FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
          FOREIGN KEY (feature_id) REFERENCES features(id) ON DELETE CASCADE,
          UNIQUE KEY (vehicle_id, feature_id)
        )
      `);

      await conn.query(`
        CREATE TABLE IF NOT EXISTS updates (
          id INT AUTO_INCREMENT PRIMARY KEY,
          vehicle_id INT,
          firmware_id INT,
          status ENUM('pending', 'in_progress', 'completed', 'failed') DEFAULT 'pending',
          progress INT DEFAULT 0,
          started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          completed_at TIMESTAMP NULL,
          error_message TEXT,
          FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
          FOREIGN KEY (firmware_id) REFERENCES firmwares(id)
        )
      `);

      await conn.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          email VARCHAR(100),
          role VARCHAR(20) DEFAULT 'admin',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.insertDemoData(conn);
    } finally {
      conn.release();
    }
  }

  async insertDemoData(conn) {
    // Véhicules
    await conn.query(`
      INSERT IGNORE INTO vehicles (id, name, type, battery_level, status, location_lat, location_lng)
      VALUES 
        (1, 'Moto 001', 'moto', 85, 'online', 6.3703, 2.3912),
        (2, 'Voiture 042', 'car', 12, 'offline', 6.3650, 2.4183),
        (3, 'Bus 203', 'bus', 67, 'online', 6.3584, 2.4336)
    `);

    // Firmwares
    await conn.query(`
      INSERT IGNORE INTO firmwares (version, file_url, release_notes, size_mb, is_critical)
      VALUES 
        ('v1.0', '/firmwares/v1.0.bin', 'Version initiale', 10.5, FALSE),
        ('v1.1', '/firmwares/v1.1.bin', 'Optimisation batterie', 15.2, FALSE),
        ('v1.2', '/firmwares/v1.2.bin', 'Correctif sécurité', 12.8, TRUE),
        ('v2.0', '/firmwares/v2.0.bin', 'Nouvelle interface', 25.4, FALSE)
    `);

    // Features
    await conn.query(`
      INSERT IGNORE INTO features (id, name, description, price_monthly, icon)
      VALUES 
        (1, 'Climatisation Premium', 'Climatisation automatique', 5000, '❄️'),
        (2, 'Mode Sport', 'Accélération maximale', 8000, '🏎️'),
        (3, 'GPS Navigation Premium', 'Navigation GPS avancée', 3000, '🗺️')
    `);

    // Admin
    const passwordHash = await bcrypt.hash(config.DEFAULT_ADMIN_PASSWORD, 10);
    await conn.query(
      `INSERT IGNORE INTO users (username, password_hash, email) VALUES (?, ?, ?)`,
      [config.DEFAULT_ADMIN_USERNAME, passwordHash, config.DEFAULT_ADMIN_EMAIL]
    );

    console.log('✅ Données de démonstration insérées');
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      console.log('🔌 Connexion MariaDB fermée');
    }
  }

  async query(sql, params = []) {
    const conn = await this.pool.getConnection();
    try {
      return await conn.query(sql, params);
    } finally {
      conn.release();
    }
  }
}


// ============================================
// FACTORY PATTERN - SÉLECTION DE LA DB
// ============================================

function createDatabase() {
  switch (config.DB_TYPE.toLowerCase()) {
    case 'mongodb':
      return new MongoDatabase();
    case 'mariadb':
    case 'mysql':
      return new MariaDatabase();
    case 'sqlite':
    default:
      return new SQLiteDatabase();
  }
}

module.exports = createDatabase();
