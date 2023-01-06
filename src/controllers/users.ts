import { NextFunction, Request, Response } from "express";
import user from "../models/user";

class NewError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  return user
    .find({})
    .then((users) => {
      if (!users) {
        throw new NewError("Пользователи не найдены");
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
        res
          .status(400)
          .send({
            message: `Переданы некорректные данные ${err.message}`,
          });
      }
      if (err.name === "NotValidId") {
        res
          .status(404)
          .send({
            message: `Пользователь по указанному _id не найден ${err.message}`,
          });
      }
      res.status(500).send({ message: `Ошибка по умолчанию ${err}` });
    });
}; 

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return user
    .create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === "ValidationError") {
        res
          .status(ERROR_CODE)
          .send({
            message: `Переданы некорректные данные в методы создания пользователя ${err.message}`,
          });
      }
      res.status(500).send({ message: `Ошибка по умолчанию ${err}` });
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
        res
          .status(ERROR_CODE)
          .send({
            message: `Переданы некорректные данные в методы обновления профиля пользователя ${err.message}`,
          });
      }
      if (err.name === "CastError") {
        res
          .status(ERROR_CODE)
          .send({
            message: `Пользователь с указанным _id не найден ${err.message}`,
          });
      }
      res.status(500).send({ message: `Ошибка по умолчанию ${err}` });
    });
};

export const patchAvatarUser = (req: Request, res: Response) => {
  const { avatar } = req.body;
  const id = req.user._id;

  return user
    .findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true})
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === "ValidationError") {
        res
          .status(ERROR_CODE)
          .send({
            message: `Переданы некорректные данные в методы обновления аватара пользователя ${err.message}`,
          });
      }
      if (err.name === "CastError") {
        res
          .status(ERROR_CODE)
          .send({
            message: `Пользователь с указанным _id не найден ${err.message}`,
          });
      }
      res.status(500).send({ message: `Ошибка по умолчанию ${err}` });
    });
};
