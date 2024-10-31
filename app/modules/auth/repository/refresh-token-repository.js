import { RefreshToken } from '../entity/refresh-token.js';

class RefreshTokenRepository {
  async create(refreshTokenData) {
    return await RefreshToken.create(refreshTokenData);
  }

  async findByToken(token) {
    return await RefreshToken.findOne({ where: { token } });
  }

  async deleteByToken(token) {
    return await RefreshToken.destroy({ where: { token } });
  }

  async revokeByToken(token) {
    const tokenRecord = await RefreshToken.findOne({ where: { token } });
    if (tokenRecord) {
      tokenRecord.isRevoked = true;
      return await tokenRecord.save();
    }
  }

  async updateLastUsed(token) {
    const tokenRecord = await RefreshToken.findOne({ where: { token } });
    if (tokenRecord) {
      tokenRecord.lastUsedAt = new Date();
      return await tokenRecord.save();
    }
  }
}

export default new RefreshTokenRepository();