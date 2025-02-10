import { Seller } from '../../associations/associations.js'

class SellerRepository {
  async createSeller(sellerData, options) {
    return await Seller.create(sellerData, options);
  }

  async findSellerById(id) {
    return await Seller.findByPk(id);
  }

  async findSellerByIdentityDocument(identity_document) {
    return await Seller.findOne({ where: { identity_document } });
  }

  async findAllSellers() {
    return await Seller.findAll();
  }
}

export default new SellerRepository();