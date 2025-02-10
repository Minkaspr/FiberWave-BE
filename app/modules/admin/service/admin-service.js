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

  async getAdminById(id) {
    return await AdminRepository.findAdminById(id);
  }

  async getAllAdmins() {
    return await AdminRepository.findAllAdmins();
  }
}

export default new AdminService();