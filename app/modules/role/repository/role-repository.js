import { Role } from '../../associations/associations.js'

class RoleRepository {
  async findByName(name) {
    return await Role.findOne({ where: { name } });
  }

  async findAll() { 
    return await Role.findAll(); 
  } 
  
  async findById(id) { 
    return await Role.findByPk(id); 
  }

  // Método para obtener un rol específico con sus permisos
  async findRoleWithPermissions(id) {
    return await Role.findByPk(id, {
      include: [
        {
          association: 'permissions',
          through: { attributes: [] }, // Excluye atributos de RolePermission
        },
      ],
    });
  }

  // Método para obtener todos los roles junto con sus permisos
  async findAllRolesWithPermissions() {
    return await Role.findAll({
      include: [{ association: 'permissions', attributes: ['id', 'code', 'name'] }]
    });
  }
}

export default new RoleRepository();