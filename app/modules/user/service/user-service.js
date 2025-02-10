import { hashPassword, comparePassword } from '../helper/bcrypt-helper.js';
import { UniqueConstraintError, NotFoundError } from '../../../middleware/custom-errors-handler.js';
import UserRepository from '../repository/user-repository.js';
import RoleRepository from '../../role/repository/role-repository.js';
import CustomerService from '../../customer/service/customer-service.js';
import SellerService from '../../seller/service/seller-service.js';
import AdminService from '../../admin/service/admin-service.js';
import UserSelDTO from '../entity/user-sel-dto.js';
import sequelize from '../../../config/conexion-db.js'

class UserService {
  async getAllUsers({ page, size, sortBy, sortOrder, roles, isActive }) {
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;
    
    const { rows, count } = await UserRepository.getAllWithPagination({ 
      limit, 
      offset,
      sortBy,
      sortOrder,
      roles,
      isActive 
    });
    
    return {
      users: rows.map(user => new UserSelDTO(user)),
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    };
  }

  async searchUsers({ page, size, searchTerm }) {
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;
  
    const { rows, count } = await UserRepository.searchUsers({
      limit,
      offset,
      searchTerm
    });
  
    return {
      users: rows.map(user => new UserSelDTO(user)),
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    };
  }

  async fetchUsers({ currentPage, pageSize, sortBy, sortOrder, roles, isActive, searchTerm }) {
    const limit = parseInt(pageSize, 10);
    const offset = (parseInt(currentPage, 10) - 1) * limit;

    // Delegamos al método fetchUsers del repositorio
    const { rows, count } = await UserRepository.fetchUsers({
      limit,
      offset,
      sortBy,
      sortOrder,
      roles,
      isActive,
      searchTerm,
    });

    // Mapeamos los resultados y construimos la respuesta
    return {
      users: rows.map(user => new UserSelDTO(user)),
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(currentPage, 10),
    };
  }

  async getUserById(id) {
    const user = await UserRepository.getById(id);
    if (!user) { throw new Error('Usuario no encontrado'); }
    return this._formatUser(user);
  }

  async getUserByFirstName(firstname) {
    return await UserRepository.getByFirstName(firstname);
  }

  async createUser(userData, roleData) {
    const transaction = await sequelize.transaction();
    try {
      let errors = [];

      const existingUser = await UserRepository.getByEmail(userData.email);
      if (existingUser) {
        errors.push(new UniqueConstraintError('email'));
      }
  
      const role = await RoleRepository.findByName(userData.role);
      if (!role) {
        errors.push(new NotFoundError('Rol', 'role', userData.role));
      }
  
      if (errors.length > 0) {
        throw errors;
      }

      const hashedPassword = await hashPassword(userData.password);
      const newUser = await UserRepository.create(
        { ...userData, password: hashedPassword, role_id: role.id },
        { transaction }
      );
  
      const userId = newUser.id;
      try {
        switch (role.name) {
          case 'customer':
            await CustomerService.createCustomer({ ...roleData, user_id: userId }, transaction);
            break;
    
          case 'seller':
            await SellerService.createSeller({ ...roleData, user_id: userId }, transaction);
            break;
    
          case 'admin':
            await AdminService.createAdmin({ ...roleData, user_id: userId }, transaction);
            break;
    
          default:
            throw new Error('Rol de usuario no válido');
        }
      } catch (error) {
        if (error instanceof UniqueConstraintError) {
          errors.push(error);
          throw errors;
        } else {
          throw new Error(`Error al crear el rol: ${roleName} - ${error.message}`);
        }
      }
      
      await transaction.commit();
      return newUser;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateUser(id, user) {
    if (user.password) {
      user.password = await hashPassword(user.password);
    }
    return await UserRepository.update(id, user);
  }

  async updatePassword(id, oldPassword, newPassword) {
    const user = await UserRepository.getById(id);
    if (!user || !(await comparePassword(oldPassword, user.password))) {
      throw new Error('Contraseña antigua inválida');
    }

    const hashedNewPassword = await hashPassword(newPassword);
    await UserRepository.update(id, { password: hashedNewPassword });
  }

  async updateProfile(id, userData) {
    const { password, ...profileData } = userData;
    return await UserRepository.update(id, profileData);
  }

  async deleteUser(id) {
    return await UserRepository.delete(id);
  }

  async getFilterOptions() {
    const roles = await UserRepository.getUsersCountByRole();
    const statuses = await UserRepository.getUsersCountByStatus();
    return { roles, statuses };
  }
  
  _formatUser(user) {
    return {
      ...user.get(),
      role: user.role.name
    };
  }
}

export default new UserService();
