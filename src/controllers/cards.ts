import { Request, Response } from "express";
import card from "../models/card";
import user from "../models/user";

export const getCards = (req: Request, res: Response) => {
  return card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

export const createCard = (req: Request, res: Response) => {
  console.log(req.user._id); // _id станет доступен
  const { name, link} = req.body;

  return card
    .create({ name, link })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) =>
      res
        .status(500)
        .send({ message: `Произошла ошибка создания пользователя ${err}` })
    );
};

export const deleteCard = (req: Request, res: Response) => {
  console.log(req.user._id); // _id станет доступен

};

export const likeCard = (req: Request, res: Response) =>
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  );

export const dislikeCard = (req: Request, res: Response) =>
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  );
