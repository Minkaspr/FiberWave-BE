import jwt from 'jsonwebtoken';
import UserRepository from '../../user/repository/user-repository.js';
import RefreshTokenRepository from '../repository/refresh-token-repository.js';
import UserDTO from '../../user/entity/user-dto.js';
import { hashPassword, comparePassword } from '../../user/helper/bcrypt-helper.js';
import { config } from '../../../config/config.js';

class AuthService {
  async register(userData) {
    const existingUser = await UserRepository.getByEmail(userData.email);
    if (existingUser) {
      throw new Error('Correo electrónico ya en uso');
    }

    const hashedPassword = await hashPassword(userData.password);
    const newUser = await UserRepository.create({ ...userData, password: hashedPassword });
    return newUser;
  }

  async login(email, password) {
    const user = await UserRepository.getByEmail(email);
    if (!user || !(await comparePassword(password, user.password))) {
      throw new Error('Correo electrónico o contraseña inválidos');
    }
    const token = jwt.sign({ id: user.id, email: user.email }, config.jwt, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, config.refreshJwt, { expiresIn: '7d' });

    await RefreshTokenRepository.create({ userId: user.id, token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });

    return { user: new UserDTO(user), token, refreshToken };
  }

  async logout() {
    await RefreshTokenRepository.revokeByToken(refreshToken);
    return { message: 'Cierre de sesión exitoso' };
  }

  async refreshToken(oldRefreshToken) {
    const refreshTokenRecord = await RefreshTokenRepository.findByToken(oldRefreshToken);

    if (!refreshTokenRecord || refreshTokenRecord.isRevoked) {
      throw new Error('Token de actualización inválido');
    }

    const user = jwt.verify(refreshTokenRecord.token, config.refreshJwt);
    const newToken = jwt.sign({ id: user.id, email: user.email }, config.jwt, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ id: user.id, email: user.email }, config.refreshJwt, { expiresIn: '7d' });

    await RefreshTokenRepository.create({ userId: user.id, token: newRefreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    await RefreshTokenRepository.deleteByToken(oldRefreshToken);

    return { token: newToken, refreshToken: newRefreshToken };
  }
}

export default new AuthService();