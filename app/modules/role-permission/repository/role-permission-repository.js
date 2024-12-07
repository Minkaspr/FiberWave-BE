/* import { RolePermission } from "../entity/role-permission.js";
import { Permission } from "../../permission/entity/permission.js"; */

import { RolePermission, Permission } from '../../associations/associations.js'

class RolePermissionRepository {
  async findPermissionsByRoleId(roleId) {
    return await RolePermission.findAll({
      where: { role_id: roleId },
      include: [Permission]
    });
  }
  async findAll(){
    return await RolePermission.findAll(); 
  }
}

export default new RolePermissionRepository();