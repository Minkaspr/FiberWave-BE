import { hashPassword, comparePassword } from '../helper/bcrypt-helper.js';
import UserRepository from '../repository/user-repository.js';

class UserService {
  async getAllUsers() {
    return await UserRepository.getAll();
  }

  async getUserById(id) {
    return await UserRepository.getById(id);
  }

  async getUserByName(name) {
    return await UserRepository.getByName(name);
  }

  async createUser(user) {
    const existingUser = await UserRepository.getByEmail(user.email);
    if (existingUser) {
      throw new Error('El correo electrónico ya está en uso');
    }

    const hashedPassword = await hashPassword(user.password);
    const newUser = await UserRepository.create({
      ...user,
      password: hashedPassword
    });

    return newUser;
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
    const { password, ...profileData } = userData; // Excluir la contraseña de los datos a actualizar
    return await UserRepository.update(id, profileData);
  }

  async deleteUser(id) {
    return await UserRepository.delete(id);
  }
}

export default new UserService();
