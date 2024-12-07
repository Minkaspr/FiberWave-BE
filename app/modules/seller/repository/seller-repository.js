import { Seller } from '../../associations/associations.js'

class SellerRepository {
  async createSeller(sellerData) {
    return await Seller.create(sellerData);
  }

  async findSellerById(id) {
    return await Seller.findByPk(id);
  }

  async findAllSellers() {
    return await Seller.findAll();
  }
}

export default new SellerRepository();