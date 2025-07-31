import { Router } from 'express';
import { requestLoanController } from '../controllers/requestLoanController';

const router = Router();

router.post('/', requestLoanController);

export default router;