//import { Permission } from "../entity/permission";
import { Permission } from '../../associations/associations.js'

class PermissionRepository {
  async findAll() { 
    return await Permission.findAll(); 
  } 
  
  async findById(id) { 
    return await Permission.findByPk(id); 
  }
}

export default new PermissionRepository();