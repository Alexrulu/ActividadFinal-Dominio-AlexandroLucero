import { Router } from 'express';
import { approveLoanController } from '../controllers/approveLoanController';

const router = Router();

router.post('/', approveLoanController);

export default router;