
const config = require('../config/config');

class DatabaseAdapter {
  constructor(db) {
    this.db = db;
    this.type = config.DB_TYPE.toLowerCase();
  }

  // VEHICLES
  async getAllVehicles() {
    if (this.type === 'mongodb') {
      return await this.db.collection('vehicles').find().sort({ created_at: -1 }).toArray();
    } else {
      return await this.db.query('SELECT * FROM vehicles ORDER BY created_at DESC');
    }
  }

  async getVehicleById(id) {
    if (this.type === 'mongodb') {
      return await this.db.collection('vehicles').findOne({ _id: parseInt(id) });
    } else {
      return await this.db.get('SELECT * FROM vehicles WHERE id = ?', [id]);
    }
  }

  async createVehicle(data) {
    if (this.type === 'mongodb') {
      const result = await this.db.collection('vehicles').insertOne({
        ...data,
        status: 'offline',
        battery_level: 100,
        speed: 0,
        is_updating: false,
        current_firmware_version: 'v1.0',
        created_at: new Date(),
        last_seen: new Date()
      });
      return await this.db.collection('vehicles').findOne({ _id: result.insertedId });
    } else {
      await this.db.run(
        `INSERT INTO vehicles (name, type, location_lat, location_lng, status) 
         VALUES (?, ?, ?, ?, 'offline')`,
        [data.name, data.type, data.location_lat || 6.3703, data.location_lng || 2.3912]
      );
      return await this.db.get('SELECT * FROM vehicles WHERE id = last_insert_rowid()');
    }
  }

  async updateVehicle(id, data) {
    if (this.type === 'mongodb') {
      await this.db.collection('vehicles').updateOne(
        { _id: parseInt(id) },
        { $set: { ...data, last_seen: new Date() } }
      );
      return await this.db.collection('vehicles').findOne({ _id: parseInt(id) });
    } else {
      const fields = Object.keys(data).map(k => ${k} = ?).join(', ');
      const values = [...Object.values(data), id];
      await this.db.run(
        UPDATE vehicles SET ${fields}, last_seen = CURRENT_TIMESTAMP WHERE id = ?,
        values
      );
      return await this.db.get('SELECT * FROM vehicles WHERE id = ?', [id]);
    }
  }

  // FIRMWARES
  async getAllFirmwares() {
    if (this.type === 'mongodb') {
      return await this.db.collection('firmwares').find().sort({ created_at: -1 }).toArray();
    } else {
      return await this.db.query('SELECT * FROM firmwares ORDER BY created_at DESC');
    }
  }

  async getFirmwareByVersion(version) {
    if (this.type === 'mongodb') {
      return await this.db.collection('firmwares').findOne({ version });
    } else {
      return await this.db.get('SELECT * FROM firmwares WHERE version = ?', [version]);
    }
  }

  async createFirmware(data) {
    if (this.type === 'mongodb') {
      const result = await this.db.collection('firmwares').insertOne({
        ...data,
        created_at: new Date()
      });
      return await this.db.collection('firmwares').findOne({ _id: result.insertedId });
    } else {
      await this.db.run(
        `INSERT INTO firmwares (version, file_url, release_notes, size_mb, is_critical) 
         VALUES (?, ?, ?, ?, ?)`,
        [data.version, data.file_url, data.release_notes, data.size_mb, data.is_critical ? 1 : 0]
      );
      return await this.db.get('SELECT * FROM firmwares WHERE id = last_insert_rowid()');
    }
  }

  // UPDATES
  async createUpdate(vehicle_id, firmware_id) {
    if (this.type === 'mongodb') {
      const result = await this.db.collection('updates').insertOne({
        vehicle_id: parseInt(vehicle_id),
        firmware_id,
        status: 'pending',
        progress: 0,
        started_at: new Date()
      });
      return await this.db.collection('updates').findOne({ _id: result.insertedId });
    } else {
      await this.db.run(
        INSERT INTO updates (vehicle_id, firmware_id, status, progress) VALUES (?, ?, 'pending', 0),
        [vehicle_id, firmware_id]
      );
      return await this.db.get('SELECT * FROM updates WHERE id = last_insert_rowid()');
    }
  }

  async updateUpdateProgress(update_id, progress) {
    if (this.type === 'mongodb') {
      await this.db.collection('updates').updateOne(
        { _id: parseInt(update_id) },
        { $set: { progress, status: 'in_progress' } }
      );
    } else {
      await this.db.run(
        UPDATE updates SET progress = ?, status = 'in_progress' WHERE id = ?,
        [progress, update_id]
      );
    }
  }

  async completeUpdate(update_id, success, new_version = null, error = null) {
    if (this.type === 'mongodb') {
      await this.db.collection('updates').updateOne(
        { _id: parseInt(update_id) },
        { 
          $set: { 
            status: success ? 'completed' : 'failed',
            progress: success ? 100 : this.progress,
            completed_at: new Date(),
            error_message: error
          } 
        }
      );
    } else {
      await this.db.run(
        UPDATE updates SET status = ?, progress = ?, completed_at = CURRENT_TIMESTAMP, error_message = ? WHERE id = ?,
        [success ? 'completed' : 'failed', success ? 100 : 0, error, update_id]
      );
    }
  }

  async getUpdateHistory() {
    if (this.type === 'mongodb') {
      return await this.db.collection('updates').aggregate([
        { $lookup: { from: 'vehicles', localField: 'vehicle_id', foreignField: '_id', as: 'vehicle' } },
        { $lookup: { from: 'firmwares', localField: 'firmware_id', foreignField: '_id', as: 'firmware' } },
        { $unwind: '$vehicle' },
        { $unwind: '$firmware' },
        { $sort: { started_at: -1 } },
        { $limit: 50 }
      ]).toArray();
    } else {
      return await this.db.query(`
        SELECT u.*, v.name as vehicle_name, v.type as vehicle_type, f.version as firmware_version
        FROM updates u
        JOIN vehicles v ON u.vehicle_id = v.id
        JOIN firmwares f ON u.firmware_id = f.id
        ORDER BY u.started_at DESC
        LIMIT 50
      `);
    }
  }

  // FEATURES
  async getAllFeatures() {
    if (this.type === 'mongodb') {
      return await this.db.collection('features').find().sort({ name: 1 }).toArray();
    } else {
      return await this.db.query('SELECT * FROM features ORDER BY name');
    }
  }

  async getVehicleFeatures(vehicle_id) {
    if (this.type === 'mongodb') {
      return await this.db.collection('features').aggregate([
        {
          $lookup: {
            from: 'vehicle_features',
            let: { feature_id: '$_id' },
            pipeline: [
              { $match: { $expr: { $and: [
                { $eq: ['$feature_id', '$$feature_id'] },
                { $eq: ['$vehicle_id', parseInt(vehicle_id)] }
              ]}}}
            ],
            as: 'activation'
          }
        },
        {
          $addFields: {
            is_active: { $arrayElemAt: ['$activation.is_active', 0] },
            activated_at: { $arrayElemAt: ['$activation.activated_at', 0] },
            expires_at: { $arrayElemAt: ['$activation.expires_at', 0] }
          }
        },
        { $project: { activation: 0 } }
      ]).toArray();
    } else {
      return await this.db.query(`
        SELECT f.*, vf.is_active, vf.activated_at, vf.expires_at
        FROM features f
        LEFT JOIN vehicle_features vf ON f.id = vf.feature_id AND vf.vehicle_id = ?
        ORDER BY f.name
      `, [vehicle_id]);
    }
  }

  async toggleFeature(vehicle_id, feature_id, activate, expires_at = null) {
    if (this.type === 'mongodb') {
      await this.db.collection('vehicle_features').updateOne(
        { vehicle_id: parseInt(vehicle_id), feature_id: parseInt(feature_id) },
        { 
          $set: { 
            is_active: activate,
            activated_at: new Date(),
            expires_at: expires_at ? new Date(expires_at) : null
          } 
        },
        { upsert: true }
      );
      return await this.db.collection('vehicle_features').findOne({
        vehicle_id: parseInt(vehicle_id),
        feature_id: parseInt(feature_id)
      });
    } else {
      await this.db.run(`
        INSERT INTO vehicle_features (vehicle_id, feature_id, is_active, expires_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(vehicle_id, feature_id) 
        DO UPDATE SET is_active = ?, activated_at = CURRENT_TIMESTAMP, expires_at = ?
      `, [vehicle_id, feature_id, activate ? 1 : 0, expires_at, activate ? 1 : 0, expires_at]);
      
      return await this.db.get(
        'SELECT * FROM vehicle_features WHERE vehicle_id = ? AND feature_id = ?',
        [vehicle_id, feature_id]
      );
    }
  }

  // USERS
  async getUserByUsername(username) {
    if (this.type === 'mongodb') {
      return await this.db.collection('users').findOne({ username });
    } else {
      return await this.db.get('SELECT * FROM users WHERE username = ?', [username]);
    }
  }

  // STATS
  async getStats() {
    if (this.type === 'mongodb') {
      const total = await this.db.collection('vehicles').countDocuments();
      const online = await this.db.collection('vehicles').countDocuments({ status: 'online' });
      const alerts = await this.db.collection('vehicles').countDocuments({ battery_level: { $lt: 20 } });
      
      const avgBattery = await this.db.collection('vehicles').aggregate([
        { $group: { _id: null, avg: { $avg: '$battery_level' } } }
      ]).toArray();

      const latestFirmware = await this.db.collection('firmwares')
        .find()
        .sort({ version: -1 })
        .limit(1)
        .toArray();
      
      const updatesAvailable = latestFirmware.length > 0 
        ? await this.db.collection('vehicles').countDocuments({
            current_firmware_version: { $ne: latestFirmware[0].version }
          })
        : 0;

      return {
        total_vehicles: total,
        online_vehicles: online,
        updates_available: updatesAvailable,
        alerts: alerts,
        average_battery: avgBattery.length > 0 ? Math.round(avgBattery[0].avg * 10) / 10 : 0
      };
    } else {
      const total = await this.db.get('SELECT COUNT(*) as count FROM vehicles');
      const online = await this.db.get("SELECT COUNT(*) as count FROM vehicles WHERE status = 'online'");
      const alerts = await this.db.get('SELECT COUNT(*) as count FROM vehicles WHERE battery_level < 20');
      const avgBattery = await this.db.get('SELECT AVG(battery_level) as avg FROM vehicles');
      const updatesAvailable = await this.db.get(`
        SELECT COUNT(DISTINCT v.id) as count
        FROM vehicles v
        WHERE v.current_firmware_version < (SELECT MAX(version) FROM firmwares)
      `);

      return {
        total_vehicles: total.count,
        online_vehicles: online.count,
        updates_available: updatesAvailable.count,
        alerts: alerts.count,
        average_battery: Math.round((avgBattery.avg || 0) * 10) / 10
      };
    }
  }
}

module.exports = DatabaseAdapter;
