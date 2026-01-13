// ============================================
// FICHIER 4/6 - WEBSOCKET HANDLER
// Nom du fichier: websocket/websocket.js
// ============================================

const DatabaseAdapter = require('../models/adapters');

class WebSocketManager {
  constructor(io, db) {
    this.io = io;
    this.db = db;
    this.adapter = new DatabaseAdapter(db);
    this.connectedClients = new Map(); // client_id => socket
    this.vehicleConnections = new Map(); // vehicle_id => socket
  }

  initialize() {
    this.io.on('connection', (socket) => {
      console.log(`🔌 Client connecté: ${socket.id}`);

      // Événement: Client s'identifie
      socket.on('identify', (data) => {
        const { client_id, vehicle_id } = data;
        
        this.connectedClients.set(client_id, socket);
        socket.client_id = client_id;
        
        if (vehicle_id) {
          this.vehicleConnections.set(vehicle_id, socket);
          socket.vehicle_id = vehicle_id;
          console.log(`🚗 Véhicule ${vehicle_id} identifié (${socket.id})`);
        } else {
          console.log(`📊 Dashboard ${client_id} identifié (${socket.id})`);
        }
      });

      // Événement: Véhicule se connecte
      socket.on('vehicle_connect', async (data) => {
        try {
          const { vehicle_id } = data;
          console.log(`🚗 Véhicule ${vehicle_id} connecté`);

          // Mettre à jour le statut en DB
          await this.adapter.updateVehicle(vehicle_id, {
            status: 'online'
          });

          // Enregistrer la connexion
          this.vehicleConnections.set(vehicle_id, socket);
          socket.vehicle_id = vehicle_id;

          // Notifier tous les clients
          this.io.emit('vehicle_status_changed', {
            vehicle_id,
            status: 'online',
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          console.error('Erreur vehicle_connect:', error);
        }
      });

      // Événement: Véhicule envoie des données
      socket.on('vehicle_data', async (data) => {
        try {
          const { vehicle_id, battery_level, location, speed } = data;

          // Mettre à jour la DB
          await this.adapter.updateVehicle(vehicle_id, {
            battery_level,
            location_lat: location.lat,
            location_lng: location.lng,
            speed
          });

          // Diffuser aux dashboards
          this.io.emit('vehicle_data_updated', {
            vehicle_id,
            battery_level,
            location,
            speed,
            timestamp: new Date().toISOString()
          });

          console.log(`📊 Données véhicule ${vehicle_id}: 🔋 ${battery_level}% | 🏃 ${speed} km/h`);
        } catch (error) {
          console.error('Erreur vehicle_data:', error);
        }
      });

      // Événement: Progression mise à jour
      socket.on('update_progress', async (data) => {
        try {
          const { update_id, progress, vehicle_id } = data;

          // Mettre à jour la DB
          await this.adapter.updateUpdateProgress(update_id, progress);

          // Notifier tous les clients
          this.io.emit('update_progress_changed', {
            update_id,
            vehicle_id,
            progress,
            timestamp: new Date().toISOString()
          });

          console.log(`🔄 Mise à jour ${update_id}: ${progress}%`);
        } catch (error) {
          console.error('Erreur update_progress:', error);
        }
      });

      // Événement: Mise à jour terminée
      socket.on('update_completed', async (data) => {
        try {
          const { update_id, vehicle_id, new_version, success, error } = data;

          // Mettre à jour la DB
          await this.adapter.completeUpdate(update_id, success, new_version, error);

          if (success) {
            // Mettre à jour la version du véhicule
            await this.adapter.updateVehicle(vehicle_id, {
              current_firmware_version: new_version,
              is_updating: false,
              status: 'online'
            });
            console.log(`✅ Mise à jour ${update_id} réussie: véhicule ${vehicle_id} → ${new_version}`);
          } else {
            // Marquer le véhicule comme pas en cours de mise à jour
            await this.adapter.updateVehicle(vehicle_id, {
              is_updating: false,
              status: 'online'
            });
            console.log(`❌ Mise à jour ${update_id} échouée: ${error}`);
          }

          // Notifier tous les clients
          this.io.emit('update_completed', {
            update_id,
            vehicle_id,
            success,
            new_version: success ? new_version : null,
            error: success ? null : error,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          console.error('Erreur update_completed:', error);
        }
      });

      // Événement: Confirmation activation feature
      socket.on('feature_activated', (data) => {
        const { vehicle_id, feature_id, feature_name, success } = data;
        
        this.io.emit('feature_activation_confirmed', {
          vehicle_id,
          feature_id,
          feature_name,
          success,
          timestamp: new Date().toISOString()
        });

        const status = success ? '✅' : '❌';
        console.log(`${status} Feature ${feature_name} sur véhicule ${vehicle_id}`);
      });

      // Événement: Déconnexion
      socket.on('disconnect', async () => {
        console.log(`❌ Client déconnecté: ${socket.id}`);

        // Si c'est un véhicule, mettre à jour son statut
        if (socket.vehicle_id) {
          try {
            await this.adapter.updateVehicle(socket.vehicle_id, {
              status: 'offline'
            });

            this.vehicleConnections.delete(socket.vehicle_id);

            this.io.emit('vehicle_status_changed', {
              vehicle_id: socket.vehicle_id,
              status: 'offline',
              timestamp: new Date().toISOString()
            });

            console.log(`🚗 Véhicule ${socket.vehicle_id} déconnecté`);
          } catch (error) {
            console.error('Erreur déconnexion véhicule:', error);
          }
        }

        // Nettoyer les références
        if (socket.client_id) {
          this.connectedClients.delete(socket.client_id);
        }
      });

      // Gestion des erreurs
      socket.on('error', (error) => {
        console.error(`❌ Erreur WebSocket ${socket.id}:`, error);
      });
    });

    console.log('✅ WebSocket Manager initialisé');
  }

  // Envoyer un message à un véhicule spécifique
  sendToVehicle(vehicle_id, message) {
    const socket = this.vehicleConnections.get(parseInt(vehicle_id));
    if (socket) {
      socket.emit('message', message);
      console.log(`📤 Message envoyé au véhicule ${vehicle_id}:`, message.type);
    } else {
      console.log(`⚠️ Véhicule ${vehicle_id} non connecté`);
    }
  }

  // Envoyer un message à un client spécifique
  sendToClient(client_id, message) {
    const socket = this.connectedClients.get(client_id);
    if (socket) {
      socket.emit('message', message);
      console.log(`📤 Message envoyé au client ${client_id}:`, message.type);
    } else {
      console.log(`⚠️ Client ${client_id} non connecté`);
    }
  }

  // Diffuser à tous les clients sauf l'expéditeur
  broadcast(message, excludeSocket = null) {
    if (excludeSocket) {
      excludeSocket.broadcast.emit('message', message);
    } else {
      this.io.emit('message', message);
    }
  }

  // Obtenir le nombre de connexions actives
  getConnectionsCount() {
    return {
      total: this.connectedClients.size,
      vehicles: this.vehicleConnections.size,
      dashboards: this.connectedClients.size - this.vehicleConnections.size
    };
  }

  // Obtenir la liste des véhicules connectés
  getConnectedVehicles() {
    return Array.from(this.vehicleConnections.keys());
  }
}

module.exports = WebSocketManager;
