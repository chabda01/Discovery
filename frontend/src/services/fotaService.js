import vehicleService from './vehicleService';

class FotaService {
  constructor() {
    this.updates = [
      {
        id: 1,
        version: '1.0.0',
        name: 'Initial Release',
        description: 'Base firmware version',
        releaseDate: new Date('2024-01-01'),
        status: 'deployed',
        vehiclesUpdated: 15
      }
    ];
    this.updateHistory = [];
  }

  getUpdates() {
    return this.updates;
  }

  getUpdateHistory() {
    return this.updateHistory;
  }

  async deployUpdate(update) {
    // Ajouter la mise à jour à la liste
    const newUpdate = {
      id: this.updates.length + 1,
      ...update,
      releaseDate: new Date(),
      status: 'deploying',
      vehiclesUpdated: 0
    };

    this.updates.push(newUpdate);

    // Envoyer la mise à jour via WebSocket
    if (vehicleService.ws && vehicleService.ws.readyState === WebSocket.OPEN) {
      vehicleService.ws.send(JSON.stringify({
        type: 'FOTA_UPDATE',
        update: {
          version: update.version,
          name: update.name,
          description: update.description,
          file: update.file
        }
      }));
    }

    // Simuler le déploiement
    setTimeout(() => {
      newUpdate.status = 'deployed';
    }, 2000);

    // Ajouter à l'historique
    this.updateHistory.unshift({
      ...newUpdate,
      timestamp: new Date()
    });

    return newUpdate;
  }

  getUpdateStats(vehicles) {
    const stats = {
      totalVehicles: vehicles.length,
      upToDate: 0,
      updating: 0,
      pendingUpdate: 0,
      offline: 0,
      versions: {}
    };

    vehicles.forEach(vehicle => {
      if (!vehicle.isConnected) {
        stats.offline++;
      } else if (vehicle.isUpdating) {
        stats.updating++;
      } else if (vehicle.pendingUpdate) {
        stats.pendingUpdate++;
      } else {
        stats.upToDate++;
      }

      // Compter les versions
      const version = vehicle.firmwareVersion;
      stats.versions[version] = (stats.versions[version] || 0) + 1;
    });

    return stats;
  }
}

export default new FotaService();
