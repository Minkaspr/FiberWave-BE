import SellerRepository from '../repository/seller-repository.js';
import { UniqueConstraintError } from "../../../middleware/custom-errors-handler.js";

class SellerService {
  async createSeller(sellerData, transaction) {
    const existingSeller = await SellerRepository.findSellerByIdentityDocument(sellerData.identity_document);
    if (existingSeller) {
      throw new UniqueConstraintError('identity_document');
    }
    return await SellerRepository.createSeller(sellerData, {transaction});
  }

  async getSellerById(id) {
    return await SellerRepository.findSellerById(id);
  }

  async getAllSellers() {
    return await SellerRepository.findAllSellers();
  }
}

export default new SellerService();
