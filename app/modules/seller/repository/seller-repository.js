import { Seller } from '../../associations/associations.js'

class SellerRepository {
  async createSeller(sellerData, options) {
    return await Seller.create(sellerData, options);
  }

  async updateSeller(userId, updateData, options) {
    const [affectedRows] = await Seller.update(updateData, {
        where: { user_id: userId },
        ...options
    });

    return affectedRows > 0;
  }

  async findSellerById(id) {
    return await Seller.findByPk(id);
  }

  async findSellerByUserId(user_id) {
    return await Seller.findOne(
      { 
        where: { user_id },
        attributes: {
          exclude: ['id', 'user_id', 'created_at', 'updated_at']
        }
      }
    );
  }

  async findSellerByIdentityDocument(identity_document) {
    return await Seller.findOne({ where: { identity_document } });
  }

  async findAllSellers() {
    return await Seller.findAll();
  }

  async deleteSellerByUserId(user_id, options = {}) {
    return await Seller.destroy({ where: { user_id }, ...options });
  }
}

export default new SellerRepository();