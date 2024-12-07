import RoleRepository from "../repository/role-repository.js";

class RoleService {

  async getAllRole(){
    return await RoleRepository.findAll();
  }

  async getRoleById(id){
    return await RoleRepository.findById(id);
  }

  async getRoleByName(name){
    return await RoleRepository.findByName(name);
  }

  // Método para obtener un rol específico con sus permisos
  async getRoleWithPermissions(id) {
    return await RoleRepository.findRoleWithPermissions(id);
  }

  // Método para obtener todos los roles con sus permisos
  async getAllRolesWithPermissions() {
    return await RoleRepository.findAllRolesWithPermissions();
  }
}

export default new RoleService();