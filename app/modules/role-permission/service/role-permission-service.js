import RolePermissionRepository from '../repository/role-permission-repository.js'

class RolePermissionService {
  async getAllRolePermission(){
    return await RolePermissionRepository.findAll();
  }
}

export default new RolePermissionService();