class VehicleService {
  constructor() {
    this.ws = null;
    this.vehicles = new Map();
    this.listeners = new Set();
  }

  connect(simulatorUrl = 'ws://localhost:8080') {
    if (this.ws) {
      return;
    }

    this.ws = new WebSocket(simulatorUrl);

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Mettre à jour les données du véhicule
      this.vehicles.set(data.id, {
        ...data,
        lastUpdate: new Date()
      });

      // Notifier tous les listeners
      this.notifyListeners();
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
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    const vehiclesArray = Array.from(this.vehicles.values());
    this.listeners.forEach(callback => callback(vehiclesArray));
  }

  getVehicles() {
    return Array.from(this.vehicles.values());
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
