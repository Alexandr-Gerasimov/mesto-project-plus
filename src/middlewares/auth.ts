import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import { AuthorizationError } from '../middlewares/errors'

const handleAuthError = (res: Response) => {
  throw new AuthorizationError('Необходима авторизация' );
};

const extractBearerToken = (header: string) => {
return header.replace('Bearer ', '');
};

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  console.log(req.headers)
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res)
  }

  const token = extractBearerToken(authorization)
  console.log(token)
  let payload
  const { JWT_SECRET = 'secret-word' } = process.env;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res)
  }

  req.user = payload as { _id: ObjectId };

  next();
};