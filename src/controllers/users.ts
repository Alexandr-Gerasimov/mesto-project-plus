import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import user from '../models/user';
import {
  NotFoundError,
  NotValidError,
  AuthorizationError,
} from '../middlewares/errors';

const bcrypt = require('bcryptjs');

export const getUsers = (req: Request, res: Response, next: NextFunction) => user
  .find({})
  .then((users) => {
    if (!users) {
      throw new NotFoundError('Пользователи не найдены');
    }
    res.send({ data: users });
  })
  .catch(next);

export const getUser = (req: Request, res: Response) => {
  const { userId } = req.params;
  return user
    .findById(userId)
    .orFail(new Error('NotValidId'))
    .then((userInfo) => res.status(200).send(userInfo))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotValidError('Переданы некорректные данные');
      }
      if (err.name === 'NotValidId') {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
    });
};

export const getUserById = (req: Request, res: Response) => {
  const id = req.params.userId;

  return user
    .findById(id)
    .orFail(new Error('NotValidId'))
    .then((userOwn) => res.status(200).send(userOwn))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotValidError('Переданы некорректные данные');
      }
      if (err.name === 'NotValidId') {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
    });
};

export const createUser = (req: Request, res: Response) => {
  const { email, password } = req.body;

  return bcrypt
    .hash(password, 10)
    .then((hash: string) => user.create({
      email,
      password: hash,
    }))
    .then((newUser: { _id: any; userEmail: any }) => {
      const { _id, userEmail } = newUser;
      res.status(201).send({
        _id,
        userEmail,
      });
    })
    .catch((err: any) => {
      if (err.name === 'CastError') {
        throw new NotValidError('Переданы некорректные данные');
      }
    });
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { JWT_SECRET = 'secret-word' } = process.env;
  return user
    .findUserByCredentials(email, password)
    .then((userLogin) => {
      res.send({
        token: jwt.sign({ _id: userLogin._id }, JWT_SECRET, { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      throw new AuthorizationError(err.message);
    });
};

export const patchUser = (req: Request, res: Response) => {
  const { name, about } = req.body;
  const id = req.user._id;

  return user
    .findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((userChange) => res.status(200).send({ userChange }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotValidError(
          'Переданы некорректные данные в методы обновления профиля пользователя',
        );
      }
      if (err.name === 'CastError') {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
    });
};

export const patchAvatarUser = (req: Request, res: Response) => {
  const { avatar } = req.body;
  const id = req.user._id;

  return user
    .findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((userAvatar) => res.status(200).send({ userAvatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotValidError(
          'Переданы некорректные данные в методы обновления профиля пользователя',
        );
      }
      if (err.name === 'CastError') {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
    });
};
