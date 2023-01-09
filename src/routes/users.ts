import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUsers,
  getUser,
  patchUser,
  patchAvatarUser,
  getUserById,
} from '../controllers/users';

const router = Router();

router.get(
  '/',

  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string(),
    }),
  }),

  getUsers,
);

router.get(
  '/:userId',

  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24).hex().required(),
    }),
    headers: Joi.object().keys({
      authorization: Joi.string(),
    }),
  }),

  getUserById,
);

router.get(
  '/me',
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string(),
    }),
    body: Joi.object().keys({
      id: Joi.string().length(24).hex().required(),
    }),
  }),
  getUser,
);

router.patch(
  '/me',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24).hex().required(),
    }),
    headers: Joi.object().keys({
      authorization: Joi.string(),
    }),
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(200),
    }),
  }),
  patchUser,
);

router.patch(
  '/me/avatar',
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string(),
    }),
    body: Joi.object().keys({
      avatar: Joi.string().regex(
        /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!]))?/,
      ),
    }),
  }),
  patchAvatarUser,
);

export default router;
