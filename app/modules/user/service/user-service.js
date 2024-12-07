import { hashPassword, comparePassword } from '../helper/bcrypt-helper.js';
import { UniqueConstraintError } from '../helper/unique-constraint-error.js';
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

  /*  async createUser(user) {
     const existingUser = await UserRepository.getByEmail(user.email);
     if (existingUser) {
       throw new UniqueConstraintError('email');
     }
 
     const hashedPassword = await hashPassword(user.password);
 
     const role = await RoleRepository.findById(user.role_id);
     if (!role) {
       throw new Error('El rol especificado no existe');
     }
 
     const newUser = await UserRepository.create({
       ...user,
       password: hashedPassword
     });
     const { id: userId } = newUser;
 
     switch (role.name) {
       case 'customer':
         await CustomerService.createCustomerData({ ...userData, user_id: userId });
         break;
       case 'seller':
         await SellerService.createSellerData({ ...userData, user_id: userId });
         break;
       case 'admin':
         await AdminService.createAdminData({ ...userData, user_id: userId });
         break;
       default:
         throw new Error('Rol no soportado');
     }
 
     return newUser;
   }
  */

  async createUser(userData) {
    const transaction = await sequelize.transaction(); // Inicia la transacción
    try {
      // Verifica si el usuario ya existe
      const existingUser = await UserRepository.getByEmail(userData.email);
      if (existingUser) {
        throw new UniqueConstraintError('email');
      }

      // Hash de la contraseña
      const hashedPassword = await hashPassword(userData.password);
      const newUser = await UserRepository.create({
        ...userData,
        password: hashedPassword,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { transaction });

      console.log(new Date().toISOString());

      const userId = newUser.id;

      const role = await RoleRepository.findById(userData.role_id);
      if (!role) {
        throw new Error('El rol especificado no existe');
      }

      // Inserta en la tabla correspondiente según el rol
      switch (role.name) {
        case 'customer':
          await CustomerService.createCustomer({ ...userData, user_id: userId }, transaction);
          break;
        case 'seller':
          await SellerService.createSeller({ ...userData, user_id: userId }, transaction);
          break;
        case 'admin':
          await AdminService.createAdmin({ ...userData, user_id: userId }, transaction);
          break;
        default:
          throw new Error('Rol de usuario no válido');
      }

      await transaction.commit(); // Confirma la transacción
      return newUser;
    } catch (error) {
      await transaction.rollback(); // Revierte todos los cambios si ocurre un error
      throw new Error(`Error al crear el usuario: ${error.message}`);
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
