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
    
    if (!user) { 
      throw new Error('Usuario no encontrado'); 
    }

    const role = user.role.name;
    let roleDetails = null;

    switch (role) {
      case 'admin':
        // Buscamos en la tabla Admin
        roleDetails = await AdminService.getAdminByUserId(user.id);
        if (!roleDetails) {
          throw new Error('Datos de Admin no encontrados. Verifica la consistencia de los datos.');
        }
      break;

      case 'seller':
        // Buscamos en la tabla Seller
        roleDetails = await SellerService.getSellerByUserId(user.id);
        if (!roleDetails) {
          throw new Error('Datos de Seller no encontrados. Verifica la consistencia de los datos.');
        }
        break;

      case 'customer':
        // Buscamos en la tabla Customer
        roleDetails = await CustomerService.getCustomerByUserId(user.id);
        // En el caso de Customer, es válido que no haya datos, por lo que no lanzamos un error
        break;

      default:
        throw new Error('Rol desconocido');
    }

    const userData = {
      ...user.toJSON(), // Convertimos a un objeto plano
      role // Agregamos el rol como propiedad directa
    };
  
    // Construir y devolver el resultado con userData y roleData
    return {
      userData,  // Objeto enriquecido del usuario
      roleData: roleDetails ? roleDetails.toJSON ? roleDetails.toJSON() : roleDetails : null // Opcional
    };
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

  async updateUserStatus(id, isActive) {
    return await UserRepository.update(id, { is_active: isActive });
  }

  /* async updateUser(id, userData, roleData) {
    const transaction = await sequelize.transaction();
    try {
        // Verificar si el usuario existe
        const existingUser = await UserRepository.getById(id);
        if (!existingUser) {
            throw new NotFoundError('Usuario', 'id', id);
        }

        // Validar email duplicado
        if (userData.email && userData.email !== existingUser.email) {
            const existingEmailUser = await UserRepository.getByEmail(userData.email);
            if (existingEmailUser) {
                throw new UniqueConstraintError('email');
            }
        }

        // Determinar el rol
        const roleName = userData.role || existingUser.role;
        const role = await RoleRepository.findByName(roleName);
        if (!role) {
            throw new NotFoundError('Rol', 'role', roleName);
        }

        // Preparar datos actualizados
        const updatedUserData = {
            ...existingUser,
            ...userData,
            role_id: role.id
        };

        // Actualizar usuario
        const userUpdated = await UserRepository.update(id, updatedUserData, transaction);

        // Actualizar datos según el rol
        let roleUpdated = false;
        switch (role.name) {
            case 'customer':
                roleUpdated = await CustomerService.updateCustomer({ ...roleData, user_id: id }, transaction);
                break;
            case 'seller':
                roleUpdated = await SellerService.updateSeller({ ...roleData, user_id: id }, transaction);
                break;
            case 'admin':
                roleUpdated = await AdminService.updateAdmin({ ...roleData, user_id: id }, transaction);
                break;
            default:
                throw new Error('Rol de usuario no válido');
        }

        await transaction.commit();
        return userUpdated && roleUpdated;

    } catch (error) {
        await transaction.rollback();
        throw error; // 🔥 Propaga el error tal cual, sin modificarlo
    }
  } */

    async updateUser(id, userData, roleData) {
      const transaction = await sequelize.transaction();
      try {
          let errors = [];
  
          // 1️⃣ Verificar si el usuario existe
          const existingUser = await UserRepository.getById(id);
          if (!existingUser) {
              throw [new NotFoundError('Usuario', 'id', id)];
          }
          console.log("DEBUG: Usuario encontrado:", existingUser);

          // 2️⃣ Validar email duplicado
          if (userData.email && userData.email !== existingUser.email) {
              const existingEmailUser = await UserRepository.getByEmail(userData.email);
              if (existingEmailUser) {
                  errors.push(new UniqueConstraintError('email'));
              }
          }
  
          // 3️⃣ Determinar el nuevo rol
          const newRoleName = userData.role;
          const oldRoleName = existingUser.role.name; 

          const role = await RoleRepository.findByName(newRoleName);
          if (!role) {
              errors.push(new NotFoundError('Rol', 'role', newRoleName));
          }
  
          // 4️⃣ Si hay errores acumulados, detener ejecución
          if (errors.length > 0) {
              throw errors;
          }
  
          // 5️⃣ Manejar cambio de rol
          let roleUpdated = false;
  
          if (oldRoleName !== newRoleName) {
              console.log(`DEBUG: Cambio de rol detectado -> De '${oldRoleName}' a '${newRoleName}'`);
  
              let roleCreated = false;
  
              // 5.1 CREAR en la nueva tabla antes de eliminar
              switch (newRoleName) {
                  case 'customer':
                      roleCreated = await CustomerService.createCustomer({ ...roleData, user_id: id }, transaction);
                      break;
                  case 'seller':
                      roleCreated = await SellerService.createSeller({ ...roleData, user_id: id }, transaction);
                      break;
                  case 'admin':
                      roleCreated = await AdminService.createAdmin({ ...roleData, user_id: id }, transaction);
                      break;
              }
  
              if (!roleCreated) {
                  throw new Error(`Error al cambiar de rol a ${newRoleName}`);
              }
  
              // 5.2 ELIMINAR de la tabla anterior y validar si se eliminó correctamente
              let roleDeleted = false;
              switch (oldRoleName) {
                  case 'customer':
                      roleDeleted = await CustomerService.deleteCustomerByUserId(id, transaction);
                      break;
                  case 'seller':
                      roleDeleted = await SellerService.deleteSellerByUserId(id, transaction);
                      break;
                  case 'admin':
                      roleDeleted = await AdminService.deleteAdminByUserId(id, transaction);
                      break;
              }

              // 🔹 Ahora verificamos si al menos una fila fue eliminada
              if (typeof roleDeleted !== "number") {
                  console.log("DEBUG: Respuesta inesperada en eliminación de rol:", roleDeleted);
                  throw new Error(`Error inesperado al eliminar el rol anterior: ${JSON.stringify(roleDeleted)}`);
              }

              if (roleDeleted === 0) {
                  throw new Error(`No se encontró el rol anterior (${oldRoleName}) para eliminar.`);
              }

              console.log("DEBUG: Rol eliminado correctamente:", oldRoleName);

              roleUpdated = true; // ✅ Se considera actualizado porque se creó correctamente
          }
  
          // 6️⃣ Preparar datos actualizados para el usuario
          const updatedUserData = {
              ...existingUser,
              ...userData,
              role_id: role.id
          };
  
          // 7️⃣ Actualizar usuario
          const userUpdated = await UserRepository.update(id, updatedUserData, transaction);
          console.log("DEBUG: Usuario actualizado:", userUpdated);
  
          // 8️⃣ Si el rol NO cambió, actualizar datos en la tabla del rol
          if (oldRoleName === newRoleName) {
              try {
                  switch (newRoleName) {
                      case 'customer':
                          roleUpdated = await CustomerService.updateCustomer({ ...roleData, user_id: id }, transaction);
                          break;
                      case 'seller':
                          roleUpdated = await SellerService.updateSeller({ ...roleData, user_id: id }, transaction);
                          break;
                      case 'admin':
                          roleUpdated = await AdminService.updateAdmin({ ...roleData, user_id: id }, transaction);
                          break;
                      default:
                          throw new Error('Rol de usuario no válido');
                  }
                  console.log("DEBUG: Rol actualizado correctamente.");
              } catch (error) {
                  if (error instanceof UniqueConstraintError) {
                      errors.push(error);
                      throw errors;
                  } else {
                      throw new Error(`Error al actualizar el rol: ${newRoleName} - ${error.message}`);
                  }
              }
          } else {
              console.log("DEBUG: No se necesita actualizar el rol, solo se creó y eliminó el anterior.");
          }
  
          // 9️⃣ Confirmar transacción
          await transaction.commit();
          return userUpdated && roleUpdated;
  
      } catch (error) {
          await transaction.rollback();
          throw error;
      }
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
    const transaction = await sequelize.transaction();
    try {
      const user = await UserRepository.findUserWithRole(id);
      if (!user) {
        throw new NotFoundError('Usuario', 'id', id);
      }

      switch (user.role.name) {
        case 'customer':
          await CustomerService.deleteCustomerByUserId(user.id, {transaction});
          break;
        case 'seller':
          await SellerService.deleteSellerByUserId(id, {transaction});
          break;
  
        case 'admin':
          await AdminService.deleteAdminByUserId(id, {transaction});
          break;
  
        default:
          throw new Error(`Rol desconocido: ${roleName}`);
      }

      const wasDeleted = await UserRepository.delete(id, {transaction});
      if(!wasDeleted) {
        throw new NotFoundError('Usuario', 'id', id);
      }

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
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
