class MomoService {
  constructor() {
    this.transactions = new Map();
    this.supportedOperators = [
      { id: 'mtn', name: 'MTN Mobile Money', code: '*170#', countries: ['Benin', 'Nigeria', 'Ghana'] },
      { id: 'moov', name: 'Moov Money', code: '*155#', countries: ['Benin', 'Ivory Coast'] },
      { id: 'orange', name: 'Orange Money', code: '*144#', countries: ['Senegal', 'Ivory Coast'] },
      { id: 'airtel', name: 'Airtel Money', code: '*432#', countries: ['Nigeria', 'Kenya'] },
      { id: 'mpesa', name: 'M-Pesa', code: '*234#', countries: ['Kenya', 'South Africa'] }
    ];
  }

  getSupportedOperators(country = null) {
    if (!country) {
      return this.supportedOperators;
    }
    return this.supportedOperators.filter(op => 
      op.countries.includes(country)
    );
  }

  async initiatePayment(paymentData) {
    const { phoneNumber, amount, operator, description } = paymentData;

    // Validation
    if (!phoneNumber || !amount || !operator) {
      throw new Error('Missing required payment information');
    }

    // Valider le numéro de téléphone
    if (!this.validatePhoneNumber(phoneNumber)) {
      throw new Error('Invalid phone number format. Use format: +229XXXXXXXX');
    }

    // Valider le montant
    if (amount < 100) {
      throw new Error('Minimum payment amount is 100 XOF');
    }

    if (amount > 1000000) {
      throw new Error('Maximum payment amount is 1,000,000 XOF');
    }

    // Créer la transaction
    const transactionId = `MOMO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const transaction = {
      id: transactionId,
      phoneNumber,
      amount,
      operator,
      description,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    };

    this.transactions.set(transactionId, transaction);

    // Simuler l'envoi de la requête push
    setTimeout(() => {
      this.simulateUserResponse(transactionId);
    }, 3000);

    return transaction;
  }

  simulateUserResponse(transactionId) {
    const transaction = this.transactions.get(transactionId);
    
    if (!transaction || transaction.status !== 'pending') {
      return;
    }

    // 80% de chance de succès, 20% d'échec
    const success = Math.random() > 0.2;

    if (success) {
      transaction.status = 'completed';
      transaction.completedAt = new Date();
      transaction.reference = `REF-${Math.random().toString(36).substr(2, 12).toUpperCase()}`;
    } else {
      // Simuler différents types d'erreurs
      const errors = [
        { code: 'INSUFFICIENT_FUNDS', message: 'Insufficient balance in your Mobile Money account' },
        { code: 'USER_CANCELLED', message: 'Payment cancelled by user' },
        { code: 'TIMEOUT', message: 'Payment request timed out' },
        { code: 'INVALID_PIN', message: 'Invalid PIN entered' },
        { code: 'DAILY_LIMIT', message: 'Daily transaction limit exceeded' }
      ];

      const error = errors[Math.floor(Math.random() * errors.length)];
      transaction.status = 'failed';
      transaction.failedAt = new Date();
      transaction.error = error;
    }

    this.transactions.set(transactionId, transaction);
  }

  async checkTransactionStatus(transactionId) {
    const transaction = this.transactions.get(transactionId);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Vérifier l'expiration
    if (transaction.status === 'pending' && new Date() > transaction.expiresAt) {
      transaction.status = 'expired';
      transaction.expiredAt = new Date();
      this.transactions.set(transactionId, transaction);
    }

    return transaction;
  }

  async cancelTransaction(transactionId) {
    const transaction = this.transactions.get(transactionId);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== 'pending') {
      throw new Error(`Cannot cancel transaction with status: ${transaction.status}`);
    }

    transaction.status = 'cancelled';
    transaction.cancelledAt = new Date();
    this.transactions.set(transactionId, transaction);

    return transaction;
  }

  validatePhoneNumber(phoneNumber) {
    // Format attendu: +229XXXXXXXX (Benin), +234XXXXXXXXXX (Nigeria), etc.
    const phoneRegex = /^\+[0-9]{10,15}$/;
    return phoneRegex.test(phoneNumber);
  }

  formatAmount(amount) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  }

  getTransactionHistory(limit = 50) {
    return Array.from(this.transactions.values())
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  }

  getStats() {
    const transactions = Array.from(this.transactions.values());
    
    return {
      total: transactions.length,
      completed: transactions.filter(t => t.status === 'completed').length,
      pending: transactions.filter(t => t.status === 'pending').length,
      failed: transactions.filter(t => t.status === 'failed').length,
      totalAmount: transactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0)
    };
  }
}

export default new MomoService();
