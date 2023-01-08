import e, { NextFunction, Request, Response } from "express";
import user from "../models/user";
import jwt from 'jsonwebtoken';
import { NotFoundError, NotValidError, AuthorizationError } from '../middlewares/errors'

const bcrypt = require('bcryptjs')

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  return user
    .find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError("Пользователи не найдены");
      }
      res.send({ data: users });
    })
    .catch(next);
};

export const getUser = (req: Request, res: Response) => {
  const id = req.user._id;

  return user
    .findById(id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new NotValidError('Переданы некорректные данные')
      }
      if (err.name === "NotValidId") {
        throw new NotFoundError(`Пользователь по указанному _id не найден`)
      }
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    email,
    password
  } = req.body;
  console.log(email)

  return bcrypt.hash(password, 10)
    .then((hash: string) => user.create({
      email,
      password: hash,
    }))
    .then((user: { _id: any; email: any; }) => {
      const { _id, email } = user;
      res.status(201).send({
        _id,
        email,
      });
    })
    .catch((err: any) => {
      if (err.name === "CastError") {
      throw new NotValidError('Переданы некорректные данные')
      }
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const { JWT_SECRET = 'secret-word' } = process.env;
  return user.findUserByCredentials(email, password)
    .then((user) => {
      res.send({ token: jwt.sign({ _id: user._id },  JWT_SECRET, { expiresIn: '7d' }) });
    })
    .catch((err) => {
      throw new AuthorizationError(err.message);
    });
};

export const patchUser = (req: Request, res: Response) => {
  const { name, about } = req.body;
  const id = req.user._id;

  return user
    .findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true})
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === "ValidationError") {
        throw new NotValidError(`Переданы некорректные данные в методы обновления профиля пользователя`)
      }
      if (err.name === "CastError") {
        throw new NotFoundError(`Пользователь с указанным _id не найден`);
      }
    });
};

export const patchAvatarUser = (req: Request, res: Response) => {
  const { avatar } = req.body;
  const id = req.user._id;

  return user
    .findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true})
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new NotValidError(`Переданы некорректные данные в методы обновления профиля пользователя`)
      }
      if (err.name === "CastError") {
        throw new NotFoundError(`Пользователь с указанным _id не найден`);
      }
    });
};
