import AdminRepository from "../repository/admin-repository.js";

class AdminService {
  async createAdmin(adminData) {
    return await AdminRepository.createAdmin(adminData);
  }

  async getAdminById(id) {
    return await AdminRepository.findAdminById(id);
  }

  async getAllAdmins() {
    return await AdminRepository.findAllAdmins();
  }
}

export default new AdminService();