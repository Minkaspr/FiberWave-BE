import AdminRepository from "../repository/admin-repository.js";
import { UniqueConstraintError } from "../../../middleware/custom-errors-handler.js";

class AdminService {
  async createAdmin(adminData, transaction) {
    const existingAdmin = await AdminRepository.findAdminByIdentityDocument(adminData.identity_document);
    if (existingAdmin) {
      throw new UniqueConstraintError('identity_document');
    }
    return await AdminRepository.createAdmin(adminData, {transaction});
  }

  async updateAdmin(adminData, transaction) {
    if (adminData.identity_document) {
        const existingAdmin = await AdminRepository.findAdminByIdentityDocument(adminData.identity_document);

        if (existingAdmin && Number(existingAdmin.user_id) !== Number(adminData.user_id)) {
            throw new UniqueConstraintError('identity_document');
        }
    }

    // Guardamos `user_id` antes de desestructurar
    const userId = adminData.user_id;
    const { id, user_id, created_at, ...filteredData } = adminData;

    return await AdminRepository.updateAdmin(userId, { ...filteredData, updated_at: new Date() }, { transaction });
  }

  async getAdminById(id) {
    return await AdminRepository.findAdminById(id);
  }

  async getAdminByUserId(user_id) {
    return await AdminRepository.findAdminByUserId(user_id);
  }

  async getAllAdmins() {
    return await AdminRepository.findAllAdmins();
  }

  async deleteAdminByUserId(user_id, options = {}) {
    return await AdminRepository.deleteAdminByUserId(user_id, options);
  }
}

export default new AdminService();