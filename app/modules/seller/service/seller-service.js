import SellerRepository from '../repository/seller-repository.js';
import { UniqueConstraintError, NotFoundError } from "../../../middleware/custom-errors-handler.js";

class SellerService {
  async createSeller(sellerData, transaction) {
    const existingSeller = await SellerRepository.findSellerByIdentityDocument(sellerData.identity_document);
    if (existingSeller) {
      throw new UniqueConstraintError('identity_document');
    }
    return await SellerRepository.createSeller(sellerData, {transaction});
  }

  async updateSeller(sellerData, transaction) {
    if (sellerData.identity_document) {
        const existingSeller = await SellerRepository.findSellerByIdentityDocument(sellerData.identity_document);
        if (existingSeller && Number(existingSeller.user_id) !== Number(sellerData.user_id)) {
            throw new UniqueConstraintError('identity_document');
        }
    }
    const userId = sellerData.user_id;
    const existingSeller = await SellerRepository.findSellerByUserId(userId);
    if (!existingSeller) {
        throw new NotFoundError('Seller', 'user_id', userId);
    }
    const { id, user_id, created_at, ...filteredData } = sellerData;

    return await SellerRepository.updateSeller(userId, { ...filteredData, updated_at: new Date() }, { transaction });
  }

  async getSellerById(id) {
    return await SellerRepository.findSellerById(id);
  }

  async getSellerByUserId(user_id) {
    return await SellerRepository.findSellerByUserId(user_id);
  }

  async getAllSellers() {
    return await SellerRepository.findAllSellers();
  }
  
  async deleteSellerByUserId(user_id, options = {}) {
    return await SellerRepository.deleteSellerByUserId(user_id, options);
  }
}

export default new SellerService();
