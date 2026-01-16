class LLMService {
  constructor() {
    this.conversationHistory = [];
  }

  // Simule une analyse LLM des données utilisateur et véhicule
  async analyzeData(userData, vehicleData) {
    // Simulation d'analyse avec délai
    await new Promise(resolve => setTimeout(resolve, 1000));

    const insights = [];
    const recommendations = [];

    // Analyse de la batterie
    if (vehicleData.battery < 20) {
      insights.push({
        type: 'warning',
        category: 'battery',
        message: 'Battery level is critically low',
        severity: 'high'
      });
      recommendations.push({
        action: 'Charge immediately',
        reason: 'Battery below 20% can cause vehicle shutdown',
        priority: 'urgent'
      });
    } else if (vehicleData.battery < 50) {
      insights.push({
        type: 'info',
        category: 'battery',
        message: 'Battery level is moderate',
        severity: 'medium'
      });
      recommendations.push({
        action: 'Plan charging session',
        reason: 'Battery below 50% - consider charging soon',
        priority: 'medium'
      });
    }

    // Analyse de la vitesse et utilisation
    const avgSpeed = vehicleData.speed || 0;
    const isMoving = avgSpeed > 0;
    
    if (isMoving && avgSpeed > 80) {
      insights.push({
        type: 'warning',
        category: 'speed',
        message: 'High speed detected',
        severity: 'medium'
      });
      recommendations.push({
        action: 'Monitor speed patterns',
        reason: 'Consistent high speeds may indicate aggressive driving',
        priority: 'medium'
      });
    }

    // Analyse de la charge
    if (vehicleData.charging) {
      insights.push({
        type: 'success',
        category: 'charging',
        message: 'Vehicle is currently charging',
        severity: 'low'
      });
    }

    // Analyse de la connexion
    if (!vehicleData.isConnected) {
      insights.push({
        type: 'error',
        category: 'connectivity',
        message: 'Vehicle is offline',
        severity: 'high'
      });
      recommendations.push({
        action: 'Check network connection',
        reason: 'Offline vehicles cannot receive updates or report data',
        priority: 'high'
      });
    }

    // Analyse des patterns d'utilisation
    const usageHours = this.calculateUsageHours(vehicleData);
    if (usageHours > 12) {
      insights.push({
        type: 'warning',
        category: 'usage',
        message: 'High daily usage detected',
        severity: 'medium'
      });
      recommendations.push({
        action: 'Consider rest periods',
        reason: 'Extended usage may impact battery health and vehicle longevity',
        priority: 'medium'
      });
    }

    // Analyse de la température (si disponible)
    if (vehicleData.temperature && vehicleData.temperature > 35) {
      insights.push({
        type: 'warning',
        category: 'temperature',
        message: 'High operating temperature',
        severity: 'medium'
      });
      recommendations.push({
        action: 'Allow cooling period',
        reason: 'High temperatures can affect battery performance',
        priority: 'medium'
      });
    }

    return {
      insights,
      recommendations,
      summary: this.generateSummary(insights, recommendations),
      timestamp: new Date()
    };
  }

  calculateUsageHours(vehicleData) {
    // Simulation - dans un vrai système, on calculerait depuis les données historiques
    return Math.floor(Math.random() * 24);
  }

  generateSummary(insights, recommendations) {
    if (insights.length === 0) {
      return 'All systems operating normally. No immediate concerns detected.';
    }

    const critical = insights.filter(i => i.severity === 'high').length;
    const warnings = insights.filter(i => i.severity === 'medium').length;

    if (critical > 0) {
      return `⚠️ ${critical} critical issue(s) detected requiring immediate attention. ${recommendations.length} recommendation(s) available.`;
    } else if (warnings > 0) {
      return `ℹ️ ${warnings} warning(s) detected. Review recommendations for optimal vehicle performance.`;
    } else {
      return 'System status: Normal. Minor optimizations available.';
    }
  }

  // Simule une conversation avec le chatbot
  async chat(message, context = {}) {
    // Ajouter le message à l'historique
    this.conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Simuler le traitement LLM
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    // Générer une réponse basée sur le contexte et l'analyse
    let response = '';

    // Analyse du message pour détecter l'intention
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('battery') || lowerMessage.includes('charge')) {
      if (context.vehicleData?.battery < 20) {
        response = `Your vehicle's battery is at ${context.vehicleData.battery}%, which is critically low. I recommend charging immediately to avoid potential shutdown. The optimal charging time would be during off-peak hours if possible.`;
      } else if (context.vehicleData?.battery < 50) {
        response = `Your battery is at ${context.vehicleData.battery}%. While not critical, I suggest planning a charging session soon. Based on your usage patterns, charging during the evening would be most efficient.`;
      } else {
        response = `Your battery is at ${context.vehicleData.battery}%, which is in a healthy range. Continue monitoring and charge when it drops below 30% for optimal battery longevity.`;
      }
    } else if (lowerMessage.includes('speed') || lowerMessage.includes('driving')) {
      if (context.vehicleData?.speed > 80) {
        response = `I notice your vehicle has been operating at higher speeds (${context.vehicleData.speed} km/h). While this is within legal limits, maintaining consistent high speeds can impact battery efficiency. Consider using eco-mode for better range.`;
      } else {
        response = `Your current speed is ${context.vehicleData?.speed || 0} km/h. Your driving patterns look efficient. Keep up the good work!`;
      }
    } else if (lowerMessage.includes('usage') || lowerMessage.includes('overuse') || lowerMessage.includes('sur-utilisation')) {
      const usageHours = this.calculateUsageHours(context.vehicleData);
      if (usageHours > 12) {
        response = `I've detected high usage patterns (approximately ${usageHours} hours today). Extended usage can impact battery health. I recommend: 1) Taking regular rest periods, 2) Using eco-mode when possible, 3) Scheduling maintenance checks more frequently. Would you like me to analyze your specific usage patterns in more detail?`;
      } else {
        response = `Your usage patterns are within normal ranges. Current daily usage: approximately ${usageHours} hours. No immediate concerns, but remember to allow the vehicle to rest between long trips.`;
      }
    } else if (lowerMessage.includes('help') || lowerMessage.includes('aide')) {
      response = `I'm here to help! I can analyze your vehicle data and provide insights on:
- Battery health and charging recommendations
- Driving patterns and efficiency tips
- Usage optimization
- Maintenance suggestions
- Performance analysis

What would you like to know more about?`;
    } else if (lowerMessage.includes('status') || lowerMessage.includes('état')) {
      const analysis = await this.analyzeData(context.userData, context.vehicleData);
      response = `Here's your vehicle status summary:\n\n${analysis.summary}\n\n${analysis.recommendations.length > 0 ? 'Key recommendations:\n' + analysis.recommendations.map(r => `• ${r.action}: ${r.reason}`).join('\n') : ''}`;
    } else {
      // Réponse générique avec analyse contextuelle
      const analysis = await this.analyzeData(context.userData, context.vehicleData);
      if (analysis.recommendations.length > 0) {
        response = `Based on your vehicle's current data, I've identified ${analysis.insights.length} insight(s). Here's my recommendation:\n\n${analysis.recommendations[0].action}: ${analysis.recommendations[0].reason}\n\nWould you like more detailed analysis?`;
      } else {
        response = `Your vehicle is operating normally. All systems are functioning as expected. Is there anything specific you'd like me to analyze or help you with?`;
      }
    }

    // Ajouter la réponse à l'historique
    this.conversationHistory.push({
      role: 'assistant',
      content: response,
      timestamp: new Date()
    });

    return {
      message: response,
      timestamp: new Date(),
      analysis: await this.analyzeData(context.userData, context.vehicleData)
    };
  }

  // Obtenir l'historique de conversation
  getHistory() {
    return this.conversationHistory;
  }

  // Réinitialiser l'historique
  clearHistory() {
    this.conversationHistory = [];
  }
}

export default new LLMService();
