require('dotenv').config();

const config = {
  // Serveur
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Base de données (SQLite par défaut)
  DB_TYPE: process.env.DB_TYPE || 'sqlite', // 'sqlite' | 'mongodb' | 'mariadb'
  
  // SQLite
  SQLITE_PATH: process.env.SQLITE_PATH || './database/voltalink.db',
  
  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/voltalink',
  
  // MariaDB/MySQL
  MARIADB_HOST: process.env.MARIADB_HOST || 'localhost',
  MARIADB_PORT: process.env.MARIADB_PORT || 3306,
  MARIADB_USER: process.env.MARIADB_USER || 'root',
  MARIADB_PASSWORD: process.env.MARIADB_PASSWORD || 'password',
  MARIADB_DATABASE: process.env.MARIADB_DATABASE || 'voltalink',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'voltalink_secret_key_2026',
  JWT_EXPIRES_IN: '24h',
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // Admin par défaut
  DEFAULT_ADMIN_USERNAME: 'admin',
  DEFAULT_ADMIN_PASSWORD: 'admin123',
  DEFAULT_ADMIN_EMAIL: 'admin@voltalink.com'
};

module.exports = config
