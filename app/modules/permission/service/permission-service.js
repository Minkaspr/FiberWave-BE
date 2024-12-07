import PermissionRepository from "../repository/permission-repository.js";

class PermissionService {
  async getAllPermisssions(){
    return await PermissionRepository.findAll();
  }

  async getPermissionById(id){
    return await PermissionRepository.findById(id);
  }
}

export default new PermissionService();