import { Customer } from '../../associations/associations.js'

class CustomerRepository {
  async createCustomer(customerData, options) {
    return await Customer.create(customerData, options);
  }

  async findCustomerById(id) {
    return await Customer.findByPk(id);
  }

  async findAllCustomers() {
    return await Customer.findAll();
  }
}

export default new CustomerRepository();
