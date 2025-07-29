import { Router } from 'express';
import { approveReturnLoanController } from '../controllers/approveReturnLoanController';

const router = Router();

router.post('/', approveReturnLoanController);

export default router;