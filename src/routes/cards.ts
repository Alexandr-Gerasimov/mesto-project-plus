import { Router } from 'express';
import { getCards, createCard, deleteCard, likeCard, dislikeCard } from '../controllers/cards'

const router = Router();

router.get('/', getCards)

router.post('/', createCard)

router.delete('/', deleteCard)

router.put('/:cardId/likes', likeCard)

router.delete('/:cardId/likes', dislikeCard)

export default router;