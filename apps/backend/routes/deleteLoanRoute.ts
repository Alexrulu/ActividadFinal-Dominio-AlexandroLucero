import { Router } from 'express';
import { deleteLoanController } from '../controllers/deleteLoanController';

const router = Router();

router.post('/', deleteLoanController);

export default router;
