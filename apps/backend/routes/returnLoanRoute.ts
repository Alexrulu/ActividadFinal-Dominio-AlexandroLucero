import { Router } from 'express';
import { returnLoanController } from '../controllers/returnLoanController';

const router = Router();

router.post('/', returnLoanController);

export default router;