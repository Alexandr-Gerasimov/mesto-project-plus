import { Request, Response, NextFunction } from "express";
import card from "../models/card";
import user from "../models/user";

class NewError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  return card
    .find({})
    .then((users) => {
      if (!users) {
        throw new NewError("Пользователи не найдены");
      }
      res.send({ data: users });
    })
    .catch(next);
};

export const createCard = (req: Request, res: Response) => {
  const owner = req.user._id
  const { name, link } = req.body;

  return card
    .create({ name, link, owner })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === "ValidationError") {
        res
          .status(ERROR_CODE)
          .send({
            message: `Переданы некорректные данные в методы создания карточки ${err.message}`,
          });
      }
      res.status(500).send({ message: `Ошибка по умолчанию ${err}` });
    });
};

export const deleteCard = (req: Request, res: Response) => {
  const id = req.user._id
  const {cardId} = req.params
  console.log(cardId)
  return card
    .findByIdAndDelete(cardId)
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === "CastError") {
        res
          .status(ERROR_CODE)
          .send({
            message: `Карточка с указанным _id не найдена ${err.message}`,
          });
      }
      res.status(500).send({ message: `Ошибка по умолчанию ${err}` });
    });
};

export const likeCard = (req: Request, res: Response) => {
  const id = req.user._id
  const {cardId} = req.params
  return card
    .findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: id } }, // добавить _id в массив, если его там нет
    { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({
            message: `Переданы некорректные данные в методы обновления профиля пользователя ${err.message}`,
          });
      }
      if (err.message === "NotValidId") {
        res
          .status(404)
          .send({
            message: `Пользователь с указанным _id не найден ${err.message}`,
          });
      }
      res.status(500).send({ message: `Ошибка по умолчанию ${err}` });
    });
  };

export const dislikeCard = (req: Request, res: Response) => {
  const id = req.user._id
  const {cardId} = req.params
  return card
    .findByIdAndUpdate(
    cardId,
    { $pull: { likes: id } },
    { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({
            message: `Переданы некорректные данные в методы обновления профиля пользователя ${err.message}`,
          });
      }
      if (err.message === "NotValidId") {
        res
          .status(404)
          .send({
            message: `Пользователь с указанным _id не найден ${err.message}`,
          });
      }
      res.status(500).send({ message: `Ошибка по умолчанию ${err}` });
    });
}
