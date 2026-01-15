const WebSocket = require('ws');

// Configuration du serveur WebSocket
const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

console.log(`🚗 Car Simulator WebSocket Server running on ws://localhost:${PORT}`);

// Classe pour simuler une voiture
class VehicleSimulator {
  constructor(id, name, country, baseLat, baseLng) {
    this.id = id;
    this.name = name;
    this.country = country;
    this.lat = baseLat + (Math.random() - 0.5) * 2;
    this.lng = baseLng + (Math.random() - 0.5) * 2;
    this.battery = Math.floor(Math.random() * 100);
    this.speed = 0;
    this.charging = false;
    this.direction = Math.random() * 360;
    this.isConnected = Math.random() > 0.2;
    this.firmwareVersion = '1.0.0';
    this.pendingUpdate = null;
    this.isUpdating = false;
    this.activeFeatures = []; // IDs des features actives
    this.drivingMode = 'manual'; // manual, autopilot, full-self-driving
  }

  update() {
    // Simuler les changements de connexion Internet (5% de chance de changer)
    if (Math.random() > 0.95) {
      this.isConnected = !this.isConnected;
    }

    // Simuler le mouvement
    if (!this.charging && !this.isUpdating) {
      // Changer aléatoirement la vitesse
      if (Math.random() > 0.7) {
        this.speed = Math.floor(Math.random() * 80);
      }

      // Si la voiture bouge, déplacer sa position
      if (this.speed > 0) {
        const distance = this.speed / 111000;
        this.lat += Math.cos(this.direction * Math.PI / 180) * distance;
        this.lng += Math.sin(this.direction * Math.PI / 180) * distance;

        // Changer de direction occasionnellement
        if (Math.random() > 0.9) {
          this.direction = Math.random() * 360;
        }

        // Consommer la batterie
        this.battery = Math.max(0, this.battery - 0.1);
      }
    }

    // Gérer la recharge
    if (this.battery < 15 && !this.charging) {
      this.charging = true;
      this.speed = 0;
    }

    if (this.charging) {
      this.battery = Math.min(100, this.battery + 0.5);
      if (this.battery >= 80) {
        this.charging = false;
      }
    }

    // Gérer les mises à jour FOTA en cours
    if (this.isUpdating) {
      // La mise à jour est en cours, ne rien faire
      // Elle sera terminée par le timeout défini dans startUpdate()
    }

    return this.getData();
  }

  getData() {
    return {
      id: this.id,
      name: this.name,
      country: this.country,
      lat: this.lat,
      lng: this.lng,
      battery: Math.round(this.battery * 10) / 10,
      speed: this.speed,
      charging: this.charging,
      isConnected: this.isConnected,
      firmwareVersion: this.firmwareVersion,
      isUpdating: this.isUpdating,
      pendingUpdate: this.pendingUpdate,
      canUpdate: this.canUpdate(),
      activeFeatures: this.activeFeatures,
      drivingMode: this.drivingMode,
      timestamp: new Date().toISOString()
    };
  }

  setPendingUpdate(update) {
    if (this.firmwareVersion !== update.version) {
      this.pendingUpdate = update;
    }
  }

  canUpdate() {
    return this.speed === 0 && this.isConnected && this.battery > 20 && !this.isUpdating;
  }

  startUpdate() {
    if (!this.pendingUpdate) {
      return { success: false, error: 'No pending update' };
    }

    if (!this.canUpdate()) {
      const reasons = [];
      if (this.speed > 0) reasons.push('vehicle is moving');
      if (!this.isConnected) reasons.push('no internet connection');
      if (this.battery <= 20) reasons.push('battery too low');
      if (this.isUpdating) reasons.push('update already in progress');

      return {
        success: false,
        error: `Cannot update: ${reasons.join(', ')}`
      };
    }

    this.isUpdating = true;
    this.speed = 0;

    // Simuler l'installation (10 secondes)
    setTimeout(() => {
      this.firmwareVersion = this.pendingUpdate.version;
      this.pendingUpdate = null;
      this.isUpdating = false;
      console.log(`✅ Vehicle ${this.id} updated to v${this.firmwareVersion}`);
    }, 10000);

    return { success: true, message: 'Update started' };
  }

  activateFeature(featureId) {
    const featureIdNum = Number(featureId);
    
    if (!this.activeFeatures.includes(featureIdNum)) {
      this.activeFeatures.push(featureIdNum);
      
      console.log(`✅ Vehicle ${this.id}: Feature ${featureIdNum} activated. Active features:`, this.activeFeatures);
      
      // Activer les modes de conduite selon la feature
      if (featureIdNum === 1) { // Autopilot
        this.drivingMode = 'autopilot';
      } else if (featureIdNum === 2) { // Full Self-Driving
        this.drivingMode = 'full-self-driving';
      }
      
      return { success: true, message: 'Feature activated successfully' };
    }
    return { success: false, error: 'Feature already active' };
  }

  deactivateFeature(featureId) {
    const index = this.activeFeatures.indexOf(featureId);
    if (index > -1) {
      this.activeFeatures.splice(index, 1);
      
      // Désactiver le mode de conduite
      if (featureId === 1 || featureId === 2) {
        this.drivingMode = 'manual';
      }
      
      return { success: true, message: 'Feature deactivated' };
    }
    return { success: false, error: 'Feature not active' };
  }
}

// Créer une flotte de véhicules répartis en Afrique
// Coordonnées des principales villes africaines
const vehicles = [
  // Bénin - Cotonou
  new VehicleSimulator(1, 'Tesla Model S', 'Benin', 6.3703, 2.3912),
  new VehicleSimulator(2, 'Tesla Model 3', 'Benin', 6.3703, 2.3912),
  
  // Nigéria - Lagos
  new VehicleSimulator(3, 'Tesla Model X', 'Nigeria', 6.5244, 3.3792),
  new VehicleSimulator(4, 'Tesla Model Y', 'Nigeria', 6.5244, 3.3792),
  new VehicleSimulator(5, 'Rivian R1T', 'Nigeria', 6.5244, 3.3792),
  
  // Afrique du Sud - Johannesburg
  new VehicleSimulator(6, 'Lucid Air', 'South Africa', -26.2041, 28.0473),
  new VehicleSimulator(7, 'Porsche Taycan', 'South Africa', -26.2041, 28.0473),
  
  // Afrique du Sud - Cape Town
  new VehicleSimulator(8, 'Audi e-tron', 'South Africa', -33.9249, 18.4241),
  
  // Kenya - Nairobi
  new VehicleSimulator(9, 'BMW iX', 'Kenya', -1.2864, 36.8172),
  new VehicleSimulator(10, 'Mercedes EQS', 'Kenya', -1.2864, 36.8172),
  
  // Ghana - Accra
  new VehicleSimulator(11, 'Volkswagen ID.4', 'Ghana', 5.6037, -0.1870),
  
  // Côte d\'Ivoire - Abidjan
  new VehicleSimulator(12, 'Hyundai Ioniq 5', 'Ivory Coast', 5.3600, -4.0083),
  
  // Sénégal - Dakar
  new VehicleSimulator(13, 'Kia EV6', 'Senegal', 14.7167, -17.4677),
  
  // Égypte - Le Caire
  new VehicleSimulator(14, 'Polestar 2', 'Egypt', 30.0444, 31.2357),
  
  // Maroc - Casablanca
  new VehicleSimulator(15, 'Nissan Leaf', 'Morocco', 33.5731, -7.5898)
];

// Envoyer les données à tous les clients connectés
function broadcastVehicleData() {
  vehicles.forEach(vehicle => {
    const data = vehicle.update();
    const message = JSON.stringify(data);

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
}

// Gérer les nouvelles connexions
wss.on('connection', (ws) => {
  console.log('✅ New client connected');

  // Envoyer immédiatement l'état actuel de tous les véhicules
  vehicles.forEach(vehicle => {
    ws.send(JSON.stringify(vehicle.getData()));
  });

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      // Gérer les commandes FOTA
      if (data.type === 'FOTA_UPDATE') {
        console.log(`📦 FOTA Update received: ${data.update.version}`);
        
        // Appliquer la mise à jour à tous les véhicules éligibles
        vehicles.forEach(vehicle => {
          vehicle.setPendingUpdate(data.update);
        });
        
        // Confirmer la réception
        ws.send(JSON.stringify({
          type: 'FOTA_CONFIRMED',
          message: `Update ${data.update.version} queued for ${vehicles.length} vehicles`
        }));
      }

      // Gérer le démarrage manuel de la mise à jour
      if (data.type === 'START_UPDATE') {
        const vehicle = vehicles.find(v => v.id === data.vehicleId);
        
        if (!vehicle) {
          ws.send(JSON.stringify({
            type: 'UPDATE_ERROR',
            vehicleId: data.vehicleId,
            error: 'Vehicle not found'
          }));
          return;
        }

        const result = vehicle.startUpdate();
        
        ws.send(JSON.stringify({
          type: result.success ? 'UPDATE_STARTED' : 'UPDATE_ERROR',
          vehicleId: data.vehicleId,
          ...result
        }));

        // Envoyer l'état mis à jour du véhicule
        setTimeout(() => {
          ws.send(JSON.stringify(vehicle.getData()));
        }, 100);
      }

      // Gérer l'activation de feature
      if (data.type === 'ACTIVATE_FEATURE') {
        const vehicleId = Number(data.vehicleId);
        const vehicle = vehicles.find(v => v.id === vehicleId);
        
        console.log(`📦 Received ACTIVATE_FEATURE for vehicle ${vehicleId}, feature ${data.featureId}`);
        
        if (!vehicle) {
          console.error(`❌ Vehicle ${vehicleId} not found`);
          ws.send(JSON.stringify({
            type: 'FEATURE_ERROR',
            vehicleId: data.vehicleId,
            error: 'Vehicle not found'
          }));
          return;
        }

        const result = vehicle.activateFeature(data.featureId);
        
        console.log(`Result for vehicle ${vehicleId}:`, result);
        
        ws.send(JSON.stringify({
          type: result.success ? 'FEATURE_ACTIVATED' : 'FEATURE_ERROR',
          vehicleId: data.vehicleId,
          featureId: data.featureId,
          ...result
        }));

        // Envoyer l'état mis à jour UNIQUEMENT de ce véhicule
        setTimeout(() => {
          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(vehicle.getData()));
            }
          });
        }, 100);
      }

      // Gérer la désactivation de feature
      if (data.type === 'DEACTIVATE_FEATURE') {
        const vehicle = vehicles.find(v => v.id === data.vehicleId);
        
        if (vehicle) {
          const result = vehicle.deactivateFeature(data.featureId);
          
          ws.send(JSON.stringify({
            type: result.success ? 'FEATURE_DEACTIVATED' : 'FEATURE_ERROR',
            vehicleId: data.vehicleId,
            featureId: data.featureId,
            ...result
          }));

          setTimeout(() => {
            wss.clients.forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(vehicle.getData()));
              }
            });
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('❌ Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Mettre à jour les véhicules toutes les secondes
setInterval(broadcastVehicleData, 1000);

console.log(`🚀 Simulating ${vehicles.length} vehicles`);
