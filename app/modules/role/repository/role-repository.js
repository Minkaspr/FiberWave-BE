import { Role } from '../entity/role.js';

class RoleRepository {
  async getByEmail(email) {
    return await Role.findOne({ where: { email } });
  }
}