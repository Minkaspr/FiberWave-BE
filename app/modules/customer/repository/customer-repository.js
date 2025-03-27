import { Customer } from '../../associations/associations.js'

class CustomerRepository {
  async createCustomer(customerData, options) {
    return await Customer.create(customerData, options);
  }

  async updateCustomer(userId, updateData, options) {
    const [affectedRows] = await Customer.update(updateData, {
        where: { user_id: userId },
        ...options
    });

    return affectedRows > 0;
  }

  async findCustomerById(id) {
    return await Customer.findByPk(id);
  }

  async findCustomerByUserId(userId) {
    return await Customer.findOne(
      { 
        where: { user_id: userId },
        attributes: {
          exclude: ['id', 'user_id', 'created_at', 'updated_at']
        }
      }
    );
  }

  async findAllCustomers() {
    return await Customer.findAll();
  }

  async deleteCustomerByUserId(userId, options = {}) {
    return await Customer.destroy({ where: { user_id: userId }, ...options });
  }
}

export default new CustomerRepository();
