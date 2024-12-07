import { Admin } from '../../associations/associations.js'

class AdminRepository {
  async createAdmin(adminData) {
    return await Admin.create(adminData);
  }

  async findAdminById(id) {
    return await Admin.findByPk(id);
  }

  async findAllAdmins() {
    return await Admin.findAll();
  }
}

export default new AdminRepository();