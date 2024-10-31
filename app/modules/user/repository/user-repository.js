import { User } from '../entity/user.js';

class UserRepository {
  async getAll() {
    return await User.findAll();
  }

  async getById(id) {
    return await User.findByPk(id);
  }

  async getByName(name) {
    return await User.findOne({ where: { name } });
  }

  async getByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async create(user) {
    return await User.create(user);
  }

  async update(id, user) {
    return await User.update(user, { where: { id } });
  }

  async delete(id) {
    return await User.destroy({ where: { id } });
  }
}

export default new UserRepository();