import CustomerRepository from '../repository/customer-repository.js';

class CustomerService {
  async createCustomer(customerData, transaction) {
    return await CustomerRepository.createCustomer(customerData, {transaction});
  }

  async updateCustomer(customerData, transaction) {
    // Extraer `user_id` antes de filtrar los datos
    const userId = customerData.user_id;
    const { id, user_id, created_at, ...filteredData } = customerData;

    return await CustomerRepository.updateCustomer(userId, { ...filteredData, updated_at: new Date() }, { transaction });
  }

  async getCustomerById(id) {
    return await CustomerRepository.findCustomerById(id);
  }

  async getCustomerByUserId(userId) {
    return await CustomerRepository.findCustomerByUserId(userId);
  }

  async getAllCustomers() {
    return await CustomerRepository.findAllCustomers();
  }

  async deleteCustomerByUserId(userId, options = {}) {
    return await CustomerRepository.deleteCustomerByUserId(userId, options);
  }
}

export default new CustomerService();