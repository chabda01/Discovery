class VehicleService {
  constructor() {
    this.ws = null;
    this.vehicles = new Map();
    this.listeners = new Set();
  }

  connect(simulatorUrl = 'ws://localhost:8080') {
    if (this.ws) {
      console.log('WebSocket already connected');
      return;
    }

    console.log('Connecting to WebSocket:', simulatorUrl);
    this.ws = new WebSocket(simulatorUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected successfully');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Gérer les messages de confirmation
      if (data.type === 'UPDATE_STARTED') {
        console.log('Update started for vehicle:', data.vehicleId);
      } else if (data.type === 'UPDATE_ERROR') {
        console.error('Update error:', data.error);
        alert(`Update failed: ${data.error}`);
      } else {
        // Mise à jour normale du véhicule
        this.vehicles.set(data.id, {
          ...data,
          lastUpdate: new Date()
        });
        
        // Notifier tous les listeners
        this.notifyListeners();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
      this.ws = null;
      // Reconnexion automatique après 5 secondes
      setTimeout(() => this.connect(simulatorUrl), 5000);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    // Envoyer immédiatement les données actuelles
    if (this.vehicles.size > 0) {
      callback(this.getVehicles());
    }
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    const vehiclesArray = Array.from(this.vehicles.values());
    this.listeners.forEach(callback => callback(vehiclesArray));
  }

  getVehicles() {
    return Array.from(this.vehicles.values());
  }

  activateFeature(vehicleId, featureId) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('Activating feature:', featureId, 'on vehicle:', vehicleId);
      this.ws.send(JSON.stringify({
        type: 'ACTIVATE_FEATURE',
        vehicleId: vehicleId,
        featureId: featureId
      }));
      return true;
    }
    console.error('WebSocket not connected');
    return false;
  }

  deactivateFeature(vehicleId, featureId) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'DEACTIVATE_FEATURE',
        vehicleId: vehicleId,
        featureId: featureId
      }));
      return true;
    }
    return false;
  }

  startUpdate(vehicleId) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('Sending START_UPDATE for vehicle:', vehicleId);
      this.ws.send(JSON.stringify({
        type: 'START_UPDATE',
        vehicleId: vehicleId
      }));
      return true;
    }
    console.error('WebSocket not connected');
    return false;
  }

  getStats() {
    const vehicles = this.getVehicles();
    const now = new Date();
    const onlineThreshold = 30000; // 30 secondes

    return {
      total: vehicles.length,
      online: vehicles.filter(v => 
        now - v.lastUpdate < onlineThreshold
      ).length,
      charging: vehicles.filter(v => v.charging).length,
      lowBattery: vehicles.filter(v => v.battery < 20).length
    };
  }
}

export default new VehicleService();
