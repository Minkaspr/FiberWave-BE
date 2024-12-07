import { Customer } from '../../associations/associations.js'

class CustomerRepository {
  async createCustomer(customerData) {
    return await Customer.create(customerData);
  }

  async findCustomerById(id) {
    return await Customer.findByPk(id);
  }

  async findAllCustomers() {
    return await Customer.findAll();
  }
}

export default new CustomerRepository();
