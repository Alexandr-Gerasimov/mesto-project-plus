import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';

const router = Router();

router.get(
  '/',
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string(),
    }),
  }),
  getCards,
);

router.post(
  '/',
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string(),
    }),
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .regex(
          /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!-]))?/,
        ),
    }),
  }),
  createCard,
);

router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string(),
    }),
    headers: Joi.object().keys({
      authorization: Joi.string(),
    }),
  }),
  deleteCard,
);

router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
    headers: Joi.object().keys({
      authorization: Joi.string(),
    }),
  }),
  likeCard,
);

router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
    headers: Joi.object().keys({
      authorization: Joi.string(),
    }),
  }),
  dislikeCard,
);

export default router;
