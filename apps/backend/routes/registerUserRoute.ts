import { Router } from 'express';
import { registerUserController } from '../controllers/registerUserController';

const router = Router();

router.post('/', registerUserController);

export default router;