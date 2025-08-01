import { Router } from 'express';
import { authenticateUserController } from '../controllers/authenticateUserController';

const router = Router();

router.post('/', authenticateUserController);

export default router;