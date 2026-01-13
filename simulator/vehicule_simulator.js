// ============================================
// FICHIER 5/6 - SIMULATEUR DE VÉHICULE
// Nom du fichier: simulator/vehicle_simulator.js
// Description: Simule un véhicule électrique connecté
// ============================================

const io = require('socket.io-client');

class VehicleSimulator {
  constructor(vehicleId, serverUrl = 'http://localhost:3000') {
    this.vehicleId = vehicleId;
    this.serverUrl = serverUrl;
    this.socket = null;
    
    // État du véhicule
    this.state = {
      battery_level: Math.floor(Math.random() * 50) + 50, // 50-100%
      location: {
        lat: 6.3703 + (Math.random() - 0.5) * 0.01,
        lng: 2.3912 + (Math.random() - 0.5) * 0.01
      },
      speed: 0, // km/h
      is_updating: false,
      current_firmware_version: 'v1.0'
    };

    // Configuration
    this.updateInterval = null;
    this.batteryDrainRate = 0.5; // % par minute
    this.sendDataInterval = 5000; // Envoyer données toutes les 5 secondes
  }

  // Se connecter au serveur
  connect() {
    console.log(`\n╔════════════════════════════════════════╗`);
    console.log(`║  🚗 SIMULATEUR VÉHICULE ${this.vehicleId.toString().padEnd(15)} ║`);
    console.log(`╚════════════════════════════════════════╝\n`);

    this.socket = io(this.serverUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log(`✅ Connecté au serveur (${this.socket.id})`);
      
      // S'identifier
      this.socket.emit('identify', {
        client_id: `vehicle_${this.vehicleId}`,
        vehicle_id: this.vehicleId
      });

      // Envoyer l'événement de connexion
      this.socket.emit('vehicle_connect', {
        vehicle_id: this.vehicleId
      });

      // Démarrer l'envoi périodique des données
      this.startSendingData();
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Déconnecté du serveur');
      this.stopSendingData();
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconnecté après ${attemptNumber} tentative(s)`);
    });

    this.socket.on('message', (message) => {
      this.handleMessage(message);
    });

    this.socket.on('error', (error) => {
      console.error('❌ Erreur WebSocket:', error);
    });
  }

  // Gérer les messages du serveur
  handleMessage(message) {
    const { type, data } = message;

    switch (type) {
      case 'start_update':
        this.handleStartUpdate(data);
        break;
      
      case 'feature_toggle':
        this.handleFeatureToggle(data);
        break;
      
      default:
        console.log(`📨 Message reçu:`, type);
    }
  }

  // Gérer le début d'une mise à jour FOTA
  async handleStartUpdate(data) {
    const { update_id, firmware } = data;
    
    console.log(`\n🔄 MISE À JOUR FIRMWARE`);
    console.log(`   Version: ${this.state.current_firmware_version} → ${firmware.version}`);
    console.log(`   Taille: ${firmware.size_mb} MB`);
    console.log(`   Critique: ${firmware.is_critical ? 'OUI' : 'NON'}\n`);

    this.state.is_updating = true;

    // Simuler le téléchargement et l'installation
    const totalSteps = 100;
    const stepDuration = 300; // ms par étape (30 secondes au total)

    for (let progress = 0; progress <= totalSteps; progress += 5) {
      await this.sleep(stepDuration * 5);

      // Envoyer la progression
      this.socket.emit('update_progress', {
        update_id,
        vehicle_id: this.vehicleId,
        progress
      });

      console.log(`   [${this.progressBar(progress)}] ${progress}%`);

      // Simuler une panne aléatoire (5% de chance)
      if (Math.random() < 0.05 && progress < 95) {
        console.log(`\n❌ Erreur lors de la mise à jour!`);
        
        this.socket.emit('update_completed', {
          update_id,
          vehicle_id: this.vehicleId,
          success: false,
          error: 'Connexion perdue pendant le téléchargement'
        });

        this.state.is_updating = false;
        return;
      }
    }

    // Mise à jour réussie
    this.state.current_firmware_version = firmware.version;
    this.state.is_updating = false;

    console.log(`\n✅ Mise à jour terminée avec succès!\n`);

    this.socket.emit('update_completed', {
      update_id,
      vehicle_id: this.vehicleId,
      new_version: firmware.version,
      success: true
    });
  }

  // Gérer l'activation/désactivation d'une feature
  handleFeatureToggle(data) {
    const { feature_name, is_active } = data;
    
    const status = is_active ? 'ACTIVÉE' : 'DÉSACTIVÉE';
    const icon = is_active ? '✅' : '❌';
    
    console.log(`${icon} Feature "${feature_name}" ${status}`);

    // Confirmer l'activation
    this.socket.emit('feature_activated', {
      vehicle_id: this.vehicleId,
      feature_id: data.feature_id,
      feature_name: data.feature_name,
      success: true
    });
  }

  // Démarrer l'envoi périodique des données
  startSendingData() {
    this.updateInterval = setInterval(() => {
      this.updateState();
      this.sendData();
    }, this.sendDataInterval);

    console.log(`🔄 Envoi des données toutes les ${this.sendDataInterval / 1000}s\n`);
  }

  // Arrêter l'envoi des données
  stopSendingData() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Mettre à jour l'état du véhicule
  updateState() {
    // Simuler le mouvement (vitesse aléatoire)
    if (!this.state.is_updating) {
      this.state.speed = Math.random() < 0.3 ? Math.floor(Math.random() * 60) : 0;
    } else {
      this.state.speed = 0;
    }

    // Décharger la batterie si en mouvement
    if (this.state.speed > 0) {
      const drain = (this.batteryDrainRate * this.sendDataInterval) / 60000;
      this.state.battery_level = Math.max(0, this.state.battery_level - drain);
    }

    // Recharger un peu si à l'arrêt
    if (this.state.speed === 0 && this.state.battery_level < 100) {
      this.state.battery_level = Math.min(100, this.state.battery_level + 0.1);
    }

    // Simuler le déplacement GPS
    if (this.state.speed > 0) {
      this.state.location.lat += (Math.random() - 0.5) * 0.001;
      this.state.location.lng += (Math.random() - 0.5) * 0.001;
    }
  }

  // Envoyer les données au serveur
  sendData() {
    if (!this.socket || !this.socket.connected) return;

    this.socket.emit('vehicle_data', {
      vehicle_id: this.vehicleId,
      battery_level: Math.round(this.state.battery_level),
      location: this.state.location,
      speed: this.state.speed
    });

    // Afficher l'état
    const batteryIcon = this.getBatteryIcon(this.state.battery_level);
    const speedIcon = this.state.speed > 0 ? '🏃' : '🛑';
    
    console.log(
      `📊 ${batteryIcon} ${Math.round(this.state.battery_level)}% | ` +
      `${speedIcon} ${this.state.speed} km/h | ` +
      `📍 ${this.state.location.lat.toFixed(4)}, ${this.state.location.lng.toFixed(4)}`
    );
  }

  // Helper: Icône de batterie selon le niveau
  getBatteryIcon(level) {
    if (level > 75) return '🟢';
    if (level > 50) return '🟡';
    if (level > 25) return '🟠';
    return '🔴';
  }

  // Helper: Barre de progression
  progressBar(progress, width = 20) {
    const filled = Math.round((progress / 100) * width);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  // Helper: Sleep
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Déconnecter
  disconnect() {
    console.log('\n🛑 Arrêt du simulateur...');
    this.stopSendingData();
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

// ============================================
// SCRIPT PRINCIPAL
// ============================================

if (require.main === module) {
  // Récupérer les arguments de ligne de commande
  const args = process.argv.slice(2);
  const vehicleId = args[0] ? parseInt(args[0]) : 1;
  const serverUrl = args[1] || 'http://localhost:3000';

  // Créer et lancer le simulateur
  const simulator = new VehicleSimulator(vehicleId, serverUrl);
  simulator.connect();

  // Gérer l'arrêt propre
  process.on('SIGINT', () => {
    simulator.disconnect();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    simulator.disconnect();
    process.exit(0);
  });
}

module.exports = VehicleSimulator;

/*
╔═══════════════════════════════════════════════════════════╗
║                 UTILISATION DU SIMULATEUR                  ║
╠═══════════════════════════════════════════════════════════╣
║                                                            ║
║  Lancer un véhicule:                                      ║
║  node simulator/vehicle_simulator.js 1                    ║
║                                                            ║
║  Lancer plusieurs véhicules (dans des terminaux séparés): ║
║  node simulator/vehicle_simulator.js 1                    ║
║  node simulator/vehicle_simulator.js 2                    ║
║  node simulator/vehicle_simulator.js 3                    ║
║                                                            ║
║  Avec URL serveur personnalisée:                          ║
║  node simulator/vehicle_simulator.js 1 http://192.168.1.10:3000 ║
║                                                            ║
║  Arrêter: Ctrl+C                                          ║
║                                                            ║
╚═══════════════════════════════════════════════════════════╝
*/
