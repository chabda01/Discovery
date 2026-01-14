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
    this.isConnected = Math.random() > 0.2; // 80% de chance d'être connecté
    this.firmwareVersion = '1.0.0';
    this.pendingUpdate = null;
    this.isUpdating = false;
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
        const distance = this.speed / 111000; // Conversion approximative km/h en degrés
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

    // Gérer les mises à jour FOTA
    if (this.pendingUpdate && !this.isUpdating) {
      // Conditions pour installer la mise à jour
      const canUpdate = this.speed === 0 && this.isConnected && this.battery > 20;
      
      if (canUpdate) {
        this.isUpdating = true;
        this.speed = 0;
        
        // Simuler l'installation (10 secondes)
        setTimeout(() => {
          this.firmwareVersion = this.pendingUpdate.version;
          this.pendingUpdate = null;
          this.isUpdating = false;
        }, 10000);
      }
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
      timestamp: new Date().toISOString()
    };
  }

  setPendingUpdate(update) {
    if (this.firmwareVersion !== update.version) {
      this.pendingUpdate = update;
    }
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
