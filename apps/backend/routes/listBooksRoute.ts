import { Router } from 'express';
import { listBooksController } from '../controllers/listBooksController';

const router = Router();

router.get('/', listBooksController);

export default router;