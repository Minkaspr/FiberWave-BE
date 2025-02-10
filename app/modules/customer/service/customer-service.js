import CustomerRepository from '../repository/customer-repository.js';

class CustomerService {
  async createCustomer(customerData, transaction) {
    return await CustomerRepository.createCustomer(customerData, {transaction});
  }

  async getCustomerById(id) {
    return await CustomerRepository.findCustomerById(id);
  }

  async getAllCustomers() {
    return await CustomerRepository.findAllCustomers();
  }
}

export default new CustomerService();