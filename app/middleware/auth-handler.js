import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, config.jwt, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};