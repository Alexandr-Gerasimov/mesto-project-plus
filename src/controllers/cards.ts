import { Request, Response, NextFunction } from 'express';
import card from '../models/card';
import {
  NotFoundError,
  NotValidError,
  AuthorizationError,
} from '../middlewares/errors';

export const getCards = (req: Request, res: Response, next: NextFunction) => card
  .find({})
  .then((users) => {
    if (!users) {
      throw new NotFoundError('Карточки не найдены');
    }
    res.send({ data: users });
  })
  .catch(next);

export const createCard = (req: Request, res: Response) => card
  .create({ name: req.body.name, link: req.body.link, owner: req.user._id })
  .then((newCard) => res.status(200).send({ newCard }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      throw new NotValidError(
        'Переданы некорректные данные в методы создания карточки',
      );
    }
  });

export const deleteCard = (req: Request, res: Response) => {
  const id = req.user._id;
  const { cardId } = req.params;
  return card
    .findById(cardId)
    .then((cardDel) => {
      if (cardDel?.owner.toString() !== id) {
        throw new AuthorizationError('Недостаточно прав для удаления карточки');
      }
      return cardDel;
    })
    .then((cardDel) => cardDel.delete())
    .then((cardDel) => res.status(200).send({ cardDel }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
    });
};

export const likeCard = (req: Request, res: Response) => {
  const id = req.user._id;
  const { cardId } = req.params;
  return card
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .orFail(new Error('NotValidId'))
    .then((cardLike) => res.status(200).send({ cardLike }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotValidError(
          'Переданы некорректные данные в методы обновления профиля пользователя',
        );
      }
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
    });
};

export const dislikeCard = (req: Request, res: Response) => {
  const id = req.user._id;
  const { cardId } = req.params;
  return card
    .findByIdAndUpdate(cardId, { $pull: { likes: id } }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((cardDislike) => res.status(200).send({ cardDislike }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotValidError(
          'Переданы некорректные данные в методы обновления профиля пользователя',
        );
      }
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
    });
};
