class LogService {
  constructor() {
    this.logs = this.generateSampleLogs();
  }

  generateSampleLogs() {
    const types = ['info', 'warning', 'error', 'success'];
    const actions = [
      'User login',
      'Admin created',
      'Vehicle added',
      'FOTA update deployed',
      'Feature activated',
      'Payment processed',
      'System backup',
      'Configuration changed',
      'Database query',
      'API request'
    ];

    const logs = [];
    for (let i = 0; i < 100; i++) {
      logs.push({
        id: i + 1,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        type: types[Math.floor(Math.random() * types.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        user: `User ${Math.floor(Math.random() * 10) + 1}`,
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        details: `Sample log entry ${i + 1}`,
        status: Math.random() > 0.2 ? 'success' : 'failed'
      });
    }

    return logs.sort((a, b) => b.timestamp - a.timestamp);
  }

  getLogs(filters = {}) {
    let filtered = [...this.logs];

    if (filters.type) {
      filtered = filtered.filter(log => log.type === filters.type);
    }

    if (filters.status) {
      filtered = filtered.filter(log => log.status === filters.status);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(search) ||
        log.user.toLowerCase().includes(search) ||
        log.details.toLowerCase().includes(search)
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(log => log.timestamp >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filtered = filtered.filter(log => log.timestamp <= new Date(filters.dateTo));
    }

    return filtered;
  }

  getStats() {
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentLogs = this.logs.filter(log => log.timestamp >= last24h);

    return {
      total: this.logs.length,
      last24h: recentLogs.length,
      byType: {
        info: this.logs.filter(l => l.type === 'info').length,
        warning: this.logs.filter(l => l.type === 'warning').length,
        error: this.logs.filter(l => l.type === 'error').length,
        success: this.logs.filter(l => l.type === 'success').length
      },
      errors: this.logs.filter(l => l.status === 'failed').length
    };
  }

  addLog(logData) {
    const newLog = {
      id: this.logs.length + 1,
      timestamp: new Date(),
      ...logData
    };

    this.logs.unshift(newLog);
    return newLog;
  }

  clearOldLogs(days = 30) {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    this.logs = this.logs.filter(log => log.timestamp >= cutoffDate);
    return this.logs.length;
  }
}

export default new LogService();
