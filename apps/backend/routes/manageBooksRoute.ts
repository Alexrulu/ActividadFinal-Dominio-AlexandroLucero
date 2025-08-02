import Router from 'express';
import { addBookController, updateBookController, deleteBookController } from '../controllers/manageBooksController';

const router = Router();

router.post('/add', addBookController);
router.put('/update', updateBookController);
router.delete('/delete', deleteBookController);

export default router;