import jwt from 'jsonwebtoken';
import UserRepository from '../../user/repository/user-repository.js';
import RoleRepository from '../../role/repository/role-repository.js'
import RefreshTokenRepository from '../repository/refresh-token-repository.js';
import UserAuthDTO from '../../user/entity/user-auth-dto.js';
import { hashPassword, comparePassword } from '../../user/helper/bcrypt-helper.js';
import { config } from '../../../config/config.js';
import { UniqueConstraintError } from '../../user/helper/unique-constraint-error.js';
import { AuthorizationError, CredentialError } from '../helper/auth-error.js';

class AuthService {
  async register(userData) {
    const existingUser = await UserRepository.getByEmail(userData.email);
    if (existingUser) {
      throw new UniqueConstraintError('email', 'Ya existe una cuenta registrada con este correo');
    }

    if (!userData.role_id) {
      const defaultRole = await RoleRepository.findByName('customer');
      userData.role_id = defaultRole.id;
    }

    const hashedPassword = await hashPassword(userData.password);
    const newUser = await UserRepository.create({ ...userData, password: hashedPassword });
    return newUser;
  }

  async login(email, password) {
    const user = await UserRepository.getByEmail(email);
    if (!user || !(await comparePassword(password, user.password))) {
      throw new CredentialError('Correo electrónico o contraseña inválidos');
    }
    const token = jwt.sign({ id: user.id, email: user.email }, config.jwt, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, config.refreshJwt, { expiresIn: '7d' });

    await RefreshTokenRepository.create({ userId: user.id, token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });

    return { user: new UserAuthDTO(user), token, refreshToken };
  }

  async logout(refreshToken) {
    await RefreshTokenRepository.revokeByToken(refreshToken);
    return { message: 'Cierre de sesión exitoso' };
  }

  async refreshToken(oldRefreshToken) {
    const refreshTokenRecord = await RefreshTokenRepository.findByToken(oldRefreshToken);

    if (!refreshTokenRecord || refreshTokenRecord.isRevoked) {
      throw new AuthorizationError('token-expired-error', 'Token de actualización inválido o revocado');
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