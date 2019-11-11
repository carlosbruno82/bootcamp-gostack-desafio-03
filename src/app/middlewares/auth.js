import jwt from 'jsonwebtoken';
import { promisify } from 'util'; // permite utilizar async e await de uma função de callback

import authConfig from '../../config/auth'; // é onde está o segredo token, para tentar desencriptografar e vê se está valido

export default async (req, res, next) => {
  const authHeader = req.headers.authorization; // é o token na requisição do insomnia.

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(400).json({ error: 'Token invalid' });
  }
};
