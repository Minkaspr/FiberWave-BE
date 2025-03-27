import { Admin } from '../../associations/associations.js'

class AdminRepository {
  async createAdmin(adminData, options) {
    return await Admin.create(adminData, options);
  }

  async updateAdmin(userId, updateData, options) {
    const [affectedRows] = await Admin.update(updateData, {
        where: { user_id: userId },
        ...options
    });

    return affectedRows > 0;
  }

  async findAdminById(id) {
    return await Admin.findByPk(id);
  }

  async findAdminByUserId(user_id) {
    return await Admin.findOne(
      { 
        where: { user_id },
        attributes: {
          exclude: ['id', 'user_id', 'created_at', 'updated_at']
        } 
      }
    );
  }

  async findAdminByIdentityDocument(identity_document) {
    return await Admin.findOne({ where: { identity_document } });
  }

  async findAllAdmins() {
    return await Admin.findAll();
  }

  async deleteAdminByUserId(user_id, options = {}) {
    return await Admin.destroy({ where: { user_id }, ...options });
  }
}

export default new AdminRepository();