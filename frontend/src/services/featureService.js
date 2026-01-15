class FeatureService {
  constructor() {
    this.features = [
      {
        id: 1,
        name: 'Autopilot',
        description: 'Advanced driver assistance with lane keeping and adaptive cruise control',
        price: 5000,
        currency: 'XOF',
        icon: 'auto_mode',
        category: 'Driving',
        active: true
      },
      {
        id: 2,
        name: 'Full Self-Driving',
        description: 'Complete autonomous driving capability in most conditions',
        price: 15000,
        currency: 'XOF',
        icon: 'directions_car',
        category: 'Driving',
        active: true,
        requiresApproval: true
      },
      {
        id: 3,
        name: 'Premium Connectivity',
        description: 'High-speed internet, live traffic, satellite maps',
        price: 2500,
        currency: 'XOF',
        icon: 'wifi',
        category: 'Connectivity',
        active: true,
        subscription: 'monthly'
      },
      {
        id: 4,
        name: 'Enhanced Audio',
        description: 'Premium sound system with immersive audio experience',
        price: 3000,
        currency: 'XOF',
        icon: 'speaker',
        category: 'Entertainment',
        active: true
      },
      {
        id: 5,
        name: 'Climate Control Plus',
        description: 'Advanced climate preconditioning and air quality monitoring',
        price: 1500,
        currency: 'XOF',
        icon: 'ac_unit',
        category: 'Comfort',
        active: true
      },
      {
        id: 6,
        name: 'Performance Boost',
        description: 'Unlock additional acceleration and top speed',
        price: 8000,
        currency: 'XOF',
        icon: 'speed',
        category: 'Performance',
        active: true
      },
      {
        id: 7,
        name: 'Sentry Mode',
        description: '360° camera recording when parked for security',
        price: 2000,
        currency: 'XOF',
        icon: 'videocam',
        category: 'Security',
        active: true
      },
      {
        id: 8,
        name: 'Dog Mode',
        description: 'Keep pets comfortable with climate control while parked',
        price: 500,
        currency: 'XOF',
        icon: 'pets',
        category: 'Comfort',
        active: true
      }
    ];

    this.vehicleFeatures = new Map(); // vehicleId -> [featureIds]
    this.pendingActivations = new Map(); // activationId -> activation data
    this.updateHistory = []; // Historique des activations
  }

  getFeatures() {
    return this.features.filter(f => f.active);
  }

  getFeatureById(id) {
    return this.features.find(f => f.id === id);
  }

  getFeaturesByCategory() {
    const categories = {};
    this.features.forEach(feature => {
      if (!categories[feature.category]) {
        categories[feature.category] = [];
      }
      categories[feature.category].push(feature);
    });
    return categories;
  }

  getVehicleFeatures(vehicleId) {
    const features = this.vehicleFeatures.get(String(vehicleId));
    return features ? [...features] : []; // Retourner une copie
  }

  hasFeature(vehicleId, featureId) {
    const features = this.vehicleFeatures.get(String(vehicleId)) || [];
    return features.includes(featureId);
  }

  async activateFeature(vehicleId, featureId, paymentMethod) {
    const vehicleIdStr = String(vehicleId); // Normaliser l'ID
    const feature = this.getFeatureById(featureId);
    
    if (!feature) {
      throw new Error('Feature not found');
    }

    if (!feature.active) {
      throw new Error('Feature is currently unavailable');
    }

    if (this.hasFeature(vehicleIdStr, featureId)) {
      throw new Error('Feature already activated on this vehicle');
    }

    // Vérifier les prérequis spéciaux
    if (featureId === 2 && !this.hasFeature(vehicleIdStr, 1)) {
      throw new Error('Full Self-Driving requires Autopilot to be activated first');
    }

    const activationId = `ACT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const activation = {
      id: activationId,
      vehicleId: vehicleIdStr,
      featureId,
      feature,
      paymentMethod,
      status: 'pending',
      createdAt: new Date(),
      amount: feature.price
    };

    this.pendingActivations.set(activationId, activation);

    return activation;
  }

  confirmActivation(activationId) {
    const activation = this.pendingActivations.get(activationId);
    
    if (!activation) {
      throw new Error('Activation not found');
    }

    const vehicleIdStr = String(activation.vehicleId);
    
    // Récupérer ou créer le tableau de features pour ce véhicule
    const vehicleFeatures = this.vehicleFeatures.get(vehicleIdStr) || [];
    
    // Ajouter la feature uniquement si elle n'est pas déjà présente
    if (!vehicleFeatures.includes(activation.featureId)) {
      vehicleFeatures.push(activation.featureId);
      this.vehicleFeatures.set(vehicleIdStr, vehicleFeatures);
      
      console.log(`Feature ${activation.featureId} activated for vehicle ${vehicleIdStr}`, {
        vehicleFeatures: this.vehicleFeatures.get(vehicleIdStr)
      });
    }

    activation.status = 'completed';
    activation.completedAt = new Date();

    return activation;
  }

  cancelActivation(activationId) {
    const activation = this.pendingActivations.get(activationId);
    
    if (!activation) {
      throw new Error('Activation not found');
    }

    activation.status = 'cancelled';
    activation.cancelledAt = new Date();

    return activation;
  }

  createFeature(featureData) {
    const newFeature = {
      id: this.features.length + 1,
      ...featureData,
      active: true,
      createdAt: new Date()
    };

    this.features.push(newFeature);
    return newFeature;
  }

  updateFeature(featureId, updates) {
    const feature = this.features.find(f => f.id === featureId);
    
    if (!feature) {
      throw new Error('Feature not found');
    }

    Object.assign(feature, updates);
    return feature;
  }

  deactivateFeature(featureId) {
    const feature = this.features.find(f => f.id === featureId);
    
    if (!feature) {
      throw new Error('Feature not found');
    }

    feature.active = false;
    return feature;
  }

  getStats() {
    const totalRevenue = Array.from(this.pendingActivations.values())
      .filter(a => a.status === 'completed')
      .reduce((sum, a) => sum + a.amount, 0);

    const activationsByFeature = {};
    Array.from(this.pendingActivations.values())
      .filter(a => a.status === 'completed')
      .forEach(a => {
        activationsByFeature[a.featureId] = (activationsByFeature[a.featureId] || 0) + 1;
      });

    return {
      totalFeatures: this.features.filter(f => f.active).length,
      totalActivations: Array.from(this.pendingActivations.values()).filter(a => a.status === 'completed').length,
      pendingActivations: Array.from(this.pendingActivations.values()).filter(a => a.status === 'pending').length,
      totalRevenue,
      activationsByFeature
    };
  }
}

export default new FeatureService();
