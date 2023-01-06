import { Router } from 'express';
import { getUsers, createUser, getUser, patchUser, patchAvatarUser } from '../controllers/users'

const router = Router();

router.get('/', getUsers)

router.get('/:userId', getUser)

router.post('/', createUser)

router.patch('/me', patchUser)

router.patch('/me/avatar', patchAvatarUser)

export default router;