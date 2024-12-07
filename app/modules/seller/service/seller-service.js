import SellerRepository from '../repository/seller-repository.js';

class SellerService {
  async createSeller(sellerData) {
    return await SellerRepository.createSeller(sellerData);
  }

  async getSellerById(id) {
    return await SellerRepository.findSellerById(id);
  }

  async getAllSellers() {
    return await SellerRepository.findAllSellers();
  }
}

export default new SellerService();
