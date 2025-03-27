import { User, Role, Permission } from "../../associations/associations.js";
import { Op } from "sequelize";
import sequelize from '../../../config/conexion-db.js'

class UserRepository {
  async getAll() {
    return await User.findAll({
      include: [{ model: Role, as: 'role' }]
    });
  }

  async getAllWithPagination({ limit, offset, sortBy, sortOrder, roles, isActive }) {
    const order = sortBy && sortOrder ? [[sortBy, sortOrder]] : [];
    const where = {};

    // Filtro por roles (múltiples valores con IN)
    if (roles && roles.length > 0) {
      where['$role.name$'] = { [Op.in]: roles };
    }

    // Filtro por is_active (solo se aplica si el parámetro es especificado)
    if (isActive !== undefined) {
      where.is_active = isActive;
    }

    const result = await User.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['name']
        }
      ],
      where,
      order,
    });
    return result;
  }

  async searchUsers({ limit, offset, searchTerm }) {
    const where = {};

    if (searchTerm) {
      const keywords = searchTerm.split(' ').map(keyword => `%${keyword}%`);

      where[Op.and] = keywords.map(keyword => ({
        [Op.or]: [
          { firstname: { [Op.iLike]: keyword } },
          { lastname: { [Op.iLike]: keyword } },
          { email: { [Op.iLike]: keyword } }
        ]
      }));
    }

    const result = await User.findAndCountAll({
      limit,
      offset,
      where,
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['name']
        }
      ]
    });

    return result;
  }

  async fetchUsers({ limit, offset, sortBy, sortOrder, roles, isActive, searchTerm }) {
    const order = sortBy && sortOrder ? [[sortBy, sortOrder]] : [];
    const where = {};

    // Filtros opcionales
    if (roles && roles.length > 0) {
      where['$role.name$'] = { [Op.in]: roles };
    }
    if (isActive !== undefined) {
      where.is_active = isActive;
    }

    // Lógica de búsqueda opcional
    if (searchTerm) {
      const keywords = searchTerm.split(' ').map(keyword => `%${keyword}%`);
      where[Op.and] = keywords.map(keyword => ({
        [Op.or]: [
          { firstname: { [Op.iLike]: keyword } },
          { lastname: { [Op.iLike]: keyword } },
          { email: { [Op.iLike]: keyword } }
        ]
      }));
    }

    // Consulta
    const result = await User.findAndCountAll({
      limit,
      offset,
      where,
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['name']
        }
      ],
      order,
    });

    return result;
  }

  async findUserWithRole(id) {
    return await User.findByPk(id, {
      include: [{ model: Role, as: 'role' }]
    });
  }

  async getById(id) {
    return await User.findByPk(
      id,
      {
        attributes: { 
          exclude: [
            'role_id',
            'password',
            'updated_at'
          ] 
        },
        include: [
          { 
            model: Role, 
            as: 'role', 
            attributes: ['name'] 
          }
        ]
      }
    );
  }

  async getByFirstName(firstname) {
    return await User.findOne({ where: { firstname } });
  }

  async getByEmail(email) {
    return await User.findOne({
      where: { email },
      include: [{
        model: Role,
        as: 'role',
        attributes: ['name'],
        include: [{
          model: Permission,
          as: 'permissions',
          attributes: ['id', 'code', 'name']
        }]
      }]
    });
  }

  async create(user, options) {
    return await User.create(user, options);
  }

  async update(id, userData, transaction) {
    // Filtrar solo los campos permitidos para actualización
    const allowedFields = ['firstname', 'lastname', 'email', 'role_id', 'is_active'];
    const updatedFields = Object.keys(userData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = userData[key];
        return obj;
      }, {});

      updatedFields.updated_at = new Date();
    const [affectedRows] = await User.update(updatedFields, { where: { id }, transaction });
    return affectedRows > 0;
  }

  async delete(id, options = {}) {
    return await User.destroy({ where: { id }, ...options });
  }

  async getUsersCountByRole() {
    return await Role.findAll({
      attributes: [
        'name',
        [sequelize.fn('COUNT', sequelize.col('users.id')), 'userCount']
      ],
      include: [{ model: User, as: 'users', attributes: [] }],
      group: ['Role.id']
    });
  }

  async getUsersCountByStatus() {
    const statuses = await User.findAll({
      attributes: [
        'is_active',
        [sequelize.fn('COUNT', sequelize.col('id')), 'userCount']
      ],
      group: ['is_active']
    });

    // Convierte a un formato estándar y añade valores faltantes
    const statusMap = { true: 0, false: 0 };
    statuses.forEach((status) => {
      statusMap[status.dataValues.is_active] = parseInt(status.dataValues.userCount, 10);
    });

    return [
      { is_active: true, userCount: statusMap[true] },
      { is_active: false, userCount: statusMap[false] }
    ];
  }
}

export default new UserRepository();