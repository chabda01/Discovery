class AdminService {
  constructor() {
    this.admins = [
      {
        id: 1,
        name: 'Kwame Mensah',
        email: 'admin@gmail.com',
        role: 'admin',
        country: 'Ghana',
        status: 'active',
        createdAt: new Date('2024-01-15'),
        lastLogin: new Date(),
        permissions: ['fleet', 'fota', 'features']
      }
    ];
  }

  getAdmins() {
    return this.admins;
  }

  getAdminById(id) {
    return this.admins.find(a => a.id === id);
  }

  createAdmin(adminData) {
    const newAdmin = {
      id: this.admins.length + 1,
      ...adminData,
      status: 'active',
      createdAt: new Date(),
      lastLogin: null
    };

    this.admins.push(newAdmin);
    return newAdmin;
  }

  updateAdmin(id, updates) {
    const admin = this.admins.find(a => a.id === id);
    if (!admin) {
      throw new Error('Admin not found');
    }

    Object.assign(admin, updates);
    return admin;
  }

  deleteAdmin(id) {
    const index = this.admins.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Admin not found');
    }

    this.admins.splice(index, 1);
    return true;
  }

  toggleStatus(id) {
    const admin = this.admins.find(a => a.id === id);
    if (!admin) {
      throw new Error('Admin not found');
    }

    admin.status = admin.status === 'active' ? 'suspended' : 'active';
    return admin;
  }

  getStats() {
    return {
      total: this.admins.length,
      active: this.admins.filter(a => a.status === 'active').length,
      suspended: this.admins.filter(a => a.status === 'suspended').length,
      byCountry: this.admins.reduce((acc, admin) => {
        acc[admin.country] = (acc[admin.country] || 0) + 1;
        return acc;
      }, {})
    };
  }
}

export default new AdminService();
