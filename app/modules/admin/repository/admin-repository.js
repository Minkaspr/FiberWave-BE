import { Admin } from '../../associations/associations.js'

class AdminRepository {
  async createAdmin(adminData, options) {
    return await Admin.create(adminData, options);
  }

  async findAdminById(id) {
    return await Admin.findByPk(id);
  }

  async findAdminByIdentityDocument(identity_document) {
    return await Admin.findOne({ where: { identity_document } });
  }

  async findAllAdmins() {
    return await Admin.findAll();
  }
}

export default new AdminRepository();