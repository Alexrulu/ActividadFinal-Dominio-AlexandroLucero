import { Router } from 'express';
import { changeUserRoleController } from '../controllers/changeUserRoleController';

const router = Router();

router.post('/', changeUserRoleController);

export default router;